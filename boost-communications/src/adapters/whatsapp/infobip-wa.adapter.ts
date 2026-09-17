import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class InfobipWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'infobip';
  private apiKey: string;
  private baseUrl: string;
  private fromNumber: string;

  constructor(config: WhatsAppConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.apiUrl || 'https://api.infobip.com';
    this.fromNumber = config.senderNumber || '447860099299';
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    let endpoint = `${this.baseUrl}/whatsapp/1/message/text`;
    let body: any;

    if (options.templateName) {
      endpoint = `${this.baseUrl}/whatsapp/1/message/template`;
      const placeholders = options.variables ? Object.values(options.variables).map(String) : [];

      body = {
        messages: [
          {
            from: this.fromNumber,
            to: destination,
            content: {
              templateName: options.templateName,
              templateData: {
                body: {
                  placeholders,
                },
              },
              language: options.language || 'en',
            },
          },
        ],
      };
    } else {
      body = {
        from: this.fromNumber,
        to: destination,
        content: {
          text: options.message || '',
        },
      };
    }

    const res = await safeFetchJson(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const messageId = res.data?.messages?.[0]?.messageId || res.data?.messageId;
    const isSuccess = res.ok && !!messageId;

    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId,
      error: isSuccess ? undefined : res.data?.requestError?.serviceException?.text || res.rawText,
      raw: res.data,
    };
  }
}
