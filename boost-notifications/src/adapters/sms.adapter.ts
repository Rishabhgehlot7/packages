import { SendMessageOptions, SendMessageResult, SMSConfig } from '../types';

export class SMSAdapter {
  constructor(private readonly config: SMSConfig) {}

  public async send(options: SendMessageOptions): Promise<SendMessageResult> {
    const phone = options.to.phone?.replace(/[^0-9]/g, '').slice(-10);
    if (!phone) {
      return {
        channel: 'sms',
        isSuccess: false,
        provider: this.config.provider,
        error: 'Recipient 10-digit mobile number missing',
      };
    }

    try {
      if (this.config.provider === 'fast2sms') {
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: this.config.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'dlt',
            sender_id: this.config.senderId,
            message: this.config.dltTemplateId,
            variables_values: Object.values(options.variables || {}).join('|'),
            flash: 0,
            numbers: phone,
          }),
        });

        const data = await res.json();
        return {
          channel: 'sms',
          isSuccess: res.ok && data.return === true,
          messageId: data.request_id,
          provider: 'fast2sms',
          rawResponse: data,
        };
      }

      return {
        channel: 'sms',
        isSuccess: true,
        messageId: `sms_${Date.now()}`,
        provider: this.config.provider,
      };
    } catch (err: any) {
      return {
        channel: 'sms',
        isSuccess: false,
        provider: this.config.provider,
        error: err.message,
      };
    }
  }
}
