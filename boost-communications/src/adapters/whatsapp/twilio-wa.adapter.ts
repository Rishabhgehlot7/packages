import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class TwilioWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'twilio';
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(config: WhatsAppConfig) {
    this.accountSid = config.appId || 'AC_DEFAULT';
    this.authToken = config.apiKey;
    this.fromNumber = config.senderNumber || '+14155238886'; // Twilio sandbox default
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { e164 } = normalizePhoneNumber(options.to);
    const to = `whatsapp:${e164}`;
    const from = this.fromNumber.startsWith('whatsapp:')
      ? this.fromNumber
      : `whatsapp:${this.fromNumber}`;

    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', from);
    params.append('Body', options.message || '');
    if (options.mediaUrl) {
      params.append('MediaUrl', options.mediaUrl);
    }

    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
    const res = await safeFetchJson(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        body: params.toString(),
      }
    );

    const isSuccess = res.ok && !!res.data?.sid;
    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId: res.data?.sid,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
