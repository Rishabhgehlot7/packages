import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class VonageSMSAdapter implements ISMSAdapter {
  public providerName = 'vonage';
  private apiKey: string;
  private apiSecret: string;
  private senderId: string;

  constructor(config: SMSConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret || '';
    this.senderId = config.senderId || 'Vonage';
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);

    const body = {
      message_type: 'text',
      to: cleanDigits,
      from: options.senderId || this.senderId,
      channel: 'sms',
      text: options.message,
    };

    const auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
    const res = await safeFetchJson('https://api.nexmo.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const messageUuid = res.data?.message_uuid;
    const isSuccess = res.ok && !!messageUuid;

    return {
      success: isSuccess,
      channel: 'sms',
      provider: this.providerName,
      messageId: messageUuid,
      error: isSuccess ? undefined : res.data?.title || res.rawText,
      raw: res.data,
    };
  }
}
