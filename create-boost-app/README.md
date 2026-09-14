# create-boost-app 🚀

[![npm version](https://img.shields.io/npm/v/create-boost-app.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/create-boost-app)
[![license](https://img.shields.io/npm/l/create-boost-app.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black.svg?style=flat-square)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)

> **The official 1-command CLI generator for launching high-converting Next.js D2C eCommerce stores with Indian GST compliance, Razorpay, Delhivery, Admin Panel, and 21 modular BoostEngine micro-packages in under 60 seconds.**

---

## 📸 What's Generated? (Storefront & Admin Preview)

```text
  Customer Storefront (localhost:3000)      Shopify-Style Admin (localhost:3000/admin)
  ┌─────────────────────────────────┐       ┌──────────────────────────────────────┐
  │ [Navbar]   Search    Bag (2)    │       │ 📊 DASHBOARD   ₹2,48,900 Sales (142) │
  │ ⚡ Flash Deal (Ends in 02:45:12) │       │ 📦 PRODUCTS    Stock, Variants, SEO  │
  │ [Hero Media] New Winter Drop    │       │ 🚚 ORDERS      Delhivery / Thermal   │
  │ [Products Grid with Quick Buy]  │       │ ↩️ RETURNS     Doorstep Reverse QC   │
  │ [Cart Drawer with Free Ship Bar]│       │ 🎁 REFERRALS   Double-sided viral    │
  │ [Razorpay / Cashfree / COD Flow]│       │ 🔌 PLUGINS     WordPress-style Hub   │
  └─────────────────────────────────┘       └──────────────────────────────────────┘
```

---

## ⚡ Instant Usage (1 Command)

Generate a brand new production-ready eCommerce store in your terminal:

```bash
npx create-boost-app my-store
# or
npx create-boost-store my-store
```

The interactive CLI will ask you for:
1. **Store Name**: e.g., `streetwear-india`
2. **Brand Title**: e.g., `Cyberpunk Streetwear`

---

## 🌟 Complete Included Features

### 1. 🌐 Modern D2C Storefront
- **Instant Search**: Typo-tolerant in-memory catalog search (`@boostengine/search`).
- **Product Experience**: Multi-angle image zoom gallery, color/size swatch pills, and pincode delivery checkers (`@boostengine/ui`, `@boostengine/shipping`).
- **Cart & Tax Engine**: Automatic Indian GST (intra-state CGST+SGST vs inter-state IGST) with Free Shipping progress meter (`@boostengine/cart`).
- **Payments**: 1-click Razorpay, Cashfree, PhonePe, and COD checkout (`@boostengine/payments`).
- **Customer Account**: Doorstep returns timeline (`@boostengine/returns`) and viral WhatsApp referral links (`@boostengine/referrals`).

### 2. ⚡ Shopify-Style Admin Panel (`/admin`)
- **Live Metrics**: Real-time sales, order conversion rate, and average order value (AOV).
- **Order Pipeline**: Manifest generation, thermal shipping label printing, and courier partner dispatch.
- **Returns & QC Management**: Inspect return requests, trigger reverse pickups, and issue refunds in 1 click.
- **Micro-Plugins Hub**: Toggle all `@boostengine/*` packages on or off without writing any code.

---

## 🚀 Running Your New Store

```bash
cd my-store
npm install
npm run dev
```

Open in your browser:
- **Customer Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Plugins Manager**: [http://localhost:3000/admin/plugins](http://localhost:3000/admin/plugins)

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
