import { IVoiceAdapter, normalizePhoneNumber, safeFetchJson } from '../base';
import { UniversalResult, VoiceCallOptions, VoiceConfig } from '../../types';

export class TwilioVoiceAdapter implements IVoiceAdapter {
  public providerName = 'twilio';
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(config: VoiceConfig) {
    this.accountSid = config.appId || 'AC_DEFAULT';
    this.authToken = config.apiKey;
    this.fromNumber = config.callerId || '+1234567890';
  }

  public async call(options: VoiceCallOptions): Promise<UniversalResult> {
    const { e164 } = normalizePhoneNumber(options.to);

    const message = options.message || 'Hello, this is an automated verification call.';
    const twiml = `<Response><Say language="${options.language || 'en-IN'}">${message}</Say></Response>`;

    const params = new URLSearchParams();
    params.append('To', e164);
    params.append('From', options.callerId || this.fromNumber);
    if (options.audioUrl) {
      params.append('Url', options.audioUrl);
    } else {
      params.append('Twiml', twiml);
    }

    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
    const res = await safeFetchJson(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        body: params.toString(),
      }
    );

    const callSid = res.data?.sid;
    const isSuccess = res.ok && !!callSid;

    return {
      success: isSuccess,
      channel: 'voice',
      provider: this.providerName,
      messageId: callSid,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
