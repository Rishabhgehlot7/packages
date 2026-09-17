import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { AIAgentCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions } from '../../types';

export class BolnaAIVoiceAdapter implements IVoiceAdapter {
  public providerName = 'bolna';
  private apiKey: string;
  private defaultAgentId?: string;
  private baseUrl: string;

  constructor(config: TelephonyConfig) {
    this.apiKey = config.apiKey;
    this.defaultAgentId = config.agentId;
    this.baseUrl = config.apiUrl || 'https://api.bolna.dev';
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { e164 } = normalizePhoneNumber(options.to);

    const body = {
      agent_id: this.defaultAgentId || 'default_ecommerce_agent',
      recipient_phone_number: e164,
      user_data: {
        message: options.message || '',
        language: options.language || 'hi-IN',
      },
    };

    const res = await safeFetchJson(`${this.baseUrl}/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const executionId = res.data?.execution_id || res.data?.call_id || res.data?.id;
    const isSuccess = res.ok && !!executionId;

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: executionId,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }

  public async triggerAIAgentCall(options: AIAgentCallOptions): Promise<UniversalResult> {
    const { e164 } = normalizePhoneNumber(options.to);

    const body = {
      agent_id: options.agentId || this.defaultAgentId || 'default_agent',
      recipient_phone_number: e164,
      user_data: options.context || {},
    };

    const res = await safeFetchJson(`${this.baseUrl}/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const executionId = res.data?.execution_id || res.data?.id;
    const isSuccess = res.ok && !!executionId;

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: executionId,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
