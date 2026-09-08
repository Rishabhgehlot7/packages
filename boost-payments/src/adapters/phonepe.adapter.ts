import { BasePaymentAdapter } from './base.adapter';
import {
  GatewayName,
  NormalizedWebhookEvent,
  PhonePeConfig,
  UnifiedCreateOrderOptions,
  UnifiedOrderResult,
  UnifiedPaymentVerificationOptions,
  UnifiedPaymentVerificationResult,
  UnifiedRefundOptions,
  UnifiedRefundResult,
  WebhookVerificationOptions,
  WebhookVerificationResult,
} from '../types';
import { base64Decode, base64Encode, sha256 } from '../utils/crypto';
import { PaymentError } from '../utils/errors';

export class PhonePeAdapter extends BasePaymentAdapter {
  public readonly name: GatewayName = 'phonepe';
  private readonly baseUrl: string;
  private readonly saltIndex: string;

  constructor(private readonly config: PhonePeConfig) {
    super();
    if (!config.merchantId || !config.saltKey) {
      throw new PaymentError('PhonePe merchantId and saltKey are required.', { gateway: 'phonepe' });
    }
    this.baseUrl =
      config.env === 'PRODUCTION'
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    this.saltIndex = config.saltIndex || '1';
  }

  private calculateXVerify(base64Payload: string, endpoint: string): string {
    const stringToHash = `${base64Payload}${endpoint}${this.config.saltKey}`;
    const hash = sha256(stringToHash);
    return `${hash}###${this.saltIndex}`;
  }

  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    // Normalization: PhonePe /pg/v1/pay API expects amount in paise
    const amountInPaise = Math.round(options.amount * 100);

    const payload = {
      merchantId: this.config.merchantId,
      merchantTransactionId: options.receipt,
      merchantUserId: options.customer.id || `MUID_${Date.now()}`,
      amount: amountInPaise,
      redirectUrl: options.redirectUrl || 'https://yourstore.com/order-success',
      redirectMode: 'POST',
      callbackUrl: options.callbackUrl || 'https://api.yourstore.com/webhooks/phonepe',
      mobileNumber: options.customer.phone.replace(/[^0-9]/g, '').slice(-10),
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const base64Payload = base64Encode(payload);
    const endpoint = '/pg/v1/pay';
    const xVerify = this.calculateXVerify(base64Payload, endpoint);

    const res = await this.fetchJson(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: {
        request: base64Payload,
      },
    });

    const redirectUrl = res?.data?.instrumentResponse?.redirectInfo?.url;

    return {
      gateway: 'phonepe',
      orderId: options.receipt,
      gatewayOrderId: options.receipt,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: res.success ? 'CREATED' : 'FAILED',
      redirectUrl,
      rawResponse: res,
    };
  }

  public async verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult> {
    const endpoint = `/pg/v1/status/${this.config.merchantId}/${options.orderId}`;
    const stringToHash = `${endpoint}${this.config.saltKey}`;
    const xVerify = `${sha256(stringToHash)}###${this.saltIndex}`;

    const res = await this.fetchJson(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': this.config.merchantId,
      },
    });

    const isSuccessful = res.code === 'PAYMENT_SUCCESS';
    const amount = res.data?.amount ? res.data.amount / 100 : 0; // Normalized to standard currency units
    const paymentId = res.data?.transactionId || options.orderId;

    return {
      gateway: 'phonepe',
      isSuccessful,
      paymentId,
      orderId: options.orderId,
      amount,
      currency: 'INR',
      paymentMethod: res.data?.paymentInstrument?.type || 'UPI',
      rawResponse: res,
    };
  }

  public async refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult> {
    const refundTxnId = `RF_${Date.now()}`;
    const amountInPaise = options.amount ? Math.round(options.amount * 100) : 0;

    const payload = {
      merchantId: this.config.merchantId,
      merchantTransactionId: refundTxnId,
      originalTransactionId: options.orderId || options.paymentId,
      amount: amountInPaise,
      callbackUrl: 'https://api.yourstore.com/webhooks/phonepe',
    };

    const base64Payload = base64Encode(payload);
    const endpoint = '/pg/v1/refund';
    const xVerify = this.calculateXVerify(base64Payload, endpoint);

    const res = await this.fetchJson(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: {
        request: base64Payload,
      },
    });

    return {
      gateway: 'phonepe',
      refundId: refundTxnId,
      paymentId: options.paymentId,
      amount: options.amount || 0,
      status: res.success ? 'SUCCESS' : 'FAILED',
      rawResponse: res,
    };
  }

  public async verifyWebhook(
    options: WebhookVerificationOptions
  ): Promise<WebhookVerificationResult> {
    const rawString =
      typeof options.rawBody === 'string'
        ? options.rawBody
        : options.rawBody.toString('utf8');

    let parsed: any;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      return { isValid: false, normalizedEvent: 'UNKNOWN', gateway: 'phonepe', error: 'Invalid JSON payload' };
    }

    if (!parsed.response) {
      return { isValid: false, normalizedEvent: 'UNKNOWN', gateway: 'phonepe', error: 'Missing response field in PhonePe callback' };
    }

    let decoded: any = {};
    try {
      decoded = JSON.parse(base64Decode(parsed.response));
    } catch {
      return { isValid: false, normalizedEvent: 'UNKNOWN', gateway: 'phonepe', error: 'Failed to decode base64 PhonePe response' };
    }

    const rawEvent = decoded.code || '';
    let normalizedEvent: NormalizedWebhookEvent = 'UNKNOWN';

    if (rawEvent === 'PAYMENT_SUCCESS') {
      normalizedEvent = 'PAYMENT_SUCCESS';
    } else if (rawEvent === 'PAYMENT_ERROR' || rawEvent === 'PAYMENT_DECLINED') {
      normalizedEvent = 'PAYMENT_FAILED';
    }

    const orderId = decoded.data?.merchantTransactionId;
    const paymentId = decoded.data?.transactionId;
    const amount = decoded.data?.amount ? decoded.data.amount / 100 : undefined;

    return {
      isValid: true,
      normalizedEvent,
      rawEvent,
      gateway: 'phonepe',
      orderId,
      paymentId,
      amount,
      currency: 'INR',
      data: decoded.data,
    };
  }
}
