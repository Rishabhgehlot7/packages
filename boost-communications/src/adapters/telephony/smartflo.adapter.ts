import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { ClickToCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions } from '../../types';

export class SmartfloTelephonyAdapter implements IVoiceAdapter {
  public providerName = 'smartflo';
  private apiToken: string;
  private callerId?: string;

  constructor(config: TelephonyConfig) {
    this.apiToken = config.apiKey || config.apiToken || '';
    this.callerId = config.callerId || config.virtualNumber;
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { national } = normalizePhoneNumber(options.to);

    const body = {
      customer_number: national,
      caller_id: options.callerId || this.callerId || '',
    };

    const res = await safeFetchJson('https://smartflo.tatateleservices.com/v1/click_to_call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.status === 'success' || res.data?.code === 200);

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.data?.call_id || res.data?.call_id,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }

  public async clickToCall(options: ClickToCallOptions): Promise<UniversalResult> {
    const { national: custNumber } = normalizePhoneNumber(options.customerNumber);
    const { national: agentNumber } = normalizePhoneNumber(options.agentNumber);

    const body = {
      agent_number: agentNumber,
      customer_number: custNumber,
      caller_id: options.callerId || this.callerId || '',
    };

    const res = await safeFetchJson('https://smartflo.tatateleservices.com/v1/click_to_call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.status === 'success' || res.data?.code === 200);

    return {
      success: isSuccess,
      channel: 'telephony',
      provider: this.providerName,
      messageId: res.data?.data?.call_id || res.data?.call_id,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
