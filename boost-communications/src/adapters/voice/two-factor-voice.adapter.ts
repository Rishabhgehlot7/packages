import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, VoiceCallOptions, VoiceConfig } from '../../types';

export class TwoFactorVoiceAdapter implements IVoiceAdapter {
  public providerName = '2factor';
  private apiKey: string;

  constructor(config: VoiceConfig) {
    this.apiKey = config.apiKey;
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const phone = cleanDigits.slice(-10);

    // Extract OTP digits from message or options
    const otpMatch = (options.message || '').match(/\b\d{4,6}\b/);
    const otp = otpMatch ? otpMatch[0] : '123456';

    const url = `https://2factor.in/API/V1/${this.apiKey}/VOICE/${phone}/${otp}`;

    const res = await safeFetchJson(url, { method: 'GET' });

    const isSuccess = res.ok && res.data?.Status === 'Success';

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.Details,
      error: isSuccess ? undefined : res.data?.Details || res.rawText,
      raw: res.data,
    };
  }
}
