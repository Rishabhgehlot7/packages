import * as React from 'react';

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterProps {
  brandName?: string;
  description?: string;
  columns?: FooterColumn[];
  onNewsletterSubmit?: (email: string) => void;
  showPaymentBadges?: boolean;
  copyrightYear?: number;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  brandName = 'BoostStore',
  description = 'India’s modern direct-to-consumer store delivering premium quality essentials straight to your doorstep.',
  columns = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'Best Sellers', href: '/collections/bestsellers' },
        { label: 'New Arrivals', href: '/collections/new' },
        { label: 'Special Offers', href: '/collections/sale' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Track Your Order', href: '/track-order' },
        { label: 'Shipping & Delivery', href: '/shipping-policy' },
        { label: 'Returns & Exchange', href: '/returns' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Our Story', href: '/about' },
        { label: 'Sustainability', href: '/sustainability' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ],
  onNewsletterSubmit,
  showPaymentBadges = true,
  copyrightYear = new Date().getFullYear(),
  className = '',
}) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    if (onNewsletterSubmit) onNewsletterSubmit(email);
    setSubscribed(true);
  };

  return (
    <footer
      className={`boost-footer ${className}`}
      style={{
        backgroundColor: '#111827',
        color: '#9ca3af',
        padding: '60px 20px 30px',
        borderTop: '1px solid #1f2937',
        fontSize: '14px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid #1f2937',
        }}
      >
        {/* Brand info & Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                backgroundColor: '#ffffff',
                color: '#111827',
                borderRadius: '8px',
                fontSize: '15px',
              }}
            >
              ⚡
            </span>
            {brandName}
          </span>
          <p style={{ lineHeight: 1.6, margin: 0, fontSize: '13px', color: '#9ca3af' }}>{description}</p>

          {/* Newsletter box */}
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f3f4f6', display: 'block', marginBottom: '8px' }}>
              Subscribe for exclusive drops & offers
            </span>
            {subscribed ? (
              <div
                style={{
                  color: '#34d399',
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                ✓ You’re on the VIP list! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    fontWeight: 700,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Dynamic Nav Columns */}
        {columns.map((col, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              {col.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <a
                    href={link.href}
                    style={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '13px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#ffffff')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#9ca3af')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '24px auto 0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '12px',
        }}
      >
        <span>
          © {copyrightYear} {brandName}. All rights reserved. Powered by BoostEngine.
        </span>

        {showPaymentBadges && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['UPI', 'RuPay', 'VISA', 'Mastercard', 'NetBanking', 'COD Available'].map((method) => (
              <span
                key={method}
                style={{
                  backgroundColor: '#1f2937',
                  color: '#d1d5db',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {method}
              </span>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};
