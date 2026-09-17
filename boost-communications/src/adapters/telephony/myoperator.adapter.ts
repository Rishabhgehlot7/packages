import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { ClickToCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions } from '../../types';

export class MyOperatorTelephonyAdapter implements IVoiceAdapter {
  public providerName = 'myoperator';
  private apiKey: string;
  private companyId: string;
  private defaultAgentId?: string;
  private callerId?: string;

  constructor(config: TelephonyConfig) {
    this.apiKey = config.apiKey;
    this.companyId = config.subDomain || 'default';
    this.defaultAgentId = config.agentId;
    this.callerId = config.callerId || config.virtualNumber;
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { national } = normalizePhoneNumber(options.to);

    const body = {
      company_id: this.companyId,
      secret_token: this.apiKey,
      type: 1,
      user_id: this.defaultAgentId || '1',
      customer_number: national,
      caller_id: options.callerId || this.callerId,
    };

    const res = await safeFetchJson('https://developers.myoperator.co/call/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.status === 'success' || res.data?.code === 200);

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.data?.uid || res.data?.uid,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }

  public async clickToCall(options: ClickToCallOptions): Promise<UniversalResult> {
    const { national: custNumber } = normalizePhoneNumber(options.customerNumber);
    const { national: agentNumber } = normalizePhoneNumber(options.agentNumber);

    const body = {
      company_id: this.companyId,
      secret_token: this.apiKey,
      type: 1,
      user_id: agentNumber,
      customer_number: custNumber,
      caller_id: options.callerId || this.callerId,
    };

    const res = await safeFetchJson('https://developers.myoperator.co/call/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.status === 'success' || res.data?.code === 200);

    return {
      success: isSuccess,
      channel: 'telephony',
      provider: this.providerName,
      messageId: res.data?.data?.uid || res.data?.uid,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
