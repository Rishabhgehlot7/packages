import { G as GatewayName, U as UnifiedCreateOrderOptions, a as UnifiedOrderResult, b as UnifiedPaymentVerificationOptions, c as UnifiedPaymentVerificationResult, d as UnifiedRefundOptions, e as UnifiedRefundResult, W as WebhookVerificationOptions, f as WebhookVerificationResult, P as PaymentManagerOptions, B as BoostCartLike, C as CartOrderOptions, D as DigitalProductCheckoutOptions, S as SubscriptionPlanOptions, g as SubscriptionResult, h as DonationCheckoutOptions, i as UPIIntentOptions, j as UPIIntentResult, N as NormalizedWebhookEvent, R as RazorpayConfig, k as CashfreeConfig, l as PhonePeConfig, m as PaytmConfig, n as StripeConfig, o as CODConfig } from './client-CSvi_y91.js';
export { p as BillingInterval, q as BoostPaymentOpenOptions, r as CreateOrderOptions, s as GatewayConfigs, t as PaymentMode, u as PaymentOrderResult, v as RefundResult, w as SmartRoutingConfig, x as SupportedGateway, y as UnifiedCustomer, z as UnifiedOrderItem, V as VerificationResult, A as WebhookResult, E as createPaymentCheckout, F as loadCashfree, H as loadRazorpay, I as loadScript } from './client-CSvi_y91.js';

declare abstract class BasePaymentAdapter {
    abstract readonly name: GatewayName;
    /**
     * Create an order or payment session on the gateway.
     */
    abstract createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    /**
     * Verify checkout completion signature or status query.
     */
    abstract verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    /**
     * Initiate a refund back to the customer.
     */
    abstract refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    /**
     * Verify server-to-server webhook authenticity and parse payload.
     */
    abstract verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
    /**
     * Safe helper to extract single string header value from request headers.
     */
    protected getHeader(headers: Record<string, string | string[] | undefined>, name: string): string | undefined;
    /**
     * Helper to perform HTTP JSON requests with standard error extraction, timeouts, and idempotency.
     */
    protected fetchJson<T = any>(url: string, options?: {
        method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
        headers?: Record<string, string>;
        body?: any;
        timeoutMs?: number;
        idempotencyKey?: string;
        retries?: number;
    }): Promise<T>;
}

declare class PaymentManager {
    private readonly adapters;
    private readonly defaultGateway?;
    private readonly smartRouting?;
    private readonly merchantUpiVpa?;
    private readonly merchantName?;
    private readonly idempotencyStore;
    constructor(options: PaymentManagerOptions);
    /**
     * Returns an active adapter instance by gateway name.
     */
    getAdapter(gateway: GatewayName): BasePaymentAdapter;
    /**
     * Lists all currently registered gateway names.
     */
    listConfiguredGateways(): GatewayName[];
    /**
     * Resolves the optimal gateway based on currency rules, explicit override, or default.
     */
    resolveGateway(options: {
        gateway?: GatewayName;
        currency?: string;
    }): GatewayName;
    /**
     * Universal Order Creator with Idempotency Protection & UPI Intent generation
     */
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    /**
     * 1-Line Seamless Integration with @boostengine/cart
     * Automatically extracts subtotal, items, discounts, and final amount from cart instance!
     */
    createOrderFromCart(cart: BoostCartLike, options: CartOrderOptions): Promise<UnifiedOrderResult>;
    /**
     * Digital Products & Instant Downloads Checkout
     * Automatically attaches license key and delivery payload for instant fulfillment.
     */
    createDigitalProductCheckout(options: DigitalProductCheckoutOptions): Promise<UnifiedOrderResult>;
    /**
     * Recurring SaaS & Membership Subscriptions
     */
    createSubscription(options: SubscriptionPlanOptions): Promise<SubscriptionResult>;
    /**
     * Donations, Tips & Pay-What-You-Want Checkout
     */
    createDonationCheckout(options: DonationCheckoutOptions): Promise<UnifiedOrderResult>;
    /**
     * Generates custom UPI Intent Deep-Links
     */
    createUPIIntent(options: UPIIntentOptions): UPIIntentResult;
    /**
     * Smart Fallback: Attempts creation on primary gateway. If it throws an error or fails,
     * it automatically routes through fallback gateways in sequence!
     */
    createOrderWithFallback(options: UnifiedCreateOrderOptions & {
        fallbackChain?: GatewayName[];
    }): Promise<UnifiedOrderResult>;
    /**
     * Verifies payment completion signature or status query.
     */
    verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    /**
     * Initiates a customer refund.
     */
    refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    /**
     * Verifies incoming webhook authenticity and decodes payload.
     */
    verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
    /**
     * Ready-made Next.js 13/14/15 App Router Route Handler Webhook Authenticator.
     */
    verifyNextJsWebhook(request: Request | any, options: {
        gateway: GatewayName;
        webhookSecret?: string;
    }): Promise<WebhookVerificationResult>;
    /**
     * Ready-made Express.js & Fastify Webhook Authenticator.
     * Works with standard req, (req.rawBody or JSON.stringify(req.body)).
     */
    verifyExpressWebhook(req: any, options: {
        gateway: GatewayName;
        webhookSecret?: string;
    }): Promise<WebhookVerificationResult>;
}
/**
 * Factory function to instantiate a PaymentManager.
 */
declare function createPaymentManager(options: PaymentManagerOptions): PaymentManager;

