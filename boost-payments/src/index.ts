// Main Server & Core Entrypoint for @boostengine/payments
export * from './types';
export * from './manager';
export * from './upi';
export * from './client';
export * from './idempotency';
export * from './agent';
export * from './utils/crypto';
export * from './utils/errors';
export * from './adapters/base.adapter';
export * from './adapters/razorpay.adapter';
export * from './adapters/cashfree.adapter';
export * from './adapters/phonepe.adapter';
export * from './adapters/paytm.adapter';
export * from './adapters/stripe.adapter';
export * from './adapters/cod.adapter';

// Explicit type aliases for top-level consumers
export type {
  PaymentOrderResult,
  VerificationResult,
  RefundResult,
  WebhookResult,
  SupportedGateway,
  NormalizedWebhookEvent,
  CreateOrderOptions,
  BoostPaymentOpenOptions,
  PaymentMode,
  BillingInterval,
  SubscriptionPlanOptions,
  SubscriptionResult,
  DigitalProductCheckoutOptions,
  DonationCheckoutOptions,
  BoostCartLike,
  CartOrderOptions,
  UPIIntentOptions,
  UPIIntentResult,
} from './types';
