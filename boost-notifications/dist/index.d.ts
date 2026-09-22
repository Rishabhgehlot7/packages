import { EventEmitter } from 'events';

type NotificationChannel$1 = 'whatsapp' | 'sms' | 'email' | 'push' | 'webhook';
type NotificationStatus = 'pending' | 'sent' | 'failed' | 'scheduled';
type NotificationTemplate = 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'order_cancelled' | 'payment_received' | 'cart_recovery' | 'otp_verification' | 'return_initiated' | 'return_approved' | 'refund_processed' | 'custom';
interface NotificationRecipient {
    id: string;
    phone?: string;
    email?: string;
    deviceToken?: string;
    name?: string;
}
interface NotificationRecord {
    id: string;
    channel: NotificationChannel$1;
    template: NotificationTemplate | string;
    recipient: NotificationRecipient;
    variables: Record<string, string>;
    status: NotificationStatus;
    scheduledAt?: Date;
    sentAt?: Date;
    error?: string;
    createdAt: Date;
}
interface WebhookRegistration {
    id: string;
    url: string;
    events: string[];
    secret?: string;
    isActive: boolean;
    createdAt: Date;
}
interface WebhookPayload {
    event: string;
    data: Record<string, unknown>;
    timestamp: Date;
    signature?: string;
}
interface NotificationsConfig {
    defaultChannel: NotificationChannel$1;
    throttleMs: number;
}
declare const DEFAULT_NOTIFICATIONS_CONFIG: NotificationsConfig;
interface NotificationsEvents {
    'notification:sent': {
        id: string;
        channel: NotificationChannel$1;
        recipientId: string;
    };
    'notification:failed': {
        id: string;
        channel: NotificationChannel$1;
        error: string;
    };
    'notification:scheduled': {
        id: string;
        scheduledAt: Date;
    };
    'webhook:triggered': {
        webhookId: string;
        event: string;
        url: string;
    };
}

declare class BoostNotificationsManager extends EventEmitter {
    private history;
    private webhooks;
    readonly config: NotificationsConfig;
    constructor(config?: Partial<NotificationsConfig>);
    send(params: {
        channel?: NotificationChannel$1;
        template: NotificationTemplate | string;
        recipient: NotificationRecipient;
        variables?: Record<string, string>;
    }): NotificationRecord;
    scheduleNotification(params: {
        channel?: NotificationChannel$1;
        template: NotificationTemplate | string;
        recipient: NotificationRecipient;
        variables?: Record<string, string>;
        scheduledAt: Date;
    }): NotificationRecord;
    registerWebhook(url: string, events: string[], secret?: string): WebhookRegistration;
    deactivateWebhook(webhookId: string): void;
    triggerWebhooks(event: string, data: Record<string, unknown>): WebhookPayload[];
    getHistory(recipientId: string): NotificationRecord[];
    getAllHistory(): NotificationRecord[];
    getWebhooks(): WebhookRegistration[];
    sync(records: NotificationRecord[]): void;
    export(): NotificationRecord[];
}

declare const notificationsAgentTools: ({
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            channel: {
                type: string;
                enum: string[];
            };
            template: {
                type: string;
            };
            recipient: {
                type: string;
            };
            variables: {
                type: string;
            };
            scheduledAt?: undefined;
            recipientId?: undefined;
            url?: undefined;
            events?: undefined;
            secret?: undefined;
            event?: undefined;
            data?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            channel: {
                type: string;
                enum?: undefined;
            };
            template: {
                type: string;
            };
            recipient: {
                type: string;
            };
            variables: {
                type: string;
            };
            scheduledAt: {
                type: string;
                description: string;
            };
            recipientId?: undefined;
            url?: undefined;
            events?: undefined;
            secret?: undefined;
            event?: undefined;
            data?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            recipientId: {
                type: string;
            };
            channel?: undefined;
            template?: undefined;
            recipient?: undefined;
            variables?: undefined;
            scheduledAt?: undefined;
            url?: undefined;
            events?: undefined;
            secret?: undefined;
            event?: undefined;
            data?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            url: {
                type: string;
            };
            events: {
                type: string;
                items: {
                    type: string;
                };
            };
            secret: {
                type: string;
            };
            channel?: undefined;
            template?: undefined;
            recipient?: undefined;
            variables?: undefined;
            scheduledAt?: undefined;
            recipientId?: undefined;
            event?: undefined;
            data?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            event: {
                type: string;
            };
            data: {
                type: string;
            };
            channel?: undefined;
            template?: undefined;
            recipient?: undefined;
            variables?: undefined;
            scheduledAt?: undefined;
            recipientId?: undefined;
            url?: undefined;
            events?: undefined;
            secret?: undefined;
        };
        required: string[];
    };
})[];
type NotificationsAgentToolName = typeof notificationsAgentTools[number]['name'];

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

export { BoostNotificationsManager, DEFAULT_NOTIFICATIONS_CONFIG, type NotificationChannel$1 as NotificationChannel, NotificationManager, type NotificationRecipient, type NotificationRecord, type NotificationStatus, type NotificationTemplate, type NotificationsAgentToolName, type NotificationsConfig, type NotificationsEvents, type WebhookPayload, type WebhookRegistration, createNotificationManager, notificationsAgentTools };
