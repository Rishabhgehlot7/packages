import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, VoiceCallOptions, VoiceConfig } from '../../types';

export class ExotelVoiceAdapter implements IVoiceAdapter {
  public providerName = 'exotel';
  private apiKey: string;
  private apiToken: string;
  private subDomain: string;
  private callerId: string;

  constructor(config: VoiceConfig) {
    this.apiKey = config.apiKey;
    this.apiToken = config.apiToken || '';
    this.subDomain = config.subDomain || 'exotel';
    this.callerId = config.callerId || '080XXXXXXXX';
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const to = cleanDigits.slice(-10);

    const params = new URLSearchParams({
      From: to,
      To: options.callerId || this.callerId,
      CallerId: options.callerId || this.callerId,
      CallType: 'trans',
    });

    const auth = Buffer.from(`${this.apiKey}:${this.apiToken}`).toString('base64');
    const res = await safeFetchJson(
      `https://api.exotel.com/v1/Accounts/${this.subDomain}/Calls/connect.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        body: params.toString(),
      }
    );

    const callSid = res.data?.Call?.Sid;
    const isSuccess = res.ok && !!callSid;

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: callSid,
      error: isSuccess ? undefined : res.rawText || 'Exotel call trigger failed',
      raw: res.data,
    };
  }
}
