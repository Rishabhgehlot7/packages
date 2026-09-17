import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class MSG91SMSAdapter implements ISMSAdapter {
  public providerName = 'msg91';
  private authKey: string;
  private senderId: string;
  private dltEntityId?: string;
  private defaultTemplateId?: string;

  constructor(config: SMSConfig) {
    this.authKey = config.apiKey;
    this.senderId = config.senderId || 'BOOSTS';
    this.dltEntityId = config.dltEntityId;
    this.defaultTemplateId = config.dltTemplateId;
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const mobile = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const templateId = options.dltTemplateId || this.defaultTemplateId;

    // Flow API (Recommended by MSG91 for DLT)
    if (templateId) {
      const body: any = {
        template_id: templateId,
        short_url: '0',
        recipients: [
          {
            mobiles: mobile,
            message: options.message,
          },
        ],
      };

      const res = await safeFetchJson('https://control.msg91.com/api/v5/flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: this.authKey,
        },
        body: JSON.stringify(body),
      });

      const isSuccess = res.ok && res.data?.type === 'success';
      return {
        success: isSuccess,
        channel: 'sms',
        provider: this.providerName,
        messageId: res.data?.message,
        error: isSuccess ? undefined : res.rawText || 'MSG91 Flow failed',
        raw: res.data,
      };
    }

    // Direct SMS API
    const params = new URLSearchParams({
      authkey: this.authKey,
      mobiles: mobile,
      message: options.message,
      sender: options.senderId || this.senderId,
      route: '4', // Transactional route
      response: 'json',
    });

    if (this.dltEntityId) {
      params.append('DLT_TE_ID', this.dltEntityId);
    }

    const res = await safeFetchJson(
      `https://api.msg91.com/api/sendhttp.php?${params.toString()}`,
      { method: 'GET' }
    );

    const isSuccess = res.ok && (res.data?.type === 'success' || !res.rawText?.includes('error'));
    return {
      success: isSuccess,
      channel: 'sms',
      provider: this.providerName,
      messageId: res.data?.message || res.rawText,
      error: isSuccess ? undefined : res.rawText,
      raw: res.data,
    };
  }
}
