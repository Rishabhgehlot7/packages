import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class GupshupWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'gupshup';
  private apiKey: string;
  private appId?: string;
  private baseUrl = 'https://api.gupshup.io/wa/api/v1';

  constructor(config: WhatsAppConfig) {
    this.apiKey = config.apiKey;
    this.appId = config.appId;
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    let payload: URLSearchParams;

    if (options.templateName) {
      const templateParams = options.variables ? Object.values(options.variables).map(String) : [];
      payload = new URLSearchParams({
        channel: 'whatsapp',
        source: this.appId || 'BOOSTSTORE',
        destination,
        'src.name': this.appId || 'BOOSTSTORE',
        template: JSON.stringify({
          id: options.templateName,
          params: templateParams,
        }),
      });
    } else {
      payload = new URLSearchParams({
        channel: 'whatsapp',
        source: this.appId || 'BOOSTSTORE',
        destination,
        'src.name': this.appId || 'BOOSTSTORE',
        message: JSON.stringify({
          type: 'text',
          text: options.message || '',
        }),
      });
    }

    const res = await safeFetchJson(`${this.baseUrl}/msg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: this.apiKey,
      },
      body: payload.toString(),
    });

    const isSuccess = res.ok && (res.data?.status === 'submitted' || res.data?.messageId);

    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId: res.data?.messageId,
      error: isSuccess ? undefined : res.rawText || 'Gupshup message error',
      raw: res.data,
    };
  }
}
