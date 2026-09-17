import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class ThreeSixtyDialogWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = '360dialog';
  private apiKey: string;
  private baseUrl: string;

  constructor(config: WhatsAppConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.apiUrl || 'https://waba-v2.360dialog.io';
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const recipient = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    let body: any;

    if (options.templateName) {
      const parameters: any[] = [];
      if (options.variables) {
        for (const val of Object.values(options.variables)) {
          parameters.push({ type: 'text', text: String(val) });
        }
      }

      body = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'template',
        template: {
          name: options.templateName,
          language: { code: options.language || 'en_US' },
          components: [
            {
              type: 'body',
              parameters,
            },
          ],
        },
      };

      if (options.mediaUrl) {
        body.template.components.unshift({
          type: 'header',
          parameters: [
            {
              type: options.headerType || 'image',
              [options.headerType || 'image']: { link: options.mediaUrl },
            },
          ],
        });
      }
    } else {
      body = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body: options.message || '' },
      };
    }

    const res = await safeFetchJson(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    const messageId = res.data?.messages?.[0]?.id;
    const isSuccess = res.ok && !!messageId;

    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId,
      error: isSuccess ? undefined : res.data?.meta?.developer_message || res.rawText,
      raw: res.data,
    };
  }
}
