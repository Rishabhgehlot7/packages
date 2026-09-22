import { GatewayName, NormalizedWebhookEvent, UnifiedCreateOrderOptions } from './types';
import { PaymentManager } from './manager';
import crypto from 'crypto';

/**
 * AI Agent Introspection & Diagnostics Toolkit for @boostengine/payments
 * Enables autonomous coding agents to inspect gateway configurations,
 * validate order payloads, and simulate offline webhooks for unit testing.
 */
export class PaymentAgentToolkit {
  /**
   * Generates a concise, LLM-friendly markdown status report of the PaymentManager
   */
  static inspect(manager: PaymentManager): string {
    const gateways = manager.listConfiguredGateways();
    return [
      `💳 **BoostPayments State Report**`,
      `- Configured Gateways (${gateways.length}): ${gateways.join(', ') || 'None'}`,
      `- Supported Modes: Physical eCommerce, Digital Downloads, Subscriptions & SaaS, Donations`,
      `- Indian UPI Intent: Active (Google Pay, PhonePe, Paytm, CRED, BHIM)`,
      `- Webhook Frameworks: Next.js App Router, Express.js, Fastify, Node HTTP`,
      `---------------------------------`,
      `💡 Status: Ready for transaction processing.`,
    ].join('\n');
  }

  /**
   * Validates an order creation payload with actionable hints for AI agents
   */
  static validateOrder(options: UnifiedCreateOrderOptions): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!options) return { valid: false, errors: ['Options object is required'] };

    if (typeof options.amount !== 'number' || isNaN(options.amount) || options.amount <= 0) {
      errors.push('Property "amount" must be a positive number greater than 0.');
    }
    if (!options.currency || options.currency.length !== 3) {
      errors.push('Property "currency" must be a 3-letter ISO code (e.g. "INR", "USD").');
    }
    if (!options.customer) {
      errors.push('Missing required "customer" object.');
    } else {
      if (!options.customer.name) errors.push('Customer "name" is required.');
      if (!options.customer.email && !options.customer.phone) {
        errors.push('Either customer "email" or "phone" must be provided.');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Generates simulated webhook payloads with valid cryptographic signatures
   * Ideal for local testing and CI/CD pipelines without hitting live gateway servers!
   */
  static simulateWebhook(options: {
    gateway: GatewayName;
    event: NormalizedWebhookEvent;
    orderId: string;
    paymentId?: string;
    amount: number;
    currency?: string;
    webhookSecret?: string;
  }): { rawBody: string; headers: Record<string, string> } {
    const {
      gateway,
      event,
      orderId,
      paymentId = `pay_sim_${Date.now()}`,
      amount,
      currency = 'INR',
      webhookSecret = 'test_secret_123',
    } = options;

    if (gateway === 'razorpay') {
      const rzpEvent =
        event === 'PAYMENT_SUCCESS'
          ? 'order.paid'
          : event === 'PAYMENT_FAILED'
          ? 'payment.failed'
          : 'refund.processed';

      const bodyObj = {
        entity: 'event',
        event: rzpEvent,
        contains: ['payment', 'order'],
        payload: {
          payment: {
            entity: {
              id: paymentId,
              order_id: orderId,
              amount: Math.round(amount * 100),
              currency,
              status: event === 'PAYMENT_SUCCESS' ? 'captured' : 'failed',
            },
          },
          order: {
            entity: {
              id: orderId,
              amount: Math.round(amount * 100),
              status: 'paid',
            },
          },
        },
      };

      const rawBody = JSON.stringify(bodyObj);
      const signature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

      return {
        rawBody,
        headers: {
          'x-razorpay-signature': signature,
          'content-type': 'application/json',
        },
      };
    }

    // Default generic simulation
    const rawBody = JSON.stringify({
      gateway,
      event,
      orderId,
      paymentId,
      amount,
      currency,
    });

    return {
      rawBody,
      headers: {
        'x-mock-signature': 'valid',
        'content-type': 'application/json',
      },
    };
  }
}
