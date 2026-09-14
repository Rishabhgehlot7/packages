# @boostengine/recommendations 🎯

[![npm version](https://img.shields.io/npm/v/@boostengine/recommendations.svg?color=blue)](https://www.npmjs.com/package/@boostengine/recommendations)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/recommendations.svg?color=green)](https://www.npmjs.com/package/@boostengine/recommendations)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tree Shakable](https://img.shields.io/badge/Tree--Shakable-Yes-success.svg)](https://bundlephobia.com)

> **Amazon & Flipkart-style Frequently Bought Together (FBT) bundles, Cross-Sell, and Upsell recommendation engine for Next.js, Vite, React, and Node.js.**

Skyrocket your Average Order Value (AOV) by intelligently recommending complementary accessories and 1-click combo bundles directly on Product Detail Pages (PDP) and Cart Drawers.

---

## 🌟 Key Features

- 🛍️ **Frequently Bought Together (FBT)**: Generates 2-3 product combo packages with automatic bundle discounts (*"Buy all 3 for ₹2,499 - Save ₹300"*).
- 🔄 **Smart Cross-Sell Scoring**: Recommends accessories and matching items based on categories, tags, price affinity, and customer ratings.
- 📈 **Upsell Recommender**: Recommends higher-tier or premium alternatives within a realistic price delta (+15% to +40%).
- ⚡ **Universal Framework Support**: Works seamlessly in Next.js (Server Components & Client Components), Vite, Express, and React Native.

---

## 📐 Frequently Bought Together UI Preview

```text
┌──────────────────────────────────────────────────────────────┐
│  FREQUENTLY BOUGHT TOGETHER                                  │
├──────────────────────────────────────────────────────────────┤
│  [Main Tee]    +   [Denim Shorts]    +   [Street Cap]        │
│    ₹999                 ₹1,499               ₹499            │
│                                                              │
│  Total Price: ₹2,997                                         │
│  Bundle Price: ₹2,697 (10% OFF • Save ₹300)                  │
│                                                              │
│  [ ADD ALL 3 TO BAG ]                                        │
└──────────────────────────────────────────────────────────────┘
```

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

## ⚡ 60-Second Quickstart

```typescript
import { RecommendationsEngine } from '@boostengine/recommendations';

const mainProduct = {
  id: 'p_hoodie',
  title: 'Vintage Acid Wash Hoodie',
  price: 1999,
  category: 'Hoodies',
  tags: ['streetwear', 'winter', 'oversized']
};

const catalog = [
  { id: 'p_tee', title: 'Heavyweight Inner Tee', price: 699, category: 'Tees', tags: ['streetwear', 'oversized'], rating: 4.8 },
  { id: 'p_cap', title: 'Washed Cotton Cap', price: 499, category: 'Accessories', tags: ['streetwear'], rating: 4.5 },
  { id: 'p_sofa', title: 'Living Room Sofa', price: 18000, category: 'Furniture' }, // Unrelated
];

// 1. Generate Frequently Bought Together Bundle with 10% Bundle Discount
const bundle = RecommendationsEngine.getFrequentlyBoughtTogether(mainProduct, catalog, {
  maxItems: 2,
  discountPercentage: 10,
});

console.log(bundle.bundlePrice);       // ₹2,878 (Combined discounted price)
console.log(bundle.savingsAmount);     // ₹319 Saved
console.log(bundle.bundleItems.length); // 2 Recommended items

// 2. Get Related Cross-Sell Products for Cart Drawer
const crossSells = RecommendationsEngine.getCrossSells(mainProduct, catalog, 3);
console.log(crossSells.map(p => p.title));
```

---

## 🚀 Framework Integration Examples

### A. Next.js App Router (PDP Server Component)

In `app/products/[id]/page.tsx`:

```tsx
import { RecommendationsEngine } from '@boostengine/recommendations';
import { getProduct, getAllProducts } from '@/lib/products';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  const catalog = await getAllProducts();

  const bundle = RecommendationsEngine.getFrequentlyBoughtTogether(product, catalog, {
    discountPercentage: 12
  });

  return (
    <div>
      {/* Product Details */}
      <h1>{product.title}</h1>

      {/* Frequently Bought Together Widget */}
      <section className="mt-12 border p-6 rounded-3xl bg-gray-50">
        <h2 className="text-xl font-bold">Frequently Bought Together</h2>
        <div className="flex gap-4 my-4">
          {bundle.allProducts.map(item => (
            <div key={item.id} className="text-center">
              <img src={item.imageUrl} alt={item.title} className="w-24 h-24 rounded-xl object-cover" />
              <p className="font-bold text-sm">₹{item.price}</p>
            </div>
          ))}
        </div>
        <p className="text-lg font-black">
          Bundle Price: ₹{bundle.bundlePrice}{' '}
          <span className="text-emerald-600 font-bold text-sm">(Save ₹{bundle.savingsAmount})</span>
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold mt-2">
          Add All {bundle.allProducts.length} to Cart
        </button>
      </section>
    </div>
  );
}
```

### B. Vite + React (Cart Drawer Cross-Sell Carousel)

```tsx
import React from 'react';
import { RecommendationsEngine } from '@boostengine/recommendations';

export function CartUpsellSection({ cartItems, catalog, onAddToCart }) {
  if (!cartItems.length) return null;

  const crossSells = RecommendationsEngine.getCrossSells(cartItems[0], catalog, 2);

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Complete the Look</h4>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {crossSells.map((prod) => (
          <div key={prod.id} className="border p-2 rounded-xl flex flex-col justify-between">
            <span className="text-xs font-semibold truncate">{prod.title}</span>
            <span className="text-xs font-bold mt-1">₹{prod.price}</span>
            <button
              onClick={() => onAddToCart(prod)}
              className="mt-2 text-xs bg-gray-100 hover:bg-black hover:text-white py-1 rounded-lg font-bold"
            >
              + Quick Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📖 API Reference

### `RecommendationsEngine.getFrequentlyBoughtTogether(mainProduct, catalog, options?): FrequentlyBoughtTogetherBundle`
Combines the target product with the most complementary accessories and applies a bundle discount.
- **Options:** `{ maxItems?: number, discountPercentage?: number }`
- **Returns:** `{ mainProduct, bundleItems, allProducts, totalRegularPrice, bundleDiscountPercentage, bundlePrice, savingsAmount }`

### `RecommendationsEngine.getCrossSells(product, catalog, limit?: number): ProductRecommendationItem[]`
Ranks and returns the best matching products from the catalog.

### `RecommendationsEngine.getUpsells(product, catalog, limit?: number): ProductRecommendationItem[]`
Finds higher-tier alternatives with richer specs and premium price tier.

---

## 📄 License

MIT © [Boost Engine Team](https://github.com/boostengine)
