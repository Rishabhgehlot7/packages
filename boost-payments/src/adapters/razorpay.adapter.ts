import { BasePaymentAdapter } from './base.adapter';
import {
  GatewayName,
  NormalizedWebhookEvent,
  RazorpayConfig,
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

export class RazorpayAdapter extends BasePaymentAdapter {
  public readonly name: GatewayName = 'razorpay';
  private readonly baseUrl = 'https://api.razorpay.com/v1';

  constructor(private readonly config: RazorpayConfig) {
    super();
    if (!config.keyId || !config.keySecret) {
      throw new PaymentError('Razorpay keyId and keySecret are required.', { gateway: 'razorpay' });
    }
  }

  private getAuthHeader(): string {
    const creds = `${this.config.keyId}:${this.config.keySecret}`;
    return `Basic ${Buffer.from(creds).toString('base64')}`;
  }

  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    // Normalization: Razorpay expects amount in smallest currency unit (paise)
    const amountInSubunits = Math.round(options.amount * 100);

    const payload = {
      amount: amountInSubunits,
      currency: options.currency.toUpperCase(),
      receipt: options.receipt,
      notes: {
        customer_name: options.customer.name,
        customer_email: options.customer.email,
        customer_phone: options.customer.phone,
        ...options.notes,
      },
    };

    const res = await this.fetchJson(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
      },
      body: payload,
    });

    return {
      gateway: 'razorpay',
      orderId: options.receipt,
      gatewayOrderId: res.id,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: 'CREATED',
      rawResponse: res,
    };
  }

  public async verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult> {
    if (!options.paymentId) {
      throw new PaymentError('Razorpay payment verification requires paymentId.', { gateway: 'razorpay' });
    }

    let isSignatureValid = false;
    if (options.signature) {
      const expectedSignature = hmacSha256(
        `${options.orderId}|${options.paymentId}`,
        this.config.keySecret
      );
      isSignatureValid = safeCompare(expectedSignature, options.signature);
    }

    const payment = await this.fetchJson(`${this.baseUrl}/payments/${options.paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: this.getAuthHeader(),
      },
    });

    const isCaptured = payment.status === 'captured' || payment.status === 'authorized';

    return {
      gateway: 'razorpay',
      isSuccessful: (options.signature ? isSignatureValid : true) && isCaptured,
      paymentId: payment.id,
      orderId: options.orderId,
      amount: payment.amount / 100, // Normalized back to standard currency units
      currency: payment.currency,
      paymentMethod: payment.method,
      rawResponse: payment,
    };
  }

  public async refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult> {
    const payload: Record<string, any> = {
      notes: { reason: options.reason || 'Merchant requested refund' },
    };
    if (options.amount) {
      payload.amount = Math.round(options.amount * 100);
    }

    const res = await this.fetchJson(`${this.baseUrl}/payments/${options.paymentId}/refund`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
      },
      body: payload,
    });

    return {
      gateway: 'razorpay',
      refundId: res.id,
      paymentId: options.paymentId,
      amount: res.amount / 100, // Normalized to standard currency units
      status: res.status === 'processed' ? 'SUCCESS' : 'PENDING',
      rawResponse: res,
    };
  }

  public async verifyWebhook(
    options: WebhookVerificationOptions
  ): Promise<WebhookVerificationResult> {
    const secret = options.webhookSecret || this.config.webhookSecret;
    if (!secret) {
      return {
        isValid: false,
        normalizedEvent: 'UNKNOWN',
        gateway: 'razorpay',
        error: 'Razorpay webhookSecret is not configured.',
      };
    }

    const signature = this.getHeader(options.headers, 'x-razorpay-signature');
    if (!signature) {
      return {
        isValid: false,
        normalizedEvent: 'UNKNOWN',
        gateway: 'razorpay',
        error: 'Missing x-razorpay-signature header.',
      };
    }

    const rawString =
      typeof options.rawBody === 'string'
        ? options.rawBody
        : options.rawBody.toString('utf8');

    const expectedSignature = hmacSha256(rawString, secret);
    const isValid = safeCompare(expectedSignature, signature);

    let parsed: any;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      parsed = null;
    }

    const rawEvent = parsed?.event || '';
    let normalizedEvent: NormalizedWebhookEvent = 'UNKNOWN';

    if (rawEvent === 'order.paid' || rawEvent === 'payment.captured' || rawEvent === 'payment.authorized') {
      normalizedEvent = 'PAYMENT_SUCCESS';
    } else if (rawEvent === 'payment.failed') {
      normalizedEvent = 'PAYMENT_FAILED';
    } else if (rawEvent === 'refund.processed' || rawEvent === 'refund.created') {
      normalizedEvent = 'REFUND_PROCESSED';
    } else if (rawEvent === 'refund.failed') {
      normalizedEvent = 'REFUND_FAILED';
    } else if (rawEvent?.includes('dispute')) {
      normalizedEvent = 'DISPUTE_CREATED';
    }

    const paymentEntity = parsed?.payload?.payment?.entity;
    const orderEntity = parsed?.payload?.order?.entity;

    const orderId = orderEntity?.receipt || paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;
    const amount = paymentEntity?.amount ? paymentEntity.amount / 100 : (orderEntity?.amount ? orderEntity.amount / 100 : undefined);
    const currency = paymentEntity?.currency || orderEntity?.currency;

    return {
      isValid,
      normalizedEvent,
      rawEvent,
      gateway: 'razorpay',
      orderId,
      paymentId,
      amount,
      currency,
      data: parsed?.payload,
    };
  }
}
