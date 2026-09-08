import {
  NotificationChannel,
  NotificationManagerOptions,
  OrderNotificationPayload,
  SendMessageOptions,
  SendMessageResult,
} from './types';
import { WhatsAppAdapter } from './adapters/whatsapp.adapter';
import { SMSAdapter } from './adapters/sms.adapter';
import { EmailAdapter } from './adapters/email.adapter';

export class NotificationManager {
  private whatsapp?: WhatsAppAdapter;
  private sms?: SMSAdapter;
  private email?: EmailAdapter;
  private defaultChannel: NotificationChannel;

  constructor(options: NotificationManagerOptions) {
    this.defaultChannel = options.defaultChannel || 'whatsapp';
    if (options.whatsapp) {
      this.whatsapp = new WhatsAppAdapter(options.whatsapp);
    }
    if (options.sms) {
      this.sms = new SMSAdapter(options.sms);
    }
    if (options.email) {
      this.email = new EmailAdapter(options.email);
    }
  }

  public async send(options: SendMessageOptions): Promise<SendMessageResult> {
    const channel = options.channel || this.defaultChannel;
    if (channel === 'whatsapp') {
      if (!this.whatsapp) throw new Error('WhatsApp channel is not configured.');
      return this.whatsapp.send(options);
    }
    if (channel === 'sms') {
      if (!this.sms) throw new Error('SMS channel is not configured.');
      return this.sms.send(options);
    }
    if (channel === 'email') {
      if (!this.email) throw new Error('Email channel is not configured.');
      return this.email.send(options);
    }
    throw new Error(`Unsupported notification channel: ${channel}`);
  }

  /**
   * Pre-built eCommerce: Send Order Confirmation on WhatsApp & SMS
   */
  public async sendOrderConfirmation(payload: OrderNotificationPayload): Promise<SendMessageResult> {
    return this.send({
      channel: this.defaultChannel,
      to: payload.customer,
      templateName: 'order_confirmed',
      variables: {
        customerName: payload.customer.name,
        orderId: payload.orderId,
        amount: payload.amount,
        items: payload.itemsSummary || 'Your items',
      },
      mediaUrl: payload.invoiceUrl,
      message: `Hi ${payload.customer.name}, your order #${payload.orderId} of ₹${payload.amount} is confirmed! We will update you once it ships.`,
    });
  }

  /**
   * Pre-built eCommerce: Send Shipping & Live Tracking link
   */
  public async sendShippingUpdate(payload: OrderNotificationPayload): Promise<SendMessageResult> {
    return this.send({
      channel: this.defaultChannel,
      to: payload.customer,
      templateName: 'order_shipped',
      variables: {
        customerName: payload.customer.name,
        orderId: payload.orderId,
        courier: payload.courierName || 'Express Courier',
        awb: payload.awbNumber || '',
        trackingLink: payload.trackingUrl || '',
      },
      message: `Hi ${payload.customer.name}, your order #${payload.orderId} has been shipped via ${payload.courierName}! Track here: ${payload.trackingUrl}`,
    });
  }

  /**
   * Pre-built eCommerce: High-Converting WhatsApp Abandoned Cart Recovery
   */
  public async sendAbandonedCartRecovery(payload: OrderNotificationPayload): Promise<SendMessageResult> {
    return this.send({
      channel: 'whatsapp',
      to: payload.customer,
      templateName: 'cart_recovery',
      variables: {
        customerName: payload.customer.name,
        discountCode: payload.discountCode || 'SAVE10',
        cartLink: payload.cartUrl || '',
      },
      message: `Hi ${payload.customer.name}, you left items in your cart! Complete your purchase today with code ${payload.discountCode || 'SAVE10'} for an extra discount: ${payload.cartUrl}`,
    });
  }

  /**
   * Pre-built eCommerce: COD Verification OTP
   */
  public async sendCODVerificationOTP(payload: OrderNotificationPayload): Promise<SendMessageResult> {
    const channel = this.whatsapp ? 'whatsapp' : 'sms';
    return this.send({
      channel,
      to: payload.customer,
      templateName: 'cod_verification_otp',
      variables: {
        otp: payload.otp || '123456',
        amount: payload.amount,
      },
      message: `Your OTP for COD order verification (₹${payload.amount}) is: ${payload.otp}. Valid for 10 minutes.`,
    });
  }
}

export function createNotificationManager(options: NotificationManagerOptions): NotificationManager {
  return new NotificationManager(options);
}
