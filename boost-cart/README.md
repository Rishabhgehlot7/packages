# @boostengine/cart 🛒

[![npm version](https://img.shields.io/npm/v/@boostengine/cart.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/cart)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/cart.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/cart)
[![license](https://img.shields.io/npm/l/@boostengine/cart.svg?style=flat-square)](https://github.com/Rishabhgehlot7/packages/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Frameworks](https://img.shields.io/badge/Next.js%20%7C%20React%20%7C%20React%20Native%20%7C%20Vue%20%7C%20Node-Universal-success.svg?style=flat-square)](https://nodejs.org/)

> **The Universal, Zero-Bloat eCommerce Cart & Checkout Engine for India & Global D2C Brands.**  
> Built for Next.js (App Router), React, React Native (Expo), Vite, Vue, Svelte, and Node.js. 100% compliant Indian GST (CGST/SGST/IGST), cross-tab realtime sync, BOGO & Tiered discounts, gift wrap/custom fees, abandoned cart recovery, and AI-agent introspection.

---

## ⚡ Feature Matrix

| Feature | Generic Libraries (`use-shopping-cart`) | Monolithic Platforms (Shopify / Medusa) | **@boostengine/cart** |
|---|:---:|:---:|:---:|
| **Bundle Size** | ~40 KB (Stripe-heavy) | Hundreds of KB / Monolith | **~5 KB Zero Dependencies** |
| **Indian GST Math** | ❌ None | Buggy external apps | **✅ Native CGST + SGST + IGST + HSN** |
| **Framework Freedom** | React only | Liquid / Platform lock-in | **✅ Next.js, React, React Native, Vue, Node** |
| **Cross-Tab Realtime Sync** | ❌ None | Complex WebSockets | **✅ Automatic via `LocalStorageAdapter`** |
| **Free Delivery Meter** | ❌ Manual UI code | Hard to customize | **✅ Dynamic progress + celebratory copy** |
| **BOGO & Tiered Offers** | ❌ Custom math | Expensive apps | **✅ Built-in BOGO & Volume tiers** |
| **Custom Fees (Gift Wrap)** | ❌ None | Extra plugins | **✅ Built-in `cart.addFee(...)`** |
| **Abandoned Cart Recovery**| ❌ None | Heavy analytics SDKs | **✅ Built-in `cart.getRecoveryPayload()`** |
| **AI Agent Friendly** | Ambiguous | Poor introspection | **✅ Built-in `CartAgentToolkit`** |

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

## 🚀 30-Second Quickstart

```typescript
import { createBoostCart, createLocalStorageAdapter } from '@boostengine/cart';

// 1. Initialize cart with Cross-Tab LocalStorage sync & Indian store origin
const cart = createBoostCart({
  origin: { state: 'Maharashtra', taxMode: 'inclusive' },
  shipping: { freeShippingThreshold: 999, flatShippingRate: 79 },
  payment: { paymentMethod: 'prepaid', codFee: 49, prepaidDiscountPercentage: 5 },
  storage: createLocalStorageAdapter(), // Safe in browser & SSR!
});

// 2. Add an item
cart.addItem({
  productId: 'prod_tee',
  title: 'Oversized Streetwear Tee',
  price: 799,
  compareAtPrice: 1299,
  quantity: 1,
  taxRate: 18,
  hsnCode: '6109',
});

// 3. Get complete checkout summary
const summary = cart.getSummary();

console.log(summary.formatted.subtotal);   // "₹799.00"
console.log(summary.freeShipping.message);  // "🚚 Add ₹200.00 more to unlock FREE Delivery!"
console.log(summary.gst.cgst);              // ₹60.94 (Intra-state CGST)
console.log(summary.gst.sgst);              // ₹60.94 (Intra-state SGST)
console.log(summary.formatted.finalTotal); // "₹838.05"
```

---

## 🌐 Universal Framework Guides

### 1. Next.js 14 / 15 (App Router & SSR Safe)

Import directly from `@boostengine/cart/react` without dragging React into your Node.js backend:

```tsx
// lib/cart.ts
import { createBoostCart, createLocalStorageAdapter } from '@boostengine/cart';

export const cart = createBoostCart({
  origin: { state: 'Maharashtra' },
  storage: createLocalStorageAdapter(), // Cross-tab sync enabled by default!
});

// components/CartDrawer.tsx
'use client';
import { useBoostCart } from '@boostengine/cart/react';
import { cart } from '@/lib/cart';

export function CartDrawer() {
  const { items, formatted, freeShipping, customFees, updateQuantity, removeItem } = useBoostCart(cart);

  return (
    <div className="p-4 bg-white shadow-xl">
      {/* Free Shipping Meter */}
      <div className="p-3 mb-4 rounded bg-amber-50">
        <p className="text-sm font-medium text-amber-900">{freeShipping.message}</p>
        <div className="w-full bg-gray-200 h-2 rounded mt-1 overflow-hidden">
          <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${freeShipping.percentage}%` }} />
        </div>
      </div>

      {/* Cart Items */}
      {items.map((item) => (
        <div key={item.id} className="flex justify-between py-2 border-b">
          <span>{item.title} (x{item.quantity})</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}

      {/* Final Total */}
      <div className="mt-4 font-bold text-lg">
        Payable: {formatted.finalTotal}
      </div>
    </div>
  );
}
```

---

### 2. React Native & Expo (Mobile Apps)

Pass `@react-native-async-storage/async-storage` directly to `createAsyncStorageAdapter`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBoostCart, createAsyncStorageAdapter } from '@boostengine/cart';
import { useBoostCart } from '@boostengine/cart/react';

export const mobileCart = createBoostCart({
  storage: createAsyncStorageAdapter(AsyncStorage, { key: 'my_app_cart' }),
  shipping: { freeShippingThreshold: 999 },
});

// In any React Native Screen:
export function CheckoutScreen() {
  const { formatted, items } = useBoostCart(mobileCart);
  return (
    <View>
      <Text>Total: {formatted.finalTotal}</Text>
    </View>
  );
}
```

---

### 3. Vue 3 & Pinia

`cart.subscribe` seamlessly bridges into Vue's `shallowRef`:

```typescript
import { shallowRef, onUnmounted } from 'vue';
import { createBoostCart } from '@boostengine/cart';

const cart = createBoostCart();

export function useVueCart() {
  const summary = shallowRef(cart.getSummary());
  const unsubscribe = cart.subscribe((val) => {
    summary.value = val;
  });

  onUnmounted(unsubscribe);
  return { summary, cart };
}
```

---

### 4. Svelte & SvelteKit

`BoostCart` implements the official Svelte store contract (`subscribe`):

```svelte
<script>
  import { createBoostCart } from '@boostengine/cart';
  const cart = createBoostCart();
</script>

<!-- Auto-subscribes with Svelte's $ syntax! -->
<h1>Total: {$cart.formatted.finalTotal}</h1>
<p>{$cart.freeShipping.message}</p>
```

---

## 🎯 Advanced Features

### 1. Custom Surcharges & Add-ons (Gift Wrap, Express Delivery)

Add or remove custom convenience fees with 1 line:

```typescript
// Add luxury gift wrapping
cart.addFee({
  id: 'gift_wrap',
  title: 'Luxury Gift Wrap & Handwritten Card',
  amount: 49,
  isTaxable: false,
});

// Add same-day express courier
cart.addFee({
  id: 'express_delivery',
  title: 'Same-Day Express Courier',
  amount: 149,
  isTaxable: true, // Auto-computes GST on courier service
});

console.log(cart.getSummary().formatted.totalCustomFees); // "₹198.00"
```

### 2. BOGO & Tiered Volume Discounts

```typescript
// BOGO: Buy 2 Get 1 Free (Lowest priced item is free)
cart.applyDiscount({
  code: 'BUY2GET1',
  type: 'bogo',
  bogoConfig: { buyQuantity: 2, getQuantity: 1 },
});

// Tiered Volume: Buy 2 get 10%, Buy 3 get 20%
cart.applyDiscount({
  code: 'VOLUMESAVE',
  type: 'tiered',
  tieredRules: [
    { minQuantity: 2, discountPercentage: 10 },
    { minQuantity: 3, discountPercentage: 20 },
  ],
});
```

### 3. Abandoned Cart & WhatsApp Bot Recovery

Track customer funnel step and get pre-formatted payloads for WhatsApp / SMS recovery bots (Wati, Interakt, Klaviyo):

```typescript
cart.setCustomerInfo({
  name: 'Aarav Mehta',
  phone: '9876543210',
  email: 'aarav@gmail.com',
});
cart.setCheckoutStep('address');

// Ready-to-post payload for WhatsApp bot webhook:
const payload = cart.getRecoveryPayload();
console.log(payload);
/*
{
  customer: { name: 'Aarav Mehta', phone: '9876543210', email: 'aarav@gmail.com' },
  checkoutStep: 'address',
  lastModifiedAt: 1726938000000,
  subtotal: 1999,
  finalTotal: 1999,
  itemCount: 1,
  items: [{ title: 'Leather Backpack', quantity: 1, price: 1999 }]
}
*/
```

### 4. Indian GST Breakdown (CGST / SGST / IGST)
`@boostengine/cart` detects destination state vs warehouse origin automatically:

```typescript
// Intra-state (e.g. Maharashtra -> Maharashtra): Split 50/50
cart.setDestination({ state: 'MH' });
const intra = cart.getSummary().gst;
console.log(intra.taxType); // 'INTRA_STATE'
console.log(intra.cgst);    // Half of tax
console.log(intra.sgst);    // Half of tax
console.log(intra.igst);    // 0

// Inter-state (e.g. Maharashtra -> Karnataka): Full IGST
cart.setDestination({ state: 'Karnataka' });
const inter = cart.getSummary().gst;
console.log(inter.taxType); // 'INTER_STATE'
console.log(inter.igst);    // 100% of tax
```

### 5. Guest-to-User Cart Merge

When an anonymous customer logs in at checkout, merge their guest items into their stored account cart with 1 line:

```typescript
guestCart.merge(userSavedCart, { strategy: 'combine' });
```

---

## 🤖 AI Agent & LLM Integration (`CartAgentToolkit`)

Are you building with **Cursor, Gemini, Claude, or autonomous Antigravity agents**?  
`@boostengine/cart` includes built-in introspection tools for AI pair programmers:

```typescript
import { CartAgentToolkit } from '@boostengine/cart';

// Generate human-readable markdown status for agent prompts
const report = CartAgentToolkit.inspect(cart);
console.log(report);
```

---

## 🛠️ Complete API Reference

### `createBoostCart(options?: CartOptions): BoostCart`
- `addItem(item: CartItem): CartItem`
- `updateQuantity(id: string, quantity: number): boolean`
- `removeItem(id: string): boolean`
- `clear(): void`
- `getItems(): CartItem[]`
- `getItem(id: string): CartItem | undefined`
- `hasItem(id: string): boolean`
- `addFee(fee: CustomFee): void`
- `removeFee(id: string): boolean`
- `getFees(): CustomFee[]`
- `clearFees(): void`
- `setCustomerInfo(info: { email?: string; phone?: string; name?: string }): void`
- `setCheckoutStep(step: 'cart' | 'address' | 'payment' | 'completed'): void`
- `getRecoveryPayload(): object`
- `applyDiscount(rule: DiscountRule): DiscountValidationResult`
- `removeDiscount(): void`
- `getSummary(): CartSummary`
- `subscribe(listener: (summary: CartSummary) => void): () => void`
- `on(event: CartEventType, listener: CartEventListener): () => void`
- `merge(source: CartItem[] | { items: CartItem[] }, options?: { strategy: 'combine' | 'replace' }): void`
- `toJSON(): object`
- `fromJSON(data: object): void`
- `destroy(): void`

---

## 📄 License

MIT © [Rishabh Gehlot](https://github.com/Rishabhgehlot7)
