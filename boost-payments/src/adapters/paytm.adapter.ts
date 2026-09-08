import { BasePaymentAdapter } from './base.adapter';
import {
  GatewayName,
  NormalizedWebhookEvent,
  PaytmConfig,
  UnifiedCreateOrderOptions,
  UnifiedOrderResult,
  UnifiedPaymentVerificationOptions,
  UnifiedPaymentVerificationResult,
  UnifiedRefundOptions,
  UnifiedRefundResult,
  WebhookVerificationOptions,
  WebhookVerificationResult,
} from '../types';
import { PaymentError } from '../utils/errors';

export class PaytmAdapter extends BasePaymentAdapter {
  public readonly name: GatewayName = 'paytm';
  private readonly baseUrl: string;

  constructor(private readonly config: PaytmConfig) {
    super();
    if (!config.mid || !config.merchantKey) {
      throw new PaymentError('Paytm mid and merchantKey are required.', { gateway: 'paytm' });
    }
    this.baseUrl =
      config.env === 'PRODUCTION'
        ? 'https://securegw.paytm.in'
        : 'https://securegw-stage.paytm.in';
  }

  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    const payload = {
      body: {
        requestType: 'Payment',
        mid: this.config.mid,
        websiteName: this.config.website || 'DEFAULT',
        orderId: options.receipt,
        callbackUrl: options.callbackUrl || 'https://api.yourstore.com/webhooks/paytm',
        txnAmount: {
          value: options.amount.toFixed(2),
          currency: 'INR',
        },
        userInfo: {
          custId: options.customer.id || `CUST_${Date.now()}`,
          mobile: options.customer.phone.replace(/[^0-9]/g, '').slice(-10),
          email: options.customer.email,
        },
      },
    };

    const url = `${this.baseUrl}/theia/api/v1/initiateTransaction?mid=${this.config.mid}&orderId=${options.receipt}`;
    const res = await this.fetchJson(url, {
      method: 'POST',
      body: payload,
    });

    const txnToken = res?.body?.txnToken;

    return {
      gateway: 'paytm',
      orderId: options.receipt,
      gatewayOrderId: options.receipt,
      amount: options.amount,
      currency: 'INR',
      status: txnToken ? 'CREATED' : 'FAILED',
      txnToken,
      rawResponse: res,
    };
  }

  public async verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult> {
    const url = `${this.baseUrl}/v3/order/status`;
    const payload = {
      body: {
        mid: this.config.mid,
        orderId: options.orderId,
      },
    };

    const res = await this.fetchJson(url, {
      method: 'POST',
      body: payload,
    });

    const body = res?.body || {};
    const isSuccessful = body.resultInfo?.resultStatus === 'TXN_SUCCESS';

    return {
      gateway: 'paytm',
      isSuccessful,
      paymentId: body.txnId || options.orderId,
      orderId: options.orderId,
      amount: parseFloat(body.txnAmount || '0'),
      currency: 'INR',
      paymentMethod: body.paymentMode || 'ONLINE',
      rawResponse: res,
    };
  }

  public async refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult> {
    const refundRefId = `RF_${Date.now()}`;
    const url = `${this.baseUrl}/refund/apply`;
    const payload = {
      body: {
        mid: this.config.mid,
        txnType: 'REFUND',
        orderId: options.orderId,
        txnId: options.paymentId,
        refId: refundRefId,
        refundAmount: (options.amount || 0).toFixed(2),
      },
    };

    const res = await this.fetchJson(url, {
      method: 'POST',
      body: payload,
    });

    const body = res?.body || {};
    const isSuccess = body.resultInfo?.resultStatus === 'TXN_SUCCESS' || body.resultInfo?.resultStatus === 'PENDING';

    return {
      gateway: 'paytm',
      refundId: body.refundId || refundRefId,
      paymentId: options.paymentId,
      amount: options.amount || 0,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
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
      const params = new URLSearchParams(rawString);
      parsed = Object.fromEntries(params.entries());
    }

    const rawStatus = parsed?.STATUS || parsed?.resultInfo?.resultStatus;
    const isSuccess = rawStatus === 'TXN_SUCCESS';
    const normalizedEvent: NormalizedWebhookEvent = isSuccess ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED';

    const orderId = parsed?.ORDERID || parsed?.orderId;
    const paymentId = parsed?.TXNID || parsed?.txnId;
    const amount = parsed?.TXNAMOUNT ? parseFloat(parsed.TXNAMOUNT) : undefined;

    return {
      isValid: true,
      normalizedEvent,
      rawEvent: rawStatus,
      gateway: 'paytm',
      orderId,
      paymentId,
      amount,
      currency: 'INR',
      data: parsed,
    };
  }
}
