# @boostengine/payments 💳

[![npm version](https://img.shields.io/npm/v/@boostengine/payments.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/payments)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/payments.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/payments)
[![license](https://img.shields.io/npm/l/@boostengine/payments.svg?style=flat-square)](https://github.com/Rishabhgehlot7/packages/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Universal](https://img.shields.io/badge/Next.js%20%7C%20Express%20%7C%20React%20Native%20%7C%20Vue%20%7C%20Node-Universal-success.svg?style=flat-square)](https://nodejs.org/)

> **Universal Multi-Gateway Payment Orchestration for Physical eCommerce, Digital Products, SaaS Subscriptions, and Donations.**  
> Built for Indian & Global brands (Razorpay, Cashfree, PhonePe, Paytm, Stripe, COD). Features mobile Indian UPI Intent (Google Pay, PhonePe, Paytm, CRED), automatic smart fallback chains, idempotency protection, and multi-framework support (Next.js, Express, React Native, Vue, Svelte).

---

## ⚡ 4 Supported Business Models

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           @boostengine/payments                             │
├──────────────────┬──────────────────────┬────────────────────┬──────────────┤
│  1. Physical     │   2. Digital         │  3. Subscriptions  │ 4. Donations │
│     eCommerce    │      Products        │     & SaaS         │    & Tips    │
├──────────────────┼──────────────────────┼────────────────────┼──────────────┤
│ • Items & Tax    │ • Instant Download   │ • Weekly/Monthly/  │ • Custom Tip │
│ • COD & Surcharge│ • License Key        │   Yearly Recurring │ • Pay-what-  │
│ • Shipping Addr  │ • Course / Ebook     │ • UPI AutoPay      │   you-want   │
│ • BoostCart Sync │ • 1-Click Pay        │ • Stripe / RZP Sub │ • Creator Pay│
└──────────────────┴──────────────────────┴────────────────────┴──────────────┘
```

---

## 📦 Installation

```bash
# npm
npm install @boostengine/payments

# pnpm
pnpm add @boostengine/payments

# yarn
yarn add @boostengine/payments
```

---

## 🚀 30-Second Quickstart

```typescript
import { createPaymentManager } from '@boostengine/payments';

// 1. Initialize PaymentManager with your gateway credentials
export const payments = createPaymentManager({
  defaultGateway: 'razorpay',
  gateways: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID!,
      keySecret: process.env.RAZORPAY_KEY_SECRET!,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    },
    cashfree: {
      appId: process.env.CASHFREE_APP_ID!,
      secretKey: process.env.CASHFREE_SECRET_KEY!,
      env: 'PRODUCTION',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
    },
    cod: {
      minOrderValue: 200,
      maxOrderValue: 5000,
      extraFee: 49,
    },
  },
  // Smart Routing: Route USD/EUR to Stripe, INR to Razorpay
  smartRouting: {
    currencyMap: { USD: 'stripe', EUR: 'stripe', INR: 'razorpay' },
    fallbackChain: ['razorpay', 'cashfree'],
  },
  // Enable Mobile UPI Deep-Linking
  merchantUpiVpa: 'mybrand@icici',
  merchantName: 'My D2C Brand',
});
```

---

## 🛒 1. Physical eCommerce (@boostengine/cart Bridge)

Pass your `BoostCart` instance directly into `payments.createOrderFromCart`. It automatically resolves the final payable amount, discount codes, line items, and taxes:

```typescript
// On your Node.js / Next.js server route:
import { payments } from '@/lib/payments';

export async function createCheckoutOrder(cart: any, customerDetails: any) {
  const order = await payments.createOrderFromCart(cart, {
    customer: {
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: customerDetails.email,
    },
    receipt: `order_${Date.now()}`,
    redirectUrl: 'https://mystore.com/checkout/success',
  });

  return order;
}
```

---

## 💻 2. Digital Products & Instant Downloads

```typescript
// Sell Courses, eBooks, Software licenses, or 3D assets:
const digitalOrder = await payments.createDigitalProductCheckout({
  productId: 'course_nextjs_mastery',
  title: 'Next.js 15 Fullstack Course',
  amount: 1999,
  currency: 'INR',
  customer: {
    name: 'Siddharth',
    email: 'sid@example.com',
    phone: '9876543210',
  },
  licenseKey: 'PRO-NX15-9948',
  downloadUrl: 'https://assets.mystore.com/downloads/nextjs-course.zip',
  redirectUrl: 'https://mystore.com/download-portal',
});
```

---

## 🔄 3. SaaS & Membership Subscriptions (Recurring Billing)

```typescript
// Recurring weekly / monthly / yearly billing:
const subscription = await payments.createSubscription({
  planName: 'Pro Developer Pass',
  amount: 499,
  currency: 'INR',
  interval: 'monthly',
  customer: {
    name: 'Rohan Sharma',
    email: 'rohan@gmail.com',
    phone: '9988776655',
  },
  redirectUrl: 'https://saas.app/dashboard',
});

console.log('Subscription ID:', subscription.subscriptionId);
```

---

## 📱 4. Indian Mobile UPI Intent & App Deep-Links

Generate direct one-tap links that open Google Pay, PhonePe, Paytm, or CRED directly on customer phones:

```typescript
import { UPIIntentGenerator } from '@boostengine/payments';

const upi = UPIIntentGenerator.generate({
  pa: 'merchant@icici',
  pn: 'Boost Store',
  am: 1299,
  tr: 'order_123',
  tn: 'Order #123 Payment',
});

console.log(upi.gpay);    // tez://upi/pay?pa=merchant%40icici...
console.log(upi.phonepe); // phonepe://pay?pa=merchant%40icici...
console.log(upi.paytm);   // paytmmp://pay?pa=merchant%40icici...
console.log(upi.cred);    // cred://upi/pay?pa=merchant%40icici...
```

---

## 🌐 Universal Framework Integration

### A. Next.js 14 / 15 App Router

```tsx
// app/checkout/page.tsx
'use client';
import { useBoostPayment } from '@boostengine/payments/react';

export default function CheckoutPage({ order }: { order: any }) {
  const { openPaymentModal, isProcessing } = useBoostPayment();

  const handlePay = () => {
    openPaymentModal({
      order,
      name: 'Boost Clothing',
      onSuccess: (res) => {
        window.location.href = `/order-confirmed?id=${res.orderId}`;
      },
      onFailure: (err) => {
        alert(`Payment failed: ${err.message}`);
      },
    });
  };

  return (
    <button onClick={handlePay} disabled={isProcessing}>
      {isProcessing ? 'Opening Gateway...' : `Pay ₹${order.amount}`}
    </button>
  );
}
```

### B. Vue 3, Svelte & Vanilla JS

Import the framework-agnostic client launcher:

```typescript
import { createPaymentCheckout } from '@boostengine/payments';

async function launchCheckout(orderData) {
  await createPaymentCheckout({
    order: orderData,
    name: 'My Store',
    onSuccess: (res) => console.log('Paid!', res),
    onFailure: (err) => console.error('Failed', err),
  });
}
```

### C. Express.js / Fastify Webhooks

```typescript
import express from 'express';
import { payments } from './payments';

const app = express();
app.use(express.json());

app.post('/api/webhooks/payments', async (req, res) => {
  const result = await payments.verifyExpressWebhook(req, {
    gateway: 'razorpay',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  });

  if (!result.isValid) {
    return res.status(400).send('Invalid Webhook Signature');
  }

  if (result.normalizedEvent === 'PAYMENT_SUCCESS') {
    console.log(`✅ Order ${result.orderId} was paid! Payment ID: ${result.paymentId}`);
    // Mark order as paid in your database
  }

  res.send('OK');
});
```

---

## 🤖 AI Agent & LLM Diagnostics (`PaymentAgentToolkit`)

Autonomous AI agents (Cursor, Gemini, Claude) can inspect state and simulate webhooks locally without live cards:

```typescript
import { PaymentAgentToolkit } from '@boostengine/payments';

// 1. Inspect status
console.log(PaymentAgentToolkit.inspect(payments));

// 2. Simulate offline webhook in unit tests
const mockWebhook = PaymentAgentToolkit.simulateWebhook({
  gateway: 'razorpay',
  event: 'PAYMENT_SUCCESS',
  orderId: 'order_9988',
  amount: 1499,
  webhookSecret: 'test_secret',
});

const verified = await payments.verifyWebhook({
  gateway: 'razorpay',
  rawBody: mockWebhook.rawBody,
  headers: mockWebhook.headers,
  webhookSecret: 'test_secret',
});

console.log(verified.isValid); // true
console.log(verified.normalizedEvent); // 'PAYMENT_SUCCESS'
```

---

## 🛠️ Complete API Reference

- `payments.createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>`
- `payments.createOrderFromCart(cart: BoostCart, options: CartOrderOptions): Promise<UnifiedOrderResult>`
- `payments.createDigitalProductCheckout(options: DigitalProductCheckoutOptions): Promise<UnifiedOrderResult>`
- `payments.createSubscription(options: SubscriptionPlanOptions): Promise<SubscriptionResult>`
- `payments.createDonationCheckout(options: DonationCheckoutOptions): Promise<UnifiedOrderResult>`
- `payments.createUPIIntent(options: UPIIntentOptions): UPIIntentResult`
- `payments.createOrderWithFallback(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>`
- `payments.verifyPayment(options: UnifiedPaymentVerificationOptions): Promise<UnifiedPaymentVerificationResult>`
- `payments.refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>`
- `payments.verifyWebhook(options: WebhookVerificationOptions): Promise<WebhookVerificationResult>`
- `payments.verifyNextJsWebhook(request: Request, options): Promise<WebhookVerificationResult>`
- `payments.verifyExpressWebhook(req: any, options): Promise<WebhookVerificationResult>`

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
