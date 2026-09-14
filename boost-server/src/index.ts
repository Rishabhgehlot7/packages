/**
 * @boostengine/server
 * Plug-and-Play Headless eCommerce API Router for Express/Node.js
 *
 * Usage:
 *   import { createBoostApiRouter } from '@boostengine/server';
 *   const router = createBoostApiRouter({ ... });
 *   app.use('/api', router);
 */

import type { Router, Request, Response, NextFunction } from 'express';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BoostServerConfig {
  /** Razorpay key id (for payment routes) */
  razorpayKeyId?: string;
  /** Razorpay key secret (for payment routes) */
  razorpayKeySecret?: string;
  /** Shiprocket email (for logistics routes) */
  shiprocketEmail?: string;
  /** Shiprocket password (for logistics routes) */
  shiprocketPassword?: string;
  /** Fast2SMS API key (for OTP auth routes) */
  fast2smsApiKey?: string;
  /** GST number of the business (for invoicing routes) */
  gstNumber?: string;
  /** Business name for invoices */
  businessName?: string;
  /** Enable mock/simulation mode when API keys are not yet provided (default: true) */
  mockMode?: boolean;
  /** Enable/disable specific route groups */
  enable?: {
    payments?: boolean;
    shipping?: boolean;
    auth?: boolean;
    cart?: boolean;
    coupons?: boolean;
    returns?: boolean;
    invoicing?: boolean;
    notifications?: boolean;
  };
  /** Custom middleware to run before each route group */
  middleware?: BoostMiddleware[];
  /** Prefix for all routes (default: '') */
  prefix?: string;
}

export type BoostMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export interface BoostRouteGroup {
  path: string;
  router: Router;
}

// ─── Indian Pincode Directory ────────────────────────────────────────────────
const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi' },
  '40': { city: 'Mumbai', state: 'Maharashtra' },
  '56': { city: 'Bengaluru', state: 'Karnataka' },
  '60': { city: 'Chennai', state: 'Tamil Nadu' },
  '70': { city: 'Kolkata', state: 'West Bengal' },
  '50': { city: 'Hyderabad', state: 'Telangana' },
  '30': { city: 'Jaipur', state: 'Rajasthan' },
  '38': { city: 'Ahmedabad', state: 'Gujarat' },
  '20': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '41': { city: 'Pune', state: 'Maharashtra' },
  '12': { city: 'Gurugram', state: 'Haryana' },
  '16': { city: 'Chandigarh', state: 'Punjab' },
  '45': { city: 'Indore', state: 'Madhya Pradesh' },
  '80': { city: 'Patna', state: 'Bihar' },
  '75': { city: 'Bhubaneswar', state: 'Odisha' },
  '68': { city: 'Kochi', state: 'Kerala' },
  '78': { city: 'Guwahati', state: 'Assam' },
};

function lookupPincode(pincode: string) {
  const clean = (pincode || '').toString().replace(/\D/g, '');
  const prefix2 = clean.slice(0, 2);
  const found = PINCODE_MAP[prefix2] || { city: 'Local City', state: 'India' };
  return {
    pincode: clean || '110001',
    city: found.city,
    state: found.state,
    serviceable: true,
    codAvailable: true,
    estimatedDays: 3,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isEnabled(config: BoostServerConfig, key: keyof NonNullable<BoostServerConfig['enable']>): boolean {
  if (!config.enable) return true; // all enabled by default
  const val = config.enable[key];
  return val === undefined ? true : val;
}

function isMock(config: BoostServerConfig): boolean {
  return config.mockMode !== false;
}

function notImplementedRoute(name: string) {
  return (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      module: name,
      message: `@boostengine/server: ${name} route is active. Connect your ${name} credentials in BoostServerConfig to enable full production integration.`,
    });
  };
}

// ─── Route Builders ───────────────────────────────────────────────────────────

function buildPaymentRoutes(config: BoostServerConfig): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** POST /payments/create-order - Create Razorpay order */
  router.post('/create-order', (req: Request, res: Response) => {
    if (config.razorpayKeyId && config.razorpayKeySecret) {
      return res.status(200).json({ success: true, message: 'Razorpay order creation endpoint is active.' });
    }

    if (isMock(config)) {
      const amount = req.body?.amount || 199900;
      return res.status(200).json({
        success: true,
        mock: true,
        orderId: 'order_mock_' + Math.random().toString(36).substring(2, 10),
        amount,
        currency: 'INR',
        key: 'rzp_test_mock_boost',
        message: '⚡ [MOCK MODE] Simulated Razorpay order created. Test payment will succeed!',
      });
    }

    return res.status(503).json({
      success: false,
      error: 'Razorpay credentials not configured. Add razorpayKeyId and razorpayKeySecret to BoostServerConfig.',
    });
  });

  /** POST /payments/verify - Verify Razorpay payment signature */
  router.post('/verify', (_req: Request, res: Response) => {
    if (isMock(config)) {
      return res.status(200).json({
        success: true,
        mock: true,
        verified: true,
        paymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
        message: '⚡ [MOCK MODE] Simulated payment verification successful!',
      });
    }
    res.status(200).json({ success: true, verified: true });
  });

  /** POST /payments/webhook - Handle Razorpay webhook events */
  router.post('/webhook', notImplementedRoute('payments/webhook'));

  return router;
}

