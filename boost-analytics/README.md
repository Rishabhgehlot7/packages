# @boostengine/analytics

> Universal eCommerce Analytics & Pixel Tracker for **Next.js (App Router / Pages)** and **Vite (React)**.

Automatically integrates and unifies:
* 🎯 **Meta (Facebook) Pixel** (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`)
* 📊 **Google Tag Manager (GTM) / GA4 eCommerce DataLayer** (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`)
* 🔍 **Microsoft Clarity** heatmaps & session recordings
* 🛡️ **In-App Browser Error Shield** (Prevents Instagram/Facebook/WhatsApp WebViews from throwing unhandled Java bridge exceptions)
* 🔁 **Purchase Event Deduplication** (Prevents duplicate revenue tracking on page refresh)

---

## 📦 Installation

```bash
npm install @boostengine/analytics
# or
yarn add @boostengine/analytics
# or
pnpm add @boostengine/analytics
```

---

## 🚀 Quickstart

### 1. Next.js (App Router)

In your root layout (`src/app/layout.tsx`):

```tsx
import { BoostAnalytics } from '@boostengine/analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BoostAnalytics
          fbPixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          clarityId={process.env.NEXT_PUBLIC_CLARITY_ID}
          currency="INR"
          defaultBrand="Your Brand"
        />
        {children}
      </body>
    </html>
  );
}
```

### 2. Vite (React)

In your main entry (`src/App.tsx` or `src/main.tsx`):

```tsx
import React from 'react';
import { BoostAnalytics } from '@boostengine/analytics';

export default function App() {
  return (
    <BoostAnalytics
      fbPixelId={import.meta.env.VITE_FB_PIXEL_ID}
      gtmId={import.meta.env.VITE_GTM_ID}
      clarityId={import.meta.env.VITE_CLARITY_ID}
      currency="INR"
      defaultBrand="Your Brand"
    >
      <YourAppRoutes />
    </BoostAnalytics>
  );
}
```

---

## 🛒 eCommerce Tracking Events

### 1. View Product (PDP)
Call when a product page loads:

```tsx
'use client';
import { trackViewItem } from '@boostengine/analytics';

useEffect(() => {
  trackViewItem({
    id: product._id,
    name: product.title,
    price: product.price,
    category: product.category,
    brand: 'Your Brand',
  });
}, [product]);
```

### 2. Add to Cart
Call inside your "Add to Cart" button handler:

```tsx
import { trackAddToCart } from '@boostengine/analytics';

const onAddToCart = () => {
  trackAddToCart({
    id: product._id,
    name: product.title,
    price: product.price,
    quantity: 1,
    category: product.category,
  });
};
```

### 3. Begin Checkout
Call when customer visits the checkout page:

```tsx
import { trackBeginCheckout } from '@boostengine/analytics';

trackBeginCheckout({
  totalValue: cartTotal,
  items: cartItems.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
});
```

### 4. Add Payment Info
Call when customer chooses or submits payment method:

```tsx
import { trackAddPaymentInfo } from '@boostengine/analytics';

trackAddPaymentInfo({
  totalValue: orderTotal,
  paymentMethod: 'Razorpay',
  items: orderItems,
});
```

### 5. Purchase / Order Confirmation
Call on Order Success / Thank You page. **Automatically deduplicated** using sessionStorage so customer refreshes won't duplicate numbers in Meta Ads / GA4!

```tsx
import { trackPurchase } from '@boostengine/analytics';

trackPurchase({
  transaction_id: order.orderId,
  value: order.totalAmount,
  tax: order.taxAmount,
  shipping: order.shippingCost,
  coupon: order.couponCode,
  items: order.items.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
});
```

### 6. Custom Event
Track any custom interaction:

```tsx
import { trackCustomEvent } from '@boostengine/analytics';

trackCustomEvent('LeadFormSubmitted', { form_name: 'Contact' });
```

---

## 🎯 Real-Time Event Tester & Debugger (Test Mode)

How do you or your marketing team know if events are actually firing? 

Enable Test Mode to display a live, on-screen floating **Event Inspector Widget**:

```tsx
<BoostAnalytics
  fbPixelId="123456789"
  gtmId="GTM-XXXXX"
  showDebugger={process.env.NODE_ENV === 'development'}
/>
```
*(Or simply add `?boost_debug=1` to any URL in your browser!)*

### What the Inspector Does:
1. **Live Connection Health:** Displays whether Meta Pixel, GTM/GA4, and Clarity are active or blocked.
2. **1-Click Test Triggers:** Click **"🛒 Test AddToCart"** or **"💳 Test Purchase"** to fire simulated events instantly and inspect them in your Meta Pixel Helper extension and GTM Preview!
3. **Real-time Event Stream:** Shows every event, timestamp, channels triggered, and full expandable JSON payload.

---

## ⚡ Framework & Browser Support

| Framework / Tool | Support | Notes |
| :--- | :--- | :--- |
| **Next.js (App Router)** | ✅ 100% | Full SSR safety with `'use client'` |
| **Next.js (Pages Router)** | ✅ 100% | Works in `_app.tsx` |
| **Vite (React)** | ✅ 100% | Works in `App.tsx` / `main.tsx` |
| **Remix / Astro** | ✅ 100% | Client component mode |
| **In-App WebViews** | ✅ 100% | Java bridge error auto-shielded |

---

## 📄 License
MIT © [Boost Engine](https://boostengine.in)


