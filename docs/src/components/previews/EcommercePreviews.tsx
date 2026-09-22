import React, { useState } from 'react';
import {
  Price,
  AddToCart,
  CouponInput,
  AddressForm,
  OrderSummary,
  CartDrawer,
  PincodeChecker,
  StickyAddToCart,
  ProductCard,
  ProductGallery,
  VariantSelector,
  QuantitySelector,
  StarRating,
  ReviewBreakdownBars,
  TrustBadges,
  OrderTimeline,
  OrderStage,
  AnnouncementBar,
  LightningDealsBar,
  FrequentlyBoughtTogether,
  BankOffersAccordion,
  AssuredBadge,
  DualMobileActionBar,
  Button,
  VStack,
  HStack,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const PricePreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Price amount={1299} originalAmount={1999} size="xl" showDiscount showSavings />
    <Price amount={899} originalAmount={1299} size="md" showDiscount />
    <Price amount={499} size="sm" />
  </div>
);

export const AddToCartPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <AddToCart
      onAdd={(qty) => onShowToast(`Added ${qty} item(s) to cart`)}
      onQuantityChange={(qty) => onShowToast(`Updated quantity: ${qty}`)}
    />
  </div>
);

export const CouponInputPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [coupon, setCoupon] = useState<string | undefined>('SAVE200');
  return (
    <div style={{ maxWidth: '360px' }}>
      <CouponInput
        appliedCode={coupon}
        discountText="Flat ₹200 OFF"
        onApply={(code) => {
          setCoupon(code);
          onShowToast(`Coupon ${code} applied successfully!`);
        }}
        onRemove={() => {
          setCoupon(undefined);
          onShowToast('Coupon removed');
        }}
      />
    </div>
  );
};

export const AddressFormPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '520px' }}>
    <AddressForm
      onSubmit={(data) => onShowToast(`Address saved for ${data.fullName}`)}
    />
  </div>
);

export const OrderSummaryPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '380px' }}>
    <OrderSummary
      subtotal={2498}
      discount={200}
      shippingFee={0}
      tax={124}
      freeShippingThreshold={1500}
      onCheckout={() => onShowToast('Redirecting to secure gateway')}
    />
  </div>
);

export const CartDrawerPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 'item-1', title: 'Premium Heavyweight Oversized Tee', price: 999, quantity: 1, variantTitle: 'Size: L - Jet Black' },
    { id: 'item-2', title: 'Cargo Joggers (Water Resistant)', price: 1499, quantity: 1, variantTitle: 'Size: 32 - Olive' }
  ]);
  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <Button variant="primary" onClick={() => setIsCartOpen(true)}>
        Open Cart Drawer ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
      </Button>
      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        Subtotal: ₹{subtotal} • Free Shipping threshold: ₹1500
      </p>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        freeShippingThreshold={1500}
        onUpdateQuantity={(id, qty) => {
          setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
        }}
        onRemoveItem={(id) => {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
        }}
        onCheckout={() => {
          onShowToast('Checkout triggered');
          setIsCartOpen(false);
        }}
      />
    </div>
  );
};

export const PincodeCheckerPreview: React.FC<PreviewProps> = () => (
  <div style={{ maxWidth: '400px', margin: '0 auto', background: 'var(--boost-surface, #ffffff)', padding: '1.5rem', borderRadius: '12px' }}>
    <PincodeChecker
      defaultPincode="110001"
      onCheck={async (pin) => {
        return {
          isServiceable: pin.length === 6,
          estimatedDeliveryDate: 'Wed, Sep 24',
          isCodAvailable: true,
          courier: 'Delhivery Express'
        };
      }}
    />
  </div>
);

export const StickyAddToCartPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ padding: '20px 0', position: 'relative', minHeight: '120px', width: '100%', overflow: 'hidden' }}>
    <StickyAddToCart
      title="Oversized Heavyweight Loopknit Tee"
      price={999}
      originalPrice={1499}
      onAddToCart={() => onShowToast('Added via sticky bottom bar')}
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
    />
  </div>
);

export const ProductCardPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ maxWidth: '300px' }}>
    <ProductCard
      id="prod-1"
      title="Vintage Wash Heavyweight Denim Jacket"
      price={2499}
      originalPrice={3999}
      rating={4.8}
      reviewCount={142}
      imageUrl="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80"
      onAddToCart={(id) => onShowToast(`Added product ${id} to cart`)}
    />
  </div>
);

