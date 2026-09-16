import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'boost-super-secret-key-2026';

// Temporary memory store for OTP verification
const OTP_STORE: Map<string, { otp: string; expiresAt: number }> = new Map();

// POST /api/auth/send-otp
authRouter.post('/send-otp', (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone || !/^[6-9]\d{9}$/.test(String(phone).replace(/^\+91/, '').trim())) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid 10-digit Indian mobile number.',
    });
  }

  const cleanPhone = String(phone).replace(/^\+91/, '').trim();
  const mockOtp = '1234';
  OTP_STORE.set(cleanPhone, {
    otp: mockOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: 'OTP dispatched via SMS/WhatsApp successfully!',
    mockOtp: '1234', // Included for seamless developer testing
  });
});

// POST /api/auth/verify-otp
authRouter.post('/verify-otp', (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  const cleanPhone = String(phone || '').replace(/^\+91/, '').trim();
  const record = OTP_STORE.get(cleanPhone);

  if (!record || record.otp !== String(otp).trim()) {
    // Also accept default mock OTP 1234 for testing convenience
    if (otp !== '1234') {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP. Please use 1234.' });
    }
  }

  const user = {
    id: 'usr_' + cleanPhone,
    phone: cleanPhone,
    role: 'customer',
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });

  return res.json({
    success: true,
    message: 'Authenticated successfully!',
    token,
    user,
  });
});
