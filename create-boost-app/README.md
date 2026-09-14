# create-boost-app

> **1-command scaffold tool for BoostEngine eCommerce projects**  
> Generate a full-stack D2C store, Vite SPA, Express API backend, or Expo mobile app in seconds.

[![npm version](https://img.shields.io/npm/v/create-boost-app)](https://www.npmjs.com/package/create-boost-app)
[![license](https://img.shields.io/npm/l/create-boost-app)](./LICENSE)

---

## Quick Start

```bash
npx create-boost-app
```

Interactive CLI aapse project name, brand title aur template puchega. 
Ab aap **Standalone** ya **Paired (Frontend + Backend)** dono scaffold kar sakte hain!

---

## Choose Your Template / Stack

### 🚀 Paired Stacks & Suites (Recommended)
Ek hi command se connected sibling folders ban jate hain:

```bash
# 🌐 Web Store + 📱 Mobile App (creates my-store-web/ and my-store-app/)
npx create-boost-app my-store --template web+app

# ⚡ Vite Storefront + 🖥️ Express API (creates my-store/ and my-store-api/)
npx create-boost-app my-store --template vite+express

# 📱 Expo Mobile App + 🖥️ Express API (creates my-app/ and my-app-api/)
npx create-boost-app my-app --template expo+express

# 👑 3-in-1 Complete Suite: Web Store + Mobile App + Express API (creates 3 folders)
npx create-boost-app my-store --template omnichannel
```

---

### 🏪 Standalone Templates

```bash
# Next.js 15 Full-Stack Store (Storefront + Admin in 1 project)
npx create-boost-app my-store --template nextjs

# Vite + React Storefront only (if you already have a backend)
npx create-boost-app my-store --template vite

# Express API Backend only
npx create-boost-app my-api --template backend-express

# Expo React Native Mobile App only
npx create-boost-app my-app --template expo-mobile
```

---

## Interactive Menu Structure

Jab aap bina `--template` flag ke run karenge:

```
Choose a stack:

  ── Full-Stack Standalone ──
  1. Next.js 15 — Full-Stack Store + Admin Panel (1 folder)

  ── Paired Stacks & Suites (Recommended) ──
  2. Next.js Web Store + Expo Mobile App [WEB + APP] (2 folders: web/ + app/)
  3. Vite Store + Express API [PAIRED] (2 folders: store/ + store-api/)
  4. Expo Mobile + Express API [PAIRED] (2 folders: app/ + app-api/)
  5. Web Store + Mobile App + Express API [3-IN-1 SUITE] (3 folders: web/ + app/ + api/)

  ── Standalone (Advanced) ──
  6. Vite Store only (frontend, no backend)
  7. Express API only (backend, no frontend)
  8. Expo Mobile only (mobile, no backend)
```

---

## 🧩 Feature & Plugin Selection (Interactive or Flags)

Aapko saare 15 plugins lene ki jarurat nahi hai! CLI aapse puchega:

```
Configure Features & Plugins:

  1. 👑 Full D2C Suite (All 15 plugins pre-installed — Recommended)
  2. ⚡ Essential Commerce (Payments, Shipping, Phone Auth, GST, Coupons, Search)
  3. 🛠️ Custom Selection (Pick individual plugins via comma-separated numbers)
```

Direct flags ke through bhi select kar sakte hain:
```bash
# All features (default)
npx create-boost-app my-store --features all

# Only essential plugins
npx create-boost-app my-store --features essentials

# Custom specific plugins
npx create-boost-app my-store --features payments,shipping,auth
```

Har project me `boost.config.json` generate hota hai jo track karta hai ki kaunse plugins active hain!

---

## Templates Detail

### 🔗 Paired: `vite+express`
- Frontend: `my-store/` (Vite + React 18 SPA)
- Backend: `my-store-api/` (Node.js/Express + `@boostengine/server`)
- Dono folders sibling banenge, `.env.local` auto-configure hoga.

### 🔗 Paired: `expo+express`
- Mobile: `my-app/` (Expo SDK 51 + React Native)
- Backend: `my-app-api/` (Express API pre-wired with payments & cart)
- Mobile clients ke liye ready backend setup.

---

### 🏪 `nextjs` — Full-Stack Store (Standalone)

The most complete template. Includes everything:

| Feature | Description |
|---------|-------------|
| Storefront | Product listing, PDP, checkout flow |
| Admin Panel | `/admin` dashboard (Shopify-style) |
| Plugin Hub | WordPress-style hot-pluggable extensions |
| Indian GST | HSN codes, GSTIN validation, PDF invoices |
| Payments | Razorpay + PhonePe + COD |
| Logistics | Shiprocket + Pincode checker |

**After scaffold:**
```bash
cd my-store
npm install
npm run dev
# Open http://localhost:3000
```

---

### ⚡ `vite` — Vite + React SPA

A lightweight storefront built with Vite and React 18. Great for:
- Custom storefronts where you already have a backend
- Headless commerce projects
- Fast prototypes

**After scaffold:**
```bash
cd my-store
npm install
npm run dev
# Open http://localhost:3000
```

---

### 🖥️ `backend-express` — Express API Server

A production-ready Node.js/Express server with **all eCommerce API routes pre-built** via `@boostengine/server`.

You get these routes out of the box:

```
GET  /api/health
POST /api/payments/create-order
POST /api/payments/verify
POST /api/auth/send-otp
POST /api/auth/verify-otp
GET  /api/cart
POST /api/cart/add
POST /api/shipping/create-shipment
GET  /api/shipping/track/:awb
POST /api/coupons/validate
POST /api/returns/initiate
POST /api/invoicing/generate
POST /api/notifications/whatsapp
```

**After scaffold:**
```bash
cd my-api
npm install
# Fill in .env.local with your API keys
npm run dev
# API running at http://localhost:3001/api/health
```

---

### 📱 `expo-mobile` — Expo React Native App

A mobile eCommerce app template built with Expo SDK 51 and React Native.

**After scaffold:**
```bash
cd my-app
npm install
npx expo start
# Scan QR with Expo Go app on your phone
```

---

## What Gets Generated

Every template includes:
- ✅ `package.json` with all `@boostengine/*` packages pre-configured
- ✅ `.env.example` with all required environment variables listed
- ✅ `.env.local` auto-created from example (ready to fill in)
- ✅ `README.md` customized with your brand name and next steps

---

## Non-Interactive Mode

Skip all prompts by passing arguments directly:

```bash
npx create-boost-app my-project --template backend-express
# Only asks for brand title, skips all other prompts
```

---

## After Scaffolding

1. **Fill in your API keys** in `.env.local`
2. **Run `npm install`**
3. **Run `npm run dev`** (or `npx expo start` for mobile)

All `@boostengine/*` packages are already installed and wired up. Just add your credentials and go!

---

## All @boostengine Packages

| Package | What it does |
|---------|-------------|
| `@boostengine/server` | All-in-one Express API router |
| `@boostengine/payments` | Razorpay, PhonePe, COD |
| `@boostengine/auth` | Phone OTP authentication |
| `@boostengine/cart` | Cart & session management |
| `@boostengine/shipping` | Shiprocket & logistics |
| `@boostengine/invoicing` | GST PDF invoices |
| `@boostengine/coupons` | Discount & coupon engine |
| `@boostengine/returns` | Returns & refund flow |
| `@boostengine/notifications` | WhatsApp, Email, SMS |
| `@boostengine/search` | Product search & filters |
| `@boostengine/wishlist` | Wishlist management |
| `@boostengine/reviews` | Reviews & ratings |
| `@boostengine/seo` | SEO meta & JSON-LD |
| `@boostengine/analytics` | Store analytics |
| `@boostengine/ui` | UI component library |

---

## License

MIT © [Boost Engine](https://github.com/boostengine)
