export type NotificationChannel = 'whatsapp' | 'sms' | 'email';
export type WhatsAppProvider = 'interakt' | 'wati' | 'gupshup' | 'meta';
export type SMSProvider = 'msg91' | 'fast2sms' | 'twilio';
export type EmailProvider = 'resend' | 'sendgrid' | 'ses';

export interface Recipient {
  name: string;
  phone?: string;
  email?: string;
}

export interface SendMessageOptions {
  channel: NotificationChannel;
  to: Recipient;
  templateName?: string;
  variables?: Record<string, string | number>;
  message?: string;
  mediaUrl?: string;
}

export interface SendMessageResult {
  channel: NotificationChannel;
  isSuccess: boolean;
  messageId?: string;
  provider: string;
  error?: string;
  rawResponse?: any;
}

export interface OrderNotificationPayload {
  customer: Recipient;
  orderId: string;
  amount: number;
  currency?: string;
  itemsSummary?: string;
  invoiceUrl?: string;
  trackingUrl?: string;
  courierName?: string;
  awbNumber?: string;
  discountCode?: string;
  cartUrl?: string;
  otp?: string;
}

export interface WhatsAppConfig {
  provider: WhatsAppProvider;
  apiKey: string;
  apiUrl?: string;
  senderPhoneId?: string;
}

export interface SMSConfig {
  provider: SMSProvider;
  apiKey: string;
  senderId?: string;
  dltTemplateId?: string;
}

export interface EmailConfig {
  provider: EmailProvider;
  apiKey: string;
  fromEmail: string;
  fromName?: string;
}

export interface NotificationManagerOptions {
  whatsapp?: WhatsAppConfig;
  sms?: SMSConfig;
  email?: EmailConfig;
  defaultChannel?: NotificationChannel;
}
