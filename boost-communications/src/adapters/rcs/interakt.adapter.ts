import { IRCSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, RCSConfig, RCSSendOptions } from '../../types';
import { InteraktRCSMessageOptions } from '../../types/interakt';

export class InteraktRCSAdapter implements IRCSAdapter {
  public providerName = 'interakt';
  private apiKey: string;
  private baseUrl = 'https://api.interakt.ai/v1/public';

  constructor(config: RCSConfig) {
    this.apiKey = config.apiKey;
  }

  public async send(options: RCSSendOptions): Promise<UniversalResult> {
    const { countryCode, national } = normalizePhoneNumber(options.to);
    
    const payload: any = {
      countryCode,
      phoneNumber: national,
      type: 'STANDALONE_CAROUSEL',
      message: {
        richCardDetails: {
          standalone: {
            cardOrientation: 'VERTICAL',
            content: {
              cardTitle: options.title,
              cardDescription: options.description,
            }
          }
        }
      }
    };

    if (options.mediaUrl) {
      payload.message.richCardDetails.standalone.content.cardMedia = {
        mediaHeight: 'TALL',
        contentInfo: {
          fileUrl: options.mediaUrl
        }
      };
    }

    if (options.suggestions && options.suggestions.length > 0) {
      payload.message.richCardDetails.standalone.content.suggestions = options.suggestions.map((s) => {
        if (s.type === 'reply') {
          return {
            reply: {
              plainText: s.title,
              postBack: { data: s.postbackData || 'reply' }
            }
          };
        } else if (s.type === 'url') {
          return {
            action: {
              plainText: s.title,
              postBack: { data: s.postbackData || 'url' },
              openUrl: { url: s.url }
            }
          };
        } else if (s.type === 'dial') {
          return {
            action: {
              plainText: s.title,
              postBack: { data: s.postbackData || 'dial' },
              dialerAction: { phoneNumber: s.phoneNumber }
            }
          };
        }
        return {};
      });
    }

    return this.sendRawRCS(payload as InteraktRCSMessageOptions);
  }

  // Raw Interakt RCS Endpoint
  public async sendRawRCS(options: InteraktRCSMessageOptions): Promise<UniversalResult> {
    const res = await safeFetchJson(`${this.baseUrl}/rcs/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.apiKey}`,
      },
      body: JSON.stringify(options),
    });

    const isSuccess = res.ok && (res.data?.result === true || !!res.data?.id);

    return {
      success: isSuccess,
      channel: 'rcs',
      provider: this.providerName,
      messageId: res.data?.id || res.data?.data?.id,
      error: isSuccess ? undefined : res.data?.message || res.rawText || 'Interakt RCS delivery failure',
      raw: res.data,
    };
  }

  public async sendRcsText(countryCode: string, phoneNumber: string, text: string) {
    return this.sendRawRCS({
      countryCode,
      phoneNumber,
      type: 'Text',
      message: { plainText: text }
    });
  }

  public async sendRcsQuickReply(countryCode: string, phoneNumber: string, text: string, suggestions: any[]) {
    return this.sendRawRCS({
      countryCode,
      phoneNumber,
      type: 'QR',
      message: { plainText: text, suggestions }
    });
  }

  public async sendRcsButtonUrl(countryCode: string, phoneNumber: string, text: string, suggestions: any[]) {
    return this.sendRawRCS({
      countryCode,
      phoneNumber,
      type: 'BUTTON_URL',
      message: { plainText: text, suggestions }
    });
  }

  public async sendRcsCarousel(countryCode: string, phoneNumber: string, cardWidth: string, contents: any[], suggestions?: any[]) {
    return this.sendRawRCS({
      countryCode,
      phoneNumber,
      type: 'CAROUSEL',
      message: { 
        richCardDetails: { 
          carousel: { cardWidth, contents }
        },
        suggestions
      }
    });
  }

  public async sendRcsTemplate(options: InteraktRCSMessageOptions) {
    return this.sendRawRCS({
      ...options,
      type: 'Template'
    });
  }
}
