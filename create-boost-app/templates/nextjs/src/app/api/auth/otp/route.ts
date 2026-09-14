import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppAdapter } from '@boostengine/notifications';

// In-memory OTP storage with 10-minute expiry
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const whatsapp = new WhatsAppAdapter({
  provider: 'interakt',
  apiKey: process.env.INTERAKT_API_KEY || 'demo_key',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, otp } = body;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (action === 'send') {
      // Generate a 4-digit numeric OTP (fixed demo 1234 or random for testing)
      const generatedOtp = cleanPhone === '9876543210' ? '1234' : Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      otpStore.set(cleanPhone, { otp: generatedOtp, expiresAt });

      const message = `[Boost Store] Your verification code to confirm your Cash on Delivery (COD) order is: ${generatedOtp}. Do not share this OTP with anyone. Valid for 10 minutes.`;

      // Dispatch via WhatsApp/SMS adapter in background
      try {
        whatsapp.send({
          channel: 'whatsapp',
          to: { phone: cleanPhone, name: 'Valued Customer' },
          message,
          variables: { otp: generatedOtp },
        }).catch(() => {});
      } catch (e) {}

      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to +91 ${cleanPhone.slice(0, 2)}****${cleanPhone.slice(-4)}`,
        // Include demo OTP in response for instant developer testing
        demoOtp: generatedOtp,
      });
    }

    if (action === 'verify') {
      if (!otp || typeof otp !== 'string') {
        return NextResponse.json({ success: false, error: 'OTP code is required' }, { status: 400 });
      }

      const record = otpStore.get(cleanPhone);

      // Support demo fallback '1234'
      if (otp.trim() === '1234' || (record && record.otp === otp.trim() && record.expiresAt > Date.now())) {
        otpStore.delete(cleanPhone);
        return NextResponse.json({
          success: true,
          verified: true,
          message: 'Phone number verified successfully for COD order.',
        });
      }

      return NextResponse.json({
        success: false,
        error: 'Invalid or expired OTP. Please enter the correct 4-digit code (use 1234 for testing).',
      }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'OTP processing failed' },
      { status: 500 }
    );
  }
}
