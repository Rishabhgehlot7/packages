import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions } from '../../types';

export class AiSensyWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'aisensy';
  private apiKey: string;
  private baseUrl = 'https://backend.aisensy.com/campaign/t1/api/v2';

  constructor(config: WhatsAppConfig) {
    this.apiKey = config.apiKey;
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const templateParams = options.variables ? Object.values(options.variables).map(String) : [];

    const body: any = {
      apiKey: this.apiKey,
      campaignName: options.templateName || 'api_campaign',
      destination,
      userName: 'Valued Customer',
      templateParams,
    };

    if (options.mediaUrl) {
      body.media = {
        url: options.mediaUrl,
        filename: 'boost_media',
      };
    }

    const res = await safeFetchJson(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.success === true || res.data?.status === 'SUCCESS');
    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId: res.data?.messageId || res.data?.data?.messageId,
      error: isSuccess ? undefined : res.rawText || 'AiSensy delivery error',
      raw: res.data,
    };
  }
}
