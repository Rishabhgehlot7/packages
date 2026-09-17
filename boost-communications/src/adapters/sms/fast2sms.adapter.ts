import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class Fast2SMSSMSAdapter implements ISMSAdapter {
  public providerName = 'fast2sms';
  private apiKey: string;
  private senderId?: string;

  constructor(config: SMSConfig) {
    this.apiKey = config.apiKey;
    this.senderId = config.senderId;
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const numbers = cleanDigits.slice(-10);

    // Fast2SMS DLT SMS / Quick Transactional route
    const body: any = {
      route: options.dltTemplateId ? 'dlt' : 'q',
      message: options.message,
      language: options.unicode ? 'unicode' : 'english',
      flash: 0,
      numbers,
    };

    if (options.dltTemplateId) {
      body.sender_id = options.senderId || this.senderId || 'FSTSMS';
      body.message = options.dltTemplateId; // in DLT mode, Fast2SMS takes template id
    }

    const res = await safeFetchJson('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.apiKey,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && res.data?.return === true;
    return {
      success: isSuccess,
      channel: 'sms',
      provider: this.providerName,
      messageId: res.data?.request_id,
      error: isSuccess ? undefined : res.data?.message?.[0] || res.rawText,
      raw: res.data,
    };
  }
}
