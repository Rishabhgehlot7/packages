import {
  GatewayName,
  PaymentManagerOptions,
  UnifiedCreateOrderOptions,
  UnifiedOrderResult,
  UnifiedPaymentVerificationOptions,
  UnifiedPaymentVerificationResult,
  UnifiedRefundOptions,
  UnifiedRefundResult,
  WebhookVerificationOptions,
  WebhookVerificationResult,
  SubscriptionPlanOptions,
  SubscriptionResult,
  DigitalProductCheckoutOptions,
  DonationCheckoutOptions,
  BoostCartLike,
  CartOrderOptions,
  UPIIntentOptions,
  UPIIntentResult,
} from './types';
import { BasePaymentAdapter } from './adapters/base.adapter';
import { RazorpayAdapter } from './adapters/razorpay.adapter';
import { CashfreeAdapter } from './adapters/cashfree.adapter';
import { PhonePeAdapter } from './adapters/phonepe.adapter';
import { PaytmAdapter } from './adapters/paytm.adapter';
import { StripeAdapter } from './adapters/stripe.adapter';
import { CODAdapter } from './adapters/cod.adapter';
import { GatewayNotConfiguredError, PaymentError } from './utils/errors';
import { IdempotencyStore } from './idempotency';
import { UPIIntentGenerator } from './upi';

export class PaymentManager {
  private readonly adapters: Map<GatewayName, BasePaymentAdapter> = new Map();
  private readonly defaultGateway?: GatewayName;
  private readonly smartRouting?: PaymentManagerOptions['smartRouting'];
  private readonly merchantUpiVpa?: string;
  private readonly merchantName?: string;
  private readonly idempotencyStore = new IdempotencyStore();

  constructor(options: PaymentManagerOptions) {
    this.defaultGateway = options.defaultGateway;
    this.smartRouting = options.smartRouting;
    this.merchantUpiVpa = options.merchantUpiVpa;
    this.merchantName = options.merchantName;

    // Initialize configured gateways
    const { gateways } = options;
    if (gateways.razorpay) {
      this.adapters.set('razorpay', new RazorpayAdapter(gateways.razorpay));
    }
    if (gateways.cashfree) {
      this.adapters.set('cashfree', new CashfreeAdapter(gateways.cashfree));
    }
    if (gateways.phonepe) {
      this.adapters.set('phonepe', new PhonePeAdapter(gateways.phonepe));
    }
    if (gateways.paytm) {
      this.adapters.set('paytm', new PaytmAdapter(gateways.paytm));
    }
    if (gateways.stripe) {
      this.adapters.set('stripe', new StripeAdapter(gateways.stripe));
    }
    if (gateways.cod) {
      this.adapters.set('cod', new CODAdapter(gateways.cod));
    }

    if (this.adapters.size === 0) {
      console.warn('⚠️ [PaymentManager] No payment gateways were configured in PaymentManager.');
    }
  }

  /**
   * Returns an active adapter instance by gateway name.
   */
  public getAdapter(gateway: GatewayName): BasePaymentAdapter {
    const adapter = this.adapters.get(gateway);
    if (!adapter) {
      throw new GatewayNotConfiguredError(gateway);
    }
    return adapter;
  }

  /**
   * Lists all currently registered gateway names.
   */
  public listConfiguredGateways(): GatewayName[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Resolves the optimal gateway based on currency rules, explicit override, or default.
   */
  public resolveGateway(options: { gateway?: GatewayName; currency?: string }): GatewayName {
    if (options.gateway) {
      return options.gateway;
    }

    if (options.currency && this.smartRouting?.currencyMap) {
      const mapped = this.smartRouting.currencyMap[options.currency.toUpperCase()];
      if (mapped && this.adapters.has(mapped)) {
        return mapped;
      }
    }

    if (this.defaultGateway && this.adapters.has(this.defaultGateway)) {
      return this.defaultGateway;
    }

    const firstAvailable = this.adapters.keys().next().value;
    if (firstAvailable) {
      return firstAvailable;
    }

    throw new PaymentError('No payment gateways configured to process order.');
  }

  /**
   * Universal Order Creator with Idempotency Protection & UPI Intent generation
   */
  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    // 1. Idempotency Check (Prevent duplicate charges on network retry)
    if (options.idempotencyKey) {
      const cached = this.idempotencyStore.get<UnifiedOrderResult>(options.idempotencyKey);
      if (cached) {
        return cached;
      }
    }

    const targetGateway = this.resolveGateway({
      gateway: options.gateway,
      currency: options.currency,
    });
    const adapter = this.getAdapter(targetGateway);
    const result = await adapter.createOrder(options);

    // Set mode
    result.mode = options.mode || 'one_time';

    // 2. Attach Indian UPI Intent if merchant UPI VPA is configured
    if (this.merchantUpiVpa && (!options.currency || options.currency.toUpperCase() === 'INR')) {
      result.upiIntent = UPIIntentGenerator.generate({
        pa: this.merchantUpiVpa,
        pn: this.merchantName || 'Merchant Checkout',
        am: result.amount,
        tr: result.orderId,
        tn: `Payment for #${result.orderId}`,
      });
    }

    // Cache in idempotency store
    if (options.idempotencyKey) {
      this.idempotencyStore.set(options.idempotencyKey, result);
    }

    return result;
  }

