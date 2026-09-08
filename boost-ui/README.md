# @boostengine/ui 🎨

> **Pre-Built High-Converting eCommerce UI Components for Next.js & React: Slide-out Cart Drawer with Free Shipping Progress Bar, Mobile Sticky Buy Bar, Pincode Delivery Checker, Trust Badges & Order Timeline.**

Zero configuration, works with Tailwind CSS, Vanilla CSS, or raw inline styles, pre-bundled with `'use client'` for Next.js 13/14/15 App Router.

---

## 🌟 Included Components

1. **`CartDrawer`**: Slide-out cart with real-time Free Shipping Progress Bar, item quantity selector, and 1-click checkout CTA.
2. **`StickyAddToCart`**: Mobile-first bottom bar that appears on scroll with product title, price, quantity controls, and instant "Add to Cart" / "Buy Now".
3. **`PincodeChecker`**: Pincode verification input with delivery date calculation and Cash on Delivery (COD) badge.
4. **`TrustBadges`**: High-converting vector icons for *100% Genuine*, *7-Day Easy Returns*, *COD Available*, and *256-Bit SSL Secure*.
5. **`OrderTimeline`**: Step-by-step order tracking progress (*Placed &rarr; Confirmed &rarr; Shipped &rarr; Out for Delivery &rarr; Delivered*).
6. **`StarRating`**: Amber-gold 5-star display with half-star fill and total review counts.

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
  CartDrawer,
  StickyAddToCart,
  PincodeChecker,
  TrustBadges,
  StarRating,
} from '@boostengine/ui';

export default function ProductPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: '1', title: 'Oversized Hoodie', price: 1999, quantity: 1 },
  ]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Oversized Cyberpunk Hoodie</h1>
      <StarRating rating={4.8} reviewCount={42} />

      <p style={{ fontSize: '24px', fontWeight: 800 }}>₹1,999</p>

      {/* Pincode Estimator */}
      <PincodeChecker />

      {/* Conversion Badges */}
      <TrustBadges />

      {/* Mobile Sticky Add to Cart */}
      <StickyAddToCart
        title="Oversized Cyberpunk Hoodie"
        price={1999}
        compareAtPrice={2999}
        onAddToCart={() => setIsCartOpen(true)}
        onBuyNow={() => console.log('Direct Checkout')}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={1999}
        freeShippingThreshold={999}
        onUpdateQuantity={(id, qty) => console.log(id, qty)}
        onRemoveItem={(id) => console.log('Remove', id)}
        onCheckout={() => console.log('Proceed to checkout')}
      />
    </div>
  );
}
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
