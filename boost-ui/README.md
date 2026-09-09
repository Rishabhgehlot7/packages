# @boostengine/ui 🎨

> **Pre-Built High-Converting eCommerce UI Components for Next.js & React: Product Gallery with Zoom, Variant Swatches, Product Cards, Full Navbar, Footer, Mobile Bottom Bar, Announcement Banner, Quantity Selector, Review Breakdown, Slide-out Cart Drawer, Sticky Buy Bar, Pincode Checker, and Trust Badges.**

Zero configuration, zero external CSS dependencies, pre-bundled with `'use client'` for Next.js 13/14/15 App Router.

---

## 🌟 Included Components (Complete D2C Suite)

### 🛍️ Layout & Navigation
1. **`Navbar`**: Responsive top navigation with search bar, link badges, wishlist/cart badge counts, and mobile menu.
2. **`AnnouncementBar`**: Cycling promo ticker with 1-click coupon code copy button and dismiss action.
3. **`Footer`**: Multi-column footer with newsletter subscription, payment badges (UPI, RuPay, Visa), and company policies.
4. **`MobileBottomBar`**: Fixed bottom navigation bar for mobile devices (`Home | Search | Wishlist | Bag | Profile`) with active tab indicators and badge counters.

### 📦 Product Experience & Catalog
5. **`ProductGallery`**: Responsive product media showcase with hover zoom, vertical or horizontal thumbnail carousel, and badge overlays.
6. **`VariantSelector`**: Interactive color swatch circles, size pills with stock availability, price delta hints, and sold-out cross-outs.
7. **`ProductCard`**: High-converting catalog cards with secondary image hover-flip, discount tags, rating badges, stock urgency, and quick add-to-cart.
8. **`QuantitySelector`**: Stepper `[-] 1 [+]` with min/max stock limits and multiple size variants (`sm`, `md`, `lg`).
9. **`ReviewBreakdownBars`**: Average rating summary with interactive 5-star to 1-star percentage distribution bars.

### ⚡ Conversion & Checkout Accelerators
10. **`CartDrawer`**: Slide-out cart with real-time Free Shipping Progress Bar, item quantity selector, and 1-click checkout CTA.
11. **`StickyAddToCart`**: Mobile-first bottom bar that appears on scroll with product title, price, quantity controls, and instant "Add to Cart" / "Buy Now".
12. **`PincodeChecker`**: Pincode verification input with delivery date calculation and Cash on Delivery (COD) badge.
13. **`TrustBadges`**: High-converting vector icons for *100% Genuine*, *7-Day Easy Returns*, *COD Available*, and *256-Bit SSL Secure*.
14. **`OrderTimeline`**: Step-by-step order tracking progress (*Placed &rarr; Confirmed &rarr; Shipped &rarr; Out for Delivery &rarr; Delivered*).
15. **`StarRating`**: Amber-gold 5-star display with half-star fill and total review counts.

---

## 📦 Installation

```bash
npm install @boostengine/ui
```

---

## 🚀 Quickstart (Next.js App Router)

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

export default function StorePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({ Size: 'M', Color: 'Black' });
  const [qty, setQty] = useState(1);

  return (
    <div>
      <AnnouncementBar
        messages={['⚡ Flat 20% OFF on all orders above ₹999', '🚚 Free Express Shipping across India']}
        couponCode="BOOST20"
      />

      <Navbar
        brandName="BoostStore"
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Gallery */}
          <ProductGallery
            images={[
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
              'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'
            ]}
          />

          {/* Product Form */}
          <div>
            <h1>Boost Minimalist Oversized Tee</h1>
            <p style={{ fontSize: '24px', fontWeight: 800 }}>₹999</p>

            <VariantSelector
              options={[
                { name: 'Color', type: 'color', values: [{ label: 'Black', value: '#111827' }, { label: 'White', value: '#ffffff' }] },
                { name: 'Size', type: 'pill', values: [{ label: 'S', value: 'S' }, { label: 'M', value: 'M' }, { label: 'L', value: 'L' }] }
              ]}
              selectedVariants={selectedVariants}
              onChange={(name, val) => setSelectedVariants(prev => ({ ...prev, [name]: val }))}
            />

            <div style={{ marginTop: '20px' }}>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            <PincodeChecker style={{ marginTop: '24px' }} />
            <TrustBadges style={{ marginTop: '24px' }} />
          </div>
        </div>
      </main>

      <Footer brandName="BoostStore" />
      <MobileBottomBar cartCount={cartCount} onTabChange={(id) => console.log('Tab:', id)} />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={[{ id: '1', title: 'Minimalist Tee', price: 999, quantity: qty }]}
        subtotal={999 * qty}
        freeShippingThreshold={999}
      />
    </div>
  );
}
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
