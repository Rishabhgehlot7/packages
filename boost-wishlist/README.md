# @boostengine/wishlist 💖

> **High-Converting Wishlist & Save-for-Later Engine with Guest Merge, Price-Drop Alerts & Cart Integration for Modern eCommerce.**

Zero external dependencies, built to capture customer intent and convert window-shoppers into high-value buyers.

---

## 🌟 Key Features

- **💖 Toggle & State Management**: 1-line item add, remove, and toggle (`wl.toggleItem(item)`).
- **🔄 Guest-to-User Merge**: Seamlessly merges anonymous visitor items into authenticated user profiles on login without duplicates.
- **📉 Price Drop Detector**: Automatically calculates price reductions against your live catalog to trigger WhatsApp / SMS alerts via `@boostengine/notifications`.
- **🛒 Direct Cart Compatibility**: Directly compatible with `@boostengine/cart`.
- **💾 LocalStorage & Session Ready**: Native `.toJSON()` and `.fromJSON()`.

---

## 📦 Installation

```bash
npm install @boostengine/wishlist
```

---

## 🚀 Quickstart

```typescript
import { createBoostWishlist } from '@boostengine/wishlist';

const wishlist = createBoostWishlist();

// 1. Toggle product in wishlist (Adds if absent, removes if already present)
const { isWishlisted } = wishlist.toggleItem({
  productId: 'hoodie_01',
  variantId: 'L',
  title: 'Cyberpunk Anime Hoodie',
  price: 2499,
  image: 'https://myshop.com/images/hoodie.jpg',
});

console.log(isWishlisted); // true

// 2. Check for Price Drop Alerts
const alerts = wishlist.checkPriceDrops([
  { id: 'hoodie_01', price: 1999 }, // Dropped by ₹500!
]);

if (alerts.length > 0) {
  console.log(`Price dropped by ₹${alerts[0].savedAmount} (${alerts[0].discountPercentage}% OFF)!`);
}
```

---

## 🛠️ CLI Utilities

```bash
# Run interactive wishlist demo
npx @boostengine/wishlist demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
