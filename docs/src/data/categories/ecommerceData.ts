import { UIComponentItem } from '../../types';

export const ecommerceData: UIComponentItem[] = [
  {
    id: 'Price',
    name: 'Price',
    category: 'ecommerce',
    description: 'Formatted eCommerce price component with currency symbol, strikethrough MRP, and savings badge.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add price',
    codeSnippet: `import { Price } from '@boostengine/ui';

export function ProductPricing() {
  return (
    <Price
      amount={1299}
      originalAmount={1999}
      showDiscount
      showSavings
      size="lg"
    />
  );
}`,
    props: [
      { name: 'amount', type: 'number', default: 'Required', description: 'Selling price' },
      { name: 'originalAmount', type: 'number', default: 'undefined', description: 'Original MRP for strikethrough' },
      { name: 'currencySymbol', type: 'string', default: "'₹'", description: 'Currency symbol' }
    ]
  },
  {
    id: 'AddToCart',
    name: 'AddToCart',
    category: 'ecommerce',
    description: 'Standalone Add to Cart button that dynamically transforms into a quantity stepper upon click.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add add-to-cart',
    codeSnippet: `import { AddToCart } from '@boostengine/ui';

export function BuySection() {
  return (
    <AddToCart
      onAdd={(qty) => console.log('Added qty:', qty)}
      onQuantityChange={(qty) => console.log('Changed qty:', qty)}
    />
  );
}`,
    props: [
      { name: 'onAdd', type: '(quantity: number) => void', default: 'undefined', description: 'Fired on initial add' },
      { name: 'maxQuantity', type: 'number', default: '10', description: 'Upper quantity limiter' }
    ]
  },
  {
    id: 'CouponInput',
    name: 'CouponInput',
    category: 'ecommerce',
    description: 'Promo code field with Apply button, uppercase transform, discount badge tag, and remove action.',
    badge: 'Conversion',
    cliCommand: 'npx boost-ui add coupon-input',
    codeSnippet: `import { CouponInput } from '@boostengine/ui';
import { useState } from 'react';

export function CheckoutCoupon() {
  const [applied, setApplied] = useState<string | undefined>();
  return (
    <CouponInput
      appliedCode={applied}
      discountText="Flat ₹200 OFF"
      onApply={(code) => setApplied(code)}
      onRemove={() => setApplied(undefined)}
    />
  );
}`,
    props: [
      { name: 'onApply', type: '(code: string) => void', default: 'undefined', description: 'Coupon apply handler' }
    ]
  },
  {
    id: 'AddressForm',
    name: 'AddressForm',
    category: 'ecommerce',
    description: 'Comprehensive shipping address form with Indian 6-digit pincode, home/work tag, and default address flag.',
    badge: 'India Ready',
    cliCommand: 'npx boost-ui add address-form',
    codeSnippet: `import { AddressForm } from '@boostengine/ui';

export function DeliveryAddress() {
  return (
    <AddressForm
      onSubmit={(address) => console.log('Saved Address:', address)}
    />
  );
}`,
    props: [
      { name: 'onSubmit', type: '(data: AddressData) => void', default: 'undefined', description: 'Form submission callback' }
    ]
  },
  {
    id: 'OrderSummary',
    name: 'OrderSummary',
    category: 'ecommerce',
    description: 'Order cost breakdown with subtotal, discounts, shipping progress threshold, GST taxes, and checkout CTA.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add order-summary',
    codeSnippet: `import { OrderSummary } from '@boostengine/ui';

export function CartTotals() {
  return (
    <OrderSummary
      subtotal={1998}
      discount={200}
      freeShippingThreshold={1500}
      tax={99}
      onCheckout={() => window.location.href = '/checkout'}
    />
  );
}`,
    props: [
      { name: 'subtotal', type: 'number', default: 'Required', description: 'Items subtotal amount' },
      { name: 'freeShippingThreshold', type: 'number', default: 'undefined', description: 'Free shipping milestone' }
    ]
  },
  {
    id: 'CartDrawer',
    name: 'CartDrawer',
    category: 'ecommerce',
    description: 'Slide-out cart drawer with dynamic Indian free shipping progress meter, multi-tab sync, and item management.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add cart-drawer',
    codeSnippet: `import { CartDrawer } from '@boostengine/ui';
import { useState } from 'react';

export function CartDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CartDrawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      items={[{ id: '1', title: 'Cotton Tee', price: 999, quantity: 2 }]}
      subtotal={1998}
      freeShippingThreshold={1500}
      onCheckout={() => console.log('Checkout')}
    />
  );
}`,
    props: [
      { name: 'isOpen', type: 'boolean', default: 'false', description: 'Controls visibility of the slide-out drawer' }
    ]
  },
  {
    id: 'PincodeChecker',
    name: 'PincodeChecker',
    category: 'ecommerce',
    description: 'Indian 6-digit Pincode Serviceability & Cash on Delivery (COD) availability checker widget with estimated delivery date calculation.',
    badge: 'India Ready',
    cliCommand: 'npx boost-ui add pincode-checker',
    codeSnippet: `import { PincodeChecker } from '@boostengine/ui';

export function ProductDetails() {
  return (
    <PincodeChecker
      defaultPincode="110001"
      onCheck={async (pin) => ({
        isServiceable: true,
        estimatedDeliveryDate: 'Wed, Sep 24',
        isCodAvailable: true,
        courier: 'Delhivery'
      })}
    />
  );
}`,
    props: [
      { name: 'defaultPincode', type: 'string', default: "''", description: 'Default prefilled pin code' }
    ]
  },
  {
    id: 'StickyAddToCart',
    name: 'StickyAddToCart',
    category: 'ecommerce',
    description: 'Bottom sticky buy bar for smartphone viewports that activates after scrolling past the main CTA.',
    badge: 'Conversion',
    cliCommand: 'npx boost-ui add sticky-add-to-cart',
    codeSnippet: `import { StickyAddToCart } from '@boostengine/ui';

export function ProductPage() {
  return (
    <StickyAddToCart
      title="Oversized Heavyweight Tee"
      price={999}
      originalPrice={1499}
      onAddToCart={() => console.log('Added to cart')}
    />
  );
}`,
    props: [
      { name: 'price', type: 'number', default: 'Required', description: 'Current item price' }
    ]
  },
  {
    id: 'ProductCard',
    name: 'ProductCard',
    category: 'ecommerce',
    description: 'Conversion-optimized product card with image aspect ratio, discount badge, star ratings, and quick add button.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add product-card',
    codeSnippet: `import { ProductCard } from '@boostengine/ui';

export function Grid() {
  return (
    <ProductCard
      id="prod-1"
      title="Vintage Wash Denim Jacket"
      price={2499}
      originalPrice={3999}
      rating={4.7}
      reviewCount={184}
      imageUrl="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80"
      onAddToCart={(id) => console.log('Add:', id)}
    />
  );
}`,
    props: [
      { name: 'price', type: 'number', default: 'Required', description: 'Product price' }
    ]
  },
  {
    id: 'ProductGallery',
    name: 'ProductGallery',
    category: 'ecommerce',
    description: 'Image gallery with thumbnail strip, swipeable main viewport, and full zoom capability.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add product-gallery',
    codeSnippet: `import { ProductGallery } from '@boostengine/ui';

export function Showcase() {
  return (
    <ProductGallery
      images={[
        { id: '1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', alt: 'Tee Front' },
        { id: '2', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', alt: 'Tee Back' }
      ]}
    />
  );
}`,
    props: [
      { name: 'images', type: 'ProductImage[]', default: '[]', description: 'Array of image objects' }
    ]
  },
  {
    id: 'VariantSelector',
    name: 'VariantSelector',
    category: 'ecommerce',
    description: 'Pill and swatch variant selector for sizes, colors, and inventory availability states.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add variant-selector',
    codeSnippet: `import { VariantSelector } from '@boostengine/ui';
import { useState } from 'react';

export function Options() {
  const [selected, setSelected] = useState({ Size: 'M', Color: 'Black' });
  return (
    <VariantSelector
      groups={[
        { name: 'Size', options: [{ id: 's', label: 'S' }, { id: 'm', label: 'M' }] },
        { name: 'Color', options: [{ id: 'black', label: 'Black' }, { id: 'white', label: 'White' }] }
      ]}
      selectedVariants={selected}
      onChange={(grp, opt) => setSelected({ ...selected, [grp]: opt })}
    />
  );
}`,
    props: [
      { name: 'groups', type: 'VariantGroup[]', default: '[]', description: 'Groups of variant dimensions' }
    ]
  },
  {
    id: 'QuantitySelector',
    name: 'QuantitySelector',
    category: 'ecommerce',
    description: 'Accessible plus and minus quantity stepper with min/max validation bounds.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add quantity-selector',
    codeSnippet: `import { QuantitySelector } from '@boostengine/ui';
import { useState } from 'react';

export function StepperDemo() {
  const [qty, setQty] = useState(1);
  return <QuantitySelector value={qty} onChange={setQty} min={1} max={10} />;
}`,
    props: [
      { name: 'value', type: 'number', default: '1', description: 'Current quantity' }
    ]
  },
  {
    id: 'StarRating',
    name: 'StarRating',
    category: 'ecommerce',
    description: 'Interactive or read-only star rating widget supporting fractional half-stars.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add star-rating',
    codeSnippet: `import { StarRating } from '@boostengine/ui';

export function Rating() {
  return <StarRating rating={4.5} count={248} size={18} />;
}`,
    props: [
      { name: 'rating', type: 'number', default: '0', description: 'Numeric rating value (0 to 5)' }
    ]
  },
  {
    id: 'ReviewBreakdownBars',
    name: 'ReviewBreakdownBars',
    category: 'ecommerce',
    description: 'Amazon-style rating histogram bars showing 5-star to 1-star percentage distributions.',
    badge: 'Conversion',
    cliCommand: 'npx boost-ui add review-breakdown-bars',
    codeSnippet: `import { ReviewBreakdownBars } from '@boostengine/ui';

export function Breakdown() {
  return (
    <ReviewBreakdownBars
      totalReviews={320}
      breakdown={[
        { stars: 5, percentage: 70 },
        { stars: 4, percentage: 18 },
        { stars: 3, percentage: 7 },
        { stars: 2, percentage: 3 },
        { stars: 1, percentage: 2 }
      ]}
    />
  );
}`,
    props: [
      { name: 'breakdown', type: 'ReviewBreakdownItem[]', default: '[]', description: 'Distribution of stars' }
    ]
  },
  {
    id: 'TrustBadges',
    name: 'TrustBadges',
    category: 'ecommerce',
    description: 'Grid or row of eCommerce trust badges: Cash on Delivery, 7-Day Returns, Free Shipping, and 100% Authentic.',
    badge: 'Trust',
    cliCommand: 'npx boost-ui add trust-badges',
    codeSnippet: `import { TrustBadges } from '@boostengine/ui';

export function ProductTrust() {
  return <TrustBadges layout="grid" />;
}`,
    props: [
      { name: 'layout', type: "'grid' | 'row'", default: "'grid'", description: 'Grid or horizontal strip layout' }
    ]
  },
  {
    id: 'OrderTimeline',
    name: 'OrderTimeline',
    category: 'ecommerce',
    description: 'Interactive post-purchase delivery tracker showing Order Confirmed, Shipped, Out for Delivery, and Delivered.',
    badge: 'India Ready',
    cliCommand: 'npx boost-ui add order-timeline',
    codeSnippet: `import { OrderTimeline } from '@boostengine/ui';

export function Tracking() {
  return (
    <OrderTimeline
      currentStage="out_for_delivery"
      estimatedDelivery="Tomorrow by 8 PM"
    />
  );
}`,
    props: [
      { name: 'currentStage', type: "'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered'", default: "'confirmed'", description: 'Active shipment milestone' }
    ]
  },
  {
    id: 'AnnouncementBar',
    name: 'AnnouncementBar',
    category: 'ecommerce',
    description: 'Top header announcement banner for discount vouchers, flash sale notices, and free shipping triggers.',
    badge: 'Urgency',
    cliCommand: 'npx boost-ui add announcement-bar',
    codeSnippet: `import { AnnouncementBar } from '@boostengine/ui';

export function TopBanner() {
  return (
    <AnnouncementBar
      text="FLASH SALE: Flat 20% OFF on all orders using code FESTIVE20"
      closable
    />
  );
}`,
    props: [
      { name: 'text', type: 'string', default: "''", description: 'Banner message text' }
    ]
  },
  {
    id: 'LightningDealsBar',
    name: 'LightningDealsBar',
    category: 'ecommerce',
    description: 'Urgency countdown timer bar with claim percentage progress indicator.',
    badge: 'Urgency',
    cliCommand: 'npx boost-ui add lightning-deals-bar',
    codeSnippet: `import { LightningDealsBar } from '@boostengine/ui';

export function FlashDeal() {
  return (
    <LightningDealsBar
      dealEndsInSeconds={7200}
      claimedPercent={84}
    />
  );
}`,
    props: [
      { name: 'claimedPercent', type: 'number', default: '0', description: 'Percentage of units claimed' }
    ]
  },
  {
    id: 'FrequentlyBoughtTogether',
    name: 'FrequentlyBoughtTogether',
    category: 'ecommerce',
    description: 'Amazon-style product bundle upsell widget with multi-item checkboxes and one-click add bundle button.',
    badge: 'AOV Boost',
    cliCommand: 'npx boost-ui add frequently-bought-together',
    codeSnippet: `import { FrequentlyBoughtTogether } from '@boostengine/ui';

export function Bundle() {
  return (
    <FrequentlyBoughtTogether
      mainProduct={{ id: '1', title: 'Running Shoes', price: 2999 }}
      bundleProducts={[
        { id: '2', title: 'Performance Socks (Pack of 3)', price: 499 }
      ]}
      onAddBundle={(ids) => console.log('Bundle added:', ids)}
    />
  );
}`,
    props: [
      { name: 'bundleProducts', type: 'BundleItem[]', default: '[]', description: 'Items in the bundle' }
    ]
  },
  {
    id: 'BankOffersAccordion',
    name: 'BankOffersAccordion',
    category: 'ecommerce',
    description: 'Flipkart-style bank offers list with instant discount terms and T&C dropdowns.',
    badge: 'India Ready',
    cliCommand: 'npx boost-ui add bank-offers-accordion',
    codeSnippet: `import { BankOffersAccordion } from '@boostengine/ui';

export function Offers() {
  return (
    <BankOffersAccordion
      offers={[
        { id: '1', title: '10% Instant Discount on HDFC Bank Cards', terms: 'Min transaction ₹3,000' }
      ]}
    />
  );
}`,
    props: [
      { name: 'offers', type: 'BankOffer[]', default: '[]', description: 'List of bank offers' }
    ]
  },
  {
    id: 'AssuredBadge',
    name: 'AssuredBadge',
    category: 'ecommerce',
    description: 'Quality assurance badge modeled after Flipkart Assured, Amazon Prime, and SuperCoin trust tags.',
    badge: 'Trust',
    cliCommand: 'npx boost-ui add assured-badge',
    codeSnippet: `import { AssuredBadge } from '@boostengine/ui';

export function TrustTag() {
  return <AssuredBadge type="assured" />;
}`,
    props: [
      { name: 'type', type: "'assured' | 'prime' | 'supercoin'", default: "'assured'", description: 'Badge style' }
    ]
  },
  {
    id: 'DualMobileActionBar',
    name: 'DualMobileActionBar',
    category: 'ecommerce',
    description: 'Mobile dual action sticky bar with secondary Add to Bag button and primary Buy Now button.',
    badge: 'Conversion',
    cliCommand: 'npx boost-ui add dual-mobile-action-bar',
    codeSnippet: `import { DualMobileActionBar } from '@boostengine/ui';

export function StickyActions() {
  return (
    <DualMobileActionBar
      onAddToCart={() => console.log('Add to cart')}
      onBuyNow={() => console.log('Buy now')}
    />
  );
}`,
    props: [
      { name: 'price', type: 'number', default: 'undefined', description: 'Product selling price' },
      { name: 'compareAtPrice', type: 'number', default: 'undefined', description: 'MRP or strikethrough price' },
      { name: 'currencySymbol', type: 'string', default: "'₹'", description: 'Currency symbol' },
      { name: 'isInCart', type: 'boolean', default: 'false', description: 'Changes Add to Bag state' },
      { name: 'isWishlisted', type: 'boolean', default: 'false', description: 'Wishlist heart state' },
      { name: 'onAddToCart', type: '() => void', default: 'undefined', description: 'Callback when Add to Cart is clicked' },
      { name: 'onBuyNow', type: '() => void', default: 'undefined', description: 'Callback when Buy Now is clicked' },
      { name: 'onToggleWishlist', type: '() => void', default: 'undefined', description: 'Callback when Wishlist heart is clicked' }
    ]
  }
];
