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
} from './types';
import { BasePaymentAdapter } from './adapters/base.adapter';
import { RazorpayAdapter } from './adapters/razorpay.adapter';
import { CashfreeAdapter } from './adapters/cashfree.adapter';
import { PhonePeAdapter } from './adapters/phonepe.adapter';
import { PaytmAdapter } from './adapters/paytm.adapter';
import { StripeAdapter } from './adapters/stripe.adapter';
import { CODAdapter } from './adapters/cod.adapter';
import { GatewayNotConfiguredError, PaymentError } from './utils/errors';

export class PaymentManager {
  private readonly adapters: Map<GatewayName, BasePaymentAdapter> = new Map();
  private readonly defaultGateway?: GatewayName;
  private readonly smartRouting?: PaymentManagerOptions['smartRouting'];

  constructor(options: PaymentManagerOptions) {
    this.defaultGateway = options.defaultGateway;
    this.smartRouting = options.smartRouting;

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
   * Create an order using the chosen or automatically resolved gateway.
   */
  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    const targetGateway = this.resolveGateway({
      gateway: options.gateway,
      currency: options.currency,
    });
    const adapter = this.getAdapter(targetGateway);
    return adapter.createOrder(options);
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
      (this.listConfiguredGateways());

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
}

/**
 * Factory function to instantiate a PaymentManager.
 */
export function createPaymentManager(options: PaymentManagerOptions): PaymentManager {
  return new PaymentManager(options);
}
