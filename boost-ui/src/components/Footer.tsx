import * as React from 'react';

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterSocialLink {
  name?: string;
  platform?: string;
  href: string;
  icon?: React.ReactNode;
}

export interface FooterProps {
  logo?: React.ReactNode;
  brandName?: string;
  brandBadge?: string;
  description?: string;
  columns?: FooterColumn[];
  socialLinks?: FooterSocialLink[];
  bottomLinks?: Array<{ label: string; href: string }>;
  newsletter?: boolean;
  onNewsletterSubmit?: (email: string) => void;
  showPaymentBadges?: boolean;
  copyrightYear?: number;
  copyrightText?: string;
  variant?: 'dark' | 'light' | 'surface';
  className?: string;
  style?: React.CSSProperties;
}

const resolveSocialIcon = (nameOrPlatform?: string): React.ReactNode => {
  const key = (nameOrPlatform || '').toLowerCase();
  if (key.includes('insta')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (key.includes('twitter') || key.includes('x')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    );
  }
  if (key.includes('youtube')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    );
  }
  if (key.includes('github')) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    );
  }
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

export const Footer: React.FC<FooterProps> = ({
  logo,
  brandName = 'BoostStore',
  brandBadge,
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
  socialLinks,
  bottomLinks = [
    { label: 'Privacy Notice', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Security', href: '/security' },
    { label: 'Sitemap', href: '/sitemap' },
  ],
  newsletter = true,
  onNewsletterSubmit,
  showPaymentBadges = true,
  copyrightYear = new Date().getFullYear(),
  copyrightText,
  variant = 'dark',
  className = '',
  style,
}) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [openMobileColumns, setOpenMobileColumns] = React.useState<Record<number, boolean>>({});

  const toggleMobileColumn = (idx: number) => {
    setOpenMobileColumns((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

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

  const footerBg = isLight ? '#f8fafc' : isSurface ? 'var(--boost-surface, #ffffff)' : '#07090e';
  const footerText = isLight ? '#475569' : isSurface ? 'var(--boost-text-muted, #64748b)' : '#94a3b8';
  const headingColor = isLight ? '#0f172a' : isSurface ? 'var(--boost-text, #0f172a)' : '#f8fafc';
  const borderColor = isLight ? 'var(--boost-border, #e2e8f0)' : isSurface ? 'var(--boost-border, #e2e8f0)' : 'rgba(255, 255, 255, 0.08)';
  const inputBg = isLight || isSurface ? 'var(--boost-bg, #ffffff)' : 'rgba(255, 255, 255, 0.06)';
  const inputColor = isLight || isSurface ? 'var(--boost-text, #0f172a)' : '#f8fafc';
  const inputBorder = isLight || isSurface ? 'var(--boost-border, #cbd5e1)' : 'rgba(255, 255, 255, 0.14)';

  const defaultSocials: FooterSocialLink[] = [
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'X / Twitter', href: 'https://twitter.com' },
    { name: 'YouTube', href: 'https://youtube.com' },
  ];

  const socials = socialLinks || defaultSocials;

  return (
    <>
      <style>{`
        :root[data-theme="dark"] .boost-footer {
          background-color: #07090e !important;
          border-top-color: rgba(255, 255, 255, 0.08) !important;
        }
        :root[data-theme="dark"] .boost-footer .boost-footer-heading {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-footer .boost-footer-link {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-footer .boost-footer-link:hover {
          color: #60a5fa !important;
        }
        :root[data-theme="dark"] .boost-footer-input {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.14) !important;
          color: #f8fafc !important;
        }

        @container (max-width: 640px) {
          .boost-footer-col-header {
            cursor: pointer !important;
          }
          .boost-footer-col-chevron {
            display: inline-block !important;
          }
        }
        @media (max-width: 640px) {
          .boost-footer-col-header {
            cursor: pointer !important;
          }
          .boost-footer-col-chevron {
            display: inline-block !important;
          }
        }
      `}</style>

      <footer
        className={`boost-footer ${className}`}
        style={{
          containerType: 'inline-size',
          backgroundColor: footerBg,
          color: footerText,
          padding: 'clamp(40px, 6vw, 64px) clamp(16px, 4vw, 32px) 28px',
          borderTop: `1px solid ${borderColor}`,
          fontSize: '14px',
          boxSizing: 'border-box',
          width: '100%',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          ...style,
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
              className="boost-footer-heading"
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
              {logo ? (
                logo
              ) : (
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
              )}
              {brandName}
              {brandBadge && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.2))',
                    color: 'var(--boost-primary, #6366f1)',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    textTransform: 'uppercase',
                  }}
                >
                  {brandBadge}
                </span>
              )}
            </span>
            <p style={{ lineHeight: 1.6, margin: 0, fontSize: '13px', color: footerText }}>
              {description}
            </p>

            {/* Social Links */}
            {socials.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                {socials.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name || s.platform || 'Social Link'}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: isLight || isSurface ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: headingColor,
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {s.icon || resolveSocialIcon(s.platform || s.name)}
                  </a>
                ))}
              </div>
            )}

            {/* Newsletter box */}
            <div style={{ marginTop: '10px' }}>
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
                      className="boost-footer-input"
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

          {/* Dynamic Nav Columns with Mobile Collapsible Accordions */}
          {columns.map((col, idx) => {
            const isOpen = !!openMobileColumns[idx];
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  className="boost-footer-col-header"
                  onClick={() => toggleMobileColumn(idx)}
                >
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
                  <span
                    className="boost-footer-col-chevron"
                    style={{
                      color: footerText,
                      transition: 'transform 0.2s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>

                <ul
                  className={`boost-footer-column-content ${isOpen ? 'is-open' : ''}`}
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="boost-footer-link"
                        style={{
                          color: footerText,
                          textDecoration: 'none',
                          fontSize: '13px',
                          transition: 'color 0.15s ease',
                          display: 'inline-block',
                          padding: '2px 0',
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Copyright, Bottom Links & Payment Badges */}
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
          <div>
            <span>
              {copyrightText || `© ${copyrightYear} ${brandName}. All rights reserved.`}
            </span>
          </div>

          {bottomLinks && bottomLinks.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {bottomLinks.map((bl, idx) => (
                <a
                  key={idx}
                  href={bl.href}
                  className="boost-footer-link"
                  style={{ color: footerText, textDecoration: 'none', fontSize: '12px' }}
                >
                  {bl.label}
                </a>
              ))}
            </div>
          )}

          {showPaymentBadges && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {['UPI', 'RuPay', 'VISA', 'Mastercard', 'NetBanking', 'COD Available'].map((method) => (
                <span
                  key={method}
                  style={{
                    backgroundColor: isLight || isSurface ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid ${borderColor}`,
                    color: headingColor,
                    padding: '3px 8px',
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
    </>
  );
};

Footer.displayName = 'Footer';
