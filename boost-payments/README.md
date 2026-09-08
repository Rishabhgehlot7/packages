# @boostengine/payments

> **Unified Multi-Gateway Payment Orchestration Layer** for Indian & Global eCommerce. Seamlessly integrate **Razorpay, Cashfree, PhonePe, Paytm, Stripe, and Cash On Delivery (COD)** through a single unified API with smart routing, automatic fallbacks, Next.js App Router webhook helpers, and React checkout hooks.

---

## ⚡ Key Highlights

- 🔌 **Universal Checkout API**: Pass standard amounts (e.g. `1499.00`). Subunits (paise/cents) are normalized internally!
- 🛡️ **High-Availability Fallback**: If your primary gateway is down or bank servers timeout, automatically failover to your secondary gateway!
- 💱 **Smart Currency Routing**: Automatically route USD/EUR to Stripe and INR to Cashfree/Razorpay/PhonePe.
- ⚡ **Next.js App Router Native**: 2-line webhook verification with `payments.verifyNextJsWebhook(req, { gateway: 'razorpay' })`.
- 🏷️ **Normalized Webhook Events**: Standardized events like `'PAYMENT_SUCCESS'`, `'PAYMENT_FAILED'`, `'REFUND_PROCESSED'`.
- ⚛️ **Client Checkout Hook**: `useBoostPayment()` hook to open Razorpay modals or Cashfree dropin with automatic SDK loading!
- 🪶 **Zero Dependency Bloat**: Uses native Node.js `fetch` and `crypto`. No 10 heavy third-party vendor SDKs.

---

## 📦 Installation

```bash
npm install @boostengine/payments
```

---

## 🚀 1. Server-Side Setup (`lib/payments.ts`)

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
      extraFee: 49, // Rs. 49 COD handling charge
    },
  },

  // Smart Routing & Resilience
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

## 💳 2. Unified Order Creation (Server Route)

Always pass standard human currency units (e.g. `1499.00`). Package handles paise/cents conversions automatically:

```typescript
// Next.js Route Handler / Express
export async function POST(req: Request) {
  const { amount, customer, chosenGateway } = await req.json();

  const order = await payments.createOrder({
    amount: 1499.00, // Always in standard currency (e.g. Rs. 1499.00)
    currency: 'INR',
    receipt: `order_${Date.now()}`,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
    gateway: chosenGateway, // or let smartRouting decide
  });

  return Response.json(order);
}
```

---

## 🔥 3. Next.js App Router Webhook (`app/api/webhooks/[gateway]/route.ts`)

No manual stream parsing or signature math required:

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

  // Use standardized normalized events across all gateways!
  switch (result.normalizedEvent) {
    case 'PAYMENT_SUCCESS':
      console.log(`✅ Order ${result.orderId} paid successfully! Amount: ${result.amount}`);
      // Update database: Order status -> PAID
      break;

    case 'PAYMENT_FAILED':
      console.log(`❌ Order ${result.orderId} failed.`);
      break;

    case 'REFUND_PROCESSED':
      console.log(`🔄 Refund processed for payment ${result.paymentId}`);
      break;
  }

  return new Response('OK');
}
```

---

## ⚛️ 4. Frontend Checkout Hook (`useBoostPayment`)

Automatically detects gateway, dynamically loads required vendor script, and triggers modals or redirects:

```tsx
'use client';

import { useBoostPayment } from '@boostengine/payments/react';
import { useRouter } from 'next/navigation';

export default function CheckoutButton({ cartTotal, customer }) {
  const router = useRouter();
  const { openPaymentModal, isProcessing } = useBoostPayment();

  const handleCheckout = async (gateway: 'razorpay' | 'cashfree' | 'phonepe' | 'cod') => {
    // 1. Call your server API to create order
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({ amount: cartTotal, customer, chosenGateway: gateway }),
    });
    const order = await res.json();

    // 2. Open checkout modal / redirect automatically
    openPaymentModal({
      order,
      name: 'Boost Engine Store',
      description: 'Order Checkout',
      themeColor: '#4f46e5',
      onSuccess: async (response) => {
        // Automatically called when Razorpay modal succeeds or COD is chosen
        router.push(`/order-confirmed?id=${response.orderId}`);
      },
      onFailure: (err) => {
        alert(err.message);
      },
    });
  };

  return (
    <div className="flex gap-2">
      <button disabled={isProcessing} onClick={() => handleCheckout('razorpay')}>
        Pay with Razorpay
      </button>
      <button disabled={isProcessing} onClick={() => handleCheckout('cashfree')}>
        Pay with Cashfree
      </button>
      <button disabled={isProcessing} onClick={() => handleCheckout('cod')}>
        Cash On Delivery
      </button>
    </div>
  );
}
```

---

## 🛡️ 5. High-Availability Fallback Checkout

If your primary payment gateway experiences bank server outages or 500 errors, automatic fallback routes the order through the next available gateway:

```typescript
const order = await payments.createOrderWithFallback({
  amount: 1499.00,
  currency: 'INR',
  receipt: `order_${Date.now()}`,
  customer: {
    name: 'Aman Sharma',
    email: 'aman@example.com',
    phone: '9876543210',
  },
  fallbackChain: ['razorpay', 'cashfree', 'phonepe'],
});
```

---

## 🧰 Explicit TypeScript Type Exports

```typescript
import type {
  PaymentOrderResult,
  VerificationResult,
  RefundResult,
  WebhookResult,
  SupportedGateway,
  NormalizedWebhookEvent,
  CreateOrderOptions,
  BoostPaymentOpenOptions,
} from '@boostengine/payments';
```

---

## 🛠️ CLI Tool

```bash
# List all 6 supported gateways
npx @boostengine/payments list

# Generate .env.payments.example template
npx @boostengine/payments init-env

# Compute quick SHA-256 hash
npx @boostengine/payments hash "my_test_payload"
```

---

## 📄 License
MIT © Boost Engine Team
