import { IWhatsAppAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, WhatsAppConfig, WhatsAppSendOptions, InboundWebhookEvent, DeliveryStatus } from '../../types';
import {
  InteraktTrackUserOptions,
  InteraktTrackEventOptions,
  InteraktCampaignOptions,
  InteraktTemplateCreateOptions,
  InteraktChatAssignmentOptions,
  InteraktSendMediaOptions,
  InteraktSendTemplateOptions
} from '../../types/interakt';

export class InteraktWhatsAppAdapter implements IWhatsAppAdapter {
  public providerName = 'interakt';
  private apiKey: string;
  private baseUrl = 'https://api.interakt.ai/v1/public';

  constructor(config: WhatsAppConfig) {
    this.apiKey = config.apiKey;
  }

  private async makeRequest(endpoint: string, method: string, payload?: any, queryParams?: Record<string, any>): Promise<any> {
    let url = `${this.baseUrl}${endpoint}`;
    if (queryParams) {
      const q = new URLSearchParams();
      Object.entries(queryParams).forEach(([k, v]) => {
        if (v !== undefined) q.append(k, String(v));
      });
      url += `?${q.toString()}`;
    }

    const options: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.apiKey}`,
      }
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    return safeFetchJson(url, options);
  }

  public async send(options: WhatsAppSendOptions): Promise<UniversalResult> {
    const { countryCode, national } = normalizePhoneNumber(options.to);

    const body: any = {
      countryCode,
      phoneNumber: national,
      callbackData: 'boost_comms_alert',
      type: options.templateName ? 'Template' : 'Text',
    };

    if (options.templateName) {
      const traitValues = options.variables ? Object.values(options.variables).map(String) : [];
      
      const templateObj: any = {
        name: options.templateName,
        languageCode: options.language || 'en',
        bodyValues: traitValues,
      };

      if (options.mediaUrl) {
        templateObj.headerValues = [options.mediaUrl];
      }

      if (options.buttons && options.buttons.length > 0) {
        const buttonValuesObj: Record<string, string[]> = {};
        options.buttons.forEach((btn, idx) => {
          if (btn.value) {
            buttonValuesObj[String(idx)] = [btn.value];
          }
        });
        templateObj.buttonValues = buttonValuesObj;
      }

      body.template = templateObj;
    } else {
      body.message = options.message || '';
    }

    const res = await this.makeRequest('/message/', 'POST', body);
    const isSuccess = res.ok && (res.data?.result === true || !!res.data?.id);

    return {
      success: isSuccess,
      channel: 'whatsapp',
      provider: this.providerName,
      messageId: res.data?.id || res.data?.data?.id,
      error: isSuccess ? undefined : res.data?.message || res.rawText || 'Interakt delivery failure',
      raw: res.data,
    };
  }

  // --- Track APIs ---
  public async trackUser(options: InteraktTrackUserOptions): Promise<any> {
    const res = await this.makeRequest('/track/users/', 'POST', options);
    return res.data;
  }

  public async trackEvent(options: InteraktTrackEventOptions): Promise<any> {
    const res = await this.makeRequest('/track/events/', 'POST', options);
    return res.data;
  }

  // --- Campaign APIs ---
  public async createCampaign(options: InteraktCampaignOptions): Promise<any> {
    const res = await this.makeRequest('/create-campaign/', 'POST', options);
    return res.data;
  }

  // --- Customer APIs ---
  public async getUsersBulk(offset: number = 0, limit: number = 100, filters?: any): Promise<any> {
    const res = await this.makeRequest('/apis/users/', 'POST', { filters }, { offset, limit });
    return res.data;
  }

  public async getUserByPhone(phoneNumber: string): Promise<any> {
    const res = await this.makeRequest(`/apis/users/phone_number/${phoneNumber}`, 'GET');
    return res.data;
  }

  public async getUserById(userId: string): Promise<any> {
    const res = await this.makeRequest(`/apis/users/id/${userId}`, 'GET');
    return res.data;
  }

  // --- Advanced Send Message APIs ---
  public async sendMediaMessage(options: InteraktSendMediaOptions): Promise<any> {
    const res = await this.makeRequest('/message/', 'POST', options);
    return res.data;
  }

  public async sendTemplateMessage(options: InteraktSendTemplateOptions): Promise<any> {
    const res = await this.makeRequest('/message/', 'POST', options);
    return res.data;
  }

  // --- Create Template APIs ---
  public async createTemplate(options: InteraktTemplateCreateOptions): Promise<any> {
    const res = await this.makeRequest('/track/templates/', 'POST', options);
    return res.data;
  }

  public async getAllTemplates(queryParams?: Record<string, string | number>): Promise<any> {
    const res = await this.makeRequest('/track/organization/templates', 'GET', undefined, queryParams);
    return res.data;
  }

  // --- Chat Assignment APIs ---
  public async assignChat(options: InteraktChatAssignmentOptions): Promise<any> {
    const res = await this.makeRequest('/assignment/', 'POST', options);
    return res.data;
  }

  public parseWebhook(payload: any, headers?: Record<string, string>): InboundWebhookEvent | null {
    if (!payload || !payload.type) return null;

    const eventType = payload.type;
    const msgId = payload.data?.message?.id;
    const phone = payload.data?.customer?.phone_number;

    if (eventType.startsWith('message_')) {
      let status: DeliveryStatus | undefined;
      
      switch (eventType) {
        case 'message_sent': status = 'sent'; break;
        case 'message_delivered': status = 'delivered'; break;
        case 'message_read': status = 'read'; break;
        case 'message_failed': status = 'failed'; break;
      }

      if (status) {
        return {
          channel: 'whatsapp',
          provider: this.providerName,
          type: 'delivery_receipt',
          messageId: msgId,
          status,
          to: phone ? `+${phone}` : undefined,
          timestamp: new Date().toISOString(),
          raw: payload,
        };
      } else if (eventType === 'message_received') {
        return {
          channel: 'whatsapp',
          provider: this.providerName,
          type: 'incoming_message',
          messageId: msgId,
          from: phone ? `+${phone}` : undefined,
          content: payload.data?.message?.text || payload.data?.message?.message?.text,
          timestamp: new Date().toISOString(),
          raw: payload,
        };
      }
    }
    
    return null;
  }
}
