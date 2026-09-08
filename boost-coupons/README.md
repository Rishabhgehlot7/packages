# @boostengine/coupons

> **High-Converting Discounts & Promotion Engine** for eCommerce. Supports **Flat, Percentage (with max cap), Free Shipping, Tiered (Spend X Get Y), BOGO, First-Order Only, and Auto-Apply Best Coupon** calculation.

---

## ⚡ Key Highlights

- 🎟️ **Rich Discount Models**: Flat off, Percentage with maximum cap, Tiered thresholds, BOGO, and Free Shipping.
- 🎯 **Advanced Cart & User Rules**:
  - First-order only restriction.
  - Prepaid vs COD payment mode rules (e.g. extra 5% off on UPI).
  - Minimum cart subtotal threshold.
  - Usage limits per user and total coupon redemption limits.
- 🧠 **Auto-Apply Best Coupon**: Evaluates all active coupons in 1ms and applies the one that gives the customer the maximum savings!

---

## 📦 Installation

```bash
npm install @boostengine/coupons
```

---

## 🚀 Quickstart

```typescript
import { CouponEngine, CouponRule } from '@boostengine/coupons';

const availableCoupons: CouponRule[] = [
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
    maxDiscount: 400,  // Capped at ₹400
    minSubtotal: 1499,
  },
  {
    code: 'PREPAID5',
    discountType: 'PERCENTAGE',
    discountValue: 5,
    applicablePaymentMode: 'Prepaid', // Only applies if customer pays online
  },
];

// 1. Manually Apply a Coupon:
const result = CouponEngine.apply(availableCoupons[1], {
  items: [{ id: '1', name: 'Hoodie', price: 1999, quantity: 1 }],
  subtotal: 1999,
  shippingFee: 99,
  paymentMode: 'Prepaid',
});

console.log(result.isValid);        // true
console.log(result.discountAmount); // 399.80
console.log(result.finalTotal);     // 1698.20

// 2. Auto-Apply the Best Coupon (Highest Savings):
const best = CouponEngine.autoApplyBest(availableCoupons, {
  items: [{ id: '1', name: 'Hoodie', price: 1999, quantity: 1 }],
  subtotal: 1999,
  shippingFee: 99,
});

console.log(`Best coupon: ${best.bestCoupon?.couponCode} saving ₹${best.bestCoupon?.discountAmount}`);
```

---

## 🛠️ CLI Quickstart

```bash
# View supported discount models
npx @boostengine/coupons list
```

---

## 📄 License
MIT © Boost Engine Team
