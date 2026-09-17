import { IEmailAdapter, safeFetchJson } from '../base';
import { UniversalResult, EmailConfig, EmailSendOptions } from '../../types';

export class SMTPEmailAdapter implements IEmailAdapter {
  public providerName = 'smtp';
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  public async send(options: EmailSendOptions): Promise<UniversalResult> {
    const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;

    // Supports webhook / HTTP relay forwarder
    const relayUrl = this.config.smtpHost?.startsWith('http')
      ? this.config.smtpHost
      : 'https://api.brevo.com/v3/smtp/email'; // default fallback relay

    const body = {
      sender: { email: options.from || this.config.from },
      to: (Array.isArray(options.to) ? options.to : [options.to]).map((e) => ({ email: e })),
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
    };

    const res = await safeFetchJson(relayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.config.apiKey,
      },
      body: JSON.stringify(body),
    });

    const isSuccess = res.ok && (!!res.data?.messageId || res.status === 201 || res.status === 200);

    return {
      success: isSuccess,
      channel: 'email',
      provider: this.providerName,
      messageId: res.data?.messageId || 'smtp_sent',
      error: isSuccess ? undefined : res.rawText || 'SMTP Relay delivery failed',
      raw: res.data,
    };
  }
}
