// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationChannel = 'whatsapp' | 'sms' | 'email' | 'push' | 'webhook';
export type NotificationStatus  = 'pending' | 'sent' | 'failed' | 'scheduled';

export type NotificationTemplate =
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_received'
  | 'cart_recovery'
  | 'otp_verification'
  | 'return_initiated'
  | 'return_approved'
  | 'refund_processed'
  | 'custom';

export interface NotificationRecipient {
  id: string;
  phone?: string;
  email?: string;
  deviceToken?: string;       // for push notifications
  name?: string;
}

export interface NotificationRecord {
  id: string;
  channel: NotificationChannel;
  template: NotificationTemplate | string;
  recipient: NotificationRecipient;
  variables: Record<string, string>;
  status: NotificationStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  error?: string;
  createdAt: Date;
}

// ─── Webhooks ─────────────────────────────────────────────────────────────────

export interface WebhookRegistration {
  id: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: Date;
  signature?: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface NotificationsConfig {
  defaultChannel: NotificationChannel;
  throttleMs: number;         // min ms between notifications to same recipient (default: 0)
}

export const DEFAULT_NOTIFICATIONS_CONFIG: NotificationsConfig = {
  defaultChannel: 'whatsapp',
  throttleMs: 0,
};

// ─── Events ──────────────────────────────────────────────────────────────────

export interface NotificationsEvents {
  'notification:sent':    { id: string; channel: NotificationChannel; recipientId: string };
  'notification:failed':  { id: string; channel: NotificationChannel; error: string };
  'notification:scheduled': { id: string; scheduledAt: Date };
  'webhook:triggered':    { webhookId: string; event: string; url: string };
}
