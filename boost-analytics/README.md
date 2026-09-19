# @boostengine/analytics 📊

[![npm version](https://img.shields.io/npm/v/@boostengine/analytics.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/analytics)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/analytics.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/analytics)
[![license](https://img.shields.io/npm/l/@boostengine/analytics.svg?style=flat-square)](https://github.com/Rishabhgehlot7/packages/blob/main/LICENSE)
[![Next.js Ready](https://img.shields.io/badge/Next.js-App%20Router%20%26%20Pages%20Router-black.svg?style=flat-square)](https://nextjs.org/)
[![Multi-Pixel](https://img.shields.io/badge/Pixels-Meta%20%7C%20GA4%20%7C%20GTM%20%7C%20Clarity-orange.svg?style=flat-square)](https://github.com/Rishabhgehlot7/packages)

> **Universal eCommerce analytics and pixel tracker for Next.js, React, and Vite. Fires unified events to Meta Pixel (Facebook), Google Analytics 4 (GA4), Google Tag Manager (GTM), and Microsoft Clarity with WebView error shielding.**

Prevents Instagram / Facebook in-app browser script crashes. Zero manual `window.fbq` or `window.gtag` boilerplate.

---

## 📸 Unified Event Tracking Flow

```text
               Customer Clicks: [ Add to Cart - ₹1,499 ]
                                   │
                                   ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                     @boostengine/analytics                      │
  ├─────────────────────────────────────────────────────────────────┤
  │ trackAddToCart({ id: 'hoodie_01', price: 1499, currency: 'INR' })│
  └───────────────┬─────────────────┬─────────────────┬─────────────┘
                  │                 │                 │
   ┌──────────────▼────────┐ ┌──────▼─────────┐ ┌─────▼──────────┐
   │ Meta Pixel (fbq)      │ │ GA4 / GTM      │ │ MS Clarity     │
   ├───────────────────────┤ ├────────────────┤ ├────────────────┤
   │ fbq('track',          │ │ gtag('event',  │ │ Session tag &  │
   │   'AddToCart', {...}) │ │ 'add_to_cart') │ │ funnel marked  │
   └───────────────────────┘ └────────────────┘ └────────────────┘
```

---

## 🌟 Key Highlights

- **⚡ 1-Click Multi-Pixel Setup**: Inject Meta Pixel, GA4, GTM, and Microsoft Clarity tracking tags with a single `<BoostAnalyticsProvider />` component.
- **🛡️ In-App Browser Shielding**: Prevents iOS & Android Instagram / Facebook WebViews from throwing unhandled script exceptions.
- **🛒 E-commerce Standard Events**: Pre-built helpers for `trackPageView`, `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout`, and `trackPurchase`.
- **⚛️ Universal Framework Support**: Works seamlessly in Next.js 13/14/15 App Router, Next.js Pages Router, and Vite + React.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/analytics

# pnpm
pnpm add @boostengine/analytics

# yarn
yarn add @boostengine/analytics
```

---

## 🚀 Quickstart Guide

### 1. Root Provider Setup (`app/layout.tsx`)

```tsx
import { BoostAnalyticsProvider } from '@boostengine/analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <BoostAnalyticsProvider
          metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
          ga4MeasurementId={process.env.NEXT_PUBLIC_GA4_ID}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          clarityId={process.env.NEXT_PUBLIC_CLARITY_ID}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### 2. Triggering Events Anywhere in Your Store

```tsx
'use client';

import { useAnalytics } from '@boostengine/analytics';

export default function ProductBuyButton({ product }: any) {
  const { trackAddToCart, trackPurchase } = useAnalytics();

  const handleAdd = () => {
    trackAddToCart({
      content_ids: [product.id],
      content_name: product.title,
      currency: 'INR',
      value: product.price,
    });
  };

  return <button onClick={handleAdd}>Add to Bag</button>;
}
```

---

MIT © [Rishabh Gehlot](https://github.com/Rishabhgehlot7) • [Repository](https://github.com/Rishabhgehlot7/packages)
