import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class WatiWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'wati';
  private accessToken: string;
  private apiUrl: string;

  constructor(config: WhatsAppConfig) {
    this.accessToken = config.apiKey;
    this.apiUrl = config.apiUrl || 'https://live-server-1111.wati.io';
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const whatsappNumber = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    if (options.templateName) {
      const parameters = options.variables
        ? Object.entries(options.variables).map(([name, value]) => ({
            name,
            value: String(value),
          }))
        : [];

      const body = {
        template_name: options.templateName,
        broadcast_name: 'boost_comms_event',
        parameters,
      };

      const res = await safeFetchJson(
        `${this.apiUrl}/api/v1/sendTemplateMessage?whatsappNumber=${whatsappNumber}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const isSuccess = res.ok && (res.data?.result === true || res.data?.info === 'SUCCESS');

      return {
        success: isSuccess,
        channel: 'whatsapp',
        provider: this.providerName,
        messageId: res.data?.model?.id || res.data?.phone_id,
        error: isSuccess ? undefined : res.rawText || 'WATI template message failed',
        raw: res.data,
      };
    }

    // Session text message
    const res = await safeFetchJson(
      `${this.apiUrl}/api/v1/sendSessionMessage/${whatsappNumber}?messageText=${encodeURIComponent(
        options.message || ''
      )}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    const isSuccess = res.ok && res.data?.result === true;
    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId: res.data?.model?.id,
      error: isSuccess ? undefined : res.rawText || 'WATI session message failed',
      raw: res.data,
    };
  }
}
