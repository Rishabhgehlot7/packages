import { BasePaymentAdapter } from './base.adapter';
import {
  CashfreeConfig,
  GatewayName,
  NormalizedWebhookEvent,
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

export class CashfreeAdapter extends BasePaymentAdapter {
  public readonly name: GatewayName = 'cashfree';
  private readonly baseUrl: string;
  private readonly apiVersion: string;

  constructor(private readonly config: CashfreeConfig) {
    super();
    if (!config.appId || !config.secretKey) {
      throw new PaymentError('Cashfree appId and secretKey are required.', { gateway: 'cashfree' });
    }
    this.baseUrl =
      config.env === 'PRODUCTION'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';
    this.apiVersion = config.apiVersion || '2023-08-01';
  }

  private getHeaders(): Record<string, string> {
    return {
      'x-client-id': this.config.appId,
      'x-client-secret': this.config.secretKey,
      'x-api-version': this.apiVersion,
      'Content-Type': 'application/json',
    };
  }

  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    // Normalization: Cashfree expects amount in standard currency units (e.g. 1499.00)
    const payload = {
      order_id: options.receipt,
      order_amount: options.amount,
      order_currency: options.currency.toUpperCase(),
      customer_details: {
        customer_id: options.customer.id || `cust_${Date.now()}`,
        customer_name: options.customer.name,
        customer_email: options.customer.email,
        customer_phone: options.customer.phone,
      },
      order_meta: {
        return_url: options.redirectUrl,
        notify_url: options.callbackUrl,
      },
      order_note: options.notes ? JSON.stringify(options.notes) : 'Order via Boost Payments',
    };

    const res = await this.fetchJson(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: payload,
    });

    return {
      gateway: 'cashfree',
      orderId: options.receipt,
      gatewayOrderId: res.order_id,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: res.order_status === 'ACTIVE' ? 'CREATED' : 'PENDING',
      paymentSessionId: res.payment_session_id,
      rawResponse: res,
    };
  }

  public async verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult> {
    const order = await this.fetchJson(`${this.baseUrl}/orders/${options.orderId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const isSuccessful = order.order_status === 'PAID';
    let paymentMethod = 'unknown';
    let paymentId = options.paymentId || order.order_id;

    if (isSuccessful) {
      try {
        const payments = await this.fetchJson(`${this.baseUrl}/orders/${options.orderId}/payments`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        if (Array.isArray(payments) && payments.length > 0) {
          const latest = payments[0];
          paymentId = String(latest.cf_payment_id || paymentId);
          paymentMethod = latest.payment_group || (latest.payment_method ? Object.keys(latest.payment_method)[0] : 'online');
        }
      } catch {
        // Fallback to order details
      }
    }

    return {
      gateway: 'cashfree',
      isSuccessful,
      paymentId,
      orderId: order.order_id,
      amount: order.order_amount,
      currency: order.order_currency,
      paymentMethod,
      rawResponse: order,
    };
  }

  public async refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult> {
    if (!options.orderId) {
      throw new PaymentError('Cashfree refund requires orderId.', { gateway: 'cashfree' });
    }

    const payload = {
      refund_id: `rfnd_${Date.now()}`,
      refund_amount: options.amount,
      refund_note: options.reason || 'Merchant initiated refund',
    };

    const res = await this.fetchJson(`${this.baseUrl}/orders/${options.orderId}/refunds`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: payload,
    });

    return {
      gateway: 'cashfree',
      refundId: res.refund_id,
      paymentId: options.paymentId,
      amount: res.refund_amount,
      status: res.refund_status === 'SUCCESS' ? 'SUCCESS' : 'PENDING',
      rawResponse: res,
    };
  }

  public async verifyWebhook(
    options: WebhookVerificationOptions
  ): Promise<WebhookVerificationResult> {
    const signature = this.getHeader(options.headers, 'x-webhook-signature');
    const timestamp = this.getHeader(options.headers, 'x-webhook-timestamp');

    const rawString =
      typeof options.rawBody === 'string'
        ? options.rawBody
        : options.rawBody.toString('utf8');

    let isValid = false;
    if (signature && timestamp) {
      const signedData = `${timestamp}${rawString}`;
      const expectedSignature = Buffer.from(
        hmacSha256(signedData, this.config.secretKey),
        'hex'
      ).toString('base64');
      isValid = safeCompare(expectedSignature, signature);
    } else if (signature) {
      const expectedSignature = Buffer.from(
        hmacSha256(rawString, this.config.secretKey),
        'hex'
      ).toString('base64');
      isValid = safeCompare(expectedSignature, signature);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      parsed = null;
    }

    const rawEvent = parsed?.type || '';
    let normalizedEvent: NormalizedWebhookEvent = 'UNKNOWN';

    if (rawEvent === 'PAYMENT_SUCCESS_WEBHOOK') {
      normalizedEvent = 'PAYMENT_SUCCESS';
    } else if (rawEvent === 'PAYMENT_FAILED_WEBHOOK' || rawEvent === 'USER_DROPPED_WEBHOOK') {
      normalizedEvent = 'PAYMENT_FAILED';
    } else if (rawEvent === 'REFUND_STATUS_WEBHOOK') {
      const refundStatus = parsed?.data?.refund?.refund_status;
      normalizedEvent = refundStatus === 'SUCCESS' ? 'REFUND_PROCESSED' : 'REFUND_FAILED';
    } else if (rawEvent?.includes('DISPUTE')) {
      normalizedEvent = 'DISPUTE_CREATED';
    }

    const orderData = parsed?.data?.order;
    const paymentData = parsed?.data?.payment;
    const refundData = parsed?.data?.refund;

    const orderId = orderData?.order_id || refundData?.order_id;
    const paymentId = paymentData ? String(paymentData.cf_payment_id) : (refundData ? String(refundData.cf_payment_id) : undefined);
    const amount = paymentData?.payment_amount ?? orderData?.order_amount ?? refundData?.refund_amount;
    const currency = paymentData?.payment_currency || orderData?.order_currency;

    return {
      isValid,
      normalizedEvent,
      rawEvent,
      gateway: 'cashfree',
      orderId,
      paymentId,
      amount,
      currency,
      data: parsed?.data,
    };
  }
}
