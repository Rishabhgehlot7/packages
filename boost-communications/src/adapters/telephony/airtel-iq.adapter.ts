import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { ClickToCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions } from '../../types';

export class AirtelIQTelephonyAdapter implements IVoiceAdapter {
  public providerName = 'airtel-iq';
  private apiKey: string;
  private apiToken: string;
  private callerId?: string;

  constructor(config: TelephonyConfig) {
    this.apiKey = config.apiKey;
    this.apiToken = config.apiToken || '';
    this.callerId = config.callerId || config.virtualNumber;
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const body = {
      customerNumber: destination,
      callerId: options.callerId || this.callerId,
      type: 'trans',
    };

    const auth = Buffer.from(`${this.apiKey}:${this.apiToken}`).toString('base64');
    const res = await safeFetchJson('https://iq.airtel.in/voice/v1/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.status === 'SUCCESS' || !!res.data?.callId);

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: res.data?.callId,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }

  public async clickToCall(options: ClickToCallOptions): Promise<UniversalResult> {
    const { cleanDigits: custDigits } = normalizePhoneNumber(options.customerNumber);
    const { cleanDigits: agentDigits } = normalizePhoneNumber(options.agentNumber);

    const body = {
      customerNumber: custDigits.length === 10 ? `91${custDigits}` : custDigits,
      agentNumber: agentDigits.length === 10 ? `91${agentDigits}` : agentDigits,
      callerId: options.callerId || this.callerId,
    };

    const auth = Buffer.from(`${this.apiKey}:${this.apiToken}`).toString('base64');
    const res = await safeFetchJson('https://iq.airtel.in/voice/v1/click-to-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (res.data?.status === 'SUCCESS' || !!res.data?.callId);

    return {
      success: isSuccess,
      channel: 'telephony',
      provider: this.providerName,
      messageId: res.data?.callId,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
