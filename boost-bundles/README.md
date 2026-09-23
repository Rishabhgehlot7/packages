# @boostengine/bundles

> Enterprise product bundles, mix-and-match kits, frequently bought together combos, tiered volume discounts, and autonomous AI bundle optimization for modern commerce.

[![npm version](https://img.shields.io/npm/v/@boostengine/bundles.svg)](https://www.npmjs.com/package/@boostengine/bundles)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Features

- **🛍️ Complete Bundle Architectures**:
  - **Frequently Bought Together (FBT)**: Dynamic cross-sell combos with optional item toggling.
  - **Fixed Price Bundles**: Pre-packaged kits (e.g. 3-pack skincare kit at flat ₹1,499).
  - **Mix-and-Match Custom Boxes**: Let customers build their own box with `minSelectCount` & `maxSelectCount` constraints.
  - **Tiered Volume Discounts**: Quantity ladders (e.g. Buy 2 get 10% off, Buy 3 get 20% off).
- **🧮 Sub-Penny Pricing & Distribution Engine**:
  - Proportional per-line discount allocation for transparent accounting & GST invoices.
  - Automatic savings amount and savings percentage calculation.
- **⚛️ First-Class React Hooks**:
  - `useBundle()`: Interactive bundle selection, item toggle, live recalculation & cart dispatch payload.
  - `useVolumeDiscount()`: Quantity stepper, tier matching & next-tier upsell motivation.
- **🤖 Autonomous AI Agent Tools**:
  - Pre-built LLM function calling schemas for autonomous AI shopping assistants.
- **📦 Seamless @boostengine/cart Integration**:
  - Built-in `transformBundleToCartItem()` helper for instant 1-click cart insertion.

---

## 📦 Installation

```bash
npm install @boostengine/bundles
# or
pnpm add @boostengine/bundles
# or
yarn add @boostengine/bundles
# or
bun add @boostengine/bundles
```

---

## 🚀 Quick Start

### 1. Pure Calculation Engine (Node.js / Server / SSR)

```typescript
import { calculateBundlePrice, BundleDefinition } from '@boostengine/bundles';

const bundle: BundleDefinition = {
  id: 'summer-combo',
  title: 'Summer Essentials 3-Piece Kit',
  type: 'frequently_bought_together',
  discountType: 'percentage',
  discountValue: 20, // 20% OFF
  items: [
    { id: '1', productId: 'p1', title: 'Oversized Tee', price: 999, isRequired: true },
    { id: '2', productId: 'p2', title: 'Chino Shorts', price: 1499, isDefaultSelected: true },
    { id: '3', productId: 'p3', title: 'Retro Sunglasses', price: 799, isDefaultSelected: true },
  ],
};

const result = calculateBundlePrice(bundle);

console.log(result.originalTotal);      // 3297
console.log(result.discountedTotal);    // 2637.6
console.log(result.savingsAmount);      // 659.4
console.log(result.savingsPercentage);  // 20%
```

---

### 2. Interactive React Component (`useBundle`)

```tsx
'use client';

import React from 'react';
import { useBundle } from '@boostengine/bundles/react';

export function FrequentlyBoughtTogether({ bundle }) {
  const {
    selectedIds,
    totalPrice,
    originalTotal,
    savingsAmount,
    savingsPercentage,
    toggleItem,
    getCartPayload,
  } = useBundle({ bundle });

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
      <h3 className="font-bold text-lg">{bundle.title}</h3>

      <div className="space-y-2">
        {bundle.items.map((item) => (
          <label key={item.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              disabled={item.isRequired}
              onChange={() => toggleItem(item.id)}
              className="rounded text-indigo-600"
            />
            <span className="text-sm font-medium">{item.title}</span>
            <span className="text-sm font-bold ml-auto">₹{item.price}</span>
          </label>
        ))}
      </div>

      <div className="pt-4 border-t flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 line-through">₹{originalTotal}</span>
          <div className="text-2xl font-black text-emerald-600">₹{totalPrice}</div>
          <span className="text-xs text-amber-600 font-bold">Save ₹{savingsAmount} ({savingsPercentage}% OFF)</span>
        </div>

        <button
          onClick={() => console.log('Dispatch to cart:', getCartPayload())}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Add Combo to Cart
        </button>
      </div>
    </div>
  );
}
```

---

### 3. Tiered Volume Pricing (`useVolumeDiscount`)

```tsx
'use client';

import React from 'react';
import { useVolumeDiscount } from '@boostengine/bundles/react';

const rules = [
  { minQuantity: 2, discountType: 'percentage', discountValue: 10, label: 'Buy 2, Save 10%' },
  { minQuantity: 3, discountType: 'percentage', discountValue: 20, label: 'Buy 3, Save 20%', isPopular: true },
  { minQuantity: 5, discountType: 'percentage', discountValue: 30, label: 'Buy 5+, Save 30%' },
];

export function VolumePricingWidget({ productId, basePrice }) {
  const {
    quantity,
    increment,
    decrement,
    effectiveUnitPrice,
    discountedSubtotal,
    totalSavings,
    nextTier,
  } = useVolumeDiscount({
    productId,
    baseUnitPrice: basePrice,
    rules,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={decrement} className="p-2 border rounded">-</button>
        <span className="font-bold">{quantity}</span>
        <button onClick={increment} className="p-2 border rounded">+</button>
        <span className="text-lg font-bold">Total: ₹{discountedSubtotal}</span>
      </div>

      {nextTier && (
        <div className="text-xs text-indigo-600 font-semibold bg-indigo-50 p-2 rounded-lg">
          💡 {nextTier.label} (Add {nextTier.neededQuantity} more to save ₹{nextTier.potentialSavings})
        </div>
      )}
    </div>
  );
}
```

---

## 📄 License

MIT © [BoostEngine Team](https://github.com/boostengine)
