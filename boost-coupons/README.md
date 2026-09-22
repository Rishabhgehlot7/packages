# @boostengine/coupons 🎟️

[![npm version](https://img.shields.io/npm/v/@boostengine/coupons.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/coupons)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/coupons.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/coupons)
[![license](https://img.shields.io/npm/l/@boostengine/coupons.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Discount Models](https://img.shields.io/badge/7%20Promo%20Models-Flat%20%7C%20Percent%20%7C%20BOGO%20%7C%20Cashback%20%7C%20Referral-emerald.svg?style=flat-square)](https://github.com/boostengine/boostengine)
[![Frameworks](https://img.shields.io/badge/Frameworks-React%20%7C%20Next.js%20%7C%20React%20Native%20%7C%20Vue%20%7C%20Node-orange.svg?style=flat-square)](https://github.com/boostengine/boostengine)
[![AI Agent Ready](https://img.shields.io/badge/AI%20Agents-OpenAI%20%7C%20LangChain%20%7C%20Vercel%20AI-purple.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **The definitive eCommerce discount & promotions engine for modern web and mobile apps. Supports 7 promotion models, multi-coupon stacking, AOV upsell hints, React/React Native hooks, native `@boostengine/cart` bridge, and turnkey AI agent toolkits for autonomous conversational commerce.**

---

## 📸 Architecture & Intelligence Flow

```text
               Customer Cart (Subtotal: ₹1,799)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 ┌─────────────────────────┐           ┌─────────────────────────┐
 │ Auto-Apply Best Coupon  │           │   AOV Upsell Optimizer  │
 ├─────────────────────────┤           ├─────────────────────────┤
 │ • FLAT150   ──► -₹150   │           │ "Add ₹200 more items    │
 │ • SAVE20    ──► -₹359.8 │ ◄─[BEST]  │  to unlock SAVE25 and   │
 │ • PREPAID5  ──► -₹89.95 │           │  save ₹500 instantly!"  │
 └──────────┬──────────────┘           └─────────────────────────┘
            │
            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                     Applied Promo State                     │
 ├─────────────────────────────────────────────────────────────┤
 │ 🎉 Code [SAVE20] applied! You saved ₹359.80!                │
 │ Subtotal: ₹1,799  │  Discount: -₹359.80  │  Final: ₹1,439.20 │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Why @boostengine/coupons?

- **🎟️ 7 Industry Promotion Models**:
  - `FLAT`: Flat rupee discount (e.g. ₹200 off).
  - `PERCENTAGE`: Percentage with optional cap (e.g. 20% off up to ₹500).
  - `BOGO`: Buy X items, get Y items free or discounted.
  - `FREE_SHIPPING`: Waives delivery fees on qualifying carts.
  - `TIERED`: Volume ladders (Spend ₹1,000 get ₹100, spend ₹2,000 get ₹300).
  - `CASHBACK`: Rewards wallet balance credit upon order completion.
  - `REFERRAL`: Commission earnings for the referrer + instant checkout discount for the buyer.
- **📚 Multi-Coupon Stacking**: Combine platform vouchers with payment-mode discounts and free delivery coupons safely.
- **💡 AOV Boost & Upsell Engine**: Motivates shoppers with smart reminders (*"Add ₹150 more to unlock 20% OFF"*).
- **🛒 Native `@boostengine/cart` Bridge**: Pass cart instances directly to `CouponEngine.apply(coupon, cart)`.
- **⚛️ Universal React & React Native Hook**: Plug-and-play `useCoupon()` hook with automatic subtotal recalculation.
- **🤖 Built-in AI Agent Toolkit**: Function schemas ready for OpenAI Function Calling, LangChain, Vercel AI SDK, and Claude agents.
- **🛡️ Enterprise Guardrails**: SKU/category whitelists, minimum quantity checks, payment-mode restrictions, and first-order locks.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/coupons

# pnpm
pnpm add @boostengine/coupons

# yarn
yarn add @boostengine/coupons
```

---

## 🚀 Quickstart: Core Engine

```typescript
import { CouponEngine, type CouponRule } from '@boostengine/coupons';

const coupons: CouponRule[] = [
  {
    code: 'WELCOME200',
    discountType: 'FLAT',
    discountValue: 200,
    minSubtotal: 999,
  },
  {
    code: 'FESTIVE30',
    discountType: 'PERCENTAGE',
    discountValue: 30, // 30% off
    maxDiscount: 500,  // Max ₹500 cap
    minSubtotal: 1499,
  },
  {
    code: 'BOGO_TEE',
    discountType: 'BOGO',
    discountValue: 100, // 100% off second item
    bogoConfig: {
      buyQuantity: 2,
      getQuantity: 1,
      applyOnCheapest: true,
    },
  },
];

// 1. Manually apply a coupon
const result = CouponEngine.apply(coupons[1], {
  items: [{ id: 'prod_1', name: 'Premium Oversized Tee', price: 1699, quantity: 1 }],
  subtotal: 1699,
  shippingFee: 80,
  paymentMode: 'Prepaid',
});

console.log(result.isValid);        // true
console.log(result.discountAmount); // 500 (capped from 509.70)
console.log(result.finalTotal);     // 1279 (1699 - 500 + 80)

// 2. Automatically find and apply the maximum saving coupon
const best = CouponEngine.autoApplyBest(coupons, {
  items: [{ id: 'prod_1', name: 'Premium Oversized Tee', price: 1699, quantity: 1 }],
  subtotal: 1699,
});

console.log(best.bestCoupon?.couponCode); // "FESTIVE30"
console.log(best.bestCoupon?.discountAmount); // 500
```

---

## 💡 AOV Upsell Hints ("Add ₹X more")

Boost Average Order Value by prompting shoppers before they reach discount thresholds:

```typescript
import { CouponEngine } from '@boostengine/coupons';

const cart = {
  items: [{ id: 'prod_1', price: 800, quantity: 1 }],
  subtotal: 800,
};

const upsells = CouponEngine.getUpsellHints(coupons, cart);

upsells.forEach((hint) => {
  console.log(`Add ₹${hint.amountNeeded} more to unlock ${hint.couponCode}!`);
  // Output: "Add ₹199 more to unlock WELCOME200!"
  // Output: "Add ₹699 more to unlock FESTIVE30!"
});
```

---

## 📚 Multi-Coupon Stacking

Allow shoppers to combine non-conflicting vouchers (e.g. Platform discount + Free Delivery):

```typescript
import { CouponEngine, type CouponRule } from '@boostengine/coupons';

const vouchers: CouponRule[] = [
  { code: 'SAVE10', discountType: 'PERCENTAGE', discountValue: 10, isStackable: true },
  { code: 'FREESHIP', discountType: 'FREE_SHIPPING', discountValue: 0, isStackable: true },
];

const stacked = CouponEngine.applyMultiple(vouchers, {
  items: [{ id: 'prod_1', price: 2000, quantity: 1 }],
  subtotal: 2000,
  shippingFee: 100,
});

console.log(stacked.totalDiscount);   // 300 (200 off + 100 shipping waived)
console.log(stacked.appliedCoupons);  // ['SAVE10', 'FREESHIP']
console.log(stacked.finalTotal);      // 1800
```

---

## 🛒 Seamless `@boostengine/cart` Integration

If your project uses [`@boostengine/cart`](https://www.npmjs.com/package/@boostengine/cart), pass your cart directly to `CouponEngine`:

```typescript
import { CartEngine } from '@boostengine/cart';
import { CouponEngine } from '@boostengine/coupons';

const cart = new CartEngine();
cart.addItem({ id: 'item_1', name: 'Hoodie', price: 1500, quantity: 1 });

// Directly pass cart instance!
const evaluation = CouponEngine.apply(festiveCoupon, cart);
console.log(evaluation.finalTotal);
```

---

## ⚛️ React & React Native (`@boostengine/coupons/react`)

Drop-in hook for Next.js, Vite React, and React Native (Expo):

```tsx
import React, { useState } from 'react';
import { useCoupon } from '@boostengine/coupons/react';

export function CheckoutCouponBox({ cartSubtotal, shippingFee }: { cartSubtotal: number; shippingFee: number }) {
  const [inputCode, setInputCode] = useState('');

  const {
    appliedCoupon,
    discountAmount,
    finalTotal,
    cashbackEarned,
    errorMessage,
    applyCode,
    removeCoupon,
  } = useCoupon({
    availableCoupons: [
      { code: 'SAVE20', discountType: 'PERCENTAGE', discountValue: 20, minSubtotal: 1000 },
      { code: 'CASHBACK50', discountType: 'CASHBACK', discountValue: 50 },
    ],
    cart: {
      subtotal: cartSubtotal,
      shippingFee,
    },
  });

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      {appliedCoupon ? (
        <div className="flex items-center justify-between text-green-600">
          <div>
            <span className="font-bold">🎉 {appliedCoupon.couponCode} applied!</span>
            <p className="text-sm">Discount: -₹{discountAmount}</p>
            {cashbackEarned > 0 && <p className="text-xs text-amber-600">Wallet Cashback: +₹{cashbackEarned}</p>}
          </div>
          <button onClick={removeCoupon} className="text-red-500 text-sm underline">Remove</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            className="border p-2 rounded flex-1 uppercase"
          />
          <button onClick={() => applyCode(inputCode)} className="bg-black text-white px-4 py-2 rounded">
            Apply
          </button>
        </div>
      )}

      {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
      <p className="mt-2 font-bold">Total to Pay: ₹{finalTotal}</p>
    </div>
  );
}
```

---

## 🤖 Turnkey AI Agent Toolkit (`@boostengine/coupons/agent`)

Equip conversational shopping agents (OpenAI GPT-4o, Claude 3.5, Gemini, LangChain) with autonomous promotion management:

```typescript
import { CouponAgentToolkit } from '@boostengine/coupons/agent';

const toolkit = new CouponAgentToolkit([
  { code: 'SUPER500', discountType: 'FLAT', discountValue: 500, minSubtotal: 2500 },
  { code: 'SAVE15', discountType: 'PERCENTAGE', discountValue: 15, minSubtotal: 1000 },
]);

// 1. Export JSON Schema for LLM Function Calling
const tools = toolkit.getFunctionSchemas();
// Pass `tools` into openai.chat.completions.create({ tools, ... })

// 2. Execute tool calls from LLM response
const botResponse = toolkit.autoApplyBestCoupon({
  cart: { subtotal: 3000, shippingFee: 50 },
});

console.log(botResponse);
/*
{
  success: true,
  bestCouponCode: "SUPER500",
  discountAmount: 500,
  finalTotal: 2550,
  message: "Applied coupon SUPER500 saving you ₹500! Your new total is ₹2550."
}
*/
```

---

## 💻 Interactive CLI

Inspect and test coupons directly from your terminal:

```bash
# Interactive test runner
npx @boostengine/coupons test

# View supported discount models & examples
npx @boostengine/coupons
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
