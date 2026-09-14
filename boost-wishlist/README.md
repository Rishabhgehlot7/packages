# @boostengine/wishlist 💖

[![npm version](https://img.shields.io/npm/v/@boostengine/wishlist.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/wishlist)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/wishlist.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/wishlist)
[![license](https://img.shields.io/npm/l/@boostengine/wishlist.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Conversion](https://img.shields.io/badge/Conversion-Price%20Drop%20Alerts-pink.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **High-converting wishlist and save-for-later engine for eCommerce. Features guest wishlist merging, price-drop alerts, 1-click move to cart, and offline local storage synchronization.**

Zero external dependencies. Operates seamlessly on client browsers, Next.js App Router, and Node.js backend sessions.

---

## 📸 Visual Wishlist UI & Price-Drop Preview

```text
  My Saved Wishlist (3 Items)
  ─────────────────────────────────────────────────────────────────────────────
  ┌───────────────────┐  Cyberpunk Heavy Hoodie (Size: L | Color: Black)
  │                   │  Current Price: ₹1,499  ~~₹2,499~~
  │  [Product Photo]  │  🔔 PRICE DROP: Dropped by ₹300 since you saved it!
  │                   │  [ Move to Cart 🛒 ]    [ Remove ✕ ]
  └───────────────────┘
  
  ┌───────────────────┐  Minimalist Graphic Tee (Size: M | Color: White)
  │                   │  Current Price: ₹699
  │  [Product Photo]  │  ⚠️ LOW STOCK: Only 2 left in warehouse
  │                   │  [ Move to Cart 🛒 ]    [ Remove ✕ ]
  └───────────────────┘
```

---

## 🌟 Key Highlights

- **🔄 Guest to Customer Sync**: Enables guests to save items in `localStorage` without logging in, then automatically merges their saved items when they log in.
- **🔔 Price Drop Detection**: Tracks original saved price vs live product price and calculates savings alerts (e.g. *"Price dropped by ₹300!"*).
- **🛒 1-Click Move to Cart**: Atomically removes item from wishlist and transfers into `@boostengine/cart` payload.
- **💾 Dual Persistence**: In-memory and LocalStorage persistence with JSON serialization.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/wishlist

# pnpm
pnpm add @boostengine/wishlist

# yarn
yarn add @boostengine/wishlist
```

---

## 🚀 Quickstart Guide

```typescript
import { createWishlistManager } from '@boostengine/wishlist';

// 1. Initialize Wishlist
const wishlist = createWishlistManager();

// 2. Add an item
wishlist.addItem({
  productId: 'prod_hoodie',
  variantId: 'L_Black',
  title: 'Cyberpunk Heavy Hoodie',
  price: 1799, // price when customer saved it
  imageUrl: 'https://booststore.in/hoodie.jpg',
});

// 3. Detect price drops
const currentLivePrice = 1499;
const alerts = wishlist.checkPriceDrops({
  'prod_hoodie_L_Black': currentLivePrice,
});

console.log(alerts[0].priceDifference); // 300 (Saved ₹300!)
console.log(alerts[0].percentageDrop);   // 16.6%

// 4. Move to Cart
const itemToMove = wishlist.moveToCart('prod_hoodie_L_Black');
console.log(itemToMove); // Ready to pass to cart.addItem(...)
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
