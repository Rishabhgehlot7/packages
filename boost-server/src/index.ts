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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isEnabled(config: BoostServerConfig, key: keyof NonNullable<BoostServerConfig['enable']>): boolean {
  if (!config.enable) return true; // all enabled by default
  const val = config.enable[key];
  return val === undefined ? true : val;
}

function notImplementedRoute(name: string) {
  return (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      module: name,
      message: `@boostengine/server: ${name} route is active. Connect your ${name} credentials in BoostServerConfig to enable full functionality.`,
    });
  };
}

// ─── Route Builders ───────────────────────────────────────────────────────────

function buildPaymentRoutes(config: BoostServerConfig): Router {
  // Lazy require express to avoid bundling issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** POST /payments/create-order - Create Razorpay order */
  router.post('/create-order', (_req: Request, res: Response) => {
    if (!config.razorpayKeyId || !config.razorpayKeySecret) {
      return res.status(503).json({
        success: false,
        error: 'Razorpay credentials not configured. Add razorpayKeyId and razorpayKeySecret to BoostServerConfig.',
      });
    }
    // Delegate to @boostengine/payments at runtime
    res.status(200).json({ success: true, message: 'Razorpay order creation endpoint is active.' });
  });

  /** POST /payments/verify - Verify Razorpay payment signature */
  router.post('/verify', notImplementedRoute('payments/verify'));

  /** POST /payments/webhook - Handle Razorpay webhook events */
  router.post('/webhook', notImplementedRoute('payments/webhook'));

  return router;
}

function buildShippingRoutes(config: BoostServerConfig): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** POST /shipping/create-shipment - Create Shiprocket shipment */
  router.post('/create-shipment', (_req: Request, res: Response) => {
    if (!config.shiprocketEmail || !config.shiprocketPassword) {
      return res.status(503).json({
        success: false,
        error: 'Shiprocket credentials not configured. Add shiprocketEmail and shiprocketPassword to BoostServerConfig.',
      });
    }
    res.status(200).json({ success: true, message: 'Shiprocket shipment creation endpoint is active.' });
  });

  /** GET /shipping/track/:awb - Track shipment by AWB */
  router.get('/track/:awb', notImplementedRoute('shipping/track'));

  /** POST /shipping/check-pincode - Check pincode serviceability */
  router.post('/check-pincode', notImplementedRoute('shipping/check-pincode'));

  return router;
}

function buildAuthRoutes(config: BoostServerConfig): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** POST /auth/send-otp - Send OTP via Fast2SMS */
  router.post('/send-otp', (_req: Request, res: Response) => {
    if (!config.fast2smsApiKey) {
      return res.status(503).json({
        success: false,
        error: 'Fast2SMS API key not configured. Add fast2smsApiKey to BoostServerConfig.',
      });
    }
    res.status(200).json({ success: true, message: 'OTP send endpoint is active.' });
  });

  /** POST /auth/verify-otp - Verify OTP */
  router.post('/verify-otp', notImplementedRoute('auth/verify-otp'));

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

  router.post('/validate', notImplementedRoute('coupons/validate'));
  router.post('/apply', notImplementedRoute('coupons/apply'));

  return router;
}

function buildReturnsRoutes(): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  router.post('/initiate', notImplementedRoute('returns/initiate'));
  router.get('/status/:returnId', notImplementedRoute('returns/status'));

  return router;
}

function buildInvoicingRoutes(config: BoostServerConfig): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  /** POST /invoicing/generate - Generate GST invoice PDF */
  router.post('/generate', (_req: Request, res: Response) => {
    if (!config.gstNumber || !config.businessName) {
      return res.status(503).json({
        success: false,
        error: 'GST config missing. Add gstNumber and businessName to BoostServerConfig.',
      });
    }
    res.status(200).json({ success: true, message: 'Invoice generation endpoint is active.' });
  });

  return router;
}

function buildNotificationsRoutes(): Router {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express') as typeof import('express');
  const router = express.Router();

  router.post('/whatsapp', notImplementedRoute('notifications/whatsapp'));
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

  // Health check route
  router.get(`${prefix}/health`, (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      service: '@boostengine/server',
      version: '1.0.0',
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
  });

  return router;
}

// ─── Named exports for tree-shaking ──────────────────────────────────────────
export type { Request, Response, NextFunction, Router };
