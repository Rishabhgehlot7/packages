import { IEmailAdapter, safeFetchJson } from '../base';
import { UniversalResult, EmailConfig, EmailSendOptions } from '../../types';

export class ResendEmailAdapter implements IEmailAdapter {
  public providerName = 'resend';
  private apiKey: string;
  private defaultFrom: string;

  constructor(config: EmailConfig) {
    this.apiKey = config.apiKey;
    this.defaultFrom = config.fromName ? `${config.fromName} <${config.from}>` : config.from;
  }

  public async send(options: EmailSendOptions): Promise<UniversalResult> {
    const to = Array.isArray(options.to) ? options.to : [options.to];

    const body: any = {
      from: options.from || this.defaultFrom,
      to,
      subject: options.subject,
    };

    if (options.html) body.html = options.html;
    if (options.text) body.text = options.text;
    if (options.replyTo) body.reply_to = options.replyTo;

    const res = await safeFetchJson('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && !!res.data?.id;

    return {
      success: isSuccess,
      channel: 'email',
      provider: this.providerName,
      messageId: res.data?.id,
      error: isSuccess ? undefined : res.data?.message || res.rawText,
      raw: res.data,
    };
  }
}
