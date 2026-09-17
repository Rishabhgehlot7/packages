import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, VoiceCallOptions, VoiceConfig } from '../../types';

export class GupshupVoiceAdapter implements IVoiceAdapter {
  public providerName = 'gupshup';
  private apiKey: string;
  private callerId?: string;

  constructor(config: VoiceConfig) {
    this.apiKey = config.apiKey;
    this.callerId = config.callerId;
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const payload = new URLSearchParams({
      sendTo: destination,
      msg: options.message || 'Hello, this is an automated verification call.',
      callerId: options.callerId || this.callerId || '',
    });

    const res = await safeFetchJson('https://api.gupshup.io/sm/api/v1/voice/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: this.apiKey,
      },
      body: payload.toString(),
    });

    const isSuccess = res.ok && (res.data?.status === 'success' || !!res.data?.callId);

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.callId || res.data?.id,
      error: isSuccess ? undefined : res.rawText || 'Gupshup Voice Call trigger failed',
      raw: res.data,
    };
  }
}
