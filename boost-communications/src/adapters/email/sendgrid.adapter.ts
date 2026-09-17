import { IEmailAdapter, safeFetchJson } from '../base';
import { UniversalResult, EmailConfig, EmailSendOptions } from '../../types';

export class SendGridEmailAdapter implements IEmailAdapter {
  public providerName = 'sendgrid';
  private apiKey: string;
  private defaultFrom: string;

  constructor(config: EmailConfig) {
    this.apiKey = config.apiKey;
    this.defaultFrom = config.from;
  }

  public async send(options: EmailSendOptions): Promise<UniversalResult> {
    const toEmails = Array.isArray(options.to) ? options.to : [options.to];

    const body = {
      personalizations: [
        {
          to: toEmails.map((email) => ({ email })),
          subject: options.subject,
        },
      ],
      from: { email: options.from || this.defaultFrom },
      content: [
        {
          type: options.html ? 'text/html' : 'text/plain',
          value: options.html || options.text || '',
        },
      ],
    };

    const res = await safeFetchJson('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.status >= 200 && res.status < 300;

    return {
      success: isSuccess,
      channel: 'email',
      provider: this.providerName,
      messageId: isSuccess ? 'sendgrid_queued' : undefined,
      error: isSuccess ? undefined : res.rawText || 'SendGrid dispatch failed',
      raw: res.data,
    };
  }
}
