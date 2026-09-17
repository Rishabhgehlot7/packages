import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class ExotelSMSAdapter implements ISMSAdapter {
  public providerName = 'exotel';
  private apiKey: string;
  private apiToken: string;
  private subDomain: string;
  private senderId: string;
  private dltEntityId?: string;

  constructor(config: SMSConfig) {
    this.apiKey = config.apiKey;
    this.apiToken = config.apiSecret || '';
    this.subDomain = config.route || 'exotel';
    this.senderId = config.senderId || 'EXOTEL';
    this.dltEntityId = config.dltEntityId;
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const to = cleanDigits.slice(-10);

    const params = new URLSearchParams({
      From: options.senderId || this.senderId,
      To: to,
      Body: options.message,
    });

    if (options.dltTemplateId) {
      params.append('DltTemplateId', options.dltTemplateId);
    }
    if (this.dltEntityId) {
      params.append('DltEntityId', this.dltEntityId);
    }

    const auth = Buffer.from(`${this.apiKey}:${this.apiToken}`).toString('base64');
    const res = await safeFetchJson(
      `https://api.exotel.com/v1/Accounts/${this.subDomain}/Sms/send.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        body: params.toString(),
      }
    );

    const smsSid = res.data?.SMSMessage?.Sid;
    const isSuccess = res.ok && !!smsSid;

    return {
      success: isSuccess,
      channel: 'sms',
      provider: this.providerName,
      messageId: smsSid,
      error: isSuccess ? undefined : res.rawText || 'Exotel SMS failed',
      raw: res.data,
    };
  }
}
