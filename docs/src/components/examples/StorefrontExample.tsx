import React, { useState } from 'react';
import {
  Breadcrumb,
  ProductGallery,
  Price,
  VariantSelector,
  QuantitySelector,
  AssuredBadge,
  PincodeChecker,
  AddToCart,
  BankOffersAccordion,
  FrequentlyBoughtTogether,
  TrustBadges,
  ReviewBreakdownBars,
  Accordion,
  Badge,
  Button,
  CartDrawer,
} from '@boostengine/ui';
import { Heart, Share2, ShieldCheck, Zap } from 'lucide-react';

interface StorefrontExampleProps {
  onShowToast: (msg: string) => void;
}

export const StorefrontExample: React.FC<StorefrontExampleProps> = ({ onShowToast }) => {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({
    Size: 'L',
    Color: 'Acid Black'
  });
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 'cart-1',
      title: 'Heavyweight Loopknit Oversized Tee',
      price: 1299,
      quantity: 1,
      variantTitle: 'Size: L • Acid Black'
    }
  ]);

  const productImages = [
    { id: '1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', alt: 'Premium Acid Black Tee Front' },
    { id: '2', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', alt: 'Fabric Loopknit Texture' },
    { id: '3', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80', alt: 'Model Streetwear Fit' },
    { id: '4', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80', alt: 'Styling Outfit Look' }
  ];

  const handleAddToCart = (qty: number) => {
    const newItem = {
      id: `cart-${Date.now()}`,
      title: 'Heavyweight Loopknit Oversized Tee',
      price: 1299,
      quantity: qty,
      variantTitle: `Size: ${selectedVariants.Size} • ${selectedVariants.Color}`
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
    onShowToast(`Added ${qty} item(s) to your bag!`);
  };

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div style={{ backgroundColor: 'var(--boost-bg, #090d16)', color: 'var(--boost-text, #f8fafc)', minHeight: '100vh', padding: '24px 20px', fontFamily: 'inherit' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ maxWidth: '1180px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Breadcrumb
          items={[
            { label: 'Home', href: '#' },
            { label: 'Streetwear & Apparel', href: '#' },
            { label: 'Heavyweight Oversized Tees' }
          ]}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              onShowToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist!');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--boost-border, #334155)',
              background: 'rgba(255,255,255,0.05)',
              color: isWishlisted ? '#f43f5e' : 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            <Heart size={14} fill={isWishlisted ? '#f43f5e' : 'none'} />
            <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
          </button>
          <button
            onClick={() => onShowToast('Product link copied!')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--boost-border, #334155)',
              background: 'rgba(255,255,255,0.05)',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Product Section: Gallery + Buy Box */}
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Column: Product Gallery */}
        <div>
          <ProductGallery
            aspectRatio="portrait"
            images={productImages}
          />
          <div style={{ marginTop: '24px' }}>
            <TrustBadges layout="grid" />
          </div>
        </div>

        {/* Right Column: Buy Box Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Badge variant="primary">LIMITED DROP</Badge>
              <AssuredBadge type="assured" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              Heavyweight French Terry Oversized Tee
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
              SKU: BE-APP-2026-BLK • 100% Organic Loopknit Cotton (260 GSM)
            </p>
          </div>

          {/* Pricing */}
          <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--boost-border, #334155)' }}>
            <Price amount={1299} originalAmount={2499} size="xl" showDiscount showSavings />
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={13} fill="#10b981" />
              <span>Flat ₹1,200 festive savings applied automatically. Inclusive of all Indian GST.</span>
            </div>
          </div>

          {/* Variant Selector */}
          <VariantSelector
            groups={[
              {
                name: 'Size',
                options: [
                  { id: 'S', label: 'S (38")' },
                  { id: 'M', label: 'M (40")' },
                  { id: 'L', label: 'L (42")' },
                  { id: 'XL', label: 'XL (44")' }
                ]
              },
              {
                name: 'Color',
                options: [
                  { id: 'Acid Black', label: 'Acid Black' },
                  { id: 'Vintage Olive', label: 'Vintage Olive' },
                  { id: 'Desert Sand', label: 'Desert Sand' }
                ]
              }
            ]}
            selectedValues={selectedVariants}
            onChange={(group, option) => {
              setSelectedVariants(prev => ({ ...prev, [group]: option }));
              onShowToast(`Selected ${group}: ${option}`);
            }}
          />

          {/* Quantity & CTA Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--boost-text-muted, #94a3b8)' }}>Quantity</span>
              <QuantitySelector
                value={quantity}
                min={1}
                max={5}
                onChange={setQuantity}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'flex-end' }}>
              <AddToCart
                onAdd={handleAddToCart}
                label="Add to Shopping Bag"
              />
            </div>
          </div>

          {/* Pincode & Express Delivery Checker */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Check Delivery & Cash on Delivery (COD)
            </span>
            <PincodeChecker
              defaultPincode="560102"
              onCheck={async (pin) => ({
                isServiceable: pin.length === 6,
                estimatedDeliveryDate: 'Delivery by Thursday, 2 PM',
                isCodAvailable: true,
                courier: 'Bluedart Air Express'
              })}
            />
          </div>

          {/* Bank Offers Accordion */}
          <BankOffersAccordion
            offers={[
              { id: '1', title: '10% Instant Discount on HDFC Credit Cards', description: 'Min cart value ₹1,999. Max discount ₹500.', code: 'HDFC10' },
              { id: '2', title: 'Flat ₹150 Cashback via PhonePe UPI', description: 'Applicable once per user on payments above ₹999.', code: 'PHONEPE150' },
              { id: '3', title: 'No Cost EMI on Major Credit Cards', description: 'Available on 3 & 6 month tenures.' }
            ]}
          />
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      <div style={{ maxWidth: '1180px', margin: '48px auto 0' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Frequently Bought Together</h2>
        <FrequentlyBoughtTogether
          mainProduct={{
            id: 'p1',
            title: 'Heavyweight Loopknit Oversized Tee',
            price: 1299,
            originalPrice: 2499,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80'
          }}
          suggestedItems={[
            {
              id: 'p2',
              title: 'Water-Resistant Cargo Joggers',
              price: 1499,
              originalPrice: 2499,
              imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&q=80'
            },
            {
              id: 'p3',
              title: 'Cushioned Athletic Crew Socks (3-Pack)',
              price: 399,
              originalPrice: 699,
              imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300&q=80'
            }
          ]}
          bundleDiscountPercentage={15}
          onAddBundleToCart={(items) => {
            onShowToast(`Combo of ${items.length} items added with 15% bundle discount!`);
            setIsCartOpen(true);
          }}
        />
      </div>

      {/* Customer Ratings & Reviews */}
      <div style={{ maxWidth: '1180px', margin: '48px auto 0' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Customer Feedback & Ratings</h2>
        <ReviewBreakdownBars
          averageRating={4.8}
          totalReviews={384}
          breakdown={[
            { stars: 5, percentage: 82, count: 315 },
            { stars: 4, percentage: 12, count: 46 },
            { stars: 3, percentage: 4, count: 15 },
            { stars: 2, percentage: 1, count: 5 },
            { stars: 1, percentage: 1, count: 3 }
          ]}
        />
      </div>

      {/* Cart Drawer Simulation */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        freeShippingThreshold={1500}
        onUpdateQuantity={(id, q) => {
          setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
        }}
        onRemoveItem={(id) => {
          setCartItems(prev => prev.filter(item => item.id !== id));
          onShowToast('Item removed from cart');
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          onShowToast('Redirecting to Express Checkout...');
        }}
      />
    </div>
  );
};
