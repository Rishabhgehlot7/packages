export type ChannelType = 'whatsapp' | 'sms' | 'voice' | 'telephony' | 'rcs' | 'email';

export type WhatsAppProvider =
  | 'interakt'
  | 'gupshup'
  | 'meta'
  | 'wati'
  | 'twilio'
  | 'aisensy'
  | '360dialog'
  | 'routemobile'
  | 'infobip'
  | 'vonage';

export type SMSProvider =
  | 'msg91'
  | 'fast2sms'
  | '2factor'
  | 'twilio'
  | 'exotel'
  | 'routemobile'
  | 'infobip'
  | 'vonage';

export type VoiceProvider =
  | 'exotel'
  | 'mcube'
  | 'myoperator'
  | 'ozonetel'
  | 'knowlarity'
  | 'smartflo'
  | 'airtel-iq'
  | 'servetel'
  | 'plivo'
  | 'msg91'
  | 'twilio'
  | 'gupshup'
  | 'infobip'
  | '2factor'
  | 'bolna';

export type TelephonyProvider =
  | 'mcube'
  | 'exotel'
  | 'myoperator'
  | 'ozonetel'
  | 'knowlarity'
  | 'smartflo'
  | 'airtel-iq'
  | 'servetel'
  | 'plivo'
  | 'bolna';

export type RCSProvider = 'gupshup' | 'routemobile' | 'infobip' | 'interakt';
export * from './interakt';

export type EmailProvider = 'resend' | 'sendgrid' | 'smtp' | 'ses';

export interface Recipient {
  name?: string;
  phone?: string;
  email?: string;
}

export interface UniversalResult {
  success: boolean;
  channel: ChannelType;
  provider: string;
  messageId?: string;
  error?: string;
  raw?: any;
}

// ----------------- Webhooks & Events -----------------
export type DeliveryStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'queued';

export interface InboundWebhookEvent {
  channel: ChannelType;
  provider: string;
  type: 'delivery_receipt' | 'incoming_message' | 'call_status' | 'dtmf_input';
  messageId?: string;
  status?: DeliveryStatus;
  from?: string;
  to?: string;
  content?: string;
  timestamp: string;
  raw?: any;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs?: number;
}

// ----------------- WhatsApp -----------------
export interface WhatsAppConfig {
  provider: WhatsAppProvider;
  apiKey: string;
  apiSecret?: string;
  appId?: string;
  senderPhoneId?: string;
  apiUrl?: string;
  senderNumber?: string;
}

export interface WhatsAppSendOptions {
  to: string;
  templateName?: string;
  language?: string;
  variables?: Record<string, string | number>;
  message?: string;
  mediaUrl?: string;
  headerType?: 'text' | 'image' | 'video' | 'document';
  buttons?: Array<{ type: 'url' | 'quick_reply'; text: string; value?: string }>;
}

// ----------------- SMS -----------------
export interface SMSConfig {
  provider: SMSProvider;
  apiKey: string;
  apiSecret?: string;
  senderId?: string;
  dltEntityId?: string;
  dltTemplateId?: string;
  route?: string;
}

export interface SMSSendOptions {
  to: string;
  message: string;
  dltTemplateId?: string;
  senderId?: string;
  unicode?: boolean;
}

// ----------------- Voice -----------------
export interface VoiceConfig {
  provider: VoiceProvider;
  apiKey: string;
  apiToken?: string;
  subDomain?: string;
  callerId?: string;
  virtualNumber?: string;
  appId?: string;
  apiUrl?: string;
}

export interface VoiceCallOptions {
  to: string;
  message?: string;
  audioUrl?: string;
  callerId?: string;
  language?: 'en-IN' | 'hi-IN' | 'en-US';
  digitsToCollect?: number;
}

// ----------------- Cloud Telephony / MCUBE / IVR -----------------
export interface TelephonyConfig {
  provider: TelephonyProvider;
  apiKey: string;
  apiToken?: string;
  callerId?: string;
  virtualNumber?: string;
  subDomain?: string;
  agentId?: string;
  apiUrl?: string;
}

export interface ClickToCallOptions {
  agentNumber: string;
  customerNumber: string;
  callerId?: string;
  refId?: string;
  customData?: Record<string, any>;
}

export interface AIAgentCallOptions {
  to: string;
  agentId?: string;
  prompt?: string;
  context?: Record<string, any>;
  language?: string;
}

// ----------------- RCS -----------------
export interface RCSConfig {
  provider: RCSProvider;
  apiKey: string;
  botId?: string;
  appId?: string;
}

export interface RCSSendOptions {
  to: string;
  title: string;
  description: string;
  mediaUrl?: string;
  suggestions?: Array<{
    type: 'reply' | 'url' | 'dial';
    title: string;
    postbackData?: string;
    url?: string;
    phoneNumber?: string;
  }>;
}

// ----------------- Email -----------------
export interface EmailConfig {
  provider: EmailProvider;
  apiKey: string;
  from: string;
  fromName?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}

export interface EmailSendOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

// ----------------- Smart OTP -----------------
export interface SmartOTPOptions {
  phone: string;
  customerName?: string;
  otp?: string;
  length?: number;
  validityMinutes?: number;
  messageTemplate?: string;
  fallbackSequence?: Array<'whatsapp' | 'sms' | 'voice'>;
  fallbackDelayMs?: number;
}

export interface SmartOTPResult extends UniversalResult {
  otp: string;
  token: string;
  deliveredVia: 'whatsapp' | 'sms' | 'voice';
  attempts: Array<{ channel: 'whatsapp' | 'sms' | 'voice'; success: boolean; error?: string }>;
}

export interface VerifyOTPOptions {
  phone: string;
  otp: string;
  token: string;
}

export interface VerifyOTPResult {
  valid: boolean;
  phone: string;
  error?: string;
}

// ----------------- Omnichannel Config -----------------
export interface OmnichannelProvidersConfig {
  whatsapp?: WhatsAppConfig;
  sms?: SMSConfig;
  voice?: VoiceConfig;
  telephony?: TelephonyConfig;
  rcs?: RCSConfig;
  email?: EmailConfig;
}

export interface OmnichannelConfig {
  providers?: OmnichannelProvidersConfig;
  defaultChannel?: ChannelType;
  otpSecret?: string;
  debug?: boolean;
  retry?: RetryConfig;
}
