import { IRCSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, RCSConfig, RCSSendOptions } from '../../types';

export class GupshupRCSAdapter implements IRCSAdapter {
  public providerName = 'gupshup';
  private apiKey: string;
  private botId: string;
  private baseUrl = 'https://api.gupshup.io/rcs/api/v1';

  constructor(config: RCSConfig) {
    this.apiKey = config.apiKey;
    this.botId = config.botId || 'BOOST_RCS_BOT';
  }

  public async send(options: RCSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

    const suggestions = (options.suggestions || []).map((s) => {
      if (s.type === 'url') {
        return {
          action: {
            openUrlAction: { url: s.url },
            displayText: s.title,
            postbackData: s.postbackData || s.title,
          },
        };
      }
      if (s.type === 'dial') {
        return {
          action: {
            dialAction: { phoneNumber: s.phoneNumber },
            displayText: s.title,
            postbackData: s.postbackData || s.title,
          },
        };
      }
      return {
        reply: {
          text: s.title,
          postbackData: s.postbackData || s.title,
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
        contentInfo: { fileUrl: options.mediaUrl },
      };
    }

    const payload = {
      sendTo: destination,
      botId: this.botId,
      message: {
        richCard: {
          standaloneCard: {
            cardOrientation: 'VERTICAL',
            cardContent,
          },
        },
      },
    };

    const res = await safeFetchJson(`${this.baseUrl}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const isSuccess = res.ok && (res.data?.status === 'submitted' || !!res.data?.messageId);

    return {
      success: isSuccess,
      channel: 'rcs',
      provider: this.providerName,
      messageId: res.data?.messageId,
      error: isSuccess ? undefined : res.rawText || 'RCS card delivery failed',
      raw: res.data,
    };
  }
}
