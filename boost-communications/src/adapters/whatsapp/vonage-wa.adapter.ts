import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class VonageWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'vonage';
  private apiKey: string;
  private apiSecret: string;
  private fromNumber: string;

  constructor(config: WhatsAppConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.appId || '';
    this.fromNumber = config.senderNumber || '14157386102';
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const to = cleanDigits;

    let body: any = {
      message_type: 'text',
      to,
      from: this.fromNumber,
      channel: 'whatsapp',
      text: options.message || '',
    };

    if (options.templateName) {
      body = {
        message_type: 'template',
        to,
        from: this.fromNumber,
        channel: 'whatsapp',
        template: {
          name: options.templateName,
          parameters: options.variables ? Object.values(options.variables).map(String) : [],
        },
        whatsapp: {
          policy: 'deterministic',
          locale: options.language || 'en_US',
        },
      };
    }

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
      channel: 'whatsapp',
      provider: this.providerName,
      messageId: messageUuid,
      error: isSuccess ? undefined : res.data?.title || res.rawText,
      raw: res.data,
    };
  }
}
