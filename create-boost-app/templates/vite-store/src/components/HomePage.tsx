import React, { useState, useEffect } from 'react';
import { DEMO_PRODUCTS, Product } from '../data/products';

const storeName = import.meta.env.VITE_STORE_NAME || '{{BRAND_TITLE}}';

const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi' },
  '40': { city: 'Mumbai', state: 'Maharashtra' },
  '56': { city: 'Bengaluru', state: 'Karnataka' },
  '60': { city: 'Chennai', state: 'Tamil Nadu' },
  '70': { city: 'Kolkata', state: 'West Bengal' },
  '50': { city: 'Hyderabad', state: 'Telangana' },
  '30': { city: 'Jaipur', state: 'Rajasthan' },
  '38': { city: 'Ahmedabad', state: 'Gujarat' },
  '20': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '41': { city: 'Pune', state: 'Maharashtra' },
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('110001');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as Array<{ product: Product; quantity: number }>
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'BOOST20') {
      setDiscountPercent(20);
      alert('🎉 20% Discount applied via BOOST20!');
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      alert('🎉 10% Welcome discount applied!');
    } else {
      alert('Invalid coupon! Try BOOST20 for 20% off.');
    }
  };

  const pincodeInfo = PINCODE_MAP[pincode.slice(0, 2)] || { city: 'Local City', state: 'India' };

  const handleSimulatedCheckout = () => {
    const orderId = 'BST-' + Math.floor(100000 + Math.random() * 900000);
    setCheckoutSuccess(orderId);
    setCart([]);
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh', color: '#111' }}>
      {/* ── Top Announcement Banner ── */}
      <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '10px 16px', textAlign: 'center', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span>⚡ FLASH SALE: Use code <span style={{ color: '#fbbf24', fontWeight: 700 }}>BOOST20</span> for 20% OFF | Free Express Delivery Pan-India 🇮🇳</span>
        {isLiveApi && (
          <span style={{ backgroundColor: '#065f46', color: '#34d399', padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600 }}>
            ● API Connected (:3001)
          </span>
        )}
      </div>

      {/* ── Sticky Header ── */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40, padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>{storeName}</span>
          </div>

          <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search streetwear, hoodies, fragrances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 9999,
                border: '1px solid #cbd5e1',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              ❤️ <span style={{ fontWeight: 600 }}>{wishlist.length}</span>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                backgroundColor: '#0f172a',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>🛒 Cart</span>
              <span style={{ backgroundColor: '#3b82f6', borderRadius: 9999, padding: '2px 8px', fontSize: 12 }}>
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            color: '#fff',
            borderRadius: 24,
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#a5b4fc' }}>
            NEW DROP AUTUMN / WINTER 2026
          </span>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
            High-Performance D2C Essentials
          </h1>
          <p style={{ fontSize: 16, color: '#c7d2fe', margin: 0, maxWidth: 600 }}>
            Curated streetwear, 450 GSM pure cotton hoodies, and artisanal solid fragrances. Powered by BoostEngine eCommerce suite.
          </p>
        </div>
      </section>

      {/* ── Categories Navigation ── */}
      <section style={{ maxWidth: 1200, margin: '16px auto', padding: '0 24px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: 9999,
              border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0',
              backgroundColor: selectedCategory === cat ? '#0f172a' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#475569',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* ── Product Grid ── */}
      <main style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {filteredProducts.map((p) => {
            const discountPct = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
            const isFav = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  border: '1px solid #f1f5f9',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: '#dc2626',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: 6,
                    }}
                  >
                    -{discountPct}% OFF
                  </span>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: 9999,
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ color: '#eab308', fontSize: 13 }}>★ {p.rating}</span>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>({p.reviewsCount} reviews)</span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px', lineHeight: 1.4 }}>{p.description}</p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>₹{p.price.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₹{p.compareAtPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      style={{
                        width: '100%',
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        border: 'none',
                        padding: '11px 0',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Slide-over Cart Drawer ── */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ width: '100%', maxWidth: 440, backgroundColor: '#fff', height: '100%', display: 'flex', flexDirection: 'column', padding: 24, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Your Cart ({totalCartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  <p style={{ fontSize: 40 }}>🛒</p>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div key={product.id} style={{ display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                    <img src={product.image} alt={product.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: 14 }}>{product.title}</h4>
                      <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>₹{product.price.toLocaleString('en-IN')}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => updateQuantity(product.id, -1)} style={{ padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: 4, background: '#fff', cursor: 'pointer' }}>-</button>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, 1)} style={{ padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: 4, background: '#fff', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Pincode checker */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', backgroundColor: '#f8fafc', padding: 8, borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>📍 Pincode:</span>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    style={{ width: 80, padding: 4, fontSize: 12, border: '1px solid #cbd5e1', borderRadius: 4 }}
                  />
                  <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
                    ⚡ Deliver to {pincodeInfo.city}, {pincodeInfo.state} (Free COD)
                  </span>
                </div>

                {/* Coupon Input */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Coupon (e.g. BOOST20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: 13, border: '1px solid #cbd5e1', borderRadius: 6 }}
                  />
                  <button onClick={applyCoupon} style={{ padding: '8px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                    Apply
                  </button>
                </div>

                {/* Totals */}
                <div style={{ fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 4 }}>
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: 4 }}>
                      <span>Discount ({discountPercent}%):</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: '#0f172a' }}>
                    <span>Total:</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleSimulatedCheckout}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    padding: '14px 0',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ⚡ Pay via Razorpay / COD (Mock Test) →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Order Success Modal ── */}
      {checkoutSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 16 }}>
          <div style={{ backgroundColor: '#fff', padding: 32, borderRadius: 20, maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <span style={{ fontSize: 54 }}>🎉</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '12px 0 6px', color: '#16a34a' }}>Order Placed Successfully!</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 16px' }}>
              Order ID: <strong>{checkoutSuccess}</strong>
            </p>
            <div style={{ backgroundColor: '#f1f5f9', padding: 16, borderRadius: 12, fontSize: 13, color: '#334155', textAlign: 'left', marginBottom: 20 }}>
              <p style={{ margin: '0 0 6px' }}>⚡ <strong>Simulated Payment:</strong> Success (Razorpay/COD)</p>
              <p style={{ margin: '0 0 6px' }}>🚚 <strong>Tracking AWB:</strong> SR9982312014</p>
              <p style={{ margin: 0 }}>📍 <strong>Destination:</strong> {pincodeInfo.city}, {pincodeInfo.state}</p>
            </div>
            <button
              onClick={() => { setCheckoutSuccess(null); setIsCartOpen(false); }}
              style={{ width: '100%', backgroundColor: '#0f172a', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
