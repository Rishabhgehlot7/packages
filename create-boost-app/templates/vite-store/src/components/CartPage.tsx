import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import {
  ShoppingBagIcon,
  TrashIcon,
  MapPinIcon,
  TagIcon,
  LockIcon,
  CheckIcon,
  CheckCircleIcon,
  CreditCardIcon,
  BanknoteIcon,
  UserIcon,
  PhoneIcon,
  ArrowRightIcon,
  ZapIcon,
} from './Icons';

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('boost_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pincode, setPincode] = useState<string>('110001');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Checkout inputs
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    total: number;
    paymentMethod: string;
    city: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('boost_cart', JSON.stringify(cart));
    } catch {
      // Handle quota gracefully
    }
  }, [cart]);

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
      alert('Invalid coupon code. Try BOOST20 for 20% off.');
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
      alert('Please fill in your Delivery Name, Mobile, and Full Address.');
      return;
    }
    if (customerPhone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    const orderId = 'BST-' + Math.floor(100000 + Math.random() * 900000);
    setOrderSuccess({
      orderId,
      total: finalTotal,
      paymentMethod: paymentMethod === 'online' ? 'Instant Online (Razorpay / UPI)' : 'Cash on Delivery (COD)',
      city: pincodeInfo.city,
    });
    setCart([]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0f172a' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#0f172a', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ZapIcon size={18} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800 }}>Boost Store</span>
          </Link>

          <Link to="/" style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>← Continue Shopping</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1240, margin: '32px auto', padding: '0 24px 64px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShoppingBagIcon size={24} /> Your Cart & Checkout ({totalCartCount})
        </h1>

        {cart.length === 0 && !orderSuccess ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: '60px 24px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#cbd5e1', display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <ShoppingBagIcon size={64} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>Your cart is empty</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 20px' }}>Explore our drop and add your favorite streetwear essentials.</p>
            <Link
              to="/"
              style={{
                backgroundColor: '#0f172a',
                color: '#fff',
                padding: '12px 26px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'start' }}>
            {/* Left: Cart Items & Delivery Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Items List */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                  Cart Items ({totalCartCount})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cart.map(({ product, quantity, size }) => (
                    <div
                      key={`${product.id}-${size || 'nosize'}`}
                      style={{
                        display: 'flex',
                        gap: 16,
                        paddingBottom: 16,
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 10 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700 }}>{product.title}</h4>
                          <button
                            onClick={() => removeItem(product.id, size)}
                            title="Remove"
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{product.category}</span>
                          {size && (
                            <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                              Size: {size}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 15, fontWeight: 800 }}>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', padding: '3px 6px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                            <button
                              onClick={() => updateQuantity(product.id, size, -1)}
                              style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, size, 1)}
                              style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Form */}
              <form onSubmit={handleCheckoutSubmit} style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                  Delivery Address & Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                        <UserIcon size={15} />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Kabir Malhotra"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Mobile Number *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                        <PhoneIcon size={15} />
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98XXXXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Street Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No, Landmark, Area"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontFamily: 'inherit' }}
                  />
                </div>

                {/* Payment Option Selection */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 8 }}>Payment Method</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div
                      onClick={() => setPaymentMethod('online')}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        border: paymentMethod === 'online' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: paymentMethod === 'online' ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <CreditCardIcon size={18} color="#2563eb" />
                      <div>
                        <strong style={{ fontSize: 13, display: 'block' }}>Instant UPI / Cards</strong>
                        <span style={{ fontSize: 11, color: '#64748b' }}>Razorpay Secure</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('cod')}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        border: paymentMethod === 'cod' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        backgroundColor: paymentMethod === 'cod' ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <BanknoteIcon size={18} color="#16a34a" />
                      <div>
                        <strong style={{ fontSize: 13, display: 'block' }}>Cash on Delivery</strong>
                        <span style={{ fontSize: 11, color: '#64748b' }}>Pay cash at door</span>
                      </div>
                    </div>
                  </div>
                </div>

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
                    marginTop: 8,
                  }}
                >
                  <LockIcon size={16} />
                  <span>Place Order • Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
                </button>
              </form>
            </div>

            {/* Right: Summary, Coupons & Pincode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Pincode Check */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 20, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MapPinIcon size={16} color="#2563eb" />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Delivery Pincode:</span>
                  <input
                    type="text"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    style={{ width: 70, padding: '3px 6px', fontSize: 12, border: '1px solid #cbd5e1', borderRadius: 4, textAlign: 'center', fontWeight: 600 }}
                  />
                </div>
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckIcon size={14} /> Deliver to {pincodeInfo.city} ({pincodeInfo.days})
                </span>
              </div>

              {/* Coupon Code */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 20, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>Apply Discount Coupon</span>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                      <TagIcon size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', fontSize: 12, border: '1px solid #cbd5e1', borderRadius: 6, textTransform: 'uppercase', fontWeight: 600 }}
                    />
                  </div>
                  <button
                    onClick={() => applyCouponCode(couponCode)}
                    style={{ padding: '8px 14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#dcfce7', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
                    <span>Coupon "{appliedCoupon}" applied ({discountPercent}% OFF)</span>
                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11 }}>
                    <span style={{ color: '#64748b' }}>Quick codes:</span>
                    <button onClick={() => applyCouponCode('BOOST20')} style={{ background: '#fef3c7', border: '1px dashed #f59e0b', color: '#92400e', padding: '2px 6px', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>
                      BOOST20 (20% OFF)
                    </button>
                    <button onClick={() => applyCouponCode('WELCOME10')} style={{ background: '#f1f5f9', border: '1px dashed #cbd5e1', color: '#475569', padding: '2px 6px', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>
                      WELCOME10
                    </button>
                  </div>
                )}
              </div>

              {/* Order Totals Summary */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 14px' }}>Order Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                      <span>Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Express Delivery</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, borderTop: '1px dashed #e2e8f0', paddingTop: 12, marginTop: 4 }}>
                    <span>Total Amount</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Confirmed Modal */}
        {orderSuccess && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', borderRadius: 24, maxWidth: 440, width: '100%', padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircleIcon size={36} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Order Placed Successfully!</h2>
              <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 20px' }}>Your streetwear items are being prepared for dispatch.</p>

              <div style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 14, fontSize: 13, textAlign: 'left', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700 }}>ORDER ID</span>
                  <p style={{ margin: 0, fontWeight: 700 }}>{orderSuccess.orderId}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700 }}>PAYMENT METHOD</span>
                  <p style={{ margin: 0, fontWeight: 600 }}>{orderSuccess.paymentMethod}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700 }}>TOTAL AMOUNT</span>
                  <p style={{ margin: 0, fontWeight: 700, color: '#16a34a' }}>₹{orderSuccess.total.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700 }}>DELIVERY TO</span>
                  <p style={{ margin: 0, fontWeight: 600 }}>{orderSuccess.city} ({pincodeInfo.days})</p>
                </div>
              </div>

              <Link
                to="/"
                onClick={() => setOrderSuccess(null)}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '13px 0',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>Continue Shopping</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
