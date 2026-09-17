import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { ClickToCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions } from '../../types';

export class KnowlarityTelephonyAdapter implements IVoiceAdapter {
  public providerName = 'knowlarity';
  private apiKey: string;
  private apiToken: string;
  private virtualNumber: string;

  constructor(config: TelephonyConfig) {
    this.apiKey = config.apiKey;
    this.apiToken = config.apiToken || '';
    this.virtualNumber = config.virtualNumber || config.callerId || '+91XXXXXXXXXX';
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

    const body = {
      k_number: options.callerId || this.virtualNumber,
      agent_number: options.callerId || this.virtualNumber,
      customer_number: destination,
    };

    const res = await safeFetchJson('https://kpi.knowlarity.com/0.1/virtual_number/click2call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        Authorization: this.apiToken,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.success?.status === 'success' || !res.rawText?.includes('error'));

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.success?.call_id || res.data?.call_id,
      error: isSuccess ? undefined : res.data?.error?.message || res.rawText,
      raw: res.data,
    };
  }

  public async clickToCall(options: ClickToCallOptions): Promise<UniversalResult> {
    const { e164: custNumber } = normalizePhoneNumber(options.customerNumber);
    const { e164: agentNumber } = normalizePhoneNumber(options.agentNumber);

    const body = {
      k_number: options.callerId || this.virtualNumber,
      agent_number: agentNumber,
      customer_number: custNumber,
    };

    const res = await safeFetchJson('https://kpi.knowlarity.com/0.1/virtual_number/click2call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        Authorization: this.apiToken,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.success?.status === 'success' || !res.rawText?.includes('error'));

    return {
      success: isSuccess,
      channel: 'telephony',
      provider: this.providerName,
      messageId: res.data?.success?.call_id || res.data?.call_id,
      error: isSuccess ? undefined : res.data?.error?.message || res.rawText,
      raw: res.data,
    };
  }
}
