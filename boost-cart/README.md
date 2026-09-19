# @boostengine/cart 🛒

[![npm version](https://img.shields.io/npm/v/@boostengine/cart.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/cart)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/cart.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/cart)
[![license](https://img.shields.io/npm/l/@boostengine/cart.svg?style=flat-square)](https://github.com/Rishabhgehlot7/packages/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Universal](https://img.shields.io/badge/Runs%20On-Node%20%7C%20Browser%20%7C%20Edge-success.svg?style=flat-square)](https://nodejs.org/)

> **Lightweight, deterministic eCommerce cart engine with compliant Indian GST (CGST, SGST, IGST), real-time Free Shipping progress meter, prepaid discounts, and coupon savings breakdown.**

Zero external dependencies. Runs seamlessly on Node.js, Next.js (Server & Client), React, Vite, React Native, and Cloudflare Workers.

---

## 📸 Visual Calculation Architecture

```text
  [ Customer Adds Items ]
            │
            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                    @boostengine/cart                        │
 ├─────────────────────────────────────────────────────────────┤
 │ 1. Compute Base Subtotal & MRP Savings                      │
 │ 2. Destination vs Origin Check                              │
 │    ├─ Intra-State (e.g. MH -> MH) ──► Split CGST (9%) + SGST│
 │    └─ Inter-State (e.g. MH -> KA) ──► Full IGST (18%)       │
 │ 3. Free Shipping Threshold Check                            │
 │    └─ Subtotal >= ₹999 ? Free (₹0) : Flat Rate (₹79)        │
 │ 4. Deduct Coupon Discounts & Add COD / Prepaid Surcharges   │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                      Order Summary                          │
 ├─────────────────────────────────────────────────────────────┤
 │ Total MRP:               ₹1,999                             │
 │ Product Discount:       -  ₹500                             │
 │ Coupon (SAVE10):        -  ₹150                             │
 │ Subtotal:                ₹1,349                             │
 │ Estimated GST (18%):     Inclusive [₹205.78 IGST]           │
 │ Shipping Fee:            FREE (Unlocked > ₹999!)            │
 ├─────────────────────────────────────────────────────────────┤
 │ FINAL PAYABLE AMOUNT:    ₹1,199                             │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

- **🇮🇳 100% Compliant Indian GST Engine**: Automatically detects intra-state (50/50 CGST + SGST split) vs inter-state (100% IGST) based on two-letter state codes (`MH`, `DL`, `KA`, `TN`, etc.). Supports both tax-inclusive and tax-exclusive pricing models.
- **🚚 Free Shipping Progress**: Returns remaining amount needed (e.g. *"Add ₹250 more for Free Delivery"*) and a 0-100 percentage for animated progress bars.
- **💰 Complete Savings Breakdown**: Computes MRP savings, coupon discounts, and prepaid online payment savings so customers clearly see what they saved.
- **💳 Payment Surcharges**: Automatic handling of Cash-on-Delivery (COD) convenience fees or prepaid 5% instant cashback discounts.
- **💾 State Persistence**: Built-in `.toJSON()` and `.fromJSON()` for 1-line syncing with browser `localStorage`, session cookies, or backend databases.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/cart

# pnpm
pnpm add @boostengine/cart

# yarn
yarn add @boostengine/cart
```

---

## 🚀 Quickstart (3 Simple Steps)

### Step 1: Create your cart instance
```typescript
import { createBoostCart } from '@boostengine/cart';

const cart = createBoostCart({
  // Store warehouse location
  origin: { state: 'Maharashtra', taxMode: 'inclusive' },
  
  // Customer delivery destination
  destination: { state: 'Karnataka' },
  
  // Shipping rule: Free delivery for orders above ₹999, else ₹79
  shipping: { freeShippingThreshold: 999, flatShippingRate: 79 },
  
  // Payment rules
  payment: { paymentMethod: 'cod', codFee: 49 },
});
```

### Step 2: Add or update items
```typescript
cart.addItem({
  productId: 'hoodie_01',
  variantId: 'L_Black',
  title: 'Cyberpunk Heavyweight Hoodie',
  price: 1499,
  compareAtPrice: 2499, // Original MRP
  quantity: 1,
  taxRate: 18,          // 18% GST
  hsnCode: '6109',
});
```

### Step 3: Get instant totals & summary
```typescript
const summary = cart.getSummary();

console.log(summary.subtotal);              // 1499
console.log(summary.totalSavings);          // 1000 (Saved from MRP!)
console.log(summary.freeShipping.isFree);   // true (1499 >= 999)
console.log(summary.shippingFee);           // 0
console.log(summary.gst.taxType);           // "INTER_STATE" (IGST)
console.log(summary.gst.igst);              // 228.66
console.log(summary.finalTotal);            // 1548 (1499 + 49 COD Fee)
```

---

## ⚛️ React & Next.js Integration Example

Sync effortlessly with React state or `localStorage`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { createBoostCart, type BoostCart } from '@boostengine/cart';

export function useCart() {
  const [cart, setCart] = useState<BoostCart | null>(null);

  useEffect(() => {
    // 1. Initialize from localStorage if saved
    const saved = localStorage.getItem('boost_cart');
    const instance = createBoostCart({
      origin: { state: 'Maharashtra', taxMode: 'inclusive' },
      shipping: { freeShippingThreshold: 999, flatShippingRate: 79 },
    });

    if (saved) {
      instance.fromJSON(JSON.parse(saved));
    }
    setCart(instance);
  }, []);

  const addItem = (item: any) => {
    if (!cart) return;
    cart.addItem(item);
    localStorage.setItem('boost_cart', JSON.stringify(cart.toJSON()));
    setCart(Object.assign(Object.create(Object.getPrototypeOf(cart)), cart)); // trigger re-render
  };

  return { cart, summary: cart?.getSummary(), addItem };
}
```

---

## 📖 API Reference

### Methods on `BoostCart`

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `addItem(item)` | `CartItem` | `void` | Adds an item or increments quantity if item already exists. |
| `updateQuantity(id, qty)` | `string, number` | `void` | Updates item quantity. Removes item if quantity is 0. |
| `removeItem(id)` | `string` | `void` | Removes item from cart. |
| `applyDiscount(discount)`| `{ code, amount }` | `void` | Applies a fixed coupon or promotional discount. |
| `setDestination(dest)` | `{ state, pincode }` | `void` | Updates destination state to re-evaluate IGST vs CGST/SGST. |
| `setPaymentConfig(config)`| `PaymentConfig` | `void` | Switches between COD and prepaid modes. |
| `getSummary()` | *none* | `CartSummary` | Returns complete breakdown of subtotal, tax, discounts, and final total. |
| `toJSON()` | *none* | `string` | Serializes state for caching in LocalStorage or Redis. |
| `fromJSON(data)` | `object` | `void` | Restores cart state from serialized object. |

---

## 🛠️ Interactive CLI Simulation

Test cart calculations directly in your terminal:

```bash
npx @boostengine/cart demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
