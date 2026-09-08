import { G as GatewayName, U as UnifiedCreateOrderOptions, a as UnifiedOrderResult, b as UnifiedPaymentVerificationOptions, c as UnifiedPaymentVerificationResult, d as UnifiedRefundOptions, e as UnifiedRefundResult, W as WebhookVerificationOptions, f as WebhookVerificationResult, P as PaymentManagerOptions, R as RazorpayConfig, C as CashfreeConfig, g as PhonePeConfig, h as PaytmConfig, S as StripeConfig, i as CODConfig } from './types-D3bPaYhQ.mjs';
export { B as BoostPaymentOpenOptions, j as CreateOrderOptions, k as GatewayConfigs, N as NormalizedWebhookEvent, l as PaymentOrderResult, m as RefundResult, n as SmartRoutingConfig, o as SupportedGateway, p as UnifiedCustomer, q as UnifiedOrderItem, V as VerificationResult, r as WebhookResult } from './types-D3bPaYhQ.mjs';

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
     * Helper to perform HTTP JSON requests with standard error extraction.
     */
    protected fetchJson<T = any>(url: string, options?: {
        method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
        headers?: Record<string, string>;
        body?: any;
    }): Promise<T>;
}

declare class PaymentManager {
    private readonly adapters;
    private readonly defaultGateway?;
    private readonly smartRouting?;
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
     * Create an order using the chosen or automatically resolved gateway.
     */
    createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;
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
     * Directly consumes the standard web Request object with raw stream body handling:
     *
     * ```typescript
     * export async function POST(req: Request) {
     *   const result = await payments.verifyNextJsWebhook(req, { gateway: 'razorpay' });
     *   if (!result.isValid) return new Response('Invalid Signature', { status: 400 });
     *   console.log('Event:', result.normalizedEvent, result.orderId);
     *   return new Response('OK');
     * }
     * ```
     */
    verifyNextJsWebhook(request: Request | any, options: {
        gateway: GatewayName;
        webhookSecret?: string;
    }): Promise<WebhookVerificationResult>;
}
/**
 * Factory function to instantiate a PaymentManager.
 */
declare function createPaymentManager(options: PaymentManagerOptions): PaymentManager;

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

export { BasePaymentAdapter, CODAdapter, CODConfig, CashfreeAdapter, CashfreeConfig, GatewayName, GatewayNotConfiguredError, PaymentError, PaymentManager, PaymentManagerOptions, PaytmAdapter, PaytmConfig, PhonePeAdapter, PhonePeConfig, RazorpayAdapter, RazorpayConfig, SignatureVerificationError, StripeAdapter, StripeConfig, UnifiedCreateOrderOptions, UnifiedOrderResult, UnifiedPaymentVerificationOptions, UnifiedPaymentVerificationResult, UnifiedRefundOptions, UnifiedRefundResult, WebhookVerificationOptions, WebhookVerificationResult, base64Decode, base64Encode, createPaymentManager, hmacSha256, safeCompare, sha256 };
