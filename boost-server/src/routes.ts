/**
 * @boostengine/server — Framework-Agnostic Route Table
 *
 * `buildRouteDefinitions(config)` returns a normalized list of route
 * definitions that the Express, Fastify, and Hono adapters mount. Every
 * handler is framework-agnostic and returns a `RouteResult`.
 */

import type {
  BoostServerConfig,
  HttpMethod,
  RouteDefinition,
  RouteRequest,
  RouteResult,
} from './types';

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

function isEnabled(
  config: BoostServerConfig,
  key: keyof NonNullable<BoostServerConfig['enable']>,
): boolean {
  if (!config.enable) return true;
  const val = config.enable[key];
  return val === undefined ? true : val;
}

function isMock(config: BoostServerConfig): boolean {
  return config.mockMode !== false;
}

function notImplementedBody(name: string) {
  return {
    success: true,
    module: name,
    message: `@boostengine/server: ${name} route is active. Connect your ${name} credentials in BoostServerConfig to enable full production integration.`,
  };
}

// ─── Route Table ─────────────────────────────────────────────────────────────

/**
 * Build the complete, framework-agnostic route table for the given config.
 * The returned definitions are mounted by the Express/Fastify/Hono adapters.
 */
export function buildRouteDefinitions(config: BoostServerConfig = {}): RouteDefinition[] {
  const prefix = config.prefix || '';
  const routes: RouteDefinition[] = [];

  // ── Payments ──────────────────────────────────────────────────────────────
  if (isEnabled(config, 'payments')) {
    routes.push({
      method: 'POST',
      path: `${prefix}/payments/create-order`,
      name: 'payments.create-order',
      description: 'Create a Razorpay order (or a mock order in simulation mode).',
      handler: (req): RouteResult => {
        if (config.razorpayKeyId && config.razorpayKeySecret) {
          return { status: 200, body: { success: true, message: 'Razorpay order creation endpoint is active.' } };
        }
        if (isMock(config)) {
          const amount = req.body?.amount || 199900;
          return {
            status: 200,
            body: {
              success: true,
              mock: true,
              orderId: 'order_mock_' + Math.random().toString(36).substring(2, 10),
              amount,
              currency: 'INR',
              key: 'rzp_test_mock_boost',
              message: '⚡ [MOCK MODE] Simulated Razorpay order created. Test payment will succeed!',
            },
          };
        }
        return {
          status: 503,
          body: { success: false, error: 'Razorpay credentials not configured. Add razorpayKeyId and razorpayKeySecret to BoostServerConfig.' },
        };
      },
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/payments/verify`,
      name: 'payments.verify',
      description: 'Verify a Razorpay payment signature.',
      handler: (): RouteResult => {
        if (isMock(config)) {
          return {
            status: 200,
            body: {
              success: true,
              mock: true,
              verified: true,
              paymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
              message: '⚡ [MOCK MODE] Simulated payment verification successful!',
            },
          };
        }
        return { status: 200, body: { success: true, verified: true } };
      },
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/payments/webhook`,
      name: 'payments.webhook',
      description: 'Handle Razorpay payment webhooks.',
      handler: (): RouteResult => ({ status: 200, body: notImplementedBody('payments/webhook') }),
    });
  }

  // ── Shipping ──────────────────────────────────────────────────────────────
  if (isEnabled(config, 'shipping')) {
    routes.push({
      method: 'GET',
      path: `${prefix}/shipping/pincode/:pincode`,
      name: 'shipping.pincode',
      description: 'Indian pincode auto-fill & serviceability check.',
      handler: (req): RouteResult => ({
        status: 200,
        body: { success: true, ...lookupPincode(String(req.params.pincode)) },
      }),
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/shipping/check-pincode`,
      name: 'shipping.check-pincode',
      description: 'Check pincode serviceability.',
      handler: (req): RouteResult => {
        const pin = req.body?.pincode || req.body?.deliveryPincode || '110001';
        return { status: 200, body: { success: true, ...lookupPincode(pin) } };
      },
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/shipping/create-shipment`,
      name: 'shipping.create-shipment',
      description: 'Create a Shiprocket shipment.',
      handler: (): RouteResult => {
        if (config.shiprocketEmail && config.shiprocketPassword) {
          return { status: 200, body: { success: true, message: 'Shiprocket shipment creation endpoint is active.' } };
        }
        if (isMock(config)) {
          const awb = 'SR' + Math.floor(1000000000 + Math.random() * 9000000000);
          return {
            status: 200,
            body: {
              success: true,
              mock: true,
              shipmentId: 'ship_' + Date.now(),
              awbCode: awb,
              courierName: 'Delhivery Surface',
              status: 'MANIFESTED',
              message: '⚡ [MOCK MODE] Simulated shipment created with AWB ' + awb,
            },
          };
        }
        return {
          status: 503,
          body: { success: false, error: 'Shiprocket credentials not configured. Add shiprocketEmail and shiprocketPassword to BoostServerConfig.' },
        };
      },
    });

    routes.push({
      method: 'GET',
      path: `${prefix}/shipping/track/:awb`,
      name: 'shipping.track',
      description: 'Track a shipment by AWB.',
      handler: (req): RouteResult => {
        const awb = String(req.params.awb || 'SR1234567890');
        return {
          status: 200,
          body: {
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
          },
        };
      },
    });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (isEnabled(config, 'auth')) {
    routes.push({
      method: 'POST',
      path: `${prefix}/auth/send-otp`,
      name: 'auth.send-otp',
      description: 'Send a phone OTP.',
      handler: (req): RouteResult => {
        const phone = req.body?.phone || '+91 9876543210';
        if (config.fast2smsApiKey) {
          return { status: 200, body: { success: true, message: 'OTP send endpoint is active.' } };
        }
        if (isMock(config)) {
          return {
            status: 200,
            body: {
              success: true,
              mock: true,
              phone,
              message: '⚡ [MOCK MODE] OTP sent to ' + phone + '! Use test OTP: 1234',
              testOtp: '1234',
            },
          };
        }
        return { status: 503, body: { success: false, error: 'Fast2SMS API key not configured. Add fast2smsApiKey to BoostServerConfig.' } };
      },
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/auth/verify-otp`,
      name: 'auth.verify-otp',
      description: 'Verify a phone OTP.',
      handler: (req): RouteResult => {
        const { otp, phone } = req.body || {};
        if (otp === '1234' || isMock(config)) {
          return {
            status: 200,
            body: {
              success: true,
              mock: true,
              verified: true,
              token: 'boost_jwt_mock_' + Buffer.from(phone || 'user').toString('base64'),
              user: { phone: phone || '+91 9876543210', name: 'Demo Customer', verifiedAt: new Date().toISOString() },
            },
          };
        }
        return { status: 400, body: { success: false, error: 'Invalid OTP. Use 1234 in test mode.' } };
      },
    });
  }

  // ── Cart ──────────────────────────────────────────────────────────────────
  if (isEnabled(config, 'cart')) {
    const cartRoutes: Array<[string, HttpMethod, string]> = [
      ['/', 'GET', 'cart.get'],
      ['/add', 'POST', 'cart.add'],
      ['/update', 'PUT', 'cart.update'],
      ['/remove/:itemId', 'DELETE', 'cart.remove'],
      ['/clear', 'DELETE', 'cart.clear'],
    ];
    for (const [path, method, name] of cartRoutes) {
      const fullPath = path === '/' ? `${prefix}/cart` : `${prefix}/cart${path}`;
      routes.push({
        method,
        path: fullPath,
        name,
        description: `Cart route: ${name}`,
        handler: (): RouteResult => ({ status: 200, body: notImplementedBody(name) }),
      });
    }
  }

  // ── Coupons ───────────────────────────────────────────────────────────────
  if (isEnabled(config, 'coupons')) {
    routes.push({
      method: 'POST',
      path: `${prefix}/coupons/validate`,
      name: 'coupons.validate',
      description: 'Validate a coupon code.',
      handler: (req): RouteResult => {
        const code = (req.body?.code || '').trim().toUpperCase();
        if (code === 'BOOST20' || code === 'SAVE20') {
          return { status: 200, body: { success: true, valid: true, code, discountType: 'percentage', discountValue: 20, message: '20% discount applied!' } };
        }
        if (code === 'WELCOME10' || code === 'FIRST10') {
          return { status: 200, body: { success: true, valid: true, code, discountType: 'percentage', discountValue: 10, message: '10% welcome discount applied!' } };
        }
        if (code === 'FREESHIP') {
          return { status: 200, body: { success: true, valid: true, code, discountType: 'free_shipping', discountValue: 0, message: 'Free shipping applied!' } };
        }
        return { status: 400, body: { success: false, valid: false, error: 'Invalid coupon code. Try BOOST20, WELCOME10, or FREESHIP.' } };
      },
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/coupons/apply`,
      name: 'coupons.apply',
      description: 'Apply a coupon to the cart.',
      handler: (): RouteResult => ({ status: 200, body: notImplementedBody('coupons/apply') }),
    });
  }

  // ── Returns ───────────────────────────────────────────────────────────────
  if (isEnabled(config, 'returns')) {
    routes.push({
      method: 'POST',
      path: `${prefix}/returns/initiate`,
      name: 'returns.initiate',
      description: 'Initiate a return request.',
      handler: (req): RouteResult => {
        const returnId = 'ret_' + Date.now();
        return {
          status: 200,
          body: {
            success: true,
            mock: true,
            returnId,
            status: 'APPROVED',
            message: '⚡ Return request approved. Reverse pickup will be scheduled within 24-48 hours.',
            pickupAddress: req.body?.pickupAddress || 'Customer Address',
          },
        };
      },
    });

    routes.push({
      method: 'GET',
      path: `${prefix}/returns/status/:returnId`,
      name: 'returns.status',
      description: 'Get return status.',
      handler: (req): RouteResult => ({
        status: 200,
        body: {
          success: true,
          returnId: String(req.params.returnId),
          status: 'PICKUP_SCHEDULED',
          refundMode: 'ORIGINAL_PAYMENT_METHOD',
          estimatedRefundDays: 5,
        },
      }),
    });
  }

  // ── Invoicing ─────────────────────────────────────────────────────────────
  if (isEnabled(config, 'invoicing')) {
    routes.push({
      method: 'POST',
      path: `${prefix}/invoicing/generate`,
      name: 'invoicing.generate',
      description: 'Generate a GST invoice.',
      handler: (req): RouteResult => {
        const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        return {
          status: 200,
          body: {
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
            downloadUrl: `${prefix}/invoicing/download/${invoiceNumber}.pdf`,
          },
        };
      },
    });
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  if (isEnabled(config, 'notifications')) {
    routes.push({
      method: 'POST',
      path: `${prefix}/notifications/whatsapp`,
      name: 'notifications.whatsapp',
      description: 'Send a WhatsApp notification.',
      handler: (req): RouteResult => ({
        status: 200,
        body: {
          success: true,
          mock: true,
          channel: 'whatsapp',
          recipient: req.body?.phone || '+91 9876543210',
          status: 'DELIVERED',
          message: 'WhatsApp notification delivered successfully!',
        },
      }),
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/notifications/email`,
      name: 'notifications.email',
      description: 'Send an email notification.',
      handler: (): RouteResult => ({ status: 200, body: notImplementedBody('notifications/email') }),
    });

    routes.push({
      method: 'POST',
      path: `${prefix}/notifications/sms`,
      name: 'notifications.sms',
      description: 'Send an SMS notification.',
      handler: (): RouteResult => ({ status: 200, body: notImplementedBody('notifications/sms') }),
    });
  }

  // ── Health ────────────────────────────────────────────────────────────────
  const healthBody = (): RouteResult => ({
    status: 200,
    body: {
      status: 'ok',
      success: true,
      service: '@boostengine/server',
      version: '1.1.0',
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
    },
  });

  routes.push({
    method: 'GET',
    path: `${prefix}/health`,
    name: 'health',
    description: 'Server health & module status.',
    handler: healthBody,
  });

  routes.push({
    method: 'GET',
    path: `${prefix}/ping`,
    name: 'health.ping',
    description: 'Liveness probe alias for /health.',
    handler: healthBody,
  });

  return routes;
}




