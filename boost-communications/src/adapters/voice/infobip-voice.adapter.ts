import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, VoiceCallOptions, VoiceConfig } from '../../types';

export class InfobipVoiceAdapter implements IVoiceAdapter {
  public providerName = 'infobip';
  private apiKey: string;
  private baseUrl: string;
  private fromNumber: string;

  constructor(config: VoiceConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.appId || 'https://api.infobip.com';
    this.fromNumber = config.callerId || '447860099299';
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const body = {
      from: options.callerId || this.fromNumber,
      to: destination,
      text: options.message || 'Hello, this is an automated verification call.',
      language: options.language === 'hi-IN' ? 'hi' : 'en',
    };

    const res = await safeFetchJson(`${this.baseUrl}/tts/3/single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const messageId = res.data?.messages?.[0]?.messageId || res.data?.bulkId;
    const isSuccess = res.ok && !!messageId;

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId,
      error: isSuccess ? undefined : res.data?.requestError?.serviceException?.text || res.rawText,
      raw: res.data,
    };
  }
}
