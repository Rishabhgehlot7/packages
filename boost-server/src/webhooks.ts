/**
 * @boostengine/server — Webhook Signature Verification & Payload Generation
 *
 * A unified signature validator for Razorpay, Cashfree, PhonePe, Paytm,
 * Stripe, and Shiprocket. Signatures are compared in constant time.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import type { WebhookProvider } from './types';

export interface WebhookVerifyOptions {
  /** Epoch timestamp string required by Cashfree/PhonePe style signatures. */
  timestamp?: string;
  /** PhonePe salt index. */
  saltIndex?: string;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Parse a Stripe `t=<ts>,v1=<sig>` signature header. */
function parseStripeSignature(signature: string): { t: string; v1: string } | null {
  const parts = signature.split(',');
  let t = '';
  let v1 = '';
  for (const part of parts) {
    const [key, ...rest] = part.split('=');
    const value = rest.join('=');
    if (key === 't') t = value;
    else if (key === 'v1') v1 = value;
  }
  if (!t || !v1) return null;
  return { t, v1 };
}

/**
 * Verify a webhook signature against a raw payload string.
 *
 * - `razorpay`: hex HMAC-SHA256 of the raw body.
 * - `stripe`: `t=<ts>,v1=<sig>`; `v1 = HMAC-SHA256(secret, t + "." + body)`.
 * - `cashfree`: base64 HMAC-SHA256 of `timestamp + body` (timestamp via options).
 * - `phonepe`: hex HMAC-SHA256 of `body + salt` (salt via options.saltIndex).
 * - `paytm` / `shiprocket`: hex HMAC-SHA256 of the raw body.
 */
export function verifyWebhookSignature(
  provider: WebhookProvider,
  payload: string,
  signature: string,
  secret: string,
  options: WebhookVerifyOptions = {},
): boolean {
  if (!payload || !signature || !secret) return false;

  try {
    const p = String(provider).toLowerCase();

    switch (p) {
      case 'razorpay': {
        const expected = createHmac('sha256', secret).update(payload).digest('hex');
        return safeEqual(signature, expected);
      }
      case 'stripe': {
        const parsed = parseStripeSignature(signature);
        if (!parsed) return false;
        const expected = createHmac('sha256', secret)
          .update(`${parsed.t}.${payload}`)
          .digest('hex');
        return safeEqual(parsed.v1, expected);
      }
      case 'cashfree': {
        const ts = options.timestamp ?? '';
        const expected = createHmac('sha256', secret)
          .update(`${ts}${payload}`)
          .digest('base64');
        return safeEqual(signature, expected);
      }
      case 'phonepe': {
        const salt = options.saltIndex ? `###${options.saltIndex}` : '';
        const expected = createHmac('sha256', secret)
          .update(`${payload}${salt}`)
          .digest('hex');
        return safeEqual(signature, expected);
      }
      case 'paytm':
      case 'shiprocket': {
        const expected = createHmac('sha256', secret).update(payload).digest('hex');
        return safeEqual(signature, expected);
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/** Generate a webhook signature for testing (inverse of `verifyWebhookSignature`). */
export function signWebhookPayload(
  provider: WebhookProvider,
  payload: string,
  secret: string,
  options: WebhookVerifyOptions = {},
): string {
  const p = String(provider).toLowerCase();

  switch (p) {
    case 'razorpay':
      return createHmac('sha256', secret).update(payload).digest('hex');
    case 'stripe': {
      const ts = options.timestamp ?? String(Math.floor(Date.now() / 1000));
      const v1 = createHmac('sha256', secret).update(`${ts}.${payload}`).digest('hex');
      return `t=${ts},v1=${v1}`;
    }
    case 'cashfree': {
      const ts = options.timestamp ?? String(Date.now());
      return createHmac('sha256', secret).update(`${ts}${payload}`).digest('base64');
    }
    case 'phonepe': {
      const salt = options.saltIndex ? `###${options.saltIndex}` : '';
      return createHmac('sha256', secret).update(`${payload}${salt}`).digest('hex');
    }
    default:
      return createHmac('sha256', secret).update(payload).digest('hex');
  }
}

/** Generate a realistic mock webhook payload for a provider + event type. */
export function generateWebhookPayload(
  provider: WebhookProvider,
  event: string,
): Record<string, any> {
  const now = Math.floor(Date.now() / 1000);
  const base = { id: `evt_${Date.now().toString(36)}`, event, created_at: now };

  switch (String(provider).toLowerCase()) {
    case 'razorpay':
      return {
        ...base,
        entity: 'event',
        payload: {
          payment: {
            entity: {
              id: `pay_${Date.now().toString(36)}`,
              amount: 199900,
              currency: 'INR',
              status: event.includes('failed') ? 'failed' : 'captured',
            },
          },
        },
      };
    case 'stripe':
      return {
        id: base.id,
        type: event,
        data: {
          object: {
            id: `cs_${Date.now().toString(36)}`,
            amount_total: 1999,
            currency: 'inr',
            payment_status: event.includes('failed') ? 'failed' : 'paid',
          },
        },
      };
    case 'cashfree':
      return {
        type: event,
        data: {
          order: {
            order_id: `order_${Date.now().toString(36)}`,
            order_amount: 1999,
            currency: 'INR',
            order_status: event.includes('failed') ? 'FAILED' : 'PAID',
          },
        },
      };
    case 'phonepe':
      return { ...base, data: { merchantTransactionId: `MT${Date.now()}`, state: 'COMPLETED' } };
    case 'paytm':
      return { ...base, data: { orderId: `order_${Date.now()}`, txnStatus: 'SUCCESS' } };
    case 'shiprocket':
      return { ...base, data: { awb: `SR${Math.floor(1000000000 + Math.random() * 9000000000)}`, status: 'Delivered' } };
    default:
      return base;
  }
}

