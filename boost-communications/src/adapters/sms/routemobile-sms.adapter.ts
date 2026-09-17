import { ISMSAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, SMSConfig, SMSSendOptions } from '../../types';

export class RouteMobileSMSAdapter implements ISMSAdapter {
  public providerName = 'routemobile';
  private username: string;
  private password: string;
  private source: string;
  private dltEntityId?: string;

  constructor(config: SMSConfig) {
    this.username = config.apiKey;
    this.password = config.apiSecret || '';
    this.source = config.senderId || 'RMLSMS';
    this.dltEntityId = config.dltEntityId;
  }

  public async send(options: SMSSendOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const params = new URLSearchParams({
      username: this.username,
      password: this.password,
      type: options.unicode ? '2' : '0',
      dlr: '1',
      destination,
      source: options.senderId || this.source,
      message: options.message,
    });

    if (this.dltEntityId) {
      params.append('entityid', this.dltEntityId);
    }
    if (options.dltTemplateId) {
      params.append('tempid', options.dltTemplateId);
    }

    const res = await safeFetchJson(`https://sms.rmlconnect.net/bulksms/bulksms?${params.toString()}`, {
      method: 'GET',
    });

    // Route Mobile returns format: "1701:919876543210:4829102"
    const text = String(res.data || res.rawText || '');
    const isSuccess = res.ok && (text.startsWith('1701') || text.includes('Success') || !text.includes('1702'));

    return {
      success: isSuccess,
      channel: 'sms',
      provider: this.providerName,
      messageId: text,
      error: isSuccess ? undefined : text || 'Route Mobile SMS failed',
      raw: text,
    };
  }
}
