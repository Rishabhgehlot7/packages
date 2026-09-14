# @boostengine/core ⚡

[![npm version](https://img.shields.io/npm/v/@boostengine/core.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/core)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/core.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/core)
[![license](https://img.shields.io/npm/l/@boostengine/core.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Plugin Architecture](https://img.shields.io/badge/Architecture-WordPress%2FShopify%20Hooks-violet.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Modular plugin runtime and event hook architecture for Next.js, React, and Node.js eCommerce stores. Enables hot-swappable micro-plugins, actions, and filters without touching core checkout or page templates.**

---

## 📸 Core Event Bus & Plugin Architecture

```text
                     [ Storefront Action / Checkout Event ]
                                       │
                                       ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      @boostengine/core                              │
    ├─────────────────────────────────────────────────────────────────────┤
    │ Event Bus & Action Dispatcher:                                      │
    │   boostCore.notifyOrderCreated(order)                               │
    └──────────────────┬─────────────────┬──────────────────┬─────────────┘
                       │                 │                  │
        ┌──────────────▼──────┐   ┌──────▼────────┐   ┌─────▼──────────┐
        │ WhatsApp Alert      │   │ Loyalty Engine│   │ Inventory Sync │
        │ Plugin              │   │ Plugin        │   │ Plugin         │
        ├─────────────────────┤   ├───────────────┤   ├────────────────┤
        │ Sends instant order │   │ Awards points │   │ Decrements SKU │
        │ receipt to customer │   │ to user wallet│   │ stock in DB    │
        └─────────────────────┘   └───────────────┘   └────────────────┘
```

---

## 🌟 Key Features

- **🪝 WordPress & Shopify-style Hooks**: `addAction`, `doAction`, `addFilter`, and `applyFilters` to alter prices, shipping rates, or order payloads on the fly.
- **🔌 Hot-Swappable Plugins**: Enable or disable packages (`@boostengine/loyalty`, `@boostengine/notifications`, `@boostengine/deals`) with runtime toggles.
- **⚡ Lifecycle Event Listeners**: Native events for `onInit`, `onActivate`, `onOrderCreated`, `onProductViewed`, and `onCartUpdated`.
- **⚙️ Dynamic Settings Injection**: Inject administrative settings into plugins without rebuilding code.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/core

# pnpm
pnpm add @boostengine/core

# yarn
yarn add @boostengine/core
```

---

## 🚀 Quickstart Guide

### 1. Creating a Custom Plugin

```typescript
import { BoostPlugin, boostCore, BOOST_HOOKS } from '@boostengine/core';

// Define your custom plugin
export const WhatsAppAlertsPlugin: BoostPlugin = {
  id: 'boost-whatsapp-alerts',
  name: 'WhatsApp Order Updates',
  version: '1.0.0',
  description: 'Sends instant WhatsApp notification when an order is completed.',
  category: 'sales',
  defaultSettings: {
    supportNumber: '+919876543210',
  },

  async onInit(context) {
    console.log('WhatsApp Plugin Initialized with settings:', context.config);
  },

  async onOrderCreated(order, context) {
    console.log(`Sending WhatsApp receipt to ${order.customer.phone} for Order #${order.orderNumber}`);
  },
};

// Register your plugin
boostCore.register(WhatsAppAlertsPlugin);
```

---

### 2. Modifying Values with Filters

Filters allow plugins to modify data before it is rendered or stored:

```typescript
import { boostCore, BOOST_HOOKS } from '@boostengine/core';

// Intercept & Modify shipping rates dynamically
boostCore.hooks.addFilter(BOOST_HOOKS.FILTER_SHIPPING_RATES, async (rates, cart) => {
  // If order is above ₹999, offer free shipping
  if (cart.subtotal >= 999) {
    return [{ courier: 'Free Express Delivery', price: 0, estimatedDays: '2 Days' }];
  }
  return rates;
});

// Execute the filter in your checkout flow
const finalRates = await boostCore.hooks.applyFilters(
  BOOST_HOOKS.FILTER_SHIPPING_RATES,
  defaultRates,
  currentCart
);
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
