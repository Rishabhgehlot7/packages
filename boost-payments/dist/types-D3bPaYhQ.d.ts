type GatewayName = 'razorpay' | 'cashfree' | 'phonepe' | 'paytm' | 'stripe' | 'cod';
type SupportedGateway = GatewayName;
interface UnifiedCustomer {
    id?: string;
    name: string;
    email: string;
    phone: string;
}
interface UnifiedOrderItem {
    name: string;
    quantity: number;
    price: number;
    sku?: string;
}
interface UnifiedCreateOrderOptions {
    /** Amount in standard human currency units (e.g. 1499.00 for INR, 25.00 for USD). Package handles subunit conversions internally! */
    amount: number;
    /** 3-letter ISO currency code (e.g. 'INR', 'USD', 'EUR') */
    currency: string;
    /** Merchant order or receipt reference ID */
    receipt: string;
    /** Customer details */
    customer: UnifiedCustomer;
    /** Line items */
    items?: UnifiedOrderItem[];
    /** Merchant notes/metadata */
    notes?: Record<string, any>;
    /** Customer return/redirect URL after payment */
    redirectUrl?: string;
    /** Server-to-server webhook callback URL */
    callbackUrl?: string;
    /** Explicitly override gateway for this transaction */
    gateway?: GatewayName;
}
type CreateOrderOptions = UnifiedCreateOrderOptions;
interface UnifiedOrderResult {
    gateway: GatewayName;
    orderId: string;
    gatewayOrderId: string;
    /** Amount in standard currency units (e.g. 1499.00) */
    amount: number;
    currency: string;
    status: 'CREATED' | 'PENDING' | 'PAID' | 'FAILED';
    /** Cashfree payment_session_id for Drop-in UI or SDK */
    paymentSessionId?: string;
    /** Redirect or hosted pay URL (PhonePe, Stripe, Cashfree) */
    redirectUrl?: string;
    /** Paytm checkout txnToken */
    txnToken?: string;
    /** Raw response object from gateway */
    rawResponse: any;
}
type PaymentOrderResult = UnifiedOrderResult;
interface UnifiedPaymentVerificationOptions {
    gateway: GatewayName;
    orderId: string;
    paymentId?: string;
    signature?: string;
    rawPayload?: any;
}
interface UnifiedPaymentVerificationResult {
    gateway: GatewayName;
    isSuccessful: boolean;
    paymentId: string;
    orderId: string;
    /** Amount in standard currency units (e.g. 1499.00) */
    amount: number;
    currency: string;
    paymentMethod?: string;
    rawResponse: any;
}
type VerificationResult = UnifiedPaymentVerificationResult;
interface UnifiedRefundOptions {
    gateway: GatewayName;
    paymentId: string;
    orderId?: string;
    /** Partial or full refund amount in standard currency units */
    amount?: number;
    reason?: string;
}
interface UnifiedRefundResult {
    gateway: GatewayName;
    refundId: string;
    paymentId: string;
    /** Amount in standard currency units */
    amount: number;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    rawResponse: any;
}
type RefundResult = UnifiedRefundResult;
type NormalizedWebhookEvent = 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'REFUND_PROCESSED' | 'REFUND_FAILED' | 'DISPUTE_CREATED' | 'UNKNOWN';
interface WebhookVerificationOptions {
    gateway: GatewayName;
    rawBody: string | Buffer;
    headers: Record<string, string | string[] | undefined>;
    webhookSecret?: string;
}
interface WebhookVerificationResult {
    isValid: boolean;
    /** Standardized event name across all payment gateways */
    normalizedEvent: NormalizedWebhookEvent;
    /** Original raw event name sent by the provider */
    rawEvent?: string;
    gateway: GatewayName;
    orderId?: string;
    paymentId?: string;
    /** Amount in standard currency units (e.g. 1499.00) */
    amount?: number;
    currency?: string;
    data?: any;
    error?: string;
}
type WebhookResult = WebhookVerificationResult;
interface RazorpayConfig {
    keyId: string;
    keySecret: string;
    webhookSecret?: string;
}
interface CashfreeConfig {
    appId: string;
    secretKey: string;
    env?: 'SANDBOX' | 'PRODUCTION';
    apiVersion?: string;
}
interface PhonePeConfig {
    merchantId: string;
    saltKey: string;
    saltIndex?: string;
    env?: 'UAT' | 'PRODUCTION';
}
interface PaytmConfig {
    mid: string;
    merchantKey: string;
    website?: string;
    env?: 'STAGE' | 'PRODUCTION';
}
interface StripeConfig {
    secretKey: string;
    webhookSecret?: string;
}
interface CODConfig {
    minOrderValue?: number;
    maxOrderValue?: number;
    extraFee?: number;
    allowedPincodes?: string[];
}
interface GatewayConfigs {
    razorpay?: RazorpayConfig;
    cashfree?: CashfreeConfig;
    phonepe?: PhonePeConfig;
    paytm?: PaytmConfig;
    stripe?: StripeConfig;
    cod?: CODConfig;
}
interface SmartRoutingConfig {
    /** Map currency to default gateway, e.g. { 'USD': 'stripe', 'INR': 'cashfree' } */
    currencyMap?: Record<string, GatewayName>;
    /** Automatic fallback order if primary gateway fails, e.g. ['razorpay', 'cashfree', 'phonepe'] */
    fallbackChain?: GatewayName[];
}
interface PaymentManagerOptions {
    defaultGateway?: GatewayName;
    gateways: GatewayConfigs;
    smartRouting?: SmartRoutingConfig;
}
interface BoostPaymentOpenOptions {
    order: UnifiedOrderResult;
    onSuccess: (response: {
        gateway: GatewayName;
        orderId: string;
        paymentId?: string;
        signature?: string;
        rawResponse?: any;
    }) => void;
    onFailure?: (error: {
        gateway: GatewayName;
        message: string;
        rawError?: any;
    }) => void;
    onDismiss?: () => void;
    /** Store / brand name displayed in checkout modal */
    name?: string;
    description?: string;
    image?: string;
    themeColor?: string;
    /** Prefill user details if available */
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
}

export type { BoostPaymentOpenOptions as B, CashfreeConfig as C, GatewayName as G, NormalizedWebhookEvent as N, PaymentManagerOptions as P, RazorpayConfig as R, StripeConfig as S, UnifiedCreateOrderOptions as U, VerificationResult as V, WebhookVerificationOptions as W, UnifiedOrderResult as a, UnifiedPaymentVerificationOptions as b, UnifiedPaymentVerificationResult as c, UnifiedRefundOptions as d, UnifiedRefundResult as e, WebhookVerificationResult as f, PhonePeConfig as g, PaytmConfig as h, CODConfig as i, CreateOrderOptions as j, GatewayConfigs as k, PaymentOrderResult as l, RefundResult as m, SmartRoutingConfig as n, SupportedGateway as o, UnifiedCustomer as p, UnifiedOrderItem as q, WebhookResult as r };
