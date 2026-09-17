import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DEMO_PRODUCTS, Product } from '../data/products';
import {
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  CheckIcon,
  ZapIcon,
  ArrowRightIcon,
  LockIcon,
} from './Icons';

const storeName = import.meta.env.VITE_STORE_NAME || 'BOOST ENGINE';

const PINCODE_MAP: Record<string, { city: string; state: string; days: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi', days: 'Tomorrow, by 2 PM' },
  '40': { city: 'Mumbai', state: 'Maharashtra', days: '2-3 Business Days' },
  '56': { city: 'Bengaluru', state: 'Karnataka', days: '2-3 Business Days' },
  '60': { city: 'Chennai', state: 'Tamil Nadu', days: '3-4 Business Days' },
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find product by id or slug
  const product: Product =
    DEMO_PRODUCTS.find((p) => p.id === id || (p.slug && p.slug === id)) || DEMO_PRODUCTS[0];

  const defaultSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['M'];
  const defaultColors = product.colors && product.colors.length > 0 ? product.colors : ['Black'];
  const defaultImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(defaultSizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(defaultColors[0]);
  const [pincode, setPincode] = useState<string>('110001');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('boost_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize(defaultSizes[0]);
      setSelectedColor(defaultColors[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    try {
      const saved = localStorage.getItem('boost_cart');
      const cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find(
        (item: any) => item.product.id === product.id && item.size === selectedSize
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ product, quantity: 1, size: selectedSize, color: selectedColor });
      }

      localStorage.setItem('boost_cart', JSON.stringify(cart));
      setCartCount(cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const pincodeInfo = PINCODE_MAP[pincode.slice(0, 2)] || {
    city: 'Your City',
    state: 'India',
    days: '2-4 Business Days',
  };

  return (
    <div style={{ backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Announcement Bar */}
      <div style={{ backgroundColor: '#0284c7', color: '#ffffff', fontSize: 12, fontWeight: 700, textAlign: 'center', padding: '7px 16px' }}>
        ⚡ Pan-India Express Delivery • Free Shipping on orders over ₹999 • Code BOOST20 for 20% OFF
      </div>

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: '#fbbf24', display: 'flex' }}>
              <ZapIcon size={24} />
            </div>
            <div>
              <span style={{ fontSize: 19, fontWeight: 800, color: '#ffffff', letterSpacing: 0.5 }}>{storeName}</span>
              <span style={{ display: 'block', fontSize: 10, color: '#38bdf8', fontWeight: 700, letterSpacing: 1 }}>STREETWEAR & ESSENTIALS</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Catalog</Link>
            <Link to="/wishlist" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Wishlist</Link>
            <Link to="/orders" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Orders</Link>
            <Link to="/admin" style={{ color: '#f43f5e', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Admin</Link>
            <Link to="/cart" style={{ backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShoppingBagIcon size={16} />
              <span>Bag ({cartCount})</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', padding: '16px 24px', fontSize: 12, color: '#64748b' }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#94a3b8' }}>{product.category}</span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#38bdf8' }}>{product.title}</span>
      </div>

      {/* Main PDP Grid */}
      <main style={{ maxWidth: 1240, margin: '0 auto', width: '100%', padding: '0 24px 60px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 48 }}>
          
          {/* Left Column: Image Gallery */}
          <div>
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', backgroundColor: '#131b2e', border: '1px solid #1e293b', aspectRatio: '1/1' }}>
              <img src={selectedImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                35% OFF
              </div>
            </div>

            {/* Thumbnail Row */}
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              {defaultImages.map((img: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: selectedImage === img ? '2px solid #38bdf8' : '1px solid #334155',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details & Purchase */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ backgroundColor: '#1e293b', color: '#38bdf8', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                {product.category.toUpperCase()}
              </span>
              <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>
                ● IN STOCK • READY TO DISPATCH
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.3 }}>{product.title}</h1>

            {/* Ratings & HSN */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, fontSize: 13, color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 700 }}>
                <StarIcon size={15} />
                <span>{product.rating}</span>
                <span style={{ color: '#64748b' }}>({product.reviewsCount} reviews)</span>
              </div>
              <span>•</span>
              <span>HSN: {product.hsn || '6109'}</span>
            </div>

            {/* Price Row */}
            <div style={{ backgroundColor: '#0f172a', padding: '16px 20px', borderRadius: 12, border: '1px solid #1e293b', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#ffffff' }}>₹{product.price}</span>
                <span style={{ fontSize: 18, color: '#64748b', textDecorationLine: 'line-through' }}>₹{product.compareAtPrice}</span>
                <span style={{ color: '#10b981', fontSize: 13, fontWeight: 700 }}>Save ₹{product.compareAtPrice - product.price} (35% OFF)</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8' }}>
                Inclusive of 18% Indian GST (CGST + SGST or IGST automatically calculated at checkout)
              </p>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>SELECT SIZE</span>
                <span style={{ fontSize: 11, color: '#38bdf8', cursor: 'pointer' }}>Size Guide (True to Size)</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {defaultSizes.map((sz: string) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      border: selectedSize === sz ? '2px solid #38bdf8' : '1px solid #334155',
                      backgroundColor: selectedSize === sz ? '#0c4a6e' : '#1e293b',
                      color: selectedSize === sz ? '#38bdf8' : '#cbd5e1',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  backgroundColor: isAdded ? '#059669' : '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '15px 24px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background-color 0.2s',
                }}
              >
                {isAdded ? (
                  <>
                    <CheckIcon size={18} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon size={18} />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '15px 24px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>Buy Now (Express)</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>

            {/* Pincode Checker */}
            <div style={{ backgroundColor: '#131b2e', padding: '16px 20px', borderRadius: 12, border: '1px solid #1e293b', marginBottom: 28 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                CHECK DELIVERY & CASH ON DELIVERY AVAILABILITY
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13 }}
                />
                <button
                  type="button"
                  style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Verify
                </button>
              </div>
              <p style={{ margin: '10px 0 0', fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckIcon size={14} /> Deliver to {pincodeInfo.city} ({pincodeInfo.days}) • Free Shipping Eligible
              </p>
            </div>

            {/* Trust Points */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, borderTop: '1px solid #1e293b', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                <TruckIcon size={16} style={{ color: '#38bdf8' }} />
                <span>Pan-India 2-3 Day Express Dispatch</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                <ShieldCheckIcon size={16} style={{ color: '#38bdf8' }} />
                <span>6-Month Stitching Warranty Cover</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                <RotateCcwIcon size={16} style={{ color: '#38bdf8' }} />
                <span>7-Day Doorstep Replacement</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                <LockIcon size={16} style={{ color: '#38bdf8' }} />
                <span>100% Encrypted UPI & COD</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
