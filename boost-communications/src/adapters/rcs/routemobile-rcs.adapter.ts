import { IRCSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, RCSConfig, RCSSendOptions } from '../../types';

export class RouteMobileRCSAdapter implements IRCSAdapter {
  public providerName = 'routemobile';
  private apiKey: string;
  private botId: string;
  private baseUrl: string;

  constructor(config: RCSConfig) {
    this.apiKey = config.apiKey;
    this.botId = config.botId || 'BOOST_RCS_BOT';
    this.baseUrl = 'https://rcs.rmlconnect.net/v1';
  }

  public async send(options: RCSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const msisdn = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const suggestions = (options.suggestions || []).map((s) => {
      if (s.type === 'url') {
        return {
          action: {
            openUrl: { url: s.url },
            displayText: s.title,
            postback: s.postbackData || s.title,
          },
        };
      }
      if (s.type === 'dial') {
        return {
          action: {
            dialPhoneNumber: { phoneNumber: s.phoneNumber },
            displayText: s.title,
            postback: s.postbackData || s.title,
          },
        };
      }
      return {
        reply: {
          displayText: s.title,
          postback: s.postbackData || s.title,
        },
      };
    });

    const cardContent: any = {
      title: options.title,
      description: options.description,
      suggestions,
    };

    if (options.mediaUrl) {
      cardContent.media = {
        height: 'MEDIUM',
        fileUrl: options.mediaUrl,
      };
    }

    const payload = {
      botId: this.botId,
      to: msisdn,
      message: {
        richCard: {
          standaloneCard: {
            cardContent,
          },
        },
      },
    };

    const res = await safeFetchJson(`${this.baseUrl}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const isSuccess = res.ok && (res.data?.status === 'SUCCESS' || !!res.data?.messageId);

    return {
      success: isSuccess,
      channel: 'rcs',
      provider: this.providerName,
      messageId: res.data?.messageId,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
