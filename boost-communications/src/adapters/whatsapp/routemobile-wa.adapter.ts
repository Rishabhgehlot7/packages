import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class RouteMobileWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'routemobile';
  private apiKey: string;
  private baseUrl: string;

  constructor(config: WhatsAppConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.apiUrl || 'https://wbs.rmlconnect.net/v1';
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    let body: any;

    if (options.templateName) {
      const parameters = options.variables
        ? Object.values(options.variables).map((val) => ({
            type: 'text',
            text: String(val),
          }))
        : [];

      body = {
        phone: destination,
        template: {
          name: options.templateName,
          language: options.language || 'en',
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
        phone: destination,
        message: {
          text: options.message || '',
        },
      };
    }

    const res = await safeFetchJson(`${this.baseUrl}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.status === 'SUCCESS' || !!res.data?.messageId || res.data?.code === 200);

    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId: res.data?.messageId || res.data?.data?.messageId,
      error: isSuccess ? undefined : res.data?.description || res.rawText,
      raw: res.data,
    };
  }
}
