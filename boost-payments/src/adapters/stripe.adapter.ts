import { BasePaymentAdapter } from './base.adapter';
import {
  GatewayName,
  NormalizedWebhookEvent,
  StripeConfig,
  UnifiedCreateOrderOptions,
  UnifiedOrderResult,
  UnifiedPaymentVerificationOptions,
  UnifiedPaymentVerificationResult,
  UnifiedRefundOptions,
  UnifiedRefundResult,
  WebhookVerificationOptions,
  WebhookVerificationResult,
} from '../types';
import { hmacSha256, safeCompare } from '../utils/crypto';
import { PaymentError } from '../utils/errors';

export class StripeAdapter extends BasePaymentAdapter {
  public readonly name: GatewayName = 'stripe';
  private readonly baseUrl = 'https://api.stripe.com/v1';

  constructor(private readonly config: StripeConfig) {
    super();
    if (!config.secretKey) {
      throw new PaymentError('Stripe secretKey is required.', { gateway: 'stripe' });
    }
  }

  private getAuthHeader(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    // Normalization: Stripe expects amount in smallest currency unit (cents)
    const amountInCents = Math.round(options.amount * 100);

    const body: Record<string, string> = {
      'payment_method_types[0]': 'card',
      mode: 'payment',
      client_reference_id: options.receipt,
      customer_email: options.customer.email,
      'line_items[0][price_data][currency]': options.currency.toLowerCase(),
      'line_items[0][price_data][unit_amount]': String(amountInCents),
      'line_items[0][price_data][product_data][name]': `Order #${options.receipt}`,
      'line_items[0][quantity]': '1',
      success_url: options.redirectUrl || 'https://yourstore.com/order-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourstore.com/cart',
    };

    const res = await this.fetchJson(`${this.baseUrl}/checkout/sessions`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body,
    });

    return {
      gateway: 'stripe',
      orderId: options.receipt,
      gatewayOrderId: res.id,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: 'CREATED',
      redirectUrl: res.url,
      rawResponse: res,
    };
  }

  public async verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult> {
    const session = await this.fetchJson(`${this.baseUrl}/checkout/sessions/${options.orderId}`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const isSuccessful = session.payment_status === 'paid';
    const amount = session.amount_total ? session.amount_total / 100 : 0; // Normalized back to standard currency units
    const paymentId = (session.payment_intent as string) || session.id;

    return {
      gateway: 'stripe',
      isSuccessful,
      paymentId,
      orderId: session.client_reference_id || session.id,
      amount,
      currency: (session.currency || 'USD').toUpperCase(),
      paymentMethod: 'card',
      rawResponse: session,
    };
  }

  public async refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult> {
    const body: Record<string, string> = {
      payment_intent: options.paymentId,
    };
    if (options.amount) {
      body.amount = String(Math.round(options.amount * 100));
    }
    if (options.reason) {
      body.reason = 'requested_by_customer';
    }

    const res = await this.fetchJson(`${this.baseUrl}/refunds`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body,
    });

    return {
      gateway: 'stripe',
      refundId: res.id,
      paymentId: options.paymentId,
      amount: res.amount / 100, // Normalized to standard currency units
      status: res.status === 'succeeded' ? 'SUCCESS' : 'PENDING',
      rawResponse: res,
    };
  }

  public async verifyWebhook(
    options: WebhookVerificationOptions
  ): Promise<WebhookVerificationResult> {
    const secret = options.webhookSecret || this.config.webhookSecret;
    if (!secret) {
      return { isValid: false, normalizedEvent: 'UNKNOWN', gateway: 'stripe', error: 'Stripe webhookSecret is not configured.' };
    }

    const sigHeader = this.getHeader(options.headers, 'stripe-signature');
    if (!sigHeader || typeof sigHeader !== 'string') {
      return { isValid: false, normalizedEvent: 'UNKNOWN', gateway: 'stripe', error: 'Missing stripe-signature header.' };
    }

    const parts = sigHeader.split(',');
    let timestamp = '';
    const signatures: string[] = [];

    parts.forEach((part) => {
      const [key, val] = part.split('=');
      if (key === 't') timestamp = val;
      if (key === 'v1') signatures.push(val);
    });

    const rawString =
      typeof options.rawBody === 'string'
        ? options.rawBody
        : options.rawBody.toString('utf8');

    const signedPayload = `${timestamp}.${rawString}`;
    const expectedSignature = hmacSha256(signedPayload, secret);
    const isValid = signatures.some((sig) => safeCompare(expectedSignature, sig));

    let parsed: any;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      parsed = null;
    }

    const rawEvent = parsed?.type || '';
    let normalizedEvent: NormalizedWebhookEvent = 'UNKNOWN';

    if (rawEvent === 'checkout.session.completed' || rawEvent === 'payment_intent.succeeded') {
      normalizedEvent = 'PAYMENT_SUCCESS';
    } else if (rawEvent === 'payment_intent.payment_failed') {
      normalizedEvent = 'PAYMENT_FAILED';
    } else if (rawEvent === 'charge.refunded') {
      normalizedEvent = 'REFUND_PROCESSED';
    } else if (rawEvent?.includes('dispute')) {
      normalizedEvent = 'DISPUTE_CREATED';
    }

    const obj = parsed?.data?.object;
    const orderId = obj?.client_reference_id || obj?.metadata?.order_id || obj?.id;
    const paymentId = obj?.payment_intent || obj?.id;
    const amount = obj?.amount_total ? obj.amount_total / 100 : (obj?.amount ? obj.amount / 100 : undefined);
    const currency = obj?.currency ? obj.currency.toUpperCase() : undefined;

    return {
      isValid,
      normalizedEvent,
      rawEvent,
      gateway: 'stripe',
      orderId,
      paymentId,
      amount,
      currency,
      data: obj,
    };
  }
}
