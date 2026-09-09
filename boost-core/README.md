# @boostengine/core

WordPress/Shopify-style modular plugin runtime & event hook architecture for Next.js & React eCommerce stores.

## 🚀 Features

- **WordPress Action & Filter System**: `addAction`, `doAction`, `addFilter`, and `applyFilters`.
- **Plugin Lifecycle Hooks**: `onInit`, `onActivate`, `onDeactivate`, `onOrderCreated`, `onProductViewed`, `onCartUpdated`.
- **Zero-Friction Plugin Toggle**: Hot-activate or deactivate any `@boostengine/*` package without rewriting page templates.
- **Runtime Settings Injection**: Pass and update per-plugin configurations dynamically from the Admin Panel.

---

## 📦 Installation

```bash
npm install @boostengine/core
# or
pnpm add @boostengine/core
```

---

## 🛠️ Usage Example: Writing a BoostEngine Plugin

```typescript
import { BoostPlugin, boostCore, BOOST_HOOKS } from '@boostengine/core';

// 1. Define a Plugin
export const WhatsAppAlertsPlugin: BoostPlugin = {
  id: 'boost-whatsapp-alerts',
  name: 'WhatsApp Order Updates',
  version: '1.0.0',
  description: 'Sends instant WhatsApp receipt upon order completion.',
  category: 'sales',
  defaultSettings: {
    sendTemplate: 'order_confirmed_v1',
    supportNumber: '+919876543210',
  },

  async onInit(context) {
    console.log('WhatsApp Plugin Initialized with config:', context.config);
  },

  async onOrderCreated(order, context) {
    console.log(`Sending WhatsApp alert to ${order.customer.phone} for Order #${order.orderNumber}`);
  },
};

// 2. Register Plugin
boostCore.register(WhatsAppAlertsPlugin);

// 3. Trigger Lifecycle Event
await boostCore.notifyOrderCreated({
  orderNumber: 'BOOST-1001',
  customer: { phone: '+919876543210' },
  total: 2499,
});
```

---

## 🪝 WordPress-Style Filters & Actions

```typescript
import { boostCore, BOOST_HOOKS } from '@boostengine/core';

// Intercept & Modify shipping rates dynamically
boostCore.hooks.addFilter(BOOST_HOOKS.FILTER_SHIPPING_RATES, async (rates, cart) => {
  if (cart.subtotal > 999) {
    return [{ courier: 'Free Express Courier', price: 0, estimatedDays: '2-3 days' }];
  }
  return rates;
});

// Calculate final shipping
const finalRates = await boostCore.hooks.applyFilters(BOOST_HOOKS.FILTER_SHIPPING_RATES, defaultRates, currentCart);
```

---

## 📄 License
MIT © Boost Engine Team
