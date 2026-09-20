import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface NavLinkItem {
  label: string;
  href: string;
  badge?: string;
  isHighlight?: boolean;
  children?: NavLinkItem[];
}

export interface NavbarProps {
  brandName?: string;
  logo?: React.ReactNode;
  logoUrl?: string;
  brandBadge?: string;
  navLinks?: NavLinkItem[];
  activeHref?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: (val: string) => void;
  showSearch?: boolean;
  cartCount?: number;
  wishlistCount?: number;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onAccountClick?: () => void;
  onLinkClick?: (href: string) => void;
  isLoggedIn?: boolean;
  userName?: string;
  sticky?: boolean;
  announcementText?: string;
  announcementLink?: string;
  onAnnouncementClose?: () => void;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName = 'BoostStore',
  logo,
  logoUrl,
  brandBadge,
  navLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'Best Sellers', href: '/collections/bestsellers', badge: 'HOT' },
    { label: 'New Arrivals', href: '/collections/new' },
    { label: 'Sale', href: '/collections/sale', isHighlight: true },
  ],
  activeHref,
  searchPlaceholder = 'Search for products, brands...',
  searchValue,
  onSearchChange,
  onSearchSubmit,
  showSearch = true,
  cartCount = 0,
  wishlistCount = 0,
  onCartClick,
  onWishlistClick,
  onAccountClick,
  onLinkClick,
  isLoggedIn = false,
  userName,
  sticky = true,
  announcementText,
  announcementLink,
  onAnnouncementClose,
  actions,
  className = '',
  style,
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [localSearch, setLocalSearch] = React.useState(searchValue || '');
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [announcementVisible, setAnnouncementVisible] = React.useState(true);
  const [expandedMobileItem, setExpandedMobileItem] = React.useState<string | null>(null);

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

  const getPresetNavbarStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          backgroundColor: '#ffffff',
          borderBottom: '3px solid #000000',
          boxShadow: '0 4px 0px #000000',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.88))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        };
      case 'neumorphism':
        return {
          backgroundColor: 'var(--boost-surface, #e8ebf0)',
          borderBottom: 'none',
          boxShadow: '0 6px 14px #d1d9e6',
        };
      case 'gradient-glow':
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
        };
      case 'material-you':
        return {
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          borderBottom: 'none',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        };
      case 'dark-first':
        return {
          backgroundColor: '#090d16',
          borderBottom: '1px solid #1e293b',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderBottom: '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        };
    }
  };

  return (
    <header
      className={`boost-navbar boost-navbar-preset-${preset} ${className}`}
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 40,
        width: '100%',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        ...getPresetNavbarStyles(),
        ...style,
      }}
    >
      {announcementText && announcementVisible && (
        <div
          className="boost-navbar-announcement"
          style={{
            backgroundColor: 'var(--boost-primary, #2563eb)',
            color: '#ffffff',
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 600,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            position: 'relative',
          }}
        >
          <span>{announcementText}</span>
          {announcementLink && (
            <a
              href={announcementLink}
              style={{
                color: '#ffffff',
                textDecoration: 'underline',
                fontWeight: 700,
              }}
            >
              Shop Now →
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setAnnouncementVisible(false);
              if (onAnnouncementClose) onAnnouncementClose();
            }}
            aria-label="Close announcement"
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.85)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
      <style>{`
        :root[data-theme="dark"] .boost-navbar {
          background-color: rgba(15, 23, 42, 0.92);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        :root[data-theme="dark"] .boost-navbar-preset-neo-brutalism {
          background-color: #18181b !important;
          border-bottom-color: #f8fafc !important;
          box-shadow: 0 4px 0px #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-navbar-preset-glassmorphism {
          background-color: rgba(15, 23, 42, 0.88) !important;
          border-bottom-color: rgba(255, 255, 255, 0.12) !important;
        }
        :root[data-theme="dark"] .boost-navbar-preset-neumorphism {
          background-color: #0f172a !important;
          box-shadow: 0 6px 14px #090d15 !important;
        }
        :root[data-theme="dark"] .boost-navbar-preset-gradient-glow {
          background-color: #0f172a !important;
          border-bottom-color: rgba(99, 102, 241, 0.4) !important;
          box-shadow: 0 4px 25px rgba(99, 102, 241, 0.25) !important;
        }
        :root[data-theme="dark"] .boost-navbar input {
          background-color: rgba(30, 41, 59, 0.8) !important;
          color: #f8fafc !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-nav-link-anchor {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-nav-link-anchor:hover,
        :root[data-theme="dark"] .boost-navbar .boost-nav-link-anchor.is-active {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-mobile-search-bar {
          background-color: #0f172a !important;
          border-top-color: rgba(255, 255, 255, 0.08) !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-navbar-mobile-drawer {
          background-color: rgba(15, 23, 42, 0.98) !important;
          border-top-color: rgba(255, 255, 255, 0.1) !important;
        }
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
            {logo ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>{logo}</div>
            ) : logoUrl ? (
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
                {brandBadge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(37, 99, 235, 0.12)',
                      color: 'var(--boost-primary, #2563eb)',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {brandBadge}
                  </span>
                )}
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
            gap: '16px',
          }}
        >
          {navLinks.map((link) => {
            const hasChildren = link.children && link.children.length > 0;
            const isOpen = openDropdown === link.label;

            return (
              <div
                key={link.href}
                style={{ position: 'relative' }}
                onMouseEnter={() => hasChildren && setOpenDropdown(link.label)}
                onMouseLeave={() => hasChildren && setOpenDropdown(null)}
              >
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (hasChildren && !onLinkClick) {
                      e.preventDefault();
                      setOpenDropdown(isOpen ? null : link.label);
                    } else {
                      handleNavigation(link.href, e);
                    }
                  }}
                  style={{
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: link.isHighlight ? '#ef4444' : 'var(--boost-text, #0f172a)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    transition: 'color 0.15s ease, background-color 0.15s ease',
                  }}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </a>

                {hasChildren && isOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '200px',
                      backgroundColor: 'var(--boost-surface, #ffffff)',
                      border: '1px solid var(--boost-border, #e2e8f0)',
                      borderRadius: 'var(--boost-radius, 12px)',
                      boxShadow: 'var(--boost-shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.1))',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      zIndex: 50,
                      animation: 'boost-fadeIn 0.15s ease',
                    }}
                  >
                    {link.children!.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={(e) => {
                          handleNavigation(child.href, e);
                          setOpenDropdown(null);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--boost-text, #0f172a)',
                          transition: 'background-color 0.15s ease, color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--boost-bg, #f1f5f9)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        <span>{child.label}</span>
                        {child.badge && (
                          <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: '9999px', backgroundColor: 'var(--boost-primary, #2563eb)', color: '#ffffff' }}>
                            {child.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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

          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {actions}
            </div>
          )}
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
            gap: '6px',
            animation: 'boost-fadeIn 0.2s ease',
          }}
        >
          {navLinks.map((link) => {
            const hasChildren = link.children && link.children.length > 0;
            const isExpanded = expandedMobileItem === link.label;

            return (
              <div key={link.href}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isExpanded ? 'var(--boost-surface, #f8fafc)' : 'transparent',
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault();
                        setExpandedMobileItem(isExpanded ? null : link.label);
                      } else {
                        handleNavigation(link.href, e);
                      }
                    }}
                    style={{
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: link.isHighlight ? '#ef4444' : 'var(--boost-text, #0f172a)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
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

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => setExpandedMobileItem(isExpanded ? null : link.label)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--boost-text-muted, #64748b)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {link.children!.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={(e) => handleNavigation(child.href, e)}
                        style={{
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'var(--boost-text-muted, #64748b)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{child.label}</span>
                        {child.badge && (
                          <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: '9999px', backgroundColor: 'var(--boost-primary, #2563eb)', color: '#ffffff' }}>
                            {child.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
};


Navbar.displayName = 'Navbar';
