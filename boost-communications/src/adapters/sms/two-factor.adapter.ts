import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class TwoFactorSMSAdapter implements ISMSAdapter {
  public providerName = '2factor';
  private apiKey: string;

  constructor(config: SMSConfig) {
    this.apiKey = config.apiKey;
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const phone = cleanDigits.slice(-10);

    // If template specified, use 2Factor transactional template endpoint
    const url = options.dltTemplateId
      ? `https://2factor.in/API/V1/${this.apiKey}/ADDON_SERVICES/SEND/TSMS`
      : `https://2factor.in/API/V1/${this.apiKey}/SMS/${phone}/AUTOGEN`;

    let res;
    if (options.dltTemplateId) {
      const body = {
        From: options.senderId || 'TWOCTR',
        To: phone,
        TemplateName: options.dltTemplateId,
        VAR1: options.message,
      };

      res = await safeFetchJson(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      res = await safeFetchJson(url, { method: 'GET' });
    }

    const isSuccess = res.ok && res.data?.Status === 'Success';
    return {
      success: isSuccess,
      channel: 'sms',
      provider: this.providerName,
      messageId: res.data?.Details,
      error: isSuccess ? undefined : res.data?.Details || res.rawText,
      raw: res.data,
    };
  }
}
