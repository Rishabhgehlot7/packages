import { BasePaymentAdapter } from './base.adapter';
import {
  CODConfig,
  GatewayName,
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

export class CODAdapter extends BasePaymentAdapter {
  public readonly name: GatewayName = 'cod';

  constructor(private readonly config: CODConfig = {}) {
    super();
  }

  public async createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult> {
    const min = this.config.minOrderValue ?? 0;
    const max = this.config.maxOrderValue ?? 10000;

    if (options.amount < min) {
      throw new PaymentError(`Order amount ${options.amount} is below minimum COD threshold of ${min}`, {
        gateway: 'cod',
        statusCode: 400,
      });
    }

    if (options.amount > max) {
      throw new PaymentError(`Order amount ${options.amount} exceeds maximum COD limit of ${max}`, {
        gateway: 'cod',
        statusCode: 400,
      });
    }

    const codFee = this.config.extraFee || 0;
    const totalAmount = options.amount + codFee;

    return {
      gateway: 'cod',
      orderId: options.receipt,
      gatewayOrderId: `COD_${options.receipt}`,
      amount: totalAmount,
      currency: options.currency.toUpperCase(),
      status: 'CREATED',
      rawResponse: {
        paymentMode: 'Cash On Delivery',
        baseAmount: options.amount,
        codFee,
        totalPayable: totalAmount,
      },
    };
  }

  public async verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult> {
    return {
      gateway: 'cod',
      isSuccessful: true,
      paymentId: `COD_COLLECTED_${options.orderId}`,
      orderId: options.orderId,
      amount: 0,
      currency: 'INR',
      paymentMethod: 'cash_on_delivery',
      rawResponse: { status: 'COLLECTED' },
    };
  }

  public async refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult> {
    return {
      gateway: 'cod',
      refundId: `COD_RF_${Date.now()}`,
      paymentId: options.paymentId,
      amount: options.amount || 0,
      status: 'SUCCESS',
      rawResponse: { note: 'Manual cash/store-credit refund for COD' },
    };
  }

  public async verifyWebhook(
    _options: WebhookVerificationOptions
  ): Promise<WebhookVerificationResult> {
    return {
      isValid: true,
      normalizedEvent: 'PAYMENT_SUCCESS',
      rawEvent: 'COD_ORDER',
      gateway: 'cod',
      data: {},
    };
  }
}
