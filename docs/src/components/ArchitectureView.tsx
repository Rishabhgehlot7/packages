import React from 'react';
import { GitBranch, Layers, ArrowDown, Check, Zap } from 'lucide-react';

interface Stage {
  num: number;
  title: string;
  subtitle: string;
  packages: Array<{ name: string; id: string; role: string }>;
  color: string;
}

interface ArchitectureViewProps {
  onSelectPackage: (pkgId: string) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onSelectPackage }) => {
  const stages: Stage[] = [
    {
      num: 1,
      title: 'Discovery & SEO',
      subtitle: 'Google Shopping, Organic SEO & Typo-Tolerant Search',
      color: '#06b6d4',
      packages: [
        { name: '@boostengine/seo', id: 'boost-seo', role: 'Schema.org JSON-LD & Google Merchant XML' },
        { name: '@boostengine/search', id: 'boost-search', role: 'Sub-5ms typo-tolerant search & facet filters' },
        { name: '@boostengine/analytics', id: 'boost-analytics', role: 'Unified Meta Pixel & GA4 event broadcasting' }
      ]
    },
    {
      num: 2,
      title: 'Product Page & Urgency',
      subtitle: 'Social Proof, Flash Drops & AOV Combo Bundles',
      color: '#6366f1',
      packages: [
        { name: '@boostengine/reviews', id: 'boost-reviews', role: 'Verified buyer badges & star distribution' },
        { name: '@boostengine/deals', id: 'boost-deals', role: 'Lightning deals & stock claim progress meters' },
        { name: '@boostengine/recommendations', id: 'boost-recommendations', role: 'Frequently Bought Together combo bundles' },
        { name: '@boostengine/wishlist', id: 'boost-wishlist', role: 'Guest sync & price-drop alerts' }
      ]
    },
    {
      num: 3,
      title: 'Cart, Taxes & Stock Lock',
      subtitle: 'Intra/Inter GST Engine & 15-Minute Reservation',
      color: '#10b981',
      packages: [
        { name: '@boostengine/cart', id: 'boost-cart', role: 'CGST + SGST vs IGST Indian tax breakdown & free shipping meter' },
        { name: '@boostengine/coupons', id: 'boost-coupons', role: 'autoApplyBestCoupon algorithm & BOGO rules' },
        { name: '@boostengine/inventory', id: 'boost-inventory', role: '15-minute checkout stock hold to stop overselling' },
        { name: '@boostengine/ui', id: 'boost-ui', role: 'Slide-out Cart Drawer & Sticky Buy Now bar' }
      ]
    },
    {
      num: 4,
      title: 'Identity & Payments',
      subtitle: 'Stateless Phone OTP & Unified Payment Switch',
      color: '#f59e0b',
      packages: [
        { name: '@boostengine/auth', id: 'boost-auth', role: 'Stateless HMAC phone OTP & cookie sessions' },
        { name: '@boostengine/payments', id: 'boost-payments', role: 'Razorpay, PhonePe, Cashfree, COD with auto-paise normalization' },
        { name: '@boostengine/invoicing', id: 'boost-invoicing', role: 'Legal Indian GST Tax Invoice & 4x6 thermal shipping labels' }
      ]
    },
    {
      num: 5,
      title: 'Fulfillment & Real-time Alerts',
      subtitle: 'Multi-Courier Aggregation & WhatsApp Alerts',
      color: '#8b5cf6',
      packages: [
        { name: '@boostengine/shipping', id: 'boost-shipping', role: 'Shiprocket, Delhivery, Shadowfax live rate comparison & AWB' },
        { name: '@boostengine/notifications', id: 'boost-notifications', role: 'Instant WhatsApp & SMS order & dispatch alerts' },
        { name: '@boostengine/communications', id: 'boost-communications', role: 'Multi-tier fallback CPaaS (WhatsApp -> RCS -> SMS -> Voice)' }
      ]
    },
    {
      num: 6,
      title: 'Reverse Logistics & Viral Loop',
      subtitle: 'Doorstep Returns & Double-Sided Referrals',
      color: '#ec4899',
      packages: [
        { name: '@boostengine/returns', id: 'boost-returns', role: 'Shiprocket reverse pickup manifest, QC checks & instant refund' },
        { name: '@boostengine/loyalty', id: 'boost-loyalty', role: 'Flipkart SuperCoins style VIP tiers & coin redemption' },
        { name: '@boostengine/referrals', id: 'boost-referrals', role: 'Give ₹200, Get ₹200 viral 1-click WhatsApp share' }
      ]
    }
  ];

  return (
    <div className="content-area">
      <div className="doc-header">
        <div className="doc-category-badge">
          <GitBranch size={13} />
          <span>FULL ECOSYSTEM ARCHITECTURE</span>
        </div>
        <h1 className="doc-title">
          <span>End-to-End D2C Architecture Blueprint</span>
        </h1>
        <p className="doc-description">
          See how all 24 micro-packages compose together into a complete, high-converting shopper lifecycle. Click any package card to view its documentation.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {stages.map((stage, idx) => (
          <div key={stage.num} style={{ position: 'relative' }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${stage.color}33`,
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: `0 4px 20px ${stage.color}11`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${stage.color}22`,
                    color: stage.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.95rem'
                  }}>
                    {stage.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>{stage.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{stage.subtitle}</span>
                  </div>
                </div>

                <span className="item-badge" style={{ background: `${stage.color}22`, color: stage.color }}>
                  Stage {stage.num} of 6
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                {stage.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => onSelectPackage(pkg.id)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = stage.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <code style={{ fontSize: '0.85rem', color: stage.color, fontWeight: 700 }}>
                        {pkg.name}
                      </code>
                      <Zap size={13} style={{ color: stage.color }} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      {pkg.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {idx < stages.length - 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0.75rem 0 -0.5rem',
                color: 'var(--text-dim)'
              }}>
                <ArrowDown size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
