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
  variant?: 'dark' | 'light' | 'surface';
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
  variant = 'dark',
  className = '',
}) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError(null);
    if (onNewsletterSubmit) onNewsletterSubmit(trimmed);
    setSubscribed(true);
  };

  const isLight = variant === 'light';
  const isSurface = variant === 'surface';

  const footerBg = isLight ? '#f8fafc' : isSurface ? 'var(--boost-surface, #ffffff)' : '#090d16';
  const footerText = isLight ? '#475569' : isSurface ? 'var(--boost-text-muted, #64748b)' : '#94a3b8';
  const headingColor = isLight ? '#0f172a' : isSurface ? 'var(--boost-text, #0f172a)' : '#ffffff';
  const borderColor = isLight ? 'var(--boost-border, #e2e8f0)' : isSurface ? 'var(--boost-border, #e2e8f0)' : 'rgba(255, 255, 255, 0.08)';
  const inputBg = isLight || isSurface ? 'var(--boost-bg, #ffffff)' : 'rgba(255, 255, 255, 0.05)';
  const inputColor = isLight || isSurface ? 'var(--boost-text, #0f172a)' : '#ffffff';
  const inputBorder = isLight || isSurface ? 'var(--boost-border, #cbd5e1)' : 'rgba(255, 255, 255, 0.12)';

  return (
    <footer
      className={`boost-footer ${className}`}
      style={{
        backgroundColor: footerBg,
        color: footerText,
        padding: 'clamp(40px, 6vw, 64px) clamp(16px, 4vw, 32px) 28px',
        borderTop: `1px solid ${borderColor}`,
        fontSize: '14px',
        boxSizing: 'border-box',
        width: '100%',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'clamp(28px, 4vw, 48px)',
          paddingBottom: 'clamp(28px, 4vw, 40px)',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        {/* Brand info & Newsletter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span
            style={{
              fontSize: 'clamp(20px, 2.5vw, 24px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: headingColor,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--boost-primary, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 900,
              }}
            >
              ⚡
            </span>
            {brandName}
          </span>
          <p style={{ lineHeight: 1.6, margin: 0, fontSize: '13px', color: footerText }}>{description}</p>

          {/* Newsletter box */}
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: headingColor, display: 'block', marginBottom: '8px' }}>
              Subscribe for exclusive drops & offers
            </span>
            {subscribed ? (
              <div
                style={{
                  color: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>You're on the VIP list! Check your inbox soon.</span>
              </div>
            ) : (
              <div>
                <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="Enter your email"
                    style={{
                      flex: '1 1 180px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: inputBg,
                      border: `1px solid ${emailError ? '#ef4444' : inputBorder}`,
                      color: inputColor,
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--boost-primary, #2563eb)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                      transition: 'opacity 0.15s ease',
                    }}
                  >
                    Join
                  </button>
                </form>
                {emailError && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ef4444', marginTop: '6px', fontWeight: 500 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {emailError}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Nav Columns */}
        {columns.map((col, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: headingColor,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
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
                      color: footerText,
                      textDecoration: 'none',
                      fontSize: '13px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = headingColor)}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = footerText)}
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
          color: footerText,
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
                  backgroundColor: isLight || isSurface ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${borderColor}`,
                  color: headingColor,
                  padding: '3px 9px',
                  borderRadius: '6px',
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


Footer.displayName = 'Footer';
