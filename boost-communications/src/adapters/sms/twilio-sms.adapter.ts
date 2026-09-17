import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class TwilioSMSAdapter implements ISMSAdapter {
  public providerName = 'twilio';
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(config: SMSConfig) {
    this.accountSid = config.apiSecret || 'AC_DEFAULT';
    this.authToken = config.apiKey;
    this.fromNumber = config.senderId || '+1234567890';
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { e164 } = normalizePhoneNumber(options.to);

    const params = new URLSearchParams();
    params.append('To', e164);
    params.append('From', options.senderId || this.fromNumber);
    params.append('Body', options.message);

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
      channel: 'sms',
      provider: this.providerName,
      messageId: res.data?.sid,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