export const ProductGalleryPreview: React.FC<PreviewProps> = () => (
  <div style={{ maxWidth: '420px', width: '100%' }}>
    <ProductGallery
      aspectRatio="portrait"
      images={[
        { id: '1', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', alt: 'Clean White Tee Front' },
        { id: '2', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', alt: 'Cotton Fabric Texture' },
        { id: '3', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', alt: 'Black Heavyweight Tee' },
        { id: '4', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80', alt: 'Denim Styling Match' }
      ]}
    />
  </div>
);

export const VariantSelectorPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({
    Size: 'M',
    Color: 'Black'
  });
  return (
    <div style={{ maxWidth: '360px' }}>
      <VariantSelector
        groups={[
          { name: 'Size', options: [{ id: 's', label: 'S' }, { id: 'm', label: 'M' }, { id: 'l', label: 'L' }, { id: 'xl', label: 'XL' }] },
          { name: 'Color', options: [{ id: 'Black', label: 'Black' }, { id: 'Olive', label: 'Olive' }, { id: 'Sand', label: 'Sand' }] }
        ]}
        selectedValues={selectedVariants}
        onChange={(grp, opt) => {
          setSelectedVariants({ ...selectedVariants, [grp]: opt });
          onShowToast(`Selected ${grp}: ${opt}`);
        }}
      />
    </div>
  );
};

export const QuantitySelectorPreview: React.FC<PreviewProps> = ({ onShowToast }) => {
  const [qty, setQty] = useState(2);
  return (
    <QuantitySelector
      value={qty}
      onChange={(q) => {
        setQty(q);
        onShowToast(`Quantity set to ${q}`);
      }}
      min={1}
      max={10}
    />
  );
};

export const StarRatingPreview: React.FC<PreviewProps> = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <StarRating
        rating={4.8}
        reviewCount={312}
        size={20}
      />
      <span style={{ fontSize: '12px', color: '#64748b' }}>Customer reviews breakdown score</span>
    </div>
  );
};

export const ReviewBreakdownBarsPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '640px' }}>
    <ReviewBreakdownBars
      averageRating={4.6}
      totalReviews={420}
      breakdown={[
        { stars: 5, percentage: 72, count: 302 },
        { stars: 4, percentage: 18, count: 75 },
        { stars: 3, percentage: 6, count: 25 },
        { stars: 2, percentage: 3, count: 12 },
        { stars: 1, percentage: 1, count: 6 }
      ]}
    />
  </div>
);

export const TrustBadgesPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '680px' }}>
    <TrustBadges layout="grid" />
  </div>
);

export const OrderTimelinePreview: React.FC<PreviewProps> = () => {
  const [stage, setStage] = useState<OrderStage>('out_for_delivery');
  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['confirmed', 'shipped', 'out_for_delivery', 'delivered'] as OrderStage[]).map((s) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              border: `1px solid ${stage === s ? 'var(--primary, #6366f1)' : 'var(--border, #cbd5e1)'}`,
              backgroundColor: stage === s ? 'var(--primary, #6366f1)' : 'var(--bg-secondary, #ffffff)',
              color: stage === s ? '#ffffff' : 'var(--text-secondary, #475569)',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease',
            }}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
      <OrderTimeline currentStage={stage} />
    </div>
  );
};

export const AnnouncementBarPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '680px' }}>
    <AnnouncementBar
      messages={[
        "⚡ FESTIVE SPECIAL: Flat 20% OFF on orders over ₹1,999",
        "🚚 Free express delivery across 19,000+ Indian pincodes today!"
      ]}
      couponCode="FESTIVE20"
      couponBadgeText="USE CODE"
      linkText="Shop Collection"
      linkUrl="#"
      closable
      onClose={() => onShowToast('Announcement dismissed')}
    />
  </div>
);

export const LightningDealsBarPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '520px' }}>
    <LightningDealsBar
      dealEndsInSeconds={7200}
      endsAt={new Date(Date.now() + 7200 * 1000).toISOString()}
      claimedPercent={78}
    />
  </div>
);

export const FrequentlyBoughtTogetherPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '640px' }}>
    <FrequentlyBoughtTogether
      mainProduct={{
        id: '1',
        title: 'Air Zoom Running Sneakers Pro',
        price: 2999,
        originalPrice: 3999,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80'
      }}
      suggestedItems={[
        {
          id: '2',
          title: 'Sweat-Wicking Breathable Running Socks (Pack of 3)',
          price: 499,
          originalPrice: 799,
          imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300&auto=format&fit=crop&q=80'
        }
      ]}
      bundleDiscountPercentage={10}
      onAddBundleToCart={(items) => onShowToast(`Added ${items.length} combo items to cart!`)}
    />
  </div>
);

