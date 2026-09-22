import React, { useState } from 'react';
import { Play, Calculator, Tag, Award, Sparkles } from 'lucide-react';

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Delhi',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Haryana',
  'Telangana'
];

export const Playground: React.FC = () => {
  // 1. GST Calculator State
  const [sellerState, setSellerState] = useState('Maharashtra');
  const [buyerState, setBuyerState] = useState('Karnataka');
  const [productPrice, setProductPrice] = useState(1999);
  const [gstSlab, setGstSlab] = useState(18);

  const isInterState = sellerState !== buyerState;
  const basePrice = Math.round((productPrice / (1 + gstSlab / 100)) * 100) / 100;
  const totalTax = Math.round((productPrice - basePrice) * 100) / 100;
  const cgst = isInterState ? 0 : Math.round((totalTax / 2) * 100) / 100;
  const sgst = isInterState ? 0 : Math.round((totalTax / 2) * 100) / 100;
  const igst = isInterState ? totalTax : 0;
  const freeShippingThreshold = 1500;
  const freeShippingProgress = Math.min(100, Math.round((productPrice / freeShippingThreshold) * 100));

  // 2. Coupon Simulator State
  const [cartTotal, setCartTotal] = useState(2400);
  const sampleCoupons = [
    { code: 'FLAT150', type: 'FLAT', value: 150, min: 999 },
    { code: 'SAVE20', type: 'PERCENT', value: 20, max: 400, min: 1499 },
    { code: 'VIP500', type: 'FLAT', value: 500, min: 2999 }
  ];

  const evaluatedCoupons = sampleCoupons.map((c) => {
    let discount = 0;
    let eligible = cartTotal >= c.min;
    if (eligible) {
      if (c.type === 'FLAT') discount = c.value;
      else discount = Math.min(c.max || 9999, Math.round(cartTotal * (c.value / 100)));
    }
    return { ...c, eligible, discount };
  });

  const bestCoupon = evaluatedCoupons.reduce((best, curr) => 
    (curr.discount > (best?.discount || 0) ? curr : best), 
    evaluatedCoupons[0]
  );

  // 3. Loyalty Simulator State
  const [tier, setTier] = useState<'BRONZE' | 'SILVER' | 'GOLD' | 'SUPERSTAR'>('GOLD');
  const [orderSpend, setOrderSpend] = useState(3000);
  const [userCoins, setUserCoins] = useState(250);

  const tierMultipliers = {
    BRONZE: 1.0,
    SILVER: 1.5,
    GOLD: 2.0,
    SUPERSTAR: 3.0
  };

  const earnedCoins = Math.round((orderSpend / 100) * 5 * tierMultipliers[tier]);
  const redemptionDiscount = Math.min(Math.round(orderSpend * 0.2), userCoins); // max 20% order value

  return (
    <div className="content-area">
      <div className="doc-header">
        <div className="doc-category-badge" style={{ background: 'var(--amber-light)', color: '#fbbf24' }}>
          <Sparkles size={13} />
          <span>INTERACTIVE SANDBOX</span>
        </div>
        <h1 className="doc-title">
          <span>D2C Interactive Playground</span>
        </h1>
        <p className="doc-description">
          Experience real-world calculations powered by <code>@boostengine/cart</code>, <code>@boostengine/coupons</code>, and <code>@boostengine/loyalty</code> in real time.
        </p>
      </div>

      <div className="playground-grid">
        {/* GST Calculator */}
        <div className="sim-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--primary-light)', color: '#818cf8',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Calculator size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>Indian GST Tax Simulator</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Powered by @boostengine/cart</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Warehouse (Seller) State</label>
            <select className="form-select" value={sellerState} onChange={(e) => setSellerState(e.target.value)}>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Customer (Buyer) State</label>
            <select className="form-select" value={buyerState} onChange={(e) => setBuyerState(e.target.value)}>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price Incl. GST (₹)</label>
              <input
                type="number"
                className="form-input"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GST Slab</label>
              <select className="form-select" value={gstSlab} onChange={(e) => setGstSlab(Number(e.target.value))}>
                <option value={0}>0% (Exempt)</option>
                <option value={5}>5% (Apparel/Essentials)</option>
                <option value={12}>12% (Footwear/Packaged)</option>
                <option value={18}>18% (Standard D2C)</option>
                <option value={28}>28% (Luxury items)</option>
              </select>
            </div>
          </div>

          <div className="results-box">
            <div style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              background: isInterState ? 'var(--cyan-light)' : 'var(--emerald-light)',
              color: isInterState ? 'var(--cyan)' : 'var(--emerald)'
            }}>
              {isInterState ? 'INTER-STATE (IGST Applies)' : 'INTRA-STATE (CGST + SGST Applies)'}
            </div>

            <div className="result-row">
              <span style={{ color: 'var(--text-muted)' }}>Taxable Subtotal:</span>
              <span>₹{basePrice.toFixed(2)}</span>
            </div>

            {!isInterState ? (
              <>
                <div className="result-row">
                  <span style={{ color: 'var(--text-muted)' }}>CGST ({gstSlab / 2}%):</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
                <div className="result-row">
                  <span style={{ color: 'var(--text-muted)' }}>SGST ({gstSlab / 2}%):</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="result-row">
                <span style={{ color: 'var(--text-muted)' }}>IGST ({gstSlab}%):</span>
                <span>₹{igst.toFixed(2)}</span>
              </div>
            )}

            <div className="result-row">
              <span style={{ color: 'var(--text-muted)' }}>Free Delivery Meter:</span>
              <span style={{ color: freeShippingProgress >= 100 ? 'var(--emerald)' : 'var(--amber)' }}>
                {freeShippingProgress >= 100 ? 'Unlocked Free Shipping!' : `${freeShippingProgress}% (Add ₹${Math.max(0, freeShippingThreshold - productPrice)})`}
              </span>
            </div>

            <div className="result-row">
              <span>Customer Payable Total:</span>
              <span style={{ color: '#818cf8' }}>₹{productPrice}</span>
            </div>
          </div>
        </div>

        {/* Best Coupon Optimizer */}
        <div className="sim-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--cyan-light)', color: 'var(--cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Tag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>Coupon Engine Optimizer</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Powered by @boostengine/coupons</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Simulated Cart Subtotal (₹): {cartTotal}</label>
            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={cartTotal}
              onChange={(e) => setCartTotal(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '1rem 0' }}>
            {evaluatedCoupons.map((c) => {
              const isWinner = c.code === bestCoupon?.code && c.eligible && c.discount > 0;
              return (
                <div
                  key={c.code}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: isWinner ? '1px solid var(--emerald)' : '1px solid var(--border)',
                    background: isWinner ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <code style={{ fontWeight: 700, color: isWinner ? 'var(--emerald)' : 'var(--text-main)' }}>{c.code}</code>
                      {isWinner && (
                        <span className="item-badge" style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
                          BEST SAVINGS
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Min Order ₹{c.min} • {c.type === 'FLAT' ? `Flat ₹${c.value} off` : `${c.value}% off (Max ₹${c.max})`}
                    </span>
                  </div>
                  <div>
                    {c.eligible ? (
                      <span style={{ fontWeight: 700, color: 'var(--emerald)', fontSize: '0.9rem' }}>
                        -₹{c.discount}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--rose)' }}>
                        Need ₹{c.min - cartTotal} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="results-box">
            <div className="result-row">
              <span style={{ color: 'var(--text-muted)' }}>Auto-Recommended:</span>
              <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                {bestCoupon?.eligible ? `${bestCoupon.code} (-₹${bestCoupon.discount})` : 'None eligible'}
              </span>
            </div>
            <div className="result-row">
              <span>Final Checkout Total:</span>
              <span style={{ color: '#818cf8' }}>
                ₹{cartTotal - (bestCoupon?.eligible ? bestCoupon.discount : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Loyalty Rewards Simulator */}
        <div className="sim-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--amber-light)', color: 'var(--amber)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Award size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>SuperCoins Loyalty Rewards Simulator</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Powered by @boostengine/loyalty</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Customer VIP Tier</label>
              <select className="form-select" value={tier} onChange={(e) => setTier(e.target.value as any)}>
                <option value="BRONZE">Bronze (1.0x Coins)</option>
                <option value="SILVER">Silver (1.5x Coins)</option>
                <option value="GOLD">Gold (2.0x Coins)</option>
                <option value="SUPERSTAR">SuperStar VIP (3.0x Coins)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Order Spend Value (₹)</label>
              <input
                type="number"
                className="form-input"
                value={orderSpend}
                onChange={(e) => setOrderSpend(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">User Existing Coins: {userCoins}</label>
              <input
                type="number"
                className="form-input"
                value={userCoins}
                onChange={(e) => setUserCoins(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="results-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', border: 'none' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Coins Earned On Purchase</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.2rem' }}>
                +{earnedCoins} Coins
              </div>
            </div>

            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Checkout Coin Redemption</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.2rem' }}>
                -₹{redemptionDiscount} Discount
              </div>
            </div>

            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Post-Order Net Payable</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8', marginTop: '0.2rem' }}>
                ₹{orderSpend - redemptionDiscount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