/**
 * Universal Indian UPI Intent & Mobile App Deep-Link Generator
 * Generates direct one-click payment URLs for Google Pay, PhonePe, Paytm, CRED, and BHIM.
 */
declare class UPIIntentGenerator {
    /**
     * Generates standard UPI URI and app-specific deep links
     */
    static generate(options: UPIIntentOptions): UPIIntentResult;
    /**
     * Generates a plain text ASCII QR code pattern for terminal debugging
     */
    static generateDebugQrString(upiUri: string): string;
}

/**
 * In-Memory Idempotency Cache with auto-expiring TTL
 * Guarantees zero duplicate transactions and protects against customer double-clicks
 */
declare class IdempotencyStore {
    private cache;
    private defaultTtlMs;
    constructor(defaultTtlMs?: number);
    get<T>(key: string): T | null;
    set(key: string, result: any, ttlMs?: number): void;
    clear(): void;
}

/**
 * AI Agent Introspection & Diagnostics Toolkit for @boostengine/payments
 * Enables autonomous coding agents to inspect gateway configurations,
 * validate order payloads, and simulate offline webhooks for unit testing.
 */
declare class PaymentAgentToolkit {
    /**
     * Generates a concise, LLM-friendly markdown status report of the PaymentManager
     */
    static inspect(manager: PaymentManager): string;
    /**
     * Validates an order creation payload with actionable hints for AI agents
     */
    static validateOrder(options: UnifiedCreateOrderOptions): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Generates simulated webhook payloads with valid cryptographic signatures
     * Ideal for local testing and CI/CD pipelines without hitting live gateway servers!
     */
    static simulateWebhook(options: {
        gateway: GatewayName;
        event: NormalizedWebhookEvent;
        orderId: string;
        paymentId?: string;
        amount: number;
        currency?: string;
        webhookSecret?: string;
    }): {
        rawBody: string;
        headers: Record<string, string>;
    };
}

/**
 * Computes HMAC-SHA256 hex digest.
 */
declare function hmacSha256(data: string | Buffer, secret: string): string;
/**
 * Computes standard SHA-256 hex digest.
 */
declare function sha256(data: string | Buffer): string;
/**
 * Encodes string into Base64.
 */
declare function base64Encode(data: string | object): string;
/**
 * Decodes Base64 into utf-8 string.
 */
declare function base64Decode(encoded: string): string;
/**
 * Constant-time safe string comparison to prevent timing attacks on signatures.
 */
declare function safeCompare(a: string, b: string): boolean;

declare class PaymentError extends Error {
    readonly gateway?: GatewayName;
    readonly statusCode?: number;
    readonly rawError?: any;
    constructor(message: string, options?: {
        gateway?: GatewayName;
        statusCode?: number;
        rawError?: any;
    });
}
declare class GatewayNotConfiguredError extends PaymentError {
    constructor(gateway: GatewayName);
}
declare class SignatureVerificationError extends PaymentError {
    constructor(gateway: GatewayName, details?: string);
}

declare class RazorpayAdapter extends BasePaymentAdapter {
    private readonly config;
    readonly name: GatewayName;
    private readonly baseUrl;
    constructor(config: RazorpayConfig);
    private getAuthHeader;
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
}

declare class CashfreeAdapter extends BasePaymentAdapter {
    private readonly config;
    readonly name: GatewayName;
    private readonly baseUrl;
    private readonly apiVersion;
    constructor(config: CashfreeConfig);
    private getHeaders;
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
}

declare class PhonePeAdapter extends BasePaymentAdapter {
    private readonly config;
    readonly name: GatewayName;
    private readonly baseUrl;
    private readonly saltIndex;
    constructor(config: PhonePeConfig);
    private calculateXVerify;
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
}

declare class PaytmAdapter extends BasePaymentAdapter {
    private readonly config;
    readonly name: GatewayName;
    private readonly baseUrl;
    constructor(config: PaytmConfig);
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
}

declare class StripeAdapter extends BasePaymentAdapter {
    private readonly config;
    readonly name: GatewayName;
    private readonly baseUrl;
    constructor(config: StripeConfig);
    private getAuthHeader;
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
}

declare class CODAdapter extends BasePaymentAdapter {
    private readonly config;
    readonly name: GatewayName;
    constructor(config?: CODConfig);
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
    verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>;
    refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;
    verifyWebhook(_options: WebhookVerificationOptions): Promise<WebhookVerificationResult>;
}

export { BasePaymentAdapter, BoostCartLike, CODAdapter, CODConfig, CartOrderOptions, CashfreeAdapter, CashfreeConfig, DigitalProductCheckoutOptions, DonationCheckoutOptions, GatewayName, GatewayNotConfiguredError, IdempotencyStore, NormalizedWebhookEvent, PaymentAgentToolkit, PaymentError, PaymentManager, PaymentManagerOptions, PaytmAdapter, PaytmConfig, PhonePeAdapter, PhonePeConfig, RazorpayAdapter, RazorpayConfig, SignatureVerificationError, StripeAdapter, StripeConfig, SubscriptionPlanOptions, SubscriptionResult, UPIIntentGenerator, UPIIntentOptions, UPIIntentResult, UnifiedCreateOrderOptions, UnifiedOrderResult, UnifiedPaymentVerificationOptions, UnifiedPaymentVerificationResult, UnifiedRefundOptions, UnifiedRefundResult, WebhookVerificationOptions, WebhookVerificationResult, base64Decode, base64Encode, createPaymentManager, hmacSha256, safeCompare, sha256 };
