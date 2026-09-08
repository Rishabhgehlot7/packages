type NotificationChannel = 'whatsapp' | 'sms' | 'email';
type WhatsAppProvider = 'interakt' | 'wati' | 'gupshup' | 'meta';
type SMSProvider = 'msg91' | 'fast2sms' | 'twilio';
type EmailProvider = 'resend' | 'sendgrid' | 'ses';
interface Recipient {
    name: string;
    phone?: string;
    email?: string;
}
interface SendMessageOptions {
    channel: NotificationChannel;
    to: Recipient;
    templateName?: string;
    variables?: Record<string, string | number>;
    message?: string;
    mediaUrl?: string;
}
interface SendMessageResult {
    channel: NotificationChannel;
    isSuccess: boolean;
    messageId?: string;
    provider: string;
    error?: string;
    rawResponse?: any;
}
interface OrderNotificationPayload {
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
interface WhatsAppConfig {
    provider: WhatsAppProvider;
    apiKey: string;
    apiUrl?: string;
    senderPhoneId?: string;
}
interface SMSConfig {
    provider: SMSProvider;
    apiKey: string;
    senderId?: string;
    dltTemplateId?: string;
}
interface EmailConfig {
    provider: EmailProvider;
    apiKey: string;
    fromEmail: string;
    fromName?: string;
}
interface NotificationManagerOptions {
    whatsapp?: WhatsAppConfig;
    sms?: SMSConfig;
    email?: EmailConfig;
    defaultChannel?: NotificationChannel;
}

declare class NotificationManager {
    private whatsapp?;
    private sms?;
    private email?;
    private defaultChannel;
    constructor(options: NotificationManagerOptions);
    send(options: SendMessageOptions): Promise<SendMessageResult>;
    /**
     * Pre-built eCommerce: Send Order Confirmation on WhatsApp & SMS
     */
    sendOrderConfirmation(payload: OrderNotificationPayload): Promise<SendMessageResult>;
    /**
     * Pre-built eCommerce: Send Shipping & Live Tracking link
     */
    sendShippingUpdate(payload: OrderNotificationPayload): Promise<SendMessageResult>;
    /**
     * Pre-built eCommerce: High-Converting WhatsApp Abandoned Cart Recovery
     */
    sendAbandonedCartRecovery(payload: OrderNotificationPayload): Promise<SendMessageResult>;
    /**
     * Pre-built eCommerce: COD Verification OTP
     */
    sendCODVerificationOTP(payload: OrderNotificationPayload): Promise<SendMessageResult>;
}
declare function createNotificationManager(options: NotificationManagerOptions): NotificationManager;

declare class WhatsAppAdapter {
    private readonly config;
    constructor(config: WhatsAppConfig);
    send(options: SendMessageOptions): Promise<SendMessageResult>;
}

declare class SMSAdapter {
    private readonly config;
    constructor(config: SMSConfig);
    send(options: SendMessageOptions): Promise<SendMessageResult>;
}

declare class EmailAdapter {
    private readonly config;
    constructor(config: EmailConfig);
    send(options: SendMessageOptions): Promise<SendMessageResult>;
}

export { EmailAdapter, type EmailConfig, type EmailProvider, type NotificationChannel, NotificationManager, type NotificationManagerOptions, type OrderNotificationPayload, type Recipient, SMSAdapter, type SMSConfig, type SMSProvider, type SendMessageOptions, type SendMessageResult, WhatsAppAdapter, type WhatsAppConfig, type WhatsAppProvider, createNotificationManager };
