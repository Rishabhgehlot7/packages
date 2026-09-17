import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class MetaCloudWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'meta';
  private accessToken: string;
  private senderPhoneId: string;
  private graphVersion = 'v20.0';

  constructor(config: WhatsAppConfig) {
    this.accessToken = config.apiKey;
    this.senderPhoneId = config.senderPhoneId || 'default';
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
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: { preview_url: true, body: options.message || '' },
      };
    }

    const res = await safeFetchJson(
      `https://graph.facebook.com/${this.graphVersion}/${this.senderPhoneId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const messageId = res.data?.messages?.[0]?.id;
    const isSuccess = res.ok && !!messageId;

    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId,
      error: isSuccess ? undefined : res.data?.error?.message || res.rawText,
      raw: res.data,
    };
  }
}
