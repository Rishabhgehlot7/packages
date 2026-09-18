import * as React from 'react';

export interface NavLinkItem {
  label: string;
  href: string;
  badge?: string;
  isHighlight?: boolean;
}

export interface NavbarProps {
  brandName?: string;
  logoUrl?: string;
  navLinks?: NavLinkItem[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: (val: string) => void;
  cartCount?: number;
  wishlistCount?: number;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onAccountClick?: () => void;
  onLinkClick?: (href: string) => void;
  isLoggedIn?: boolean;
  userName?: string;
  sticky?: boolean;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName = 'BoostStore',
  logoUrl,
  navLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'Best Sellers', href: '/collections/bestsellers', badge: 'HOT' },
    { label: 'New Arrivals', href: '/collections/new' },
    { label: 'Sale', href: '/collections/sale', isHighlight: true },
  ],
  searchPlaceholder = 'Search for products, brands...',
  searchValue,
  onSearchChange,
  onSearchSubmit,
  cartCount = 0,
  wishlistCount = 0,
  onCartClick,
  onWishlistClick,
  onAccountClick,
  onLinkClick,
  isLoggedIn = false,
  userName,
  sticky = true,
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [localSearch, setLocalSearch] = React.useState(searchValue || '');

  React.useEffect(() => {
    if (searchValue !== undefined) {
      setLocalSearch(searchValue);
    }
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      e.preventDefault();
      onSearchSubmit(localSearch);
    }
  };

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href);
    }
    setMobileMenuOpen(false);
  };

  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  return (
    <header
      className={`boost-navbar ${className}`}
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 40,
        backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.88))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--boost-border, #e2e8f0)',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <style>{`
        @media (max-width: 992px) {
          .boost-navbar .boost-desktop-nav {
            display: none !important;
          }
          .boost-navbar .boost-mobile-hamburger {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .boost-navbar .boost-navbar-search-desktop {
            display: none !important;
          }
          .boost-navbar .boost-mobile-search-btn {
            display: inline-flex !important;
          }
          .boost-navbar .boost-cart-btn-text {
            display: none !important;
          }
        }
        @media (min-width: 641px) {
          .boost-navbar .boost-mobile-search-btn {
            display: none !important;
          }
          .boost-navbar .boost-mobile-search-bar {
            display: none !important;
          }
        }
      `}</style>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px clamp(14px, 3vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(10px, 2vw, 24px)',
        }}
      >
        {/* Left: Mobile hamburger & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="boost-mobile-hamburger"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              color: 'var(--boost-text, #0f172a)',
              borderRadius: '8px',
              transition: 'background-color 0.15s ease',
            }}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          {/* Logo / Brand Name */}
          <a
            href="/"
            onClick={(e) => handleNavigation('/', e)}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} style={{ height: '32px', width: 'auto' }} />
            ) : (
              <span
                style={{
                  fontSize: 'clamp(18px, 2.2vw, 22px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--boost-text, #0f172a)',
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
                    backgroundColor: 'var(--boost-primary, #2563eb)',
                    color: '#ffffff',
                    borderRadius: '9px',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </span>
                {brandName}
              </span>
            )}
          </a>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav
          className="boost-desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavigation(link.href, e)}
              style={{
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                color: link.isHighlight ? '#ef4444' : 'var(--boost-text, #0f172a)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '8px',
                transition: 'color 0.15s ease, background-color 0.15s ease',
              }}
            >
              {link.label}
              {link.badge && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Desktop Search Bar */}
        <div
          className="boost-navbar-search boost-navbar-search-desktop"
          style={{
            flex: 1,
            maxWidth: '340px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--boost-text-muted, #64748b)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              fontSize: '13px',
              borderRadius: '9999px',
              border: '1px solid var(--boost-border, #e2e8f0)',
              backgroundColor: 'var(--boost-surface, #f8fafc)',
              color: 'var(--boost-text, #0f172a)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.15s ease',
            }}
          />
        </div>

        {/* Right Actions: Wishlist, Account, Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 14px)' }}>
          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search"
            className="boost-mobile-search-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--boost-text, #0f172a)',
              borderRadius: '8px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={onWishlistClick}
            aria-label="Wishlist"
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--boost-text, #0f172a)',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              transition: 'transform 0.15s ease',
            }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 1px 4px rgba(239, 68, 68, 0.4)',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account button */}
          <button
            type="button"
            onClick={onAccountClick}
            aria-label="Account"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--boost-text, #0f172a)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
            }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {isLoggedIn && userName && (
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #0f172a)' }}>{userName}</span>
            )}
          </button>

          {/* Cart button */}
          <button
            type="button"
            onClick={onCartClick}
            aria-label="Shopping Cart"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--boost-primary, #2563eb)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              boxShadow: 'var(--boost-shadow-glow, 0 2px 10px rgba(37, 99, 235, 0.25))',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="boost-cart-btn-text">Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--boost-primary, #2563eb)',
                  borderRadius: '9999px',
                  padding: '1px 6px',
                  fontSize: '11px',
                  fontWeight: 800,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Row (Expandable on Mobile) */}
      {mobileSearchOpen && (
        <div
          className="boost-mobile-search-bar"
          style={{
            padding: '8px 16px 12px 16px',
            borderTop: '1px solid var(--boost-border, #e2e8f0)',
            backgroundColor: 'var(--boost-surface, #f8fafc)',
            animation: 'boost-fadeIn 0.2s ease',
          }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--boost-text-muted, #64748b)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              autoFocus
              value={localSearch}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                fontSize: '13px',
                borderRadius: '9999px',
                border: '1px solid var(--boost-border, #e2e8f0)',
                backgroundColor: 'var(--boost-bg, #ffffff)',
                color: 'var(--boost-text, #0f172a)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--boost-border, #e2e8f0)',
            backgroundColor: 'var(--boost-bg, #ffffff)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'boost-fadeIn 0.2s ease',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavigation(link.href, e)}
              style={{
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
                color: link.isHighlight ? '#ef4444' : 'var(--boost-text, #0f172a)',
                padding: '10px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.15s ease',
              }}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};


Navbar.displayName = 'Navbar';
