# @boostengine/cart 🛒

> **High-Performance eCommerce Cart Engine with Indian GST (CGST/SGST/IGST), Free Shipping Threshold Progress, Multi-Tax Rates & Surcharges.**

Clean, deterministic, zero third-party dependencies, and built specifically to empower Next.js, React, React Native, and Node.js eCommerce applications.

---

## 🌟 Key Features

- **🇮🇳 Compliant Indian GST Engine**: Automatically detects intra-state (CGST + SGST split 50/50) vs inter-state (IGST 100%) transactions based on shipping state codes (`MH`, `DL`, `KA`, etc.) with inclusive/exclusive tax modes and per-HSN tax audit reports.
- **🚚 Free Shipping Progress Bar**: Real-time progress percentage (0-100%), amount remaining, and celebratory motivational copy.
- **💰 Total Savings Calculator**: Transparently breaks down MRP discount, coupon discount, and prepaid discount to boost customer conversion.
- **💳 Surcharge Engine**: Clean handling of COD convenience fees and prepaid online payment discounts.
- **💾 State Persistence**: Built-in `.toJSON()` and `.fromJSON()` for direct sync with LocalStorage, cookies, or database sessions.

---

## 📦 Installation

```bash
npm install @boostengine/cart
```

---

## 🚀 Quickstart

```typescript
import { createBoostCart } from '@boostengine/cart';

// 1. Initialize Cart with store origin and policies
const cart = createBoostCart({
  origin: { state: 'Maharashtra', taxMode: 'inclusive' },
  destination: { state: 'Karnataka' }, // Inter-state
  shipping: { freeShippingThreshold: 999, flatShippingRate: 79 },
  payment: { paymentMethod: 'cod', codFee: 49 },
});

// 2. Add items
cart.addItem({
  productId: 'oversized_tee',
  variantId: 'L',
  title: 'Cyberpunk Graphic Tee',
  price: 699,
  compareAtPrice: 1299, // MRP
  quantity: 1,
  taxRate: 18,
  hsnCode: '6109',
});

// 3. Inspect Summary
const summary = cart.getSummary();

console.log(summary.subtotal); // 699
console.log(summary.totalMRP); // 1299
console.log(summary.totalSavings); // 600
console.log(summary.freeShipping.message); // "🚚 Add ₹300 more to unlock FREE Delivery!"
console.log(summary.shippingFee); // 79
console.log(summary.codFee); // 49
console.log(summary.gst.taxType); // "INTER_STATE"
console.log(summary.gst.igst); // 106.63
console.log(summary.finalTotal); // 827 (699 + 79 + 49)
```

---

## 🔄 Dynamic Cart State Operations

```typescript
// Update item quantity (automatically removes if quantity <= 0)
cart.updateQuantity('oversized_tee_L', 2);

// Apply a promo coupon (e.g. from @boostengine/coupons)
cart.applyDiscount({ code: 'FLASH200', amount: 200 });

// Switch payment method to prepaid
cart.setPaymentConfig({ paymentMethod: 'prepaid', prepaidDiscountPercentage: 5 });

// Check revised summary
const updated = cart.getSummary();
console.log(updated.finalTotal);
```

---

## 🛠️ CLI Utilities

```bash
# Run interactive live calculation & GST simulation
npx @boostengine/cart demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
