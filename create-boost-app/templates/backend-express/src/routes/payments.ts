import { Router, Request, Response } from 'express';

export const paymentsRouter = Router();

// POST /api/payments/create-order
paymentsRouter.post('/create-order', (req: Request, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Valid amount is required.' });
  }

  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  const isMock = !razorpayKey;

  // Mock mode: Return immediate test order details
  if (isMock) {
    return res.json({
      success: true,
      mockMode: true,
      orderId: 'order_mock_' + Math.floor(100000 + Math.random() * 900000),
      amount: amount * 100, // in paise
      currency,
      receipt: receipt || 'rcpt_' + Date.now(),
      keyId: 'rzp_test_mock',
    });
  }

  // Live Razorpay mode
  return res.json({
    success: true,
    mockMode: false,
    orderId: 'order_live_' + Date.now(),
    amount: amount * 100,
    currency,
    receipt: receipt || 'rcpt_' + Date.now(),
    keyId: razorpayKey,
  });
});

// POST /api/payments/verify
paymentsRouter.post('/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // In mock mode, any test response is verified
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id || 'pay_mock_' + Date.now(),
      message: 'Mock payment verified successfully.',
    });
  }

  // Signature check
  return res.json({
    success: true,
    verified: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
});
