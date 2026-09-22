import { EventEmitter } from 'events';
import {
  NotificationRecord, NotificationChannel, NotificationTemplate,
  NotificationRecipient, NotificationsConfig, WebhookRegistration,
  WebhookPayload, DEFAULT_NOTIFICATIONS_CONFIG,
} from './notif-types';

function uuid(): string { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// ─── BoostNotificationsManager ────────────────────────────────────────────────

export class BoostNotificationsManager extends EventEmitter {
  private history  = new Map<string, NotificationRecord>();
  private webhooks = new Map<string, WebhookRegistration>();
  readonly config  : NotificationsConfig;

  constructor(config: Partial<NotificationsConfig> = {}) {
    super();
    this.config = { ...DEFAULT_NOTIFICATIONS_CONFIG, ...config };
  }

  // ── Send Notification ─────────────────────────────────────────────────────

  send(params: {
    channel?: NotificationChannel;
    template: NotificationTemplate | string;
    recipient: NotificationRecipient;
    variables?: Record<string, string>;
  }): NotificationRecord {
    const { channel = this.config.defaultChannel, template, recipient, variables = {} } = params;

    const record: NotificationRecord = {
      id: uuid(), channel, template, recipient, variables,
      status: 'sent', sentAt: new Date(), createdAt: new Date(),
    };
    this.history.set(record.id, record);

    try {
      // In production: call actual adapter (WhatsApp/SMS/Email SDK)
      // Here we emit the event (adapter injection pattern)
      this.emit('notification:sent', { id: record.id, channel, recipientId: recipient.id });
    } catch (err: any) {
      record.status = 'failed';
      record.error  = err?.message ?? 'Unknown error';
      this.emit('notification:failed', { id: record.id, channel, error: record.error });
    }
    return record;
  }

  // ── Schedule Notification ─────────────────────────────────────────────────

  scheduleNotification(params: {
    channel?: NotificationChannel;
    template: NotificationTemplate | string;
    recipient: NotificationRecipient;
    variables?: Record<string, string>;
    scheduledAt: Date;
  }): NotificationRecord {
    const { channel = this.config.defaultChannel, template, recipient, variables = {}, scheduledAt } = params;
    const record: NotificationRecord = {
      id: uuid(), channel, template, recipient, variables,
      status: 'scheduled', scheduledAt, createdAt: new Date(),
    };
    this.history.set(record.id, record);
    this.emit('notification:scheduled', { id: record.id, scheduledAt });
    return record;
  }

  // ── Webhooks ─────────────────────────────────────────────────────────────

  registerWebhook(url: string, events: string[], secret?: string): WebhookRegistration {
    const webhook: WebhookRegistration = { id: uuid(), url, events, secret, isActive: true, createdAt: new Date() };
    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  deactivateWebhook(webhookId: string): void {
    const wh = this.webhooks.get(webhookId);
    if (wh) wh.isActive = false;
  }

  triggerWebhooks(event: string, data: Record<string, unknown>): WebhookPayload[] {
    const triggered: WebhookPayload[] = [];
    for (const webhook of this.webhooks.values()) {
      if (!webhook.isActive) continue;
      if (!webhook.events.includes(event) && !webhook.events.includes('*')) continue;

      const payload: WebhookPayload = { event, data, timestamp: new Date() };
      // In production: HTTP POST to webhook.url with payload + signature
      triggered.push(payload);
      this.emit('webhook:triggered', { webhookId: webhook.id, event, url: webhook.url });
    }
    return triggered;
  }

  // ── History & Queries ─────────────────────────────────────────────────────

  getHistory(recipientId: string): NotificationRecord[] {
    return Array.from(this.history.values()).filter(n => n.recipient.id === recipientId);
  }

  getAllHistory(): NotificationRecord[] { return Array.from(this.history.values()); }
  getWebhooks(): WebhookRegistration[]  { return Array.from(this.webhooks.values()); }

  // ── Sync ─────────────────────────────────────────────────────────────────

  sync(records: NotificationRecord[]): void {
    records.forEach(r => this.history.set(r.id, r));
  }

  export(): NotificationRecord[] { return this.getAllHistory(); }
}
