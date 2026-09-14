# @boostengine/coupons 🎟️

[![npm version](https://img.shields.io/npm/v/@boostengine/coupons.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/coupons)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/coupons.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/coupons)
[![license](https://img.shields.io/npm/l/@boostengine/coupons.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Discount Models](https://img.shields.io/badge/Models-Flat%20%7C%20Percent%20%7C%20BOGO%20%7C%20Free%20Shipping-emerald.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **High-converting discounts and promotions engine for eCommerce. Supports Flat discounts, Percentage off with max cap, BOGO (Buy One Get One), Tiered volume discounts, Free Shipping vouchers, and Auto-Apply Best Coupon optimizer.**

---

## 📸 Auto-Apply Best Coupon Optimizer Flow

```text
               Customer Cart (Subtotal: ₹1,999)
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │            Auto-Apply Best Coupon Optimizer Engine          │
  ├─────────────────────────────────────────────────────────────┤
  │ • FLAT200   ──► Saves ₹200                                  │
  │ • SAVE20    ──► 20% of ₹1,999 = ₹399.80 ◄─────── [MAX SAVING]│
  │ • PREPAID5  ──► 5% of ₹1,999 = ₹99.95                       │
  └───────────────────────────┬─────────────────────────────────┘
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                     Applied Promo Banner                    │
  ├─────────────────────────────────────────────────────────────┤
  │ 🎉 Code [SAVE20] applied automatically! You saved ₹399.80!  │
  │ Subtotal: ₹1,999  │  Discount: -₹399.80  │  Final: ₹1,599.20│
  └─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Highlights

- **🎟️ Multiple Discount Models**:
  - `FLAT`: Fixed rupee discount (e.g. ₹200 off).
  - `PERCENTAGE`: Percentage with maximum cap (e.g. 20% off up to ₹500).
  - `BOGO`: Buy X items, get Y items free or discounted.
  - `FREE_SHIPPING`: Waives shipping fees on qualifying carts.
  - `TIERED`: Spend ₹1,000 get ₹100, spend ₹2,000 get ₹300.
- **🧠 Auto-Apply Best Coupon**: Evaluates all active vouchers in 1 millisecond and automatically applies the single coupon yielding maximum customer savings.
- **🎯 Cart & User Restrictions**: Enforce minimum subtotal thresholds, prepaid vs COD payment modes, first-order limits, and user redemption limits.

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

## 🚀 Quickstart Guide

```typescript
import { CouponEngine, type CouponRule } from '@boostengine/coupons';

const coupons: CouponRule[] = [
  {
    code: 'FLAT200',
    discountType: 'FLAT',
    discountValue: 200,
    minSubtotal: 999,
  },
  {
    code: 'SAVE20',
    discountType: 'PERCENTAGE',
    discountValue: 20, // 20% off
    maxDiscount: 400,  // Maximum cap ₹400
    minSubtotal: 1499,
  },
  {
    code: 'PREPAID5',
    discountType: 'PERCENTAGE',
    discountValue: 5,
    applicablePaymentMode: 'Prepaid', // Only applies for online payments
  },
];

// 1. Manually Apply a Coupon
const result = CouponEngine.apply(coupons[1], {
  items: [{ id: 'item_1', name: 'Heavy Hoodie', price: 1999, quantity: 1 }],
  subtotal: 1999,
  shippingFee: 79,
  paymentMode: 'Prepaid',
});

console.log(result.isValid);        // true
console.log(result.discountAmount); // 399.80
console.log(result.finalTotal);     // 1678.20 (1999 - 399.80 + 79)

// 2. Automatically Find & Apply Best Coupon
const best = CouponEngine.autoApplyBest(coupons, {
  items: [{ id: 'item_1', name: 'Heavy Hoodie', price: 1999, quantity: 1 }],
  subtotal: 1999,
  shippingFee: 79,
});

console.log(`Auto-selected: ${best.bestCoupon?.couponCode} saving ₹${best.bestCoupon?.discountAmount}`);
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
