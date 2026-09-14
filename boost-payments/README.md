# @boostengine/payments 💳

[![npm version](https://img.shields.io/npm/v/@boostengine/payments.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/payments)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/payments.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/payments)
[![license](https://img.shields.io/npm/l/@boostengine/payments.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Gateways](https://img.shields.io/badge/Gateways-Razorpay%20%7C%20Cashfree%20%7C%20PhonePe%20%7C%20Paytm%20%7C%20Stripe%20%7C%20COD-purple.svg?style=flat-square)](https://npmjs.com/package/@boostengine/payments)

> **Unified multi-gateway payment orchestration for Indian and global eCommerce. Connect Razorpay, Cashfree, PhonePe, Paytm, Stripe, and Cash on Delivery (COD) with a single, unified API. Features automatic gateway failover, smart currency routing, Next.js webhook normalizers, and React checkout hooks.**

Zero dependency bloat — uses native Node.js `crypto` and `fetch`. No need to install 6 separate heavy vendor SDKs.

---

## 📸 Architecture & Payment Flow

```text
  Customer Clicks "Pay Now" (₹1,499)
                 │
                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 Smart Payment Orchestrator                  │
  ├─────────────────────────────────────────────────────────────┤
  │ Currency Routing:                                           │
  │   - If INR  ──► Route to Cashfree / Razorpay / PhonePe      │
  │   - If USD  ──► Route to Stripe                             │
  │   - If COD  ──► Verify min/max limits & add handling fee    │
  │                                                             │
  │ High-Availability Failover:                                 │
  │   [Cashfree Server 500] ──► Auto-retry with [Razorpay] ──► OK│
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              Client Checkout Hook (`useBoostPayment`)        │
  ├─────────────────────────────────────────────────────────────┤
  │ Opens Razorpay Popup / Cashfree Dropin / PhonePe App / UPI  │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              Next.js Webhook Handler (2 Lines)              │
  ├─────────────────────────────────────────────────────────────┤
  │ Validates HMAC-SHA256 signature and returns normalized event:│
  │   'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'REFUND_PROCESSED' │
  └─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Gateway Comparison

| Gateway | Supported Currencies | Methods Supported | Best For |
| :--- | :--- | :--- | :--- |
| **Razorpay** | INR, USD, EUR + 90 more | UPI, Cards, NetBanking, Wallets, EMI | Reliable Indian D2C checkout |
| **Cashfree** | INR | Instant UPI QR, Intent, NetBanking, Cards | Low transaction fees & high UPI success |
| **PhonePe** | INR | PhonePe App, UPI Intent, QR Code | Fast mobile conversions in India |
| **Stripe** | Global (135+ currencies) | Credit/Debit Cards, Apple Pay, Google Pay | International cross-border sales |
| **Paytm** | INR | Paytm Wallet, UPI, Postpaid, NetBanking | Indian mobile users |
| **Cash on Delivery** | Any | Pay in cash upon delivery | Tier 2/3 Indian cities |

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

## 🚀 Step-by-Step Integration Guide

### Step 1: Initialize Payment Manager (`lib/payments.ts`)

```typescript
import { createPaymentManager } from '@boostengine/payments';

export const payments = createPaymentManager({
  defaultGateway: 'cashfree',

  gateways: {
    cashfree: {
      appId: process.env.CASHFREE_APP_ID!,
      secretKey: process.env.CASHFREE_SECRET_KEY!,
      env: 'PRODUCTION', // or 'SANDBOX'
    },
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID!,
      keySecret: process.env.RAZORPAY_KEY_SECRET!,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    },
    phonepe: {
      merchantId: process.env.PHONEPE_MERCHANT_ID!,
      saltKey: process.env.PHONEPE_SALT_KEY!,
      saltIndex: '1',
      env: 'PRODUCTION', // or 'UAT'
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    cod: {
      minOrderValue: 200,
      maxOrderValue: 10000,
      extraFee: 49, // ₹49 COD handling charge
    },
  },

  // Smart Routing & High Availability
  smartRouting: {
    currencyMap: {
      USD: 'stripe',
      EUR: 'stripe',
      INR: 'cashfree',
    },
    fallbackChain: ['cashfree', 'razorpay', 'phonepe'],
  },
});
```

---

### Step 2: Create Order API Route (`app/api/checkout/route.ts`)

Pass standard human amounts (e.g. `1499.00`). Paise and cents conversion is handled automatically!

```typescript
import { payments } from '@/lib/payments';

export async function POST(req: Request) {
  const { amount, customer, gateway } = await req.json();

  // Create order with automatic fallback if primary gateway is down
  const order = await payments.createOrderWithFallback({
    amount: amount, // e.g. 1499
    currency: 'INR',
    receipt: `order_${Date.now()}`,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
    fallbackChain: gateway ? [gateway, 'razorpay'] : ['cashfree', 'razorpay'],
  });

  return Response.json(order);
}
```

---

### Step 3: Frontend Checkout Button (`components/CheckoutButton.tsx`)

The `useBoostPayment` hook automatically injects the right vendor scripts on demand and displays payment modals:

```tsx
'use client';

import { useBoostPayment } from '@boostengine/payments/react';
import { useRouter } from 'next/navigation';

export default function CheckoutButton({ cartTotal, customer }: any) {
  const router = useRouter();
  const { openPaymentModal, isProcessing } = useBoostPayment();

  const handlePay = async (gateway: 'razorpay' | 'cashfree' | 'phonepe' | 'cod') => {
    // 1. Create order on server
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ amount: cartTotal, customer, gateway }),
    });
    const order = await res.json();

    // 2. Open popup modal or redirect
    openPaymentModal({
      order,
      name: 'BoostStore',
      description: 'Order Payment',
      themeColor: '#4f46e5',
      onSuccess: async (result) => {
        router.push(`/order-success?id=${result.orderId}`);
      },
      onFailure: (err) => {
        alert(`Payment failed: ${err.message}`);
      },
    });
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button disabled={isProcessing} onClick={() => handlePay('cashfree')}>
        Pay Online (UPI / Card)
      </button>
      <button disabled={isProcessing} onClick={() => handlePay('cod')}>
        Cash on Delivery
      </button>
    </div>
  );
}
```

---

### Step 4: Next.js Universal Webhook Handler (`app/api/webhooks/[gateway]/route.ts`)

Verify webhook signatures in 2 lines with standard normalized events:

```typescript
import { payments } from '@/lib/payments';

export async function POST(
  req: Request,
  { params }: { params: { gateway: string } }
) {
  const result = await payments.verifyNextJsWebhook(req, {
    gateway: params.gateway as any,
  });

  if (!result.isValid) {
    return new Response('Invalid Signature', { status: 400 });
  }

  // Handle standardized events across all payment gateways!
  switch (result.normalizedEvent) {
    case 'PAYMENT_SUCCESS':
      console.log(`✅ Order ${result.orderId} paid! Amount: ₹${result.amount}`);
      // TODO: Update Order status to 'PAID' in database
      break;

    case 'PAYMENT_FAILED':
      console.log(`❌ Order ${result.orderId} failed.`);
      break;

    case 'REFUND_PROCESSED':
      console.log(`🔄 Refund completed for ${result.paymentId}`);
      break;
  }

  return new Response('OK');
}
```

---

## 🛠️ CLI Utilities

Test and configure payment credentials quickly:

```bash
# List supported gateways and their status
npx @boostengine/payments list

# Generate .env.payments template
npx @boostengine/payments init-env
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
