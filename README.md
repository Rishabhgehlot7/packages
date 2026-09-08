# 🚀 @boostengine Complete eCommerce Micro-Packages Ecosystem

> **The 10-Minute Enterprise eCommerce Suite for India & Global D2C Brands.**
> Assemble high-converting Next.js / Node.js eCommerce applications in 10 minutes with decoupled, zero-bloat micro-packages.

---

## 📦 The 15 Core Packages

| # | Package Name | NPM Link | Key Responsibilities |
|---|---|---|---|
| 1 | [`@boostengine/analytics`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-analytics) | `npm i @boostengine/analytics` | Meta Pixel, GA4, GTM, TikTok, Pinterest unified tracking + React hydration |
| 2 | [`@boostengine/collections`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-collections) | `npm i @boostengine/collections` | Official Postman v2.1 collections & envs for 9 platforms with sync CLI |
| 3 | [`@boostengine/payments`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-payments) | `npm i @boostengine/payments` | Razorpay, Cashfree, PhonePe, Paytm, Stripe, COD with subunit amount normalization & Next.js webhook helper |
| 4 | [`@boostengine/shipping`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-shipping) | `npm i @boostengine/shipping` | Shiprocket, Delhivery, Shadowfax with live rate comparison & cheapest courier auto-selector |
| 5 | [`@boostengine/notifications`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-notifications) | `npm i @boostengine/notifications` | WhatsApp (Interakt, Wati, Gupshup), SMS (Fast2SMS, Msg91), Email (Resend) order & recovery alerts |
| 6 | [`@boostengine/coupons`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-coupons) | `npm i @boostengine/coupons` | Promotions & coupon engine: Flat, %, Tiered spend ladder, BOGO, with `autoApplyBest` |
| 7 | [`@boostengine/auth`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-auth) | `npm i @boostengine/auth` | Frictionless phone OTP with stateless HMAC verification, Next.js cookie sessions & guest cart merge |
| 8 | [`@boostengine/cart`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-cart) | `npm i @boostengine/cart` | Cart engine, intra/inter Indian GST (CGST/SGST/IGST), free shipping progress bar, MRP savings |
| 9 | [`@boostengine/seo`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-seo) | `npm i @boostengine/seo` | Schema.org JSON-LD (Product, Breadcrumbs, FAQ), Google Merchant Center XML feed, Meta Catalog CSV |
| 10 | [`@boostengine/reviews`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-reviews) | `npm i @boostengine/reviews` | Social proof engine: star distribution, verified buyer badge, helpfulness upvoting & Schema.org |
| 11 | [`@boostengine/ui`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-ui) | `npm i @boostengine/ui` | Pre-built UI components: Slide-out Cart Drawer, Sticky Buy Now bar, Pincode Checker, Trust Badges |
| 12 | [`@boostengine/invoicing`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-invoicing) | `npm i @boostengine/invoicing` | Legal Indian GST Tax Invoice & 4x6 Thermal Shipping Label Generator with SVG Barcodes & HSN tables |
| 13 | [`@boostengine/search`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-search) | `npm i @boostengine/search` | Typo-tolerant instant search, multi-faceted filtering, live facet aggregations & URL query sync |
| 14 | [`@boostengine/wishlist`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-wishlist) | `npm i @boostengine/wishlist` | Save-for-later wishlist with guest merge, price-drop alert detection & cart integration |
| 15 | [`@boostengine/inventory`](file:///e:/boost%20engine%20mobile%20apps/04_Client_Projects/Ecom-app/packages/boost-inventory) | `npm i @boostengine/inventory` | Low-stock urgency marketing, 15-minute checkout reservation, and multi-warehouse order routing |

---

## ⚡ 1-Click Install Complete Suite

```bash
npm install @boostengine/analytics @boostengine/collections @boostengine/payments @boostengine/shipping @boostengine/notifications @boostengine/coupons @boostengine/auth @boostengine/cart @boostengine/seo @boostengine/reviews @boostengine/ui @boostengine/invoicing @boostengine/search @boostengine/wishlist @boostengine/inventory
```

---

## 🏗️ 10-Minute D2C Store Architecture

```mermaid
graph TD
    A[Shopper Lands on Store] --> B[@boostengine/analytics Tracks Traffic & Pixels]
    B --> C[Instant Search via @boostengine/search & SEO Schema via @boostengine/seo]
    C --> D[Pincode Check & Trust Badges via @boostengine/ui]
    D --> E[Save for Later via @boostengine/wishlist or Add to Cart via @boostengine/cart]
    E --> F[Stock Reserved via @boostengine/inventory & Coupon Auto-Applied via @boostengine/coupons]
    F --> G[1-Click Phone OTP Login via @boostengine/auth]
    G --> H[Fast Payment via @boostengine/payments Razorpay / PhonePe / Cashfree / Stripe]
    H --> I[Automated WhatsApp / SMS Notification via @boostengine/notifications]
    I --> J[Tax Invoice & Thermal Label via @boostengine/invoicing + Shipping via @boostengine/shipping]
```

---

## 🛠️ Master Build and Publish Scripts

```cmd
cd "e:\boost engine mobile apps\04_Client_Projects\Ecom-app\packages"

# Build and verify test suites for all packages
node build-all.cjs

# Publish all packages to npm publicly
node publish-all.cjs
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