export const BankOffersAccordionPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '580px' }}>
    <BankOffersAccordion
      offers={[
        { id: '1', title: '10% Instant Discount on ICICI Bank Cards', description: 'Min transaction ₹2,500. Max discount up to ₹750.', code: 'ICICI10' },
        { id: '2', title: 'Flat ₹100 Cashback on UPI Transactions', description: 'Applicable once per user on PhonePe, GPay, or Paytm.', code: 'UPI100' },
        { id: '3', title: 'Up to ₹1,500 Off on HDFC Credit Card EMI', description: 'Valid on 6, 9 & 12 month EMI tenures on min cart ₹7,500.', code: 'HDFCMAX' },
        { id: '4', title: 'No Cost EMI on Major Bank Credit Cards', description: 'Zero interest charged on 3 & 6 month plans.' }
      ]}
    />
  </div>
);

export const AssuredBadgePreview: React.FC<PreviewProps> = () => {
  const [type, setType] = useState<'assured' | 'prime' | 'supercoin'>('assured');
  return (
    <VStack gap="14px" align="flex-start">
      <HStack gap="8px">
        {(['assured', 'prime', 'supercoin'] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={type === t ? 'primary' : 'outline'}
            onClick={() => setType(t)}
          >
            {t.toUpperCase()}
          </Button>
        ))}
      </HStack>
      <AssuredBadge type={type} />
    </VStack>
  );
};

export const DualMobileActionBarPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  }}>
    <div style={{
      width: '100%',
      background: 'var(--bg-card, #ffffff)',
      borderRadius: '16px',
      border: '1px solid var(--border, #e2e8f0)',
      overflow: 'hidden',
      boxShadow: '0 4px 20px -5px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        height: '130px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.08) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <img
          src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80"
          alt="Product preview"
          style={{ maxHeight: '110px', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}
        />
      </div>
      <div style={{ padding: '10px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary, #6366f1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Trending Item
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b' }}>
            ★ 4.9 (1.2k)
          </span>
        </div>
        <h4 style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
          Heavyweight Oversized Acid Wash Tee
        </h4>
        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>
          100% French Terry Cotton • 280 GSM • Drop Shoulder
        </p>
      </div>
    </div>

    <div style={{ width: '100%' }}>
      <DualMobileActionBar
        price={1299}
        originalPrice={2499}
        position="relative"
        onAddToCart={() => onShowToast('Added to bag')}
        onBuyNow={() => onShowToast('Proceeding to instant checkout')}
      />
    </div>
  </div>
);

export const EcommercePreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'Price': return <PricePreview onShowToast={onShowToast} />;
    case 'AddToCart': return <AddToCartPreview onShowToast={onShowToast} />;
    case 'CouponInput': return <CouponInputPreview onShowToast={onShowToast} />;
    case 'AddressForm': return <AddressFormPreview onShowToast={onShowToast} />;
    case 'OrderSummary': return <OrderSummaryPreview onShowToast={onShowToast} />;
    case 'CartDrawer': return <CartDrawerPreview onShowToast={onShowToast} />;
    case 'PincodeChecker': return <PincodeCheckerPreview onShowToast={onShowToast} />;
    case 'StickyAddToCart': return <StickyAddToCartPreview onShowToast={onShowToast} />;
    case 'ProductCard': return <ProductCardPreview onShowToast={onShowToast} />;
    case 'ProductGallery': return <ProductGalleryPreview onShowToast={onShowToast} />;
    case 'VariantSelector': return <VariantSelectorPreview onShowToast={onShowToast} />;
    case 'QuantitySelector': return <QuantitySelectorPreview onShowToast={onShowToast} />;
    case 'StarRating': return <StarRatingPreview onShowToast={onShowToast} />;
    case 'ReviewBreakdownBars': return <ReviewBreakdownBarsPreview onShowToast={onShowToast} />;
    case 'TrustBadges': return <TrustBadgesPreview onShowToast={onShowToast} />;
    case 'OrderTimeline': return <OrderTimelinePreview onShowToast={onShowToast} />;
    case 'AnnouncementBar': return <AnnouncementBarPreview onShowToast={onShowToast} />;
    case 'LightningDealsBar': return <LightningDealsBarPreview onShowToast={onShowToast} />;
    case 'FrequentlyBoughtTogether': return <FrequentlyBoughtTogetherPreview onShowToast={onShowToast} />;
    case 'BankOffersAccordion': return <BankOffersAccordionPreview onShowToast={onShowToast} />;
    case 'AssuredBadge': return <AssuredBadgePreview onShowToast={onShowToast} />;
    case 'DualMobileActionBar': return <DualMobileActionBarPreview onShowToast={onShowToast} />;
    default: return null;
  }
};
