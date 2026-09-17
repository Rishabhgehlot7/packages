import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { ClickToCallOptions, TelephonyConfig, UniversalResult, VoiceCallOptions } from '../../types';

export class PlivoTelephonyAdapter implements IVoiceAdapter {
  public providerName = 'plivo';
  private authId: string;
  private authToken: string;
  private callerId: string;

  constructor(config: TelephonyConfig) {
    this.authId = config.apiKey;
    this.authToken = config.apiToken || '';
    this.callerId = config.callerId || config.virtualNumber || '+1234567890';
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { cleanDigits } = normalizePhoneNumber(options.to);
    const destination = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const body = {
      from: options.callerId || this.callerId,
      to: destination,
      answer_url: options.audioUrl || 'https://s3.amazonaws.com/static.plivo.com/speak.xml',
      answer_method: 'GET',
    };

    const auth = Buffer.from(`${this.authId}:${this.authToken}`).toString('base64');
    const res = await safeFetchJson(
      `https://api.plivo.com/v1/Account/${this.authId}/Call/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(body),
      }
    );

    const callUuid = res.data?.request_uuid || res.data?.call_uuid;
    const isSuccess = res.ok && !!callUuid;

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: callUuid,
      error: isSuccess ? undefined : res.data?.error || res.rawText,
      raw: res.data,
    };
  }

  public async clickToCall(options: ClickToCallOptions): Promise<UniversalResult> {
    const { cleanDigits: custDigits } = normalizePhoneNumber(options.customerNumber);
    const { cleanDigits: agentDigits } = normalizePhoneNumber(options.agentNumber);

    const body = {
      from: options.callerId || this.callerId,
      to: agentDigits.length === 10 ? `91${agentDigits}` : agentDigits,
      answer_url: `https://api.plivo.com/v1/Account/${this.authId}/Call/?forward_to=${custDigits}`,
      answer_method: 'POST',
    };

    const auth = Buffer.from(`${this.authId}:${this.authToken}`).toString('base64');
    const res = await safeFetchJson(
      `https://api.plivo.com/v1/Account/${this.authId}/Call/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(body),
      }
    );

    const callUuid = res.data?.request_uuid || res.data?.call_uuid;
    const isSuccess = res.ok && !!callUuid;

    return {
      success: isSuccess,
      channel: 'telephony',
      provider: this.providerName,
      messageId: callUuid,
      error: isSuccess ? undefined : res.data?.error || res.rawText,
      raw: res.data,
    };
  }
}
