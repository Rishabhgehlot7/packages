# @boostengine/wishlist 💖

[![npm version](https://img.shields.io/npm/v/@boostengine/wishlist.svg?color=purple)](https://www.npmjs.com/package/@boostengine/wishlist)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg)](https://react.dev/)

> Enterprise Wishlist & Save-for-Later Engine with Multi-Boards, Guest Merge, Move-to-Cart, Price Drop & Restock Alerts, Real-Time Events, and Autonomous AI Agent Tools.

Part of the **BoostEngine** headless ecommerce micro-packages ecosystem.

---

## 🌟 Key Features

- 📁 **Multi-Board Wishlists**: Create named collections (e.g. "Birthday Ideas", "Living Room Decor", "Holiday Gifts").
- 🔗 **Shareable Wishlists**: Generate public or unlisted shareable links with secure tokens.
- 🛒 **Move-to-Cart Integration**: Effortlessly convert saved items to `@boostengine/cart` items with optional auto-removal.
- 📉 **Price Drop Alerts**: Compare wishlists against live product catalogs to detect price reductions.
- 🔔 **Back-in-Stock Alerts**: Detect previously sold-out items that are now available.
- 🎯 **Target Price Watch**: Set target thresholds and trigger notifications when prices hit customer goals.
- 👥 **Guest Wishlist Merge**: Seamlessly merge local guest browsing wishlists into user accounts upon login without duplicates.
- 📡 **Real-time Event Emitter**: Hook into events (`item:added`, `item:removed`, `price_drop`, `back_in_stock`, `item:moved_to_cart`).
- 🔄 **Universal Database Sync**: Ingest from MongoDB, PostgreSQL, Supabase, Prisma, DynamoDB, or Firebase.
- ⚛️ **Universal React Suite**: `<WishlistProvider>`, `useWishlist()`, `useWishlistButton()`, `useWishlistBoards()`, and `usePriceDropAlerts()`.
- 🤖 **Autonomous AI Agent Toolkit**: 5 tools ready for OpenAI, Claude, Gemini, and Vercel AI SDK.
- 💻 **Interactive CLI**: Simulate multi-board wishlists and alerts directly in terminal (`npx boost-wishlist demo`).
- 🛡️ **100% Backward Compatible**: Retains all original methods from v1.0.x.

---

## 📦 Installation

```bash
npm install @boostengine/wishlist
# or
yarn add @boostengine/wishlist
# or
pnpm add @boostengine/wishlist
```

---

## 🚀 Quick Start (Node.js / Backend)

```typescript
import { createBoostWishlist, wishlist } from '@boostengine/wishlist';

// 1. Create a Wishlist instance
const wl = createBoostWishlist();

// 2. Create custom boards
const giftsBoard = wl.createBoard('Gifts for Mom', { description: 'Mother’s Day Ideas' });

// 3. Add items
wl.addItem({
  productId: 'prod_perfume',
  title: 'Luxury French Perfume',
  price: 4999,
  targetPrice: 3999, // Notify if it drops below ₹3999
  inStock: true,
  boardId: giftsBoard.id
});

wl.addItem({
  productId: 'prod_sneakers',
  title: 'Air Runner Sneakers',
  price: 3499,
  inStock: false // Out of stock initially
});

// 4. Check for Price Drops & Restocks against live catalog
const liveCatalog = [
  { id: 'prod_perfume', price: 3499, inStock: true }, // Dropped ₹1500 (hit target!)
  { id: 'prod_sneakers', inStock: true }              // Back in stock!
];

const priceDrops = wl.checkPriceDrops(liveCatalog);
console.log(`Price drops detected: ${priceDrops.length}`);

const restocks = wl.checkRestockAlerts(liveCatalog);
console.log(`Restocks detected: ${restocks.length}`);

// 5. Move Item to Checkout Cart
const cartResult = wl.moveToCart('prod_perfume', undefined, { autoRemove: true, quantity: 1 });
console.log('Added to Cart:', cartResult.cartItem);
console.log('Remaining in wishlist:', cartResult.remainingWishlistCount);
```

---

## 👥 Guest Wishlist Merge

Merge unauthenticated guest items stored in browser cookies/storage into an authenticated user's account without duplicates:

```typescript
import { BoostWishlist } from '@boostengine/wishlist';

const guestItems = [
  { id: '1', productId: 'prod_tee', title: 'Anime Tee', price: 999, addedAt: '2026-09-01' },
  { id: '2', productId: 'prod_cap', title: 'Baseball Cap', price: 499, addedAt: '2026-09-02' }
];

const userItems = [
  { id: '3', productId: 'prod_tee', title: 'Anime Tee', price: 999, addedAt: '2026-08-15' }
];

const { merged, addedCount } = BoostWishlist.mergeGuestWishlist(guestItems, userItems);
console.log(`Merged wishlist has ${merged.length} items (${addedCount} newly added).`);
```

---

## ⚛️ Universal React Suite

Import from `@boostengine/wishlist/react` in Next.js, Vite, React, or React Native:

### 1. App-Wide Provider with LocalStorage Persistence

```tsx
import { WishlistProvider } from '@boostengine/wishlist/react';

export function App({ children }) {
  return (
    <WishlistProvider storageKey="my_store_wishlist">
      {children}
    </WishlistProvider>
  );
}
```

### 2. Instant Wishlist Heart Toggle Button

```tsx
import React from 'react';
import { useWishlistButton } from '@boostengine/wishlist/react';

export function WishlistHeartButton({ product }) {
  const { isWishlisted, toggle } = useWishlistButton(product.id);

  return (
    <button 
      onClick={() => toggle({ title: product.title, price: product.price, image: product.image })}
      className={`p-2 rounded-full transition-colors ${
        isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
      }`}
    >
      {isWishlisted ? '❤️' : '🤍'}
    </button>
  );
}
```

### 3. Full Wishlist Page with Move-to-Cart

```tsx
import React from 'react';
import { useWishlist } from '@boostengine/wishlist/react';

export function WishlistPage() {
  const { items, totalCount, totalValue, removeItem, moveToCart } = useWishlist();

  return (
    <div>
      <h2>My Wishlist ({totalCount} items - ₹{totalValue})</h2>
      {items.map(item => (
        <div key={item.id} className="flex justify-between items-center p-3 border-b">
          <div>
            <h4>{item.title}</h4>
            <p>₹{item.price}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => moveToCart(item.productId, item.variantId, { autoRemove: true })}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Move to Cart
            </button>
            <button onClick={() => removeItem(item.productId, item.variantId)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 📡 Real-Time Event Emitter (WebSockets)

Hook wishlist events into analytics, push notifications, or Socket.io:

```typescript
import { wishlist } from '@boostengine/wishlist';

wishlist.on('item:added', ({ item, totalCount }) => {
  analytics.track('Wishlist Item Added', { productId: item.productId, price: item.price });
});

wishlist.on('price_drop', ({ item, savedAmount, discountPercentage }) => {
  pushNotification.send({
    title: `Price Drop on ${item.title}!`,
    body: `Save ₹${savedAmount} (${discountPercentage}% OFF)`
  });
});

wishlist.on('back_in_stock', ({ item }) => {
  pushNotification.send({
    title: `${item.title} is Back in Stock!`,
    body: 'Grab it before it sells out again.'
  });
});
```

---

## 🤖 Autonomous AI Agent Toolkit

Equip AI shopping assistants and support agents with wishlist tools:

```typescript
import { WishlistAgentToolkit, wishlist } from '@boostengine/wishlist';

const toolkit = new WishlistAgentToolkit(wishlist);

// Universal schemas for OpenAI, Claude, Gemini, or Vercel AI SDK
const openAITools = toolkit.toOpenAITools();
const claudeTools = toolkit.toClaudeTools();
const geminiTools = toolkit.toGeminiTools();

// Autonomous execution router
const result = await toolkit.executeTool('toggle_wishlist_item', {
  productId: 'prod_jacket',
  title: 'Cyberpunk Waterproof Jacket',
  price: 3999
});
```

---

## 💻 CLI Commands

```bash
# Run interactive simulation of Multi-Boards, Price Drops & Cart Transitions
npx boost-wishlist demo
```

---

## 📄 License

MIT © [BoostEngine Team](https://github.com/boostengine)
