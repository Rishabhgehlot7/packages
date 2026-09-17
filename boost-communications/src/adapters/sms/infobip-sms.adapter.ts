import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class InfobipSMSAdapter implements ISMSAdapter {
  public providerName = 'infobip';
  private apiKey: string;
  private baseUrl: string;
  private senderId: string;

  constructor(config: SMSConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = 'https://api.infobip.com';
    this.senderId = config.senderId || 'InfoSMS';
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const body = {
      messages: [
        {
          destinations: [{ to: destination }],
          from: options.senderId || this.senderId,
          text: options.message,
        },
      ],
    };

    const res = await safeFetchJson(`${this.baseUrl}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const messageId = res.data?.messages?.[0]?.messageId;
    const isSuccess = res.ok && !!messageId;

    return {
      success: isSuccess,
      channel: 'sms',
      provider: this.providerName,
      messageId,
      error: isSuccess ? undefined : res.data?.requestError?.serviceException?.text || res.rawText,
      raw: res.data,
    };
  }
}