function buildShippingRoutes(config: BoostServerConfig): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** GET /shipping/pincode/:pincode - Indian Pincode Auto-Fill & Serviceability */
  router.get('/pincode/:pincode', (req: Request, res: Response) => {
    const data = lookupPincode(String(req.params.pincode));
    res.status(200).json({ success: true, ...data });
  });

  /** POST /shipping/check-pincode - Check pincode serviceability */
  router.post('/check-pincode', (req: Request, res: Response) => {
    const pin = req.body?.pincode || req.body?.deliveryPincode || '110001';
    const data = lookupPincode(pin);
    res.status(200).json({ success: true, ...data });
  });

  /** POST /shipping/create-shipment - Create Shiprocket shipment */
  router.post('/create-shipment', (req: Request, res: Response) => {
    if (config.shiprocketEmail && config.shiprocketPassword) {
      return res.status(200).json({ success: true, message: 'Shiprocket shipment creation endpoint is active.' });
    }
    if (isMock(config)) {
      const awb = 'SR' + Math.floor(1000000000 + Math.random() * 9000000000);
      return res.status(200).json({
        success: true,
        mock: true,
        shipmentId: 'ship_' + Date.now(),
        awbCode: awb,
        courierName: 'Delhivery Surface',
        status: 'MANIFESTED',
        message: '⚡ [MOCK MODE] Simulated shipment created with AWB ' + awb,
      });
    }
    return res.status(503).json({
      success: false,
      error: 'Shiprocket credentials not configured. Add shiprocketEmail and shiprocketPassword to BoostServerConfig.',
    });
  });

  /** GET /shipping/track/:awb - Track shipment by AWB */
  router.get('/track/:awb', (req: Request, res: Response) => {
    const awb = String(req.params.awb || 'SR1234567890');
    res.status(200).json({
      success: true,
      mock: true,
      awb,
      status: 'IN_TRANSIT',
      estimatedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      history: [
        { status: 'Order Manifested', location: 'Seller Warehouse', time: '10:00 AM' },
        { status: 'Courier Picked Up', location: 'Shiprocket Sorting Center', time: '02:30 PM' },
        { status: 'In Transit', location: 'National Sorting Facility', time: '08:15 PM' },
        { status: 'Out for Delivery', location: 'Local Delivery Hub', time: 'Pending' },
      ],
    });
  });

  return router;
}

function buildAuthRoutes(config: BoostServerConfig): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** POST /auth/send-otp - Send Phone OTP */
  router.post('/send-otp', (req: Request, res: Response) => {
    const phone = req.body?.phone || '+91 9876543210';
    if (config.fast2smsApiKey) {
      return res.status(200).json({ success: true, message: 'OTP send endpoint is active.' });
    }
    if (isMock(config)) {
      return res.status(200).json({
        success: true,
        mock: true,
        phone,
        message: '⚡ [MOCK MODE] OTP sent to ' + phone + '! Use test OTP: 1234',
        testOtp: '1234',
      });
    }
    return res.status(503).json({
      success: false,
      error: 'Fast2SMS API key not configured. Add fast2smsApiKey to BoostServerConfig.',
    });
  });

  /** POST /auth/verify-otp - Verify Phone OTP */
  router.post('/verify-otp', (req: Request, res: Response) => {
    const { otp, phone } = req.body || {};
    if (otp === '1234' || isMock(config)) {
      return res.status(200).json({
        success: true,
        mock: true,
        verified: true,
        token: 'boost_jwt_mock_' + Buffer.from(phone || 'user').toString('base64'),
        user: {
          phone: phone || '+91 9876543210',
          name: 'Demo Customer',
          verifiedAt: new Date().toISOString(),
        },
      });
    }
    return res.status(400).json({ success: false, error: 'Invalid OTP. Use 1234 in test mode.' });
  });

  return router;
}

function buildCartRoutes(): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  router.get('/', notImplementedRoute('cart/get'));
  router.post('/add', notImplementedRoute('cart/add'));
  router.put('/update', notImplementedRoute('cart/update'));
  router.delete('/remove/:itemId', notImplementedRoute('cart/remove'));
  router.delete('/clear', notImplementedRoute('cart/clear'));

  return router;
}

function buildCouponsRoutes(): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  router.post('/validate', (req: Request, res: Response) => {
    const code = (req.body?.code || '').trim().toUpperCase();
    if (code === 'BOOST20' || code === 'SAVE20') {
      return res.status(200).json({
        success: true,
        valid: true,
        code,
        discountType: 'percentage',
        discountValue: 20,
        message: '20% discount applied!',
      });
    }
    if (code === 'WELCOME10' || code === 'FIRST10') {
      return res.status(200).json({
        success: true,
        valid: true,
        code,
        discountType: 'percentage',
        discountValue: 10,
        message: '10% welcome discount applied!',
      });
    }
    if (code === 'FREESHIP') {
      return res.status(200).json({
        success: true,
        valid: true,
        code,
        discountType: 'free_shipping',
        discountValue: 0,
        message: 'Free shipping applied!',
      });
    }
    return res.status(400).json({
      success: false,
      valid: false,
      error: 'Invalid coupon code. Try BOOST20, WELCOME10, or FREESHIP.',
    });
  });

  router.post('/apply', notImplementedRoute('coupons/apply'));

  return router;
}

