import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { ClickToCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions } from '../../types';

export class OzonetelTelephonyAdapter implements IVoiceAdapter {
  public providerName = 'ozonetel';
  private apiKey: string;
  private userName: string;
  private didNumber?: string;
  private defaultAgentId?: string;

  constructor(config: TelephonyConfig) {
    this.apiKey = config.apiKey;
    this.userName = config.subDomain || 'ozonetel';
    this.didNumber = config.callerId || config.virtualNumber;
    this.defaultAgentId = config.agentId;
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { national } = normalizePhoneNumber(options.to);

    const params = new URLSearchParams({
      api_key: this.apiKey,
      user_name: this.userName,
      phone_number: national,
      did: options.callerId || this.didNumber || '',
      type: 'manual',
    });

    const res = await safeFetchJson(
      `https://api1.cloudagent.ozonetel.com/kookoo/outbound.php?${params.toString()}`,
      { method: 'GET' }
    );

    const isSuccess = res.ok && !res.rawText?.toLowerCase().includes('error');

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.message_id || res.rawText,
      error: isSuccess ? undefined : res.rawText || 'Ozonetel call failed',
      raw: res.data,
    };
  }

  public async clickToCall(options: ClickToCallOptions): Promise<UniversalResult> {
    const { national: custNumber } = normalizePhoneNumber(options.customerNumber);

    const params = new URLSearchParams({
      api_key: this.apiKey,
      user_name: this.userName,
      customer_number: custNumber,
      agent_id: options.agentNumber || this.defaultAgentId || '',
      did: options.callerId || this.didNumber || '',
    });

    const res = await safeFetchJson(
      `https://api1.cloudagent.ozonetel.com/kookoo/outbound.php?${params.toString()}`,
      { method: 'GET' }
    );

    const isSuccess = res.ok && !res.rawText?.toLowerCase().includes('error');

    return {
      success: isSuccess,
      channel: 'telephony',
      provider: this.providerName,
      messageId: res.data?.message_id || res.rawText,
      error: isSuccess ? undefined : res.rawText || 'Ozonetel Click-to-Call failed',
      raw: res.data,
    };
  }
}
