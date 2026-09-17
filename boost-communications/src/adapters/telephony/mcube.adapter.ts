import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { ClickToCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions, InboundWebhookEvent, DeliveryStatus } from '../../types';

export class MCubeTelephonyAdapter implements IVoiceAdapter {
  public providerName = 'mcube';
  private apiKey: string;
  private defaultExecutiveNumber?: string;
  private baseUrl = 'https://api.mcube.com/Restmcube-api';

  constructor(config: TelephonyConfig) {
    this.apiKey = config.apiKey;
    this.defaultExecutiveNumber = config.agentId || config.callerId;
  }

  /**
   * Outbound Announcement / Automated Call
   */
  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { national } = normalizePhoneNumber(options.to);
    const exeNumber = options.callerId || this.defaultExecutiveNumber || '9999999999';

    const params = new URLSearchParams({
      HTTP_AUTHORIZATION: this.apiKey,
      exenumber: exeNumber,
      custnumber: national,
      refurl: '1',
      refid: `boost_${Date.now()}`,
    });

    const res = await safeFetchJson(`${this.baseUrl}/outbound-calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const isSuccess = res.ok && !res.rawText?.toLowerCase().includes('error');

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.callid || res.rawText,
      error: isSuccess ? undefined : res.rawText || 'MCUBE outbound call failed',
      raw: res.data,
    };
  }

  /**
   * MCUBE Click-to-Call (Connect Executive to Customer)
   */
  public async clickToCall(options: ClickToCallOptions): Promise<UniversalResult> {
    const { national: exeNumber } = normalizePhoneNumber(options.agentNumber);
    const { national: custNumber } = normalizePhoneNumber(options.customerNumber);

    const params = new URLSearchParams({
      HTTP_AUTHORIZATION: this.apiKey,
      exenumber: exeNumber,
      custnumber: custNumber,
      refurl: '1',
      refid: options.refId || `c2c_${Date.now()}`,
    });

    const res = await safeFetchJson(`${this.baseUrl}/outbound-calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const isSuccess = res.ok && !res.rawText?.toLowerCase().includes('error');

    return {
      success: isSuccess,
      channel: 'telephony',
      provider: this.providerName,
      messageId: res.data?.callid || res.rawText,
      error: isSuccess ? undefined : res.rawText || 'MCUBE Click-to-Call failed',
      raw: res.data,
    };
  }

  /**
   * Parse MCUBE Call Status Webhooks
   */
  public parseWebhook(payload: any, headers?: Record<string, string>): InboundWebhookEvent | null {
    // MCUBE typically sends webhooks with `callid` and `status` or `callstatus`
    if (!payload || (!payload.callid && !payload.call_id)) return null;

    const callId = payload.callid || payload.call_id;
    const statusStr = (payload.status || payload.callstatus || '').toLowerCase();
    
    let mappedStatus: DeliveryStatus | undefined;
    if (statusStr.includes('answered') || statusStr.includes('completed')) {
      mappedStatus = 'delivered';
    } else if (statusStr.includes('missed') || statusStr.includes('failed') || statusStr.includes('no answer')) {
      mappedStatus = 'failed';
    } else if (statusStr.includes('ringing') || statusStr.includes('in-progress')) {
      mappedStatus = 'sent';
    }

    if (mappedStatus) {
      return {
        channel: 'telephony',
        provider: this.providerName,
        type: 'call_status',
        messageId: callId,
        status: mappedStatus,
        from: payload.caller || payload.custnumber,
        timestamp: new Date().toISOString(),
        raw: payload,
      };
    }

    // DTMF Handling
    if (payload.dtmf || payload.digits) {
      return {
        channel: 'telephony',
        provider: this.providerName,
        type: 'dtmf_input',
        messageId: callId,
        content: payload.dtmf || payload.digits,
        from: payload.caller || payload.custnumber,
        timestamp: new Date().toISOString(),
        raw: payload,
      };
    }

    return null;
  }
}
