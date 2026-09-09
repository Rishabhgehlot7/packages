# create-boost-app

The official 1-command generator for launching production-ready Next.js D2C eCommerce stores with Indian GST compliance, Razorpay, Delhivery, Admin Panel, and 15 modular BoostEngine micro-packages.

---

## ⚡ Instant Usage

Create a new store in 60 seconds with **npx**:

```bash
npx create-boost-app my-store
# or
npx create-boost-store my-store
```

Interactive prompts will ask for:
1. **Store Name**: e.g., `my-streetwear-brand`
2. **Brand Title**: e.g., `Overkill Streetwear`

---

## 📦 What's Generated?

A fully working Next.js 15 application with:

1. **🌐 Complete D2C Storefront**:
   - Homepage with hero, instant typo-tolerant search (`@boostengine/search`), and collections
   - High-converting Product Detail Pages with Variant Selector, Image Gallery, Pincode Delivery Estimator (`@boostengine/shipping`), Stock Urgency Counters (`@boostengine/inventory`), and Customer Reviews (`@boostengine/reviews`)
   - Drawer Shopping Bag (`@boostengine/cart`) with Free Shipping meter & Indian GST tax calculation
   - Checkout Flow with 1-Click Phone OTP (`@boostengine/auth`) and Universal Payments (`@boostengine/payments`)
   - Order Confirmation screen with Legal GST Tax Invoices (`@boostengine/invoicing`)

2. **⚡ Shopify-Style Admin Panel (`/admin`)**:
   - **Dashboard**: Gross revenue, order volume, catalog health, and live KPIs
   - **Products Manager (`/admin/products`)**: Create, edit, and delete products, manage variants and stock levels
   - **Orders Pipeline (`/admin/orders`)**: Fulfill orders, assign courier partners (Delhivery, Bluedart), update tracking numbers, and print thermal shipping labels
   - **WordPress-Style Plugins Hub (`/admin/plugins`)**: Toggle micro-packages on or off without writing any code
   - **Store Settings (`/admin/settings`)**: Configure business address, GSTIN, shipping rules, and WhatsApp templates

3. **🧩 15 Hot-Pluggable Micro-Packages**:
   - `@boostengine/core`
   - `@boostengine/analytics`
   - `@boostengine/auth`
   - `@boostengine/cart`
   - `@boostengine/collections`
   - `@boostengine/coupons`
   - `@boostengine/inventory`
   - `@boostengine/invoicing`
   - `@boostengine/notifications`
   - `@boostengine/payments`
   - `@boostengine/reviews`
   - `@boostengine/search`
   - `@boostengine/seo`
   - `@boostengine/shipping`
   - `@boostengine/ui`
   - `@boostengine/wishlist`

---

## 🚀 Running Your Store

```bash
cd my-store
npm install
npm run dev
```

Open:
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Plugins Hub**: [http://localhost:3000/admin/plugins](http://localhost:3000/admin/plugins)

---

## 📄 License
MIT © Boost Engine Team
