import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, VoiceCallOptions, VoiceConfig } from '../../types';

export class MSG91VoiceAdapter implements IVoiceAdapter {
  public providerName = 'msg91';
  private authKey: string;

  constructor(config: VoiceConfig) {
    this.authKey = config.apiKey;
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const mobile = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    // MSG91 Voice Retry / Voice OTP trigger API
    const res = await safeFetchJson(
      `https://control.msg91.com/api/v5/otp/retry?authkey=${encodeURIComponent(
        this.authKey
      )}&mobile=${encodeURIComponent(mobile)}&retrytype=voice`,
      { method: 'GET' }
    );

    const isSuccess = res.ok && res.data?.type === 'success';
    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.message || 'voice_triggered',
      error: isSuccess ? undefined : res.rawText || 'MSG91 Voice Call trigger failed',
      raw: res.data,
    };
  }
}