  /**
   * 1-Line Seamless Integration with @boostengine/cart
   * Automatically extracts subtotal, items, discounts, and final amount from cart instance!
   */
  public async createOrderFromCart(
    cart: BoostCartLike,
    options: CartOrderOptions
  ): Promise<UnifiedOrderResult> {
    const summary = cart.getSummary();

    if (summary.finalTotal <= 0) {
      throw new PaymentError('Cart payable amount must be greater than 0 to initiate payment.');
    }

    const orderOptions: UnifiedCreateOrderOptions = {
      amount: summary.finalTotal,
      currency: options.currency || 'INR',
      receipt: options.receipt || `rcpt_${Date.now()}`,
      customer: options.customer,
      items: summary.items.map((i) => ({
        name: i.title,
        quantity: i.quantity,
        price: i.price,
        sku: i.sku,
      })),
      notes: {
        ...options.notes,
        cartSubtotal: summary.subtotal,
        discountApplied: summary.discount?.code || 'NONE',
      },
      gateway: options.gateway,
      redirectUrl: options.redirectUrl,
      callbackUrl: options.callbackUrl,
      idempotencyKey: options.idempotencyKey,
      mode: 'one_time',
    };

    return this.createOrder(orderOptions);
  }

  /**
   * Digital Products & Instant Downloads Checkout
   * Automatically attaches license key and delivery payload for instant fulfillment.
   */
  public async createDigitalProductCheckout(
    options: DigitalProductCheckoutOptions
  ): Promise<UnifiedOrderResult> {
    const order = await this.createOrder({
      amount: options.amount,
      currency: options.currency,
      receipt: `digital_${options.productId}_${Date.now()}`,
      customer: options.customer,
      items: [
        {
          name: options.title,
          quantity: 1,
          price: options.amount,
          sku: options.productId,
        },
      ],
      notes: {
        ...options.notes,
        productId: options.productId,
        productType: 'digital_download',
      },
      gateway: options.gateway,
      redirectUrl: options.redirectUrl,
      idempotencyKey: options.idempotencyKey,
      mode: 'digital_download',
    });

    order.digitalAccess = {
      licenseKey: options.licenseKey,
      downloadUrl: options.downloadUrl,
    };

    return order;
  }

