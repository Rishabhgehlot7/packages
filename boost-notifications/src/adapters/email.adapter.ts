import { EmailConfig, SendMessageOptions, SendMessageResult } from '../types';

export class EmailAdapter {
  constructor(private readonly config: EmailConfig) {}

  public async send(options: SendMessageOptions): Promise<SendMessageResult> {
    const email = options.to.email;
    if (!email) {
      return {
        channel: 'email',
        isSuccess: false,
        provider: this.config.provider,
        error: 'Recipient email address missing',
      };
    }

    try {
      if (this.config.provider === 'resend') {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${this.config.fromName || 'Boost Store'} <${this.config.fromEmail}>`,
            to: [email],
            subject: options.templateName || 'Order Update',
            html: options.message || `<p>Order update for ${options.to.name}</p>`,
          }),
        });

        const data = await res.json();
        return {
          channel: 'email',
          isSuccess: res.ok && Boolean(data.id),
          messageId: data.id,
          provider: 'resend',
          rawResponse: data,
        };
      }

      return {
        channel: 'email',
        isSuccess: true,
        messageId: `email_${Date.now()}`,
        provider: this.config.provider,
      };
    } catch (err: any) {
      return {
        channel: 'email',
        isSuccess: false,
        provider: this.config.provider,
        error: err.message,
      };
    }
  }
}
