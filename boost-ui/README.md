# @boostengine/ui 🎨

[![npm version](https://img.shields.io/npm/v/@boostengine/ui.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/ui)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/ui.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/ui)
[![license](https://img.shields.io/npm/l/@boostengine/ui.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React 18 & 19](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg?style=flat-square)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-13%20%7C%2014%20%7C%2015-black.svg?style=flat-square)](https://nextjs.org/)

> **Pre-built, high-converting eCommerce UI components for React and Next.js. Includes Cart Drawer, Product Gallery with Zoom, Variant Swatches, Sticky Mobile Buy Bar, Pincode Delivery Checker, Trust Badges, and 10+ more.**

Zero external CSS dependencies. Pre-configured with `'use client'` for Next.js App Router. Works out of the box with **Next.js**, **Vite**, and **Remix**.

---

## 📸 Visual UI Preview (Screenshots & Layouts)

### 1. Product Detail Page & Sticky Buy Bar (Mobile & Desktop)
```text
+-------------------------------------------------------------------------------+
| [AnnouncementBar] ⚡ Use code BOOST20 for 20% OFF | Free Shipping > ₹999 [x]  |
+-------------------------------------------------------------------------------+
| [Navbar]  BOOST STORE    [Search products...]    (♡ Wishlist)  (🛒 Cart: 2)   |
+-------------------------------------------------------------------------------+
|                                       |                                       |
|  [ProductGallery]                     |  [Product Info & Form]                |
|  +---------------------------------+  |  Minimalist Oversized Tee             |
|  |                                 |  |  ⭐⭐⭐⭐☆ (4.8 / 5) (142 reviews)     |
|  |      [ Zoom on Hover ]          |  |  ₹999  ~~₹1,499~~ (33% OFF)           |
|  |                                 |  |                                       |
|  +---------------------------------+  |  [VariantSelector]                    |
|  [Thumb 1] [Thumb 2] [Thumb 3]        |  Color: (● Black) (○ White) (● Olive) |
|                                       |  Size:  [ S ]  [ M ]  [ L ]  [ XL ]   |
|                                       |                                       |
|                                       |  Quantity: [-] 1 [+]                  |
|                                       |                                       |
|                                       |  [PincodeChecker]                     |
|                                       |  [ 560001 ] [Check Delivery]          |
|                                       |  🚚 Delivery by Friday | COD Available|
|                                       |                                       |
|                                       |  [TrustBadges]                        |
|                                       |  [✓ 100% Genuine] [↺ 7-Day Returns]   |
+-------------------------------------------------------------------------------+
| [StickyAddToCart - Mobile Screen Bottom]                                      |
| Minimalist Tee | ₹999  [-] 1 [+]  [ Add to Cart ]  [ Buy Now (⚡ 1-Click) ]  |
+-------------------------------------------------------------------------------+
```

### 2. Slide-out Cart Drawer with Free Shipping Progress
```text
+-------------------------------------------------------------+
| Your Shopping Bag (2 Items)                             [X] |
+-------------------------------------------------------------+
| 🚚 Add ₹300 more to unlock FREE Delivery!                   |
| [======================================------] 70% Progress |
+-------------------------------------------------------------+
| [Item 1 Image]  Cyberpunk Graphic Tee                       |
|                 Size: L | Color: Black                      |
|                 ₹699   [-] 1 [+]                     [🗑️]   |
+-------------------------------------------------------------+
| [Item 2 Image]  Relaxed Fit Cargo Pants                     |
|                 Size: 32 | Color: Olive                     |
|                 ₹1,299 [-] 1 [+]                     [🗑️]   |
+-------------------------------------------------------------+
| Subtotal:                                            ₹1,998 |
| Estimated Tax (GST 18%):                      Inclusive (₹0)|
| Shipping:                                              FREE |
+-------------------------------------------------------------+
| [            PROCEED TO CHECKOUT  👉 (₹1,998)               ] |
+-------------------------------------------------------------+
```

---

## 🌟 Included Components Catalog

| Category | Component | Description |
| :--- | :--- | :--- |
| **Navigation** | `Navbar` | Responsive top navbar with search bar, link badges, cart badge & mobile drawer. |
| **Navigation** | `AnnouncementBar` | Animated cycling promo ticker with 1-click coupon code copy button. |
| **Navigation** | `Footer` | Multi-column footer with newsletter input, payment badges, and legal links. |
| **Navigation** | `MobileBottomBar` | Native app-like bottom navigation (`Home`, `Search`, `Wishlist`, `Bag`, `Account`). |
| **Product** | `ProductGallery` | Multi-image product showcase with hover zoom and thumbnail switcher. |
| **Product** | `VariantSelector` | Interactive color circles and size pills with out-of-stock indicators. |
| **Product** | `ProductCard` | Catalog card with secondary image hover-flip, discount badge & quick add. |
| **Product** | `QuantitySelector` | Clean stepper `[-] 1 [+]` with min/max safety limits. |
| **Product** | `ReviewBreakdownBars` | 5-star to 1-star visual percentage bars with ratings average. |
| **Checkout** | `CartDrawer` | Slide-out cart with real-time Free Shipping progress meter. |
| **Checkout** | `StickyAddToCart` | Mobile-first bottom bar that sticks when scrolling past the main buy button. |
| **Checkout** | `PincodeChecker` | Indian pincode validator with estimated delivery date and COD badge. |
| **Trust** | `TrustBadges` | High-converting badges (*100% Genuine*, *7-Day Easy Returns*, *COD*, *SSL*). |
| **Orders** | `OrderTimeline` | Multi-step tracking (*Placed &rarr; Confirmed &rarr; Shipped &rarr; Delivered*). |

---

## 📦 Installation

Install with your favorite package manager:

```bash
# npm
npm install @boostengine/ui

# pnpm
pnpm add @boostengine/ui

# yarn
yarn add @boostengine/ui
```

---

## 🚀 Quickstart

### Next.js App Router (Next.js 13, 14, 15)

```tsx
'use client';

import { useState } from 'react';
import {
  AnnouncementBar,
  Navbar,
  Footer,
  MobileBottomBar,
  ProductGallery,
  VariantSelector,
  QuantitySelector,
  PincodeChecker,
  TrustBadges,
  CartDrawer,
  StickyAddToCart
} from '@boostengine/ui';

export default function ProductPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({ Size: 'M', Color: 'Black' });
  const [qty, setQty] = useState(1);

  return (
    <div>
      {/* 1. Promo Announcement Banner */}
      <AnnouncementBar
        messages={[
          '⚡ Flat 20% OFF on all orders above ₹999',
          '🚚 Free Express Shipping across India'
        ]}
        couponCode="BOOST20"
      />

      {/* 2. Main Header */}
      <Navbar
        brandName="BoostStore"
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      {/* 3. Product Details */}
      <main style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Gallery with Zoom */}
          <ProductGallery
            images={[
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
              'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'
            ]}
          />

          {/* Product Buying Form */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Boost Minimalist Oversized Tee</h1>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '12px 0' }}>₹999</p>

            {/* Color & Size Swatches */}
            <VariantSelector
              options={[
                {
                  name: 'Color',
                  type: 'color',
                  values: [
                    { label: 'Black', value: '#111827' },
                    { label: 'White', value: '#ffffff' }
                  ]
                },
                {
                  name: 'Size',
                  type: 'pill',
                  values: [
                    { label: 'S', value: 'S' },
                    { label: 'M', value: 'M' },
                    { label: 'L', value: 'L' }
                  ]
                }
              ]}
              selectedVariants={selectedVariants}
              onChange={(name, val) => setSelectedVariants(prev => ({ ...prev, [name]: val }))}
            />

            {/* Stepper */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Quantity:</label>
              <QuantitySelector value={qty} min={1} max={10} onChange={setQty} />
            </div>

            {/* Pincode & Delivery Checker */}
            <PincodeChecker style={{ marginTop: '24px' }} />

            {/* Conversion Trust Badges */}
            <TrustBadges style={{ marginTop: '24px' }} />
          </div>
        </div>
      </main>

      {/* 4. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={[{ id: '1', title: 'Minimalist Tee', price: 999, quantity: qty }]}
        subtotal={999 * qty}
        freeShippingThreshold={999}
        onCheckout={() => window.location.href = '/checkout'}
      />

      {/* 5. Mobile Sticky Bottom Buy Bar */}
      <StickyAddToCart
        title="Minimalist Oversized Tee"
        price={999}
        onAddToCart={() => {
          setCartCount(prev => prev + 1);
          setCartOpen(true);
        }}
      />

      {/* 6. Footer & Mobile Bar */}
      <Footer brandName="BoostStore" />
      <MobileBottomBar cartCount={cartCount} onTabChange={(tabId) => console.log('Tab selected:', tabId)} />
    </div>
  );
}
```

---

### Vite + React Example

Works seamlessly in Vite with zero extra plugins required:

```tsx
import React, { useState } from 'react';
import { ProductCard, CartDrawer } from '@boostengine/ui';

export function ProductGrid() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      <ProductCard
        title="Cyberpunk Graphic Tee"
        price={699}
        compareAtPrice={1299}
        imageUrl="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
        onAddToCart={() => setCartOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={[{ id: 'item_1', title: 'Cyberpunk Graphic Tee', price: 699, quantity: 1 }]}
        subtotal={699}
      />
    </div>
  );
}
```

---

## ⚙️ Component Props Reference

### `<ProductGallery />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `images` | `string[]` | **Required** | Array of image URLs to display. |
| `aspectRatio` | `string` | `'3/4'` | CSS aspect ratio of the main image container. |
| `zoomFactor` | `number` | `2` | Magnification factor when hovering over the main photo. |

### `<VariantSelector />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `VariantOption[]` | **Required** | Array of variant types (`color` with hex or `pill` with text). |
| `selectedVariants`| `Record<string, string>` | `{}` | Currently active selections (e.g. `{ Color: '#000', Size: 'M' }`). |
| `onChange` | `(name: string, value: string) => void` | **Required** | Callback when user selects an option. |

### `<CartDrawer />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | `false` | Controls whether the drawer is visible. |
| `onClose` | `() => void` | **Required** | Callback triggered when user clicks backdrop or close button. |
| `items` | `CartItem[]` | `[]` | Array of cart items with `id`, `title`, `price`, `quantity`. |
| `subtotal` | `number` | `0` | Order subtotal in primary currency. |
| `freeShippingThreshold` | `number` | `undefined` | Threshold value (e.g. `999`) to show motivational progress bar. |
| `onCheckout` | `() => void` | `undefined` | Callback when user clicks the checkout CTA. |

### `<PincodeChecker />`
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onCheck` | `(pincode: string) => Promise<PincodeResult>` | `defaultMock` | Custom verification function (e.g. calling `@boostengine/shipping`). |
| `placeholder` | `string` | `'Enter 6-digit Pincode'` | Input placeholder text. |

---

## 🎨 Customization & Theming

Every component uses inline CSS styles with standard design tokens, meaning:
1. **No Tailwind or Sass required**: You do not need to configure CSS purge lists or PostCSS plugins.
2. **Custom Style Overrides**: Pass standard `style` and `className` props to any component.
3. **CSS Variables Support**: Supports standard font inheritance and responsive viewport sizing.

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Do these components cause SSR hydration mismatches in Next.js?**  
A: No. All interactive components (`CartDrawer`, `StickyAddToCart`, `VariantSelector`) have `'use client'` pre-bundled, ensuring 100% clean SSR hydration without flickering.

**Q: Can I connect this with `@boostengine/cart`?**  
A: Absolutely! Simply pass `cart.getSummary().subtotal` and `cart.getItems()` directly into the `<CartDrawer />` component.

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