  /**
   * Recurring SaaS & Membership Subscriptions
   */
  public async createSubscription(options: SubscriptionPlanOptions): Promise<SubscriptionResult> {
    const targetGateway = options.gateway || (options.currency.toUpperCase() === 'INR' ? 'razorpay' : 'stripe');
    const adapter = this.getAdapter(targetGateway);

    // If adapter has native subscription support or createOrder
    const order = await adapter.createOrder({
      amount: options.amount,
      currency: options.currency,
      receipt: `sub_${options.planName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      customer: options.customer,
      notes: {
        ...options.notes,
        planName: options.planName,
        interval: options.interval,
        isSubscription: true,
      },
      redirectUrl: options.redirectUrl,
      mode: 'subscription',
    });

    return {
      subscriptionId: order.orderId,
      gateway: targetGateway,
      status: 'PENDING',
      planName: options.planName,
      amount: options.amount,
      currency: options.currency,
      interval: options.interval,
      shortUrl: order.redirectUrl,
      customer: options.customer,
      rawResponse: order.rawResponse,
    };
  }

  /**
   * Donations, Tips & Pay-What-You-Want Checkout
   */
  public async createDonationCheckout(
    options: DonationCheckoutOptions
  ): Promise<UnifiedOrderResult> {
    return this.createOrder({
      amount: options.amount,
      currency: options.currency,
      receipt: `don_${Date.now()}`,
      customer: options.customer,
      items: [
        {
          name: `Donation: ${options.cause}`,
          quantity: 1,
          price: options.amount,
        },
      ],
      notes: {
        ...options.notes,
        cause: options.cause,
        isDonation: true,
      },
      gateway: options.gateway,
      redirectUrl: options.redirectUrl,
      idempotencyKey: options.idempotencyKey,
      mode: 'donation',
    });
  }

  /**
   * Generates custom UPI Intent Deep-Links
   */
  public createUPIIntent(options: UPIIntentOptions): UPIIntentResult {
    return UPIIntentGenerator.generate(options);
  }

  /**
   * Smart Fallback: Attempts creation on primary gateway. If it throws an error or fails,
   * it automatically routes through fallback gateways in sequence!
   */
  public async createOrderWithFallback(
    options: UnifiedCreateOrderOptions & { fallbackChain?: GatewayName[] }
  ): Promise<UnifiedOrderResult> {
    const chain =
      options.fallbackChain ||
      this.smartRouting?.fallbackChain ||
      this.listConfiguredGateways();

    if (chain.length === 0) {
      throw new PaymentError('Fallback chain is empty. Configure at least one gateway.');
    }

    let lastError: any;
    for (const gw of chain) {
      if (!this.adapters.has(gw)) continue;
      try {
        const adapter = this.getAdapter(gw);
        const result = await adapter.createOrder({ ...options, gateway: gw });
        return result;
      } catch (err: any) {
        lastError = err;
        console.warn(`[PaymentManager Fallback] Gateway '${gw}' failed (${err.message}). Trying next gateway in chain...`);
      }
    }

    throw new PaymentError(
      `All gateways in fallback chain [${chain.join(', ')}] failed. Last error: ${lastError?.message || 'Unknown'}`,
      { rawError: lastError }
    );
  }

  /**
   * Verifies payment completion signature or status query.
   */
  public async verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult> {
    const adapter = this.getAdapter(options.gateway);
    return adapter.verifyPayment(options);
  }

  /**
   * Initiates a customer refund.
   */
  public async refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult> {
    const adapter = this.getAdapter(options.gateway);
    return adapter.refund(options);
  }

  /**
   * Verifies incoming webhook authenticity and decodes payload.
   */
  public async verifyWebhook(
    options: WebhookVerificationOptions
  ): Promise<WebhookVerificationResult> {
    const adapter = this.getAdapter(options.gateway);
    return adapter.verifyWebhook(options);
  }

  /**
   * Ready-made Next.js 13/14/15 App Router Route Handler Webhook Authenticator.
   */
  public async verifyNextJsWebhook(
    request: Request | any,
    options: { gateway: GatewayName; webhookSecret?: string }
  ): Promise<WebhookVerificationResult> {
    try {
      let rawBody = '';
      if (typeof request.text === 'function') {
        rawBody = await request.text();
      } else if (typeof request.body === 'string') {
        rawBody = request.body;
      } else if (Buffer.isBuffer(request.body)) {
        rawBody = request.body.toString('utf8');
      }

      const headers: Record<string, string> = {};
      if (request.headers) {
        if (typeof request.headers.forEach === 'function') {
          request.headers.forEach((val: string, key: string) => {
            headers[key.toLowerCase()] = val;
          });
        } else if (typeof request.headers.entries === 'function') {
          for (const [key, val] of request.headers.entries()) {
            headers[key.toLowerCase()] = val;
          }
        } else if (typeof request.headers === 'object') {
          Object.entries(request.headers).forEach(([k, v]) => {
            headers[k.toLowerCase()] = Array.isArray(v) ? v[0] : (v as string);
          });
        }
      }

      return this.verifyWebhook({
        gateway: options.gateway,
        rawBody,
        headers,
        webhookSecret: options.webhookSecret,
      });
    } catch (err: any) {
      return {
        isValid: false,
        normalizedEvent: 'UNKNOWN',
        gateway: options.gateway,
        error: `Failed to process Next.js webhook: ${err.message}`,
      };
    }
  }

  /**
   * Ready-made Express.js & Fastify Webhook Authenticator.
   * Works with standard req, (req.rawBody or JSON.stringify(req.body)).
   */
  public async verifyExpressWebhook(
    req: any,
    options: { gateway: GatewayName; webhookSecret?: string }
  ): Promise<WebhookVerificationResult> {
    let rawBody = '';
    if (typeof req.rawBody === 'string') {
      rawBody = req.rawBody;
    } else if (Buffer.isBuffer(req.rawBody)) {
      rawBody = req.rawBody.toString('utf8');
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
    } else if (typeof req.body === 'object') {
      rawBody = JSON.stringify(req.body);
    }

    const headers: Record<string, string> = {};
    if (req.headers) {
      Object.entries(req.headers).forEach(([k, v]) => {
        headers[k.toLowerCase()] = Array.isArray(v) ? v[0] : (v as string);
      });
    }

    return this.verifyWebhook({
      gateway: options.gateway,
      rawBody,
      headers,
      webhookSecret: options.webhookSecret,
    });
  }
}

/**
 * Factory function to instantiate a PaymentManager.
 */
export function createPaymentManager(options: PaymentManagerOptions): PaymentManager {
  return new PaymentManager(options);
}
