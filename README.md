# 🚀 @boostengine Complete eCommerce Micro-Packages Ecosystem

[![npm total packages](https://img.shields.io/badge/Packages-21%20Micro--Packages-blue.svg)](https://www.npmjs.com/org/boostengine)
[![Total Downloads](https://img.shields.io/badge/Total%20Downloads-1%2C490%2B-brightgreen.svg)](https://www.npmjs.com/org/boostengine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Vite & Next.js Compatible](https://img.shields.io/badge/Next.js%20%26%20Vite-100%25%20Compatible-success.svg)](https://nextjs.org)

> **The 10-Minute Enterprise eCommerce Suite for India & Global D2C Brands.**  
> Assemble modern, high-converting eCommerce stores in minutes with decoupled, zero-bloat, tree-shakable micro-packages.

---

## 📖 Table of Contents

- [Why BoostEngine?](#-why-boostengine)
- [Framework Compatibility (Next.js, Vite, Node, Mobile)](#-framework-compatibility)
- [Complete Package Directory (21 Packages)](#-the-core-ecosystem--packages-directory)
- [1-Click Full Store Generator (npx create-boost-app)](#-1-click-store-generation-with-npx)
- [Complete Architectural Workflow](#-complete-d2c-store-architecture)
- [Developer Quick Recipes](#-developer-quick-recipes)
- [Build & Publish Scripts](#-build-and-publish-scripts)
- [License](#-license)

---

## 💡 Why BoostEngine?

Building modern eCommerce from scratch or customizing bloated monolithic platforms (like Shopify or WooCommerce) often forces developers to compromise on performance, design flexibility, and native Indian payment/tax workflows.

| Feature | Shopify / WooCommerce | Standard Custom Build | **@boostengine Suite** |
|---|:---:|:---:|:---:|
| **Architecture** | Heavy Monolith / Vendor Lock-in | Rewrite everything | **Modular Decoupled Micro-Packages** |
| **Indian GST Math** | External paid apps | Manual buggy math | **Native Intra/Inter CGST+SGST+IGST Engine** |
| **Payments** | High transaction markup | Manual PG integration | **Razorpay, PhonePe, Cashfree, COD in 1 API** |
| **Reverse Logistics** | Manual courier portals | Hard to maintain | **Shiprocket & Delhivery Doorstep Returns** |
| **Framework Freedom** | Liquid / PHP | Framework dependent | **Next.js, Vite, React, Node.js, React Native** |
| **Bundle Size** | Megabytes of bloat | Variable | **Tiny (2-25 KB each), Tree-Shakable** |

---

## 🔌 Framework Compatibility

All packages are compiled with **dual ESM (`.mjs`) and CommonJS (`.js`)** outputs with full TypeScript declarations (`.d.ts`):

- ✅ **Next.js 14 & 15**: Full support for App Router, Pages Router, Server Components, Client Components, and Server Actions.
- ✅ **Vite**: Native ESM support for React, Vue, Svelte, and Vanilla TypeScript.
- ✅ **Backend Services**: Node.js, Express, NestJS, Fastify, and Serverless AWS Lambda.
- ✅ **Mobile Cross-Platform**: React Native and Expo (Metro bundler).

---

## 📦 The Core Ecosystem & Packages Directory

All 21 micro-packages are published publicly on NPM under the official `@boostengine` organization:

| # | Package Name | NPM Install Command | Key Responsibilities |
|:---:|---|---|---|
| **CLI** | [`create-boost-app`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/create-boost-app) | `npx create-boost-app` | 1-command generator for launching production-ready Next.js D2C store & admin panel |
| **Core** | [`@boostengine/core`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-core) | `npm i @boostengine/core` | WordPress/Shopify-style modular plugin runtime, Action/Filter dispatch & lifecycle events |
| 1 | [`@boostengine/returns`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-returns) | `npm i @boostengine/returns` | Doorstep return & exchange engine, Shiprocket reverse pickup manifest, QC checks & instant refunds |
| 2 | [`@boostengine/referrals`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-referrals) | `npm i @boostengine/referrals` | Double-sided viral referral engine ("Give ₹200, Get ₹200"), anti-fraud shield & 1-click WhatsApp links |
| 3 | [`@boostengine/loyalty`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-loyalty) | `npm i @boostengine/loyalty` | Flipkart SuperCoins & Amazon Pay style loyalty rewards, VIP tiers (Bronze to SuperStar) & coin redemption |
| 4 | [`@boostengine/deals`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-deals) | `npm i @boostengine/deals` | Amazon-style Lightning Deals, countdown timers, stock claim progress meters & urgency badges |
| 5 | [`@boostengine/recommendations`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-recommendations) | `npm i @boostengine/recommendations` | Frequently Bought Together (FBT combo bundles), Cross-sell & Upsell algorithms to boost AOV |
| 6 | [`@boostengine/cart`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-cart) | `npm i @boostengine/cart` | Cart engine, intra/inter Indian GST (CGST/SGST/IGST), free shipping progress bar & MRP savings math |
| 7 | [`@boostengine/payments`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-payments) | `npm i @boostengine/payments` | Razorpay, Cashfree, PhonePe, Paytm, Stripe, COD with subunit amount normalization & webhook helpers |
| 8 | [`@boostengine/shipping`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-shipping) | `npm i @boostengine/shipping` | Shiprocket, Delhivery, Shadowfax with live rate comparison & cheapest courier auto-selector |
| 9 | [`@boostengine/coupons`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-coupons) | `npm i @boostengine/coupons` | Promotion engine: Flat, %, Tiered spend ladder, BOGO with `autoApplyBestCoupon` optimization |
| 10 | [`@boostengine/auth`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-auth) | `npm i @boostengine/auth` | Frictionless phone OTP with stateless HMAC verification, Next.js cookie sessions & guest cart merge |
| 11 | [`@boostengine/ui`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-ui) | `npm i @boostengine/ui` | Pre-built UI components: Slide-out Cart Drawer, Sticky Buy Now bar, Pincode Checker, Trust Badges |
| 12 | [`@boostengine/invoicing`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-invoicing) | `npm i @boostengine/invoicing` | Legal Indian GST Tax Invoice & 4x6 Thermal Shipping Label Generator with SVG Barcodes & HSN tables |
| 13 | [`@boostengine/search`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-search) | `npm i @boostengine/search` | Typo-tolerant instant search, multi-faceted filtering, live facet aggregations & URL query sync |
| 14 | [`@boostengine/wishlist`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-wishlist) | `npm i @boostengine/wishlist` | Save-for-later wishlist with guest merge, price-drop alert detection & cart integration |
| 15 | [`@boostengine/inventory`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-inventory) | `npm i @boostengine/inventory` | Low-stock urgency marketing, 15-minute checkout reservation & multi-warehouse order routing |
| 16 | [`@boostengine/reviews`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-reviews) | `npm i @boostengine/reviews` | Social proof engine: star distribution, verified buyer badge, helpfulness upvoting & Schema.org |
| 17 | [`@boostengine/seo`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-seo) | `npm i @boostengine/seo` | Schema.org JSON-LD (Product, Breadcrumbs, FAQ), Google Merchant Center XML feed, Meta Catalog CSV |
| 18 | [`@boostengine/analytics`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-analytics) | `npm i @boostengine/analytics` | Meta Pixel, GA4, GTM, TikTok, Pinterest unified tracking + React hydration |
| 19 | [`@boostengine/notifications`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-notifications) | `npm i @boostengine/notifications` | WhatsApp (Interakt, Wati, Gupshup), SMS (Fast2SMS, Msg91), Email (Resend) order & recovery alerts |
| 20 | [`@boostengine/collections`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-collections) | `npm i @boostengine/collections` | Official Postman v2.1 collections & envs for 9 platforms with sync CLI |

---

## ⚡ 1-Click Store Generation with npx

Create a brand new high-converting Next.js D2C store with Admin Panel and all micro-packages pre-wired in 60 seconds:

```bash
npx create-boost-app my-store
```

---

## 🏗️ Complete D2C Store Architecture

```text
                                SHOPPER JOURNEY
                                       │
  1. Discovery & Search                ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ @boostengine/search ➔ Typo-tolerant instant search                     │
  │ @boostengine/seo    ➔ Schema.org Product JSON-LD & Google feed         │
  │ @boostengine/analytics ➔ Meta Pixel & GA4 tracking events              │
  └────────────────────────────────────┬───────────────────────────────────┘
                                       │
  2. Engagement & Urgency              ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ @boostengine/deals  ➔ Flash Sale countdown & claimed stock meter       │
  │ @boostengine/recommendations ➔ Frequently Bought Together bundles      │
  │ @boostengine/ui     ➔ Pincode delivery checker & Trust badges          │
  └────────────────────────────────────┬───────────────────────────────────┘
                                       │
  3. Bag & Cart Calculations           ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ @boostengine/cart   ➔ CGST/SGST/IGST breakdown & free shipping meter   │
  │ @boostengine/coupons ➔ Flat, %, Tiered spend ladder & BOGO discounts   │
  │ @boostengine/loyalty ➔ SuperCoins checkout discount slider             │
  │ @boostengine/inventory ➔ 15-minute checkout stock reservation          │
  └────────────────────────────────────┬───────────────────────────────────┘
                                       │
  4. Frictionless Checkout             ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ @boostengine/auth   ➔ 1-click Phone OTP login with guest cart merge    │
  │ @boostengine/shipping ➔ Shiprocket/Delhivery cheapest courier selector │
  │ @boostengine/payments ➔ Razorpay, PhonePe, Cashfree, Paytm, COD        │
  └────────────────────────────────────┬───────────────────────────────────┘
                                       │
  5. Post-Purchase Fulfillment         ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ @boostengine/notifications ➔ Instant WhatsApp & SMS receipt alerts     │
  │ @boostengine/invoicing ➔ Legal Indian GST Tax Invoice & 4x6 labels     │
  │ @boostengine/referrals ➔ "Give ₹200, Get ₹200" viral invite links      │
  │ @boostengine/returns ➔ Doorstep return pickup & instant refund engine  │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Developer Quick Recipes

### Recipe 1: Calculate Indian GST & Free Shipping Progress (`@boostengine/cart`)

```typescript
import { createBoostCart } from '@boostengine/cart';

const cart = createBoostCart({
  origin: { state: 'Maharashtra', taxMode: 'inclusive' },
  destination: { state: 'Karnataka' }, // Automatically detects Inter-State IGST (18%)
  shipping: { freeShippingThreshold: 999, flatShippingRate: 79 },
});

cart.addItem({
  productId: 'hoodie_1',
  title: 'Heavyweight Oversized Hoodie',
  price: 699,
  compareAtPrice: 1299,
  quantity: 1,
  taxRate: 18,
  hsnCode: '6109',
});

const summary = cart.getSummary();
console.log(summary.totalSavings); // ₹600 (MRP savings)
console.log(summary.freeShipping.message); // "🚚 Add ₹300 more to unlock FREE Delivery!"
```

### Recipe 2: Frequently Bought Together Combo Bundle (`@boostengine/recommendations`)

```typescript
import { RecommendationsEngine } from '@boostengine/recommendations';

const bundle = RecommendationsEngine.getFrequentlyBoughtTogether(mainProduct, catalog, {
  discountPercentage: 10,
});

console.log(bundle.bundlePrice);   // Discounted combo price
console.log(bundle.savingsAmount); // Amount saved by buying combo
```

### Recipe 3: Doorstep Return & Reverse Logistics (`@boostengine/returns`)

```typescript
import { ReturnEngine } from '@boostengine/returns';

// 1. Check 7-day return window eligibility
const check = ReturnEngine.checkEligibility(order.deliveredAt, 'apparel', 'DELIVERED');

// 2. Generate Shiprocket reverse pickup manifest
const manifest = ReturnEngine.generateReversePickupManifest(returnRequest, warehouseAddress);
console.log(manifest.awbNumber); // "SRR982147102"
```

---

## 🛠️ Build and Publish Scripts

To build and verify test suites for all 21 micro-packages:

```cmd
cd packages
node build-all.cjs
```

To publish all packages to the official NPM registry:

```cmd
node publish-all.cjs
```

---

## 📄 License

All packages in the `@boostengine` ecosystem are licensed under the permissive **[MIT License](https://opensource.org/licenses/MIT)**.  
Built for the developer community by **[Boost Engine Team](https://github.com/boostengine)**.
