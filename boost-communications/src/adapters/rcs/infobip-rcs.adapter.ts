import { IRCSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, RCSConfig, RCSSendOptions } from '../../types';

export class InfobipRCSAdapter implements IRCSAdapter {
  public providerName = 'infobip';
  private apiKey: string;
  private baseUrl: string;
  private sender: string;

  constructor(config: RCSConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = 'https://api.infobip.com';
    this.sender = config.botId || 'InfoRCS';
  }

  public async send(options: RCSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const suggestions = (options.suggestions || []).map((s) => {
      if (s.type === 'url') {
        return {
          text: s.title,
          postbackData: s.postbackData || s.title,
          openUrl: { url: s.url },
        };
      }
      if (s.type === 'dial') {
        return {
          text: s.title,
          postbackData: s.postbackData || s.title,
          dialPhoneNumber: { phoneNumber: s.phoneNumber },
        };
      }
      return {
        text: s.title,
        postbackData: s.postbackData || s.title,
      };
    });

    const body = {
      messages: [
        {
          from: this.sender,
          to: destination,
          content: {
            card: {
              title: options.title,
              description: options.description,
              media: options.mediaUrl ? { file: { url: options.mediaUrl } } : undefined,
              suggestions,
            },
          },
        },
      ],
    };

    const res = await safeFetchJson(`${this.baseUrl}/rcs/1/message/card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `App ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const messageId = res.data?.messages?.[0]?.messageId;
    const isSuccess = res.ok && !!messageId;

    return {
      success: isSuccess,
      channel: 'rcs',
      provider: this.providerName,
      messageId,
      error: isSuccess ? undefined : res.data?.requestError?.serviceException?.text || res.rawText,
      raw: res.data,
    };
  }
}
