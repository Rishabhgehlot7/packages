import React, { useState, useEffect } from 'react';
import { DEMO_PRODUCTS, Product } from '../data/products';
import {
  ZapIcon,
  SearchIcon,
  CloseIcon,
  HeartIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  SparklesIcon,
  LayersIcon,
  StarIcon,
  MapPinIcon,
  TagIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  CheckIcon,
  CheckCircleIcon,
  LockIcon,
  ShirtIcon,
  ScissorsIcon,
  PackageIcon,
  FeatherIcon,
  CompassIcon,
  EyeIcon,
  CreditCardIcon,
  BanknoteIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MessageSquareIcon,
} from './Icons';

const storeName = import.meta.env.VITE_STORE_NAME || '{{BRAND_TITLE}}';

const PINCODE_MAP: Record<string, { city: string; state: string; days: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi', days: 'Tomorrow, by 2 PM' },
  '40': { city: 'Mumbai', state: 'Maharashtra', days: '2-3 Business Days' },
  '56': { city: 'Bengaluru', state: 'Karnataka', days: '2-3 Business Days' },
  '60': { city: 'Chennai', state: 'Tamil Nadu', days: '3-4 Business Days' },
  '70': { city: 'Kolkata', state: 'West Bengal', days: '3-4 Business Days' },
  '50': { city: 'Hyderabad', state: 'Telangana', days: '2-3 Business Days' },
  '30': { city: 'Jaipur', state: 'Rajasthan', days: '2 Business Days' },
  '38': { city: 'Ahmedabad', state: 'Gujarat', days: '2-3 Business Days' },
  '20': { city: 'Lucknow', state: 'Uttar Pradesh', days: '2-3 Business Days' },
  '41': { city: 'Pune', state: 'Maharashtra', days: '2-3 Business Days' },
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'All':
      return <LayersIcon size={15} />;
    case 'Wishlist':
      return <HeartIcon size={15} filled={true} />;
    case 'Hoodies':
      return <ShirtIcon size={15} />;
    case 'T-Shirts':
      return <ShirtIcon size={15} />;
    case 'Bottoms':
      return <ScissorsIcon size={15} />;
    case 'Fragrances':
      return <SparklesIcon size={15} />;
    case 'Accessories':
      return <PackageIcon size={15} />;
    case 'Jackets':
      return <CompassIcon size={15} />;
    default:
      return <LayersIcon size={15} />;
  }
};

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ── 1. LocalStorage Persistence for Cart & Wishlist ──
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('boost_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('boost_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('boost_cart', JSON.stringify(cart));
    } catch {
      // Handle local storage quota / safari private mode gracefully
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('boost_wishlist', JSON.stringify(wishlist));
    } catch {
      // Graceful fallback
    }
  }, [wishlist]);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('110001');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Policy, Contact & Warranty Modal
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | 'shipping' | 'refund' | 'warranty' | 'contact' | null>(null);
  const [supportSubmitted, setSupportSubmitted] = useState<boolean>(false);

  // Selected sizes per card in product grid
  const [selectedCardSizes, setSelectedCardSizes] = useState<Record<string, string>>({});

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewSelectedSize, setQuickViewSelectedSize] = useState<string>('');

  // Checkout Flow & Modal
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [checkoutSuccess, setCheckoutSuccess] = useState<{
    orderId: string;
    paymentMethod: string;
    name: string;
    city: string;
    total: number;
  } | null>(null);

  // Check live API
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    fetch(`${apiBase}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setIsLiveApi(true);
        }
      })
      .catch(() => {
        // Silently fallback to built-in curated DEMO_PRODUCTS
      });
  }, []);

  const rawCategories = Array.from(new Set(products.map((p) => p.category)));
  const categories = ['All', ...(wishlist.length > 0 ? ['Wishlist'] : []), ...rawCategories];

  // Filtering
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'Wishlist') {
      return wishlist.includes(p.id);
    }
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product, sizeToUse?: string) => {
    const chosenSize = sizeToUse || selectedCardSizes[product.id] || product.sizes?.[0] || undefined;
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === chosenSize
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === chosenSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, size: chosenSize }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, size: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id && item.size === size) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string, size: string | undefined) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === id && item.size === size)));
  };

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCouponCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'BOOST20') {
      setDiscountPercent(20);
      setAppliedCoupon('BOOST20');
      setCouponCode('BOOST20');
    } else if (normalized === 'WELCOME10') {
      setDiscountPercent(10);
      setAppliedCoupon('WELCOME10');
      setCouponCode('WELCOME10');
    } else {
      alert('Invalid coupon! Use BOOST20 for 20% off or WELCOME10 for 10% off.');
    }
  };

  const removeCoupon = () => {
    setDiscountPercent(0);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const pincodeInfo = PINCODE_MAP[pincode.slice(0, 2)] || {
    city: 'Local Region',
    state: 'India',
    days: '2-3 Business Days',
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }
    if (customerPhone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    const orderId = 'BST-' + Math.floor(100000 + Math.random() * 900000);
    setCheckoutSuccess({
      orderId,
      paymentMethod: paymentMethod === 'online' ? 'Instant Online (Razorpay / UPI)' : 'Cash on Delivery (COD)',
      name: customerName,
      city: pincodeInfo.city,
      total: finalTotal,
    });
    setCart([]);
    setIsCheckoutModalOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── 1. Top Announcement Bar ── */}
      <div
        style={{
          background: 'linear-gradient(90deg, #090d16 0%, #1e1b4b 50%, #090d16 100%)',
          color: '#f8fafc',
          padding: '8px 16px',
          fontSize: 12,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              backgroundColor: '#f59e0b',
              color: '#000',
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 9999,
              letterSpacing: '0.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ZapIcon size={11} /> LIMITED DROP
          </span>
          <span>
            Use coupon <strong style={{ color: '#fbbf24', letterSpacing: '0.5px' }}>BOOST20</strong> for flat 20% OFF | Free Express Delivery Pan-India
          </span>
        </div>
        {isLiveApi && (
          <span
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '2px 10px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
            Live API :3001
          </span>
        )}
      </div>

      {/* ── 2. Sticky Glassmorphism Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div className="header-container" style={{ maxWidth: 1240, margin: '0 auto' }}>
          {/* Brand Logo & Mobile row */}
          <div
            className="header-logo-row"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              }}
            >
              <ZapIcon size={20} />
            </div>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
                {storeName}
              </span>
              <span style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Streetwear & Essentials
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar-wrapper" style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <SearchIcon size={17} />
            </span>
            <input
              type="text"
              placeholder="Search heavyweight hoodies, boxy tees, fragrances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 38px 10px 42px',
                borderRadius: 9999,
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: 14,
                fontFamily: 'inherit',
                color: '#0f172a',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 2,
                }}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {/* Actions: Wishlist & Cart */}
          <div className="header-actions-row" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => {
                setSelectedCategory('Wishlist');
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              title="View Wishlist"
              style={{
                backgroundColor: selectedCategory === 'Wishlist' ? '#fee2e2' : '#f1f5f9',
                border: selectedCategory === 'Wishlist' ? '1px solid #f87171' : 'none',
                borderRadius: 9999,
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: selectedCategory === 'Wishlist' ? '#dc2626' : '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.15s ease',
              }}
            >
              <HeartIcon size={16} filled={wishlist.length > 0} color={wishlist.length > 0 ? '#ef4444' : '#64748b'} />
              <span>Wishlist</span>
              <span
                style={{
                  backgroundColor: wishlist.length > 0 ? '#ef4444' : '#cbd5e1',
                  color: '#fff',
                  borderRadius: 9999,
                  padding: '2px 7px',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                backgroundColor: '#0f172a',
                color: '#fff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.18)',
                transition: 'transform 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <ShoppingBagIcon size={17} />
              <span>Cart</span>
              <span
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  borderRadius: 9999,
                  padding: '2px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 3. High-Impact D2C Hero Banner (Responsive) ── */}
      <section style={{ maxWidth: 1240, width: '100%', margin: '24px auto 0', padding: '0 24px' }}>
        <div
          className="hero-container"
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #090d16 0%, #171c2b 50%, #1e1b4b 100%)',
            color: '#fff',
            borderRadius: 24,
            padding: '48px 44px',
            overflow: 'hidden',
            boxShadow: '0 20px 35px -8px rgba(15, 23, 42, 0.35)',
          }}
        >
          {/* Decorative Glow Orbs */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: '40%',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Left Text Block */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  color: '#fbbf24',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  padding: '5px 12px',
                  borderRadius: 9999,
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <SparklesIcon size={14} /> DROP 04 • AUTUMN / WINTER 2026
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-1px',
                lineHeight: 1.12,
                margin: 0,
                color: '#ffffff',
              }}
            >
              High-Performance <br />
              <span style={{ background: 'linear-gradient(90deg, #93c5fd 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Streetwear Essentials
              </span>
            </h1>

            <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              Crafted with 450 GSM pure French Terry cotton, oversized tailored silhouettes, and artisanal solid fragrances engineered for daily wear.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
              <a
                href="#products-section"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  padding: '12px 24px',
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>Shop New Arrivals</span>
                <ArrowDownIcon size={15} />
              </a>
              <button
                onClick={() => {
                  setSelectedCategory('Hoodies');
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 22px',
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ShirtIcon size={16} />
                <span>Explore Hoodies</span>
              </button>
            </div>
          </div>

          {/* Right Highlight Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 20,
              padding: '24px 28px',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Store Highlights
              </span>
              <span
                style={{
                  backgroundColor: '#10b981',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <CheckIcon size={12} /> IN STOCK
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 12, color: '#38bdf8', display: 'flex' }}>
                  <FeatherIcon size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>450 GSM Heavy French Terry</h4>
                  <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Double pre-shrunk combed organic cotton</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 12, color: '#fbbf24', display: 'flex' }}>
                  <StarIcon size={20} filled={true} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>4.9/5 D2C Customer Rating</h4>
                  <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Over 2,400+ verified customer reviews</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 12, color: '#a78bfa', display: 'flex' }}>
                  <PackageIcon size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Express Dispatch & COD</h4>
                  <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Delivered in 2-3 business days across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Value Props / Trust Badges Bar ── */}
      <section style={{ maxWidth: 1240, width: '100%', margin: '20px auto 0', padding: '0 24px' }}>
        <div
          className="trust-badges-grid"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '16px 24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '10px', borderRadius: 12, display: 'flex' }}>
              <TruckIcon size={20} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Free Pan-India Delivery</h5>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>On all prepaid & COD orders</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: 12, display: 'flex' }}>
              <ShieldCheckIcon size={20} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>100% Secure Checkout</h5>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Razorpay, UPI, Cards & COD</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: '#fdf4ff', color: '#9333ea', padding: '10px', borderRadius: 12, display: 'flex' }}>
              <RotateCcwIcon size={20} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>7-Day Easy Exchange</h5>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ backgroundColor: '#fffbeb', color: '#d97706', padding: '10px', borderRadius: 12, display: 'flex' }}>
              <SparklesIcon size={20} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Premium Heavyweight</h5>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Pre-shrunk 100% combed cotton</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Category Navigation Tabs ── */}
      <section id="products-section" style={{ maxWidth: 1240, width: '100%', margin: '28px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {selectedCategory === 'Wishlist' ? 'Saved in Wishlist' : 'Curated Collection'} ({filteredProducts.length})
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
              {selectedCategory === 'Wishlist'
                ? 'Your favorite apparel and fragrances saved for later'
                : 'Handpicked drop items engineered for durability, structure, and comfort'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? products.length
                : cat === 'Wishlist'
                ? wishlist.length
                : products.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 9999,
                  border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 2px 8px rgba(15, 23, 42, 0.15)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', color: isSelected ? '#ffffff' : '#64748b' }}>
                  {getCategoryIcon(cat)}
                </span>
                <span>{cat}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 9999,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 6. Product Grid ── */}
      <main style={{ maxWidth: 1240, width: '100%', margin: '20px auto 48px', padding: '0 24px', flex: 1 }}>
        {filteredProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ color: '#94a3b8', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              {selectedCategory === 'Wishlist' ? <HeartIcon size={48} /> : <SearchIcon size={44} />}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '14px 0 6px', color: '#0f172a' }}>
              {selectedCategory === 'Wishlist' ? 'Your wishlist is empty' : `No products found for "${searchQuery}"`}
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px' }}>
              {selectedCategory === 'Wishlist'
                ? 'Click on the heart icon on any product card to save it here.'
                : 'Try searching with different keywords or reset category filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              style={{
                backgroundColor: '#0f172a',
                color: '#fff',
                padding: '10px 22px',
                borderRadius: 9999,
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Explore All Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filteredProducts.map((p) => {
              const discountPct = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
              const savingsAmount = p.compareAtPrice - p.price;
              const isFav = wishlist.includes(p.id);
              const isHovered = hoveredCard === p.id;
              const currentSelectedSize = selectedCardSizes[p.id] || p.sizes?.[0];

              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredCard(p.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 18,
                    border: '1px solid #f1f5f9',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isHovered
                      ? '0 16px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04)'
                      : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Image Container with 3:4 aspect ratio */}
                  <div
                    style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#f1f5f9', cursor: 'pointer' }}
                    onClick={() => {
                      setQuickViewProduct(p);
                      setQuickViewSelectedSize(p.sizes?.[0] || '');
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      onError={(e) => {
                        // Fallback image if unsplash link fails
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.4s ease',
                      }}
                    />

                    {/* Discount Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.5px',
                        padding: '4px 9px',
                        borderRadius: 9999,
                        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
                      }}
                    >
                      -{discountPct}% OFF
                    </span>

                    {/* Quick View Button on Image hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(p);
                        setQuickViewSelectedSize(p.sizes?.[0] || '');
                      }}
                      title="Quick View"
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(8px)',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <EyeIcon size={14} />
                      <span>Quick View</span>
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(p.id, e)}
                      title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: 'none',
                        borderRadius: 9999,
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isFav ? '#ef4444' : '#475569',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        transform: isFav ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <HeartIcon size={18} filled={isFav} />
                    </button>

                    {/* Category pill on image bottom-left */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(8px)',
                        color: '#f8fafc',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {getCategoryIcon(p.category)}
                      <span>{p.category}</span>
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      {/* Rating & Reviews */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <StarIcon size={14} filled={true} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{p.rating}</span>
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>({p.reviewsCount} reviews)</span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => {
                          setQuickViewProduct(p);
                          setQuickViewSelectedSize(p.sizes?.[0] || '');
                        }}
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          lineHeight: 1.35,
                          margin: '0 0 6px',
                          color: '#0f172a',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          cursor: 'pointer',
                        }}
                      >
                        {p.title}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: 13,
                          color: '#64748b',
                          margin: '0 0 12px',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {p.description}
                      </p>

                      {/* Size Selector for Apparel */}
                      {p.sizes && p.sizes.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                              Size: <strong style={{ color: '#0f172a' }}>{currentSelectedSize}</strong>
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {p.sizes.map((sz) => (
                              <button
                                key={sz}
                                onClick={() => setSelectedCardSizes((prev) => ({ ...prev, [p.id]: sz }))}
                                style={{
                                  padding: '3px 9px',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  borderRadius: 6,
                                  border: currentSelectedSize === sz ? '1px solid #0f172a' : '1px solid #e2e8f0',
                                  backgroundColor: currentSelectedSize === sz ? '#0f172a' : '#f8fafc',
                                  color: currentSelectedSize === sz ? '#ffffff' : '#334155',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'line-through' }}>
                          ₹{p.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: 4 }}>
                          Save ₹{savingsAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <TruckIcon size={13} /> Free Express Delivery • COD Available
                      </div>

                      <button
                        onClick={() => addToCart(p, currentSelectedSize)}
                        style={{
                          width: '100%',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 0',
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
                          transition: 'background 0.15s ease, transform 0.1s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f172a')}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <ShoppingBagIcon size={16} />
                        <span>Add to Cart</span>
                        {currentSelectedSize && (
                          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>
                            {currentSelectedSize}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── 7. Slide-over Cart Drawer (Responsive) ── */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-slide-right cart-drawer-box"
            style={{
              backgroundColor: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShoppingBagIcon size={20} /> Your Shopping Cart
                </h2>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {totalCartCount} item{totalCartCount === 1 ? '' : 's'} added
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 9999,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                }}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <div style={{ color: '#cbd5e1', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <ShoppingBagIcon size={56} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Your cart is empty</h3>
                  <p style={{ fontSize: 13, margin: '0 0 20px' }}>Looks like you haven't added any streetwear items yet.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      padding: '10px 22px',
                      borderRadius: 9999,
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cart.map(({ product, quantity, size }) => (
                    <div
                      key={`${product.id}-${size || 'nosize'}`}
                      style={{
                        display: 'flex',
                        gap: 14,
                        padding: '14px',
                        borderRadius: 12,
                        backgroundColor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: 72, height: 90, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                              {product.title}
                            </h4>
                            <button
                              onClick={() => removeItem(product.id, size)}
                              title="Remove item"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: '#64748b' }}>{product.category}</span>
                            {size && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', backgroundColor: '#e2e8f0', padding: '1px 6px', borderRadius: 4 }}>
                                Size: {size}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #cbd5e1', padding: '2px 4px' }}>
                            <button
                              onClick={() => updateQuantity(product.id, size, -1)}
                              style={{ width: 22, height: 22, border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer', color: '#334155' }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, size, 1)}
                              style={{ width: 22, height: 22, border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer', color: '#334155' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  padding: '20px 24px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {/* Delivery Estimate */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 10,
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ color: '#2563eb', display: 'flex' }}>
                    <MapPinIcon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Pincode:</span>
                      <input
                        type="text"
                        value={pincode}
                        maxLength={6}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: 68,
                          padding: '2px 6px',
                          fontSize: 12,
                          fontWeight: 600,
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          textAlign: 'center',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <CheckIcon size={13} /> Deliver to {pincodeInfo.city} ({pincodeInfo.days})
                    </span>
                  </div>
                </div>

                {/* Coupon Input & Quick Chips */}
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                        <TagIcon size={15} />
                      </span>
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 32px',
                          fontSize: 13,
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                    <button
                      onClick={() => applyCouponCode(couponCode)}
                      style={{
                        padding: '9px 16px',
                        background: '#0f172a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Apply
                    </button>
                  </div>

                  {appliedCoupon ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#dcfce7', padding: '6px 10px', borderRadius: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CheckIcon size={13} /> Coupon "{appliedCoupon}" applied ({discountPercent}% OFF)
                      </span>
                      <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#64748b' }}>Quick codes:</span>
                      <button
                        onClick={() => applyCouponCode('BOOST20')}
                        style={{ background: '#fef3c7', border: '1px dashed #f59e0b', color: '#92400e', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      >
                        BOOST20 (20% OFF)
                      </button>
                      <button
                        onClick={() => applyCouponCode('WELCOME10')}
                        style={{ background: '#f1f5f9', border: '1px dashed #cbd5e1', color: '#475569', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      >
                        WELCOME10
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div style={{ fontSize: 13, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 6 }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600, marginBottom: 6 }}>
                      <span>Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 8 }}>
                    <span>Shipping</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 17, color: '#0f172a', borderTop: '1px dashed #e2e8f0', paddingTop: 8 }}>
                    <span>Grand Total</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout Trigger Button */}
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 0',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <LockIcon size={16} />
                  <span>Proceed to Checkout (₹{finalTotal.toLocaleString('en-IN')}) →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 8. Product Quick View Modal ── */}
      {quickViewProduct && (
        <div
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-pop-in quickview-modal-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: '28px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            {/* Close Modal Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 9999,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <CloseIcon size={16} />
            </button>

            {/* Left: Product Image */}
            <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                -{Math.round(((quickViewProduct.compareAtPrice - quickViewProduct.price) / quickViewProduct.compareAtPrice) * 100)}% OFF
              </span>
            </div>

            {/* Right: Product Details */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#475569' }}>
                    {quickViewProduct.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
                    <StarIcon size={14} filled={true} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{quickViewProduct.rating}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>({quickViewProduct.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.3 }}>
                  {quickViewProduct.title}
                </h2>

                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {quickViewProduct.description}
                </p>

                {/* Tags */}
                {quickViewProduct.tags && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {quickViewProduct.tags.map((t) => (
                      <span key={t} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Size Selector */}
                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                        Select Size: <span style={{ color: '#2563eb' }}>{quickViewSelectedSize}</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {quickViewProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setQuickViewSelectedSize(sz)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: quickViewSelectedSize === sz ? '2px solid #0f172a' : '1px solid #cbd5e1',
                            backgroundColor: quickViewSelectedSize === sz ? '#0f172a' : '#ffffff',
                            color: quickViewSelectedSize === sz ? '#ffffff' : '#0f172a',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 16, color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{quickViewProduct.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: 4 }}>
                    Save ₹{(quickViewProduct.compareAtPrice - quickViewProduct.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quickViewSelectedSize);
                      setQuickViewProduct(null);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      padding: '14px 0',
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <ShoppingBagIcon size={18} />
                    <span>Add to Cart {quickViewSelectedSize ? `(${quickViewSelectedSize})` : ''}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    style={{
                      padding: '0 16px',
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: wishlist.includes(quickViewProduct.id) ? '#ef4444' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HeartIcon size={20} filled={wishlist.includes(quickViewProduct.id)} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. Real-World Checkout Flow Modal ── */}
      {isCheckoutModalOpen && (
        <div
          onClick={() => setIsCheckoutModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 65,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-pop-in"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              maxWidth: 540,
              width: '100%',
              padding: '28px 32px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Complete Your Order
                </h2>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {totalCartCount} item(s) • Total: ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 9999,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                }}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Customer Info */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                    <UserIcon size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kabir Malhotra"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Mobile Number * (For Delivery Updates)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                    <PhoneIcon size={16} />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat / House No., Landmark, Street area"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Destination City
                  </label>
                  <input
                    type="text"
                    value={`${pincodeInfo.city}, ${pincodeInfo.state}`}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
                  Select Payment Option
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div
                    onClick={() => setPaymentMethod('online')}
                    style={{
                      padding: '14px',
                      borderRadius: 12,
                      border: paymentMethod === 'online' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: paymentMethod === 'online' ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb' }}>
                      <CreditCardIcon size={18} />
                      <strong style={{ fontSize: 13 }}>Online / UPI</strong>
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Razorpay, Cards, NetBanking</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      padding: '14px',
                      borderRadius: 12,
                      border: paymentMethod === 'cod' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      backgroundColor: paymentMethod === 'cod' ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a' }}>
                      <BanknoteIcon size={18} />
                      <strong style={{ fontSize: 13 }}>Cash on Delivery</strong>
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Pay cash at doorstep</span>
                  </div>
                </div>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 0',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <LockIcon size={16} />
                <span>Confirm Order • Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── 10. Order Success Modal ── */}
      {checkoutSuccess && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            padding: 16,
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#fff',
              padding: '36px 32px',
              borderRadius: 24,
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircleIcon size={36} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
              Order Confirmed!
            </h2>
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 20px' }}>
              Thank you, <strong>{checkoutSuccess.name}</strong>. Your package is scheduled for dispatch.
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '16px',
                borderRadius: 14,
                fontSize: 13,
                color: '#334155',
                textAlign: 'left',
                marginBottom: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div>
                <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Order ID</span>
                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{checkoutSuccess.orderId}</p>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Payment Mode</span>
                <p style={{ margin: 0, fontWeight: 600 }}>{checkoutSuccess.paymentMethod}</p>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Total Paid / COD</span>
                <p style={{ margin: 0, fontWeight: 700, color: '#16a34a' }}>₹{checkoutSuccess.total.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Delivery Destination</span>
                <p style={{ margin: 0, fontWeight: 600 }}>{checkoutSuccess.city} ({pincodeInfo.days})</p>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutSuccess(null);
              }}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#fff',
                padding: '13px 0',
                border: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>Continue Shopping</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── 11. Professional D2C Footer ── */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', marginTop: 'auto', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 36, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ color: '#fbbf24', display: 'flex' }}>
                <ZapIcon size={22} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>{storeName}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#94a3b8' }}>
              Crafted for modern D2C culture. Premium French Terry cotton, curated oversized essentials, and signature scents.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <li><a href="#products-section" style={{ color: '#94a3b8', textDecoration: 'none' }}>All Products</a></li>
              <li><a href="#products-section" style={{ color: '#94a3b8', textDecoration: 'none' }}>Heavyweight Hoodies</a></li>
              <li><a href="#products-section" style={{ color: '#94a3b8', textDecoration: 'none' }}>Boxy Vintage Tees</a></li>
              <li><a href="#products-section" style={{ color: '#94a3b8', textDecoration: 'none' }}>Solid Fragrances</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Customer Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <li 
                onClick={() => { setPolicyModal('shipping'); setSupportSubmitted(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <TruckIcon size={15} /> <span>Track Order & Shipping</span>
              </li>
              <li 
                onClick={() => { setPolicyModal('refund'); setSupportSubmitted(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <RotateCcwIcon size={15} /> <span>Return & Exchange Portal</span>
              </li>
              <li 
                onClick={() => { setPolicyModal('warranty'); setSupportSubmitted(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <ShieldCheckIcon size={15} /> <span>Warranty Registration & Claim</span>
              </li>
              <li 
                onClick={() => { setPolicyModal('contact'); setSupportSubmitted(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <MailIcon size={15} /> <span>Contact Support Desk</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Payment & Trust</h4>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <LockIcon size={14} /> 100% Encrypted & Safe Payments
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>UPI</span>
              <span style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>RuPay</span>
              <span style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Visa</span>
              <span style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Mastercard</span>
              <span style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1240, margin: '0 auto', borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12 }}>
          <p style={{ margin: 0 }}>© 2026 {storeName}. Powered by BoostEngine Suite.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span 
              onClick={() => { setPolicyModal('terms'); setSupportSubmitted(false); }} 
              style={{ cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Terms of Service
            </span>
            <span 
              onClick={() => { setPolicyModal('privacy'); setSupportSubmitted(false); }} 
              style={{ cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Privacy Policy
            </span>
            <span 
              onClick={() => { setPolicyModal('shipping'); setSupportSubmitted(false); }} 
              style={{ cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Shipping Policy
            </span>
            <span 
              onClick={() => { setPolicyModal('refund'); setSupportSubmitted(false); }} 
              style={{ cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Refund Policy
            </span>
          </div>
        </div>
      </footer>

      {/* ── 12. Policy, Warranty & Support Modal ── */}
      {policyModal && (
        <div 
          onClick={() => setPolicyModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 9999,
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: 18,
              maxWidth: 680,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {policyModal === 'warranty' ? (
                  <ShieldCheckIcon size={20} style={{ color: '#38bdf8' }} />
                ) : policyModal === 'contact' ? (
                  <MailIcon size={20} style={{ color: '#38bdf8' }} />
                ) : (
                  <SparklesIcon size={20} style={{ color: '#38bdf8' }} />
                )}
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  {policyModal === 'privacy' && 'Privacy Policy'}
                  {policyModal === 'terms' && 'Terms of Service'}
                  {policyModal === 'shipping' && 'Shipping & Delivery Policy'}
                  {policyModal === 'refund' && 'Return & Refund Policy'}
                  {policyModal === 'warranty' && 'Warranty Registration & Claim'}
                  {policyModal === 'contact' && 'Contact Customer Support'}
                </h3>
              </div>
              <button 
                onClick={() => setPolicyModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Quick Switch Pills */}
            <div style={{ display: 'flex', gap: 8, padding: '12px 24px', overflowX: 'auto', borderBottom: '1px solid #1e293b', backgroundColor: '#090d16' }}>
              {(['privacy', 'terms', 'shipping', 'refund', 'warranty', 'contact'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setPolicyModal(tab); setSupportSubmitted(false); }}
                  style={{
                    backgroundColor: policyModal === tab ? '#1e293b' : 'transparent',
                    color: policyModal === tab ? '#38bdf8' : '#64748b',
                    border: policyModal === tab ? '1px solid #38bdf8' : '1px solid transparent',
                    padding: '6px 14px',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab === 'contact' ? 'Contact Us' : tab}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', fontSize: 14, lineHeight: 1.7, color: '#cbd5e1' }}>
              {policyModal === 'privacy' && (
                <div>
                  <h4 style={{ color: '#fff', marginTop: 0 }}>Information We Collect</h4>
                  <p>
                    {storeName} collects essential personal details such as customer name, shipping address, contact phone number, and email strictly for the purposes of order fulfillment, shipping communication, and OTP verification under Indian IT regulations.
                  </p>
                  <h4 style={{ color: '#fff' }}>Data Protection & Security</h4>
                  <p>
                    All payment credentials (cards, UPI, net banking) are handled securely through PCI-DSS compliant gateways like Razorpay. We do not store raw card numbers on our servers.
                  </p>
                </div>
              )}

              {policyModal === 'terms' && (
                <div>
                  <h4 style={{ color: '#fff', marginTop: 0 }}>General E-Commerce Conditions</h4>
                  <p>
                    By placing an order on {storeName}, you confirm that you are at least 18 years old and authorized to make online purchases.
                  </p>
                  <h4 style={{ color: '#fff' }}>Pricing & Stock Availability</h4>
                  <p>
                    Prices displayed are inclusive of GST as mandated under Indian tax law. In case of unexpected inventory stockouts, full refunds will be credited within 3-5 business days.
                  </p>
                </div>
              )}

              {policyModal === 'shipping' && (
                <div>
                  <h4 style={{ color: '#fff', marginTop: 0 }}>Pan-India Express Logistics</h4>
                  <p>
                    We partner with India's premier logistics providers (Delhivery, BlueDart, XpressBees). Standard delivery timeframes:
                  </p>
                  <ul style={{ paddingLeft: 20 }}>
                    <li>Metro Cities: 24 to 48 Hours</li>
                    <li>Rest of India: 2 to 4 Business Days</li>
                    <li>Free Express Shipping on all prepaid orders across India</li>
                  </ul>
                  <p>
                    A real-time SMS/WhatsApp tracking link is generated and sent immediately upon package dispatch.
                  </p>
                </div>
              )}

              {policyModal === 'refund' && (
                <div>
                  <h4 style={{ color: '#fff', marginTop: 0 }}>7-Day Doorstep Replacement Guarantee</h4>
                  <p>
                    If the product does not fit or arrives with a manufacturing defect, you can initiate a return or exchange within 7 days of delivery.
                  </p>
                  <ul style={{ paddingLeft: 20 }}>
                    <li>Reverse pickup will be scheduled at your doorstep at no additional charge.</li>
                    <li>Item must remain unworn with original tags and packaging intact.</li>
                    <li>Refunds for online orders are processed back to source within 3-5 working days.</li>
                  </ul>
                </div>
              )}

              {policyModal === 'warranty' && (
                <div>
                  <h4 style={{ color: '#fff', marginTop: 0 }}>Register or Claim Brand Warranty</h4>
                  <p style={{ fontSize: 13, color: '#94a3b8' }}>
                    All products carry a 6-month stitching and fabric construction warranty. Register your purchase below.
                  </p>

                  {supportSubmitted ? (
                    <div style={{ backgroundColor: '#064e3b', color: '#a7f3d0', border: '1px solid #059669', padding: '16px 20px', borderRadius: 12, marginTop: 16 }}>
                      <p style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircleIcon size={18} /> Warranty Registered Successfully!
                      </p>
                      <p style={{ margin: '6px 0 0', fontSize: 13 }}>
                        Your warranty token has been created. A confirmation email has been dispatched.
                      </p>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => { e.preventDefault(); setSupportSubmitted(true); }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Full Name</label>
                          <input required placeholder="Your Name" style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Order / Invoice ID</label>
                          <input required placeholder="e.g. ORD-98214" style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Product Purchased</label>
                        <input required placeholder="e.g. Cyberpunk Heavyweight 450 GSM Hoodie" style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Issue Description (if claiming)</label>
                        <textarea rows={3} placeholder="Describe the defect or reason for warranty claim..." style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <button 
                        type="submit"
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '12px 20px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                      >
                        <ShieldCheckIcon size={16} /> Submit Warranty Request
                      </button>
                    </form>
                  )}
                </div>
              )}

              {policyModal === 'contact' && (
                <div>
                  <h4 style={{ color: '#fff', marginTop: 0 }}>Get in Touch</h4>
                  <p style={{ fontSize: 13, color: '#94a3b8' }}>
                    Need styling advice, bulk order quotes, or support? Send our support team a message.
                  </p>

                  {supportSubmitted ? (
                    <div style={{ backgroundColor: '#064e3b', color: '#a7f3d0', border: '1px solid #059669', padding: '16px 20px', borderRadius: 12, marginTop: 16 }}>
                      <p style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircleIcon size={18} /> Message Received!
                      </p>
                      <p style={{ margin: '6px 0 0', fontSize: 13 }}>
                        Thank you for reaching out. A support specialist will respond within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => { e.preventDefault(); setSupportSubmitted(true); }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Your Name</label>
                          <input required placeholder="Rahul Sharma" style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Email / Phone</label>
                          <input required placeholder="rahul@example.com" style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Subject</label>
                        <input required placeholder="Query regarding shipping or exchange" style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Message</label>
                        <textarea required rows={3} placeholder="How can we help you?" style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <button 
                        type="submit"
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '12px 20px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                      >
                        <MailIcon size={16} /> Send Message
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