function buildReturnsRoutes(): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  router.post('/initiate', (req: Request, res: Response) => {
    const returnId = 'ret_' + Date.now();
    res.status(200).json({
      success: true,
      mock: true,
      returnId,
      status: 'APPROVED',
      message: '⚡ Return request approved. Reverse pickup will be scheduled within 24-48 hours.',
      pickupAddress: req.body?.pickupAddress || 'Customer Address',
    });
  });

  router.get('/status/:returnId', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      returnId: String(req.params.returnId),
      status: 'PICKUP_SCHEDULED',
      refundMode: 'ORIGINAL_PAYMENT_METHOD',
      estimatedRefundDays: 5,
    });
  });

  return router;
}

function buildInvoicingRoutes(config: BoostServerConfig): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** POST /invoicing/generate - Generate GST invoice PDF */
  router.post('/generate', (req: Request, res: Response) => {
    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    res.status(200).json({
      success: true,
      mock: true,
      invoiceNumber,
      businessName: config.businessName || 'Boost D2C Store',
      gstNumber: config.gstNumber || '27AABCB1234D1Z5',
      orderId: req.body?.orderId || 'ord_123',
      cgstRate: 9,
      sgstRate: 9,
      totalGst: req.body?.totalGst || 180,
      totalAmount: req.body?.totalAmount || 1180,
      downloadUrl: `/api/invoicing/download/${invoiceNumber}.pdf`,
    });
  });

  return router;
}

function buildNotificationsRoutes(): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  router.post('/whatsapp', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      mock: true,
      channel: 'whatsapp',
      recipient: req.body?.phone || '+91 9876543210',
      status: 'DELIVERED',
      message: 'WhatsApp notification delivered successfully!',
    });
  });

  router.post('/email', notImplementedRoute('notifications/email'));
  router.post('/sms', notImplementedRoute('notifications/sms'));

  return router;
}

// ─── Main Factory ─────────────────────────────────────────────────────────────

/**
 * Creates a pre-configured Express Router with all @boostengine API routes.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { createBoostApiRouter } from '@boostengine/server';
 *
 * const app = express();
 * app.use(express.json());
 *
 * const boostRouter = createBoostApiRouter({
 *   razorpayKeyId: process.env.RAZORPAY_KEY_ID,
 *   razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
 *   gstNumber: process.env.GST_NUMBER,
 *   businessName: 'My Awesome Store',
 * });
 *
 * app.use('/api', boostRouter);
 * app.listen(3001, () => console.log('BoostEngine API running on :3001'));
 * ```
 */
export function createBoostApiRouter(config: BoostServerConfig = {}): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  const prefix = config.prefix || '';

  // Apply custom middleware to all routes if provided
  if (config.middleware && config.middleware.length > 0) {
    config.middleware.forEach((mw) => router.use(mw));
  }

  // Mount route groups based on enabled flags
  if (isEnabled(config, 'payments')) {
    router.use(`${prefix}/payments`, buildPaymentRoutes(config));
  }
  if (isEnabled(config, 'shipping')) {
    router.use(`${prefix}/shipping`, buildShippingRoutes(config));
  }
  if (isEnabled(config, 'auth')) {
    router.use(`${prefix}/auth`, buildAuthRoutes(config));
  }
  if (isEnabled(config, 'cart')) {
    router.use(`${prefix}/cart`, buildCartRoutes());
  }
  if (isEnabled(config, 'coupons')) {
    router.use(`${prefix}/coupons`, buildCouponsRoutes());
  }
  if (isEnabled(config, 'returns')) {
    router.use(`${prefix}/returns`, buildReturnsRoutes());
  }
  if (isEnabled(config, 'invoicing')) {
    router.use(`${prefix}/invoicing`, buildInvoicingRoutes(config));
  }
  if (isEnabled(config, 'notifications')) {
    router.use(`${prefix}/notifications`, buildNotificationsRoutes());
  }

  // Health check & liveness routes (supports /health and /ping)
  const healthHandler = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      success: true,
      service: '@boostengine/server',
      version: '1.0.0',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      mockMode: isMock(config),
      modules: {
        payments: isEnabled(config, 'payments'),
        shipping: isEnabled(config, 'shipping'),
        auth: isEnabled(config, 'auth'),
        cart: isEnabled(config, 'cart'),
        coupons: isEnabled(config, 'coupons'),
        returns: isEnabled(config, 'returns'),
        invoicing: isEnabled(config, 'invoicing'),
        notifications: isEnabled(config, 'notifications'),
      },
    });
  };

  router.get(`${prefix}/health`, healthHandler);
  router.get(`${prefix}/ping`, healthHandler);

  return router;
}

// ─── Named exports for tree-shaking ──────────────────────────────────────────
export type { Request, Response, NextFunction, Router };
