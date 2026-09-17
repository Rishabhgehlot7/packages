import { createHmac, randomBytes } from 'crypto';
import {
  SmartOTPOptions,
  SmartOTPResult,
  VerifyOTPOptions,
  VerifyOTPResult,
} from '../types';
import { normalizePhoneNumber } from '../adapters/base';
import { IWhatsAppAdapter, ISMSAdapter, IVoiceAdapter } from '../adapters/base';

export class OTPManager {
  private secret: string;
  private whatsappAdapter?: IWhatsAppAdapter;
  private smsAdapter?: ISMSAdapter;
  private voiceAdapter?: IVoiceAdapter;

  constructor(options: {
    secret?: string;
    whatsappAdapter?: IWhatsAppAdapter;
    smsAdapter?: ISMSAdapter;
    voiceAdapter?: IVoiceAdapter;
  }) {
    this.secret = options.secret || 'boost_secure_otp_salt_2026';
    this.whatsappAdapter = options.whatsappAdapter;
    this.smsAdapter = options.smsAdapter;
    this.voiceAdapter = options.voiceAdapter;
  }

  /**
   * Generates a cryptographically random numeric OTP
   */
  public generateOTP(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const randomBuffer = randomBytes(4);
    const randomInt = randomBuffer.readUInt32BE(0);
    const code = min + (randomInt % (max - min + 1));
    return code.toString();
  }

  /**
   * Creates a tamper-proof stateless HMAC verification token.
   * No Redis or database write required!
   */
  public createVerificationToken(
    phone: string,
    otp: string,
    validityMinutes: number = 5
  ): string {
    const { cleanDigits } = normalizePhoneNumber(phone);
    const expiresAt = Date.now() + validityMinutes * 60 * 1000;
    const data = `${cleanDigits}:${otp}:${expiresAt}`;
    const signature = createHmac('sha256', this.secret).update(data).digest('hex');

    // Base64Url encode payload:phone:expiresAt:signature
    const payload = `${cleanDigits}.${expiresAt}.${signature}`;
    return Buffer.from(payload).toString('base64url');
  }

  /**
   * Verifies the stateless verification token cryptographically
   */
  public verifyOTP(options: VerifyOTPOptions): VerifyOTPResult {
    try {
      const { cleanDigits } = normalizePhoneNumber(options.phone);
      const decoded = Buffer.from(options.token, 'base64url').toString('utf-8');
      const [tokenPhone, expiresAtStr, signature] = decoded.split('.');

      if (!tokenPhone || !expiresAtStr || !signature) {
        return { valid: false, phone: options.phone, error: 'Invalid token structure' };
      }

      if (tokenPhone !== cleanDigits) {
        return { valid: false, phone: options.phone, error: 'Phone number mismatch' };
      }

      const expiresAt = parseInt(expiresAtStr, 10);
      if (Date.now() > expiresAt) {
        return { valid: false, phone: options.phone, error: 'OTP has expired' };
      }

      const expectedData = `${tokenPhone}:${options.otp.trim()}:${expiresAt}`;
      const expectedSignature = createHmac('sha256', this.secret).update(expectedData).digest('hex');

      if (signature !== expectedSignature) {
        return { valid: false, phone: options.phone, error: 'Invalid or incorrect OTP' };
      }

      return { valid: true, phone: options.phone };
    } catch (err: any) {
      return { valid: false, phone: options.phone, error: err?.message || 'Verification failed' };
    }
  }

  /**
   * Smart Multi-Tier Fallback OTP Delivery:
   * Sequence: WhatsApp (Tier 1) ➔ SMS (Tier 2) ➔ Voice Call (Tier 3)
   */
  public async sendSmartOTP(options: SmartOTPOptions): Promise<SmartOTPResult> {
    const { phone } = options;
    const otp = options.otp || this.generateOTP(options.length || 6);
    const validityMinutes = options.validityMinutes || 5;
    const token = this.createVerificationToken(phone, otp, validityMinutes);

    const sequence = options.fallbackSequence || ['whatsapp', 'sms', 'voice'];
    const attempts: Array<{ channel: 'whatsapp' | 'sms' | 'voice'; success: boolean; error?: string }> = [];

    const defaultMsg = `Your Boost verification code is ${otp}. Valid for ${validityMinutes} minutes. Do not share this OTP with anyone.`;
    const message = options.messageTemplate ? options.messageTemplate.replace('{otp}', otp) : defaultMsg;

    let deliveredVia: 'whatsapp' | 'sms' | 'voice' = 'sms';
    let isDelivered = false;
    let lastError: string | undefined;

    for (const channel of sequence) {
      if (channel === 'whatsapp' && this.whatsappAdapter) {
        try {
          const res = await this.whatsappAdapter.send({
            to: phone,
            message,
            templateName: 'otp_verification',
            variables: { otp, validity: validityMinutes },
          });
          attempts.push({ channel: 'whatsapp', success: res.success, error: res.error });
          if (res.success) {
            deliveredVia = 'whatsapp';
            isDelivered = true;
            break;
          }
          lastError = res.error;
        } catch (e: any) {
          attempts.push({ channel: 'whatsapp', success: false, error: e.message });
          lastError = e.message;
        }
      } else if (channel === 'sms' && this.smsAdapter) {
        try {
          const res = await this.smsAdapter.send({
            to: phone,
            message,
          });
          attempts.push({ channel: 'sms', success: res.success, error: res.error });
          if (res.success) {
            deliveredVia = 'sms';
            isDelivered = true;
            break;
          }
          lastError = res.error;
        } catch (e: any) {
          attempts.push({ channel: 'sms', success: false, error: e.message });
          lastError = e.message;
        }
      } else if (channel === 'voice' && this.voiceAdapter) {
        try {
          const spokenOtp = otp.split('').join(' ');
          const res = await this.voiceAdapter.call({
            to: phone,
            message: `Namaste. Your verification code is ${spokenOtp}. I repeat, your code is ${spokenOtp}.`,
          });
          attempts.push({ channel: 'voice', success: res.success, error: res.error });
          if (res.success) {
            deliveredVia = 'voice';
            isDelivered = true;
            break;
          }
          lastError = res.error;
        } catch (e: any) {
          attempts.push({ channel: 'voice', success: false, error: e.message });
          lastError = e.message;
        }
      }
    }

    return {
      success: isDelivered,
      channel: deliveredVia,
      provider: 'smart_fallback',
      deliveredVia,
      otp,
      token,
      attempts,
      error: isDelivered ? undefined : `All OTP delivery tiers failed. Last error: ${lastError}`,
    };
  }
}
