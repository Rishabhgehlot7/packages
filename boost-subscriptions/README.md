# @boostengine/subscriptions

Enterprise Subscribe & Save, Recurring Billing, Auto-Delivery Scheduling, and Customer Self-Serve Portal Engine for the BoostEngine ecosystem.

---

## 🌟 Key Features

- **Subscribe & Save Engine**: Configurable discount rules (percentage/fixed) with multi-tiered loyalty upgrades (e.g. 15% off base, 20% off after 3 orders).
- **Flexible Auto-Delivery Frequencies**: Daily, weekly, biweekly, monthly, bimonthly, quarterly, yearly, or custom day intervals.
- **Customer Self-Serve Portal**: Instant pause, resume, skip next delivery, swap product, update quantity, frequency, or shipping address.
- **Automated Billing Pipeline**: Recurring charge simulation, failure handling, retry logic, and order history tracking.
- **Subscription Analytics & MRR**: Real-time calculation of MRR, ARR, AOV, churn rate, and active subscribers.
- **React Hooks**: `useSubscriptionManager()` for client/admin portals, `useSubscribeAndSave()` for PDP widget pricing.
- **AI Agent Tools**: Native function calling tools for customer support bots to manage subscriptions, answer questions, and adjust schedules.
- **Universal CLI**: `boost-subscriptions` for simulation, diagnostics, and interactive demos.

---

## 📦 Installation

```bash
npm install @boostengine/subscriptions
```

---

## 🚀 Quick Start

### 1. Backend / Node.js Usage

```typescript
import { SubscriptionEngine } from '@boostengine/subscriptions';

const engine = new SubscriptionEngine();

// Create a subscription
const subscription = engine.createSubscription({
  customerId: 'cust_101',
  customerEmail: 'alex@example.com',
  customerName: 'Alex Mercer',
  plan: {
    id: 'plan_monthly',
    name: 'Deliver Monthly (Save 15%)',
    frequency: 'monthly',
    discount: { type: 'percentage', value: 15 },
    freeShipping: true
  },
  items: [
    {
      productId: 'prod_coffee',
      title: 'Espresso Roast Beans 1kg',
      unitPrice: 1200,
      quantity: 1,
      discountedPrice: 1020
    }
  ],
  shippingAddress: { ... },
  paymentMethod: {
    gateway: 'razorpay',
    customerId: 'cust_101',
    paymentMethodToken: 'mandate_token_xyz'
  }
});
```

### 2. React Storefront & PDP Hook

```tsx
import { useSubscribeAndSave } from '@boostengine/subscriptions/react';

function ProductSubscriptionWidget({ product }) {
  const {
    purchaseType,
    setPurchaseType,
    selectedPlan,
    setSelectedPlanId,
    currentPrice,
    savingsPercent
  } = useSubscribeAndSave({
    productUnitPrice: product.price,
    plans: product.subscriptionPlans
  });

  return (
    <div className="subscription-box">
      <label>
        <input
          type="radio"
          checked={purchaseType === 'one_time'}
          onChange={() => setPurchaseType('one_time')}
        />
        One-time purchase: ₹{product.price}
      </label>

      <label>
        <input
          type="radio"
          checked={purchaseType === 'subscribe'}
          onChange={() => setPurchaseType('subscribe')}
        />
        Subscribe & Save {savingsPercent}%: ₹{currentPrice}
      </label>
    </div>
  );
}
```

---

## 🛠️ CLI Usage

```bash
npx boost-subscriptions demo
```

---

## 📄 License

MIT © BoostEngine Team
