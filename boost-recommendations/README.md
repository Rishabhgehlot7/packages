# @boostengine/recommendations 🧠

[![npm version](https://img.shields.io/npm/v/@boostengine/recommendations.svg?color=blue)](https://www.npmjs.com/package/@boostengine/recommendations)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg)](https://react.dev/)

> Enterprise Frequently Bought Together (FBT) Bundles, Real Transaction Collaborative Filtering, Cart Cross-Sells, Smart Upsells, Universal Database Sync, and Autonomous AI Agent Recommendation Tools.

Part of the **BoostEngine** headless ecommerce micro-packages ecosystem.

---

## 🌟 Key Features

- 📦 **Frequently Bought Together (FBT) Bundles**: Generate Amazon & Flipkart-style combo bundles with custom bundle pricing, discount percentages, and savings calculations.
- 🤝 **Transaction Collaborative Filtering**: Mines actual customer order histories into a high-performance in-memory co-occurrence graph for genuine "Customers Who Bought This Also Bought" recommendations.
- 🛒 **Cart Cross-Sells & Impulse Add-ons**: Recommends complementary accessories, protection warranties, and low-ticket items tailored to active cart items while excluding items already in cart.
- ⭐ **Smart Product Upgrades (Upsell)**: Recommends higher-tier, better-spec alternatives in the same category (e.g., 128GB -> 256GB, Standard -> Pro).
- 🎁 **Post-Purchase 1-Click Upsells**: High-converting add-on suggestions for the order confirmation / thank-you page.
- 🔄 **Universal Database Sync**: Ingest product catalogs and historical order logs from MongoDB, PostgreSQL, Supabase, Prisma, DynamoDB, or Firebase.
- ⚛️ **Universal React Suite**: `<RecommendationsProvider>`, `useFrequentlyBoughtTogether()`, `useCartCrossSells()`, `useSimilarProducts()`, `usePersonalizedPicks()`, and `useProductUpgrades()`.
- 🤖 **Autonomous AI Agent Toolkit**: 5 tools ready for OpenAI, Claude, Gemini, and Vercel AI SDK.
- 💻 **Interactive CLI**: Test recommendation bundles directly in your terminal (`npx boost-recommendations demo`).
- 🛡️ **100% Backward Compatible**: Retains all original static methods on `RecommendationsEngine`.

---

## 📦 Installation

```bash
npm install @boostengine/recommendations
# or
yarn add @boostengine/recommendations
# or
pnpm add @boostengine/recommendations
```

---

## 🚀 Quick Start (Node.js / Backend)

```typescript
import { recommendations, RecommendationsEngine } from '@boostengine/recommendations';

// 1. Set Catalog
const catalog = [
  { id: 'phone', title: 'Flagship Smartphone (128GB)', price: 60000, category: 'Electronics', tags: ['mobile'] },
  { id: 'phone_pro', title: 'Flagship Smartphone Pro (512GB)', price: 85000, category: 'Electronics', tags: ['mobile', 'pro'] },
  { id: 'case', title: 'Armor Shockproof Case', price: 999, category: 'Electronics', tags: ['accessory', 'mobile'] },
  { id: 'charger', title: '65W Fast GaN Charger', price: 1499, category: 'Electronics', tags: ['accessory', 'mobile'] },
];

recommendations.setCatalog(catalog);

// 2. Train with Real Historical Order Transactions
recommendations.recordOrders([
  { productIds: ['phone', 'case', 'charger'] },
  { productIds: ['phone', 'case'] }
]);

// 3. Generate Amazon-style Frequently Bought Together Bundle
const bundle = recommendations.getFrequentlyBoughtTogether(catalog[0], catalog, {
  maxItems: 2,
  discountPercentage: 10
});

console.log(bundle);
/*
{
  mainProduct: { id: 'phone', price: 60000, ... },
  bundleItems: [ { id: 'case', price: 999 }, { id: 'charger', price: 1499 } ],
  totalRegularPrice: 62498,
  bundleDiscountPercentage: 10,
  bundlePrice: 56248,
  savingsAmount: 6250
}
*/

// 4. Get Cart Cross-Sells (Cart Drawer / Checkout)
const cartCrossSells = recommendations.getCartCrossSells(
  [{ id: 'phone', category: 'Electronics', price: 60000 }],
  catalog
);
console.log('Impulse cross-sells:', cartCrossSells);

// 5. Get Smart Product Upgrades
const upgrades = recommendations.getUpgrades(catalog[0], catalog);
console.log('Upgrade options:', upgrades);
```

---

## 🤝 Collaborative Filtering ("Customers Also Bought")

Mine actual customer purchase baskets to discover true product relationships:

```typescript
import { recommendations } from '@boostengine/recommendations';

// Record past sales
recommendations.recordOrder(['shoes_running', 'socks_cushioned', 'water_bottle']);
recommendations.recordOrder(['shoes_running', 'socks_cushioned']);

// Query items frequently co-purchased with running shoes
const alsoBought = recommendations.getCustomersAlsoBought('shoes_running');
console.log(alsoBought); // Output: [socks_cushioned, water_bottle]
```

---

## 🔄 Universal Database Sync

Ingest products and historical orders from any database:

```typescript
import { recommendations } from '@boostengine/recommendations';

// MongoDB, PostgreSQL, Prisma, Supabase
const mongoProducts = await db.collection('products').find().toArray();
const mongoOrders = await db.collection('orders').find().limit(5000).toArray();

recommendations.sync(mongoProducts, mongoOrders, {
  catalogMapper: p => ({
    id: p._id.toString(),
    title: p.title,
    price: p.price,
    category: p.category,
    imageUrl: p.images?.[0] || ''
  }),
  orderMapper: o => ({
    productIds: o.items.map(i => i.productId)
  })
});
```

---

## ⚛️ Universal React Suite

Import from `@boostengine/recommendations/react` in Next.js, Vite, React, or React Native:

### 1. App-Wide Provider

```tsx
import { RecommendationsProvider } from '@boostengine/recommendations/react';

export function App({ children, products }) {
  return (
    <RecommendationsProvider initialCatalog={products}>
      {children}
    </RecommendationsProvider>
  );
}
```

### 2. Amazon-style FBT Widget

```tsx
import React from 'react';
import { useFrequentlyBoughtTogether } from '@boostengine/recommendations/react';

export function FrequentlyBoughtTogetherSection({ product }) {
  const bundle = useFrequentlyBoughtTogether(product, undefined, { discountPercentage: 15 });

  return (
    <div className="border p-6 rounded-2xl bg-gray-50">
      <h3 className="font-bold text-xl mb-4">Frequently Bought Together</h3>
      <div className="flex gap-4 items-center">
        <span>{bundle.mainProduct.title}</span>
        {bundle.bundleItems.map(item => (
          <span key={item.id}>+ {item.title}</span>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-gray-500 line-through">Total: ₹{bundle.totalRegularPrice}</p>
        <p className="text-2xl font-bold text-green-700">Bundle Price: ₹{bundle.bundlePrice}</p>
        <p className="text-sm text-green-600 font-semibold">You Save: ₹{bundle.savingsAmount} (15% OFF)</p>

        <button 
          onClick={() => alert(`Add ${bundle.allProducts.length} items to cart!`)}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 font-bold py-2 px-6 rounded-xl"
        >
          Add all {bundle.allProducts.length} to Cart
        </button>
      </div>
    </div>
  );
}
```

### 3. Cart Drawer Impulse Cross-Sells

```tsx
import React from 'react';
import { useCartCrossSells } from '@boostengine/recommendations/react';

export function CartDrawerCrossSells({ cartItems }) {
  const crossSells = useCartCrossSells(cartItems, undefined, { limit: 2 });

  if (crossSells.length === 0) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-bold text-sm text-gray-700">Recommended Add-ons:</h4>
      {crossSells.map(({ item, reason }) => (
        <div key={item.id} className="flex justify-between items-center py-2">
          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-gray-500">₹{item.price} • {reason}</p>
          </div>
          <button className="text-xs bg-black text-white px-3 py-1.5 rounded-lg">+ Add</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🤖 Autonomous AI Agent Toolkit

Equip AI shopping agents and conversational bots with recommendation capabilities:

```typescript
import { RecommendationsAgentToolkit, recommendations } from '@boostengine/recommendations';

const toolkit = new RecommendationsAgentToolkit(recommendations);

// Universal schemas for OpenAI, Claude, Gemini, or Vercel AI SDK
const openAITools = toolkit.toOpenAITools();
const claudeTools = toolkit.toClaudeTools();
const geminiTools = toolkit.toGeminiTools();

// Autonomous execution router
const result = await toolkit.executeTool('get_frequently_bought_together', {
  mainProduct: currentProduct,
  catalog: allProducts,
  discountPercentage: 10
});
```

---

## 💻 CLI Commands

```bash
# Run interactive simulation of FBT Bundles, Cross-Sells & Collaborative Filtering
npx boost-recommendations demo
```

---

## 📄 License

MIT © [BoostEngine Team](https://github.com/boostengine)
