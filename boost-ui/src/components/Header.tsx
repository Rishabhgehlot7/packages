import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface HeaderNavLink {
  label: string;
  href: string;
  badge?: string | number;
  active?: boolean;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  brandName?: string;
  brandBadge?: string;
  navLinks?: HeaderNavLink[];
  links?: HeaderNavLink[];
  activeHref?: string;
  onLinkClick?: (href: string) => void;
  actions?: React.ReactNode;
  searchBar?: React.ReactNode;
  sticky?: boolean;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
  renderMobileMenu?: (props: {
    isOpen: boolean;
    onClose: () => void;
    links: HeaderNavLink[];
  }) => React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  brandName,
  brandBadge,
  navLinks,
  links,
  activeHref,
  onLinkClick,
  actions,
  searchBar,
  sticky = true,
  className = '',
  style,
  stylePreset: stylePresetProp,
  renderMobileMenu,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const effectiveLinks = navLinks || links || [];

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href);
    }
    setMobileMenuOpen(false);
  };

  const getPresetHeaderStyles = (): React.CSSProperties => {
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
          boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.03))',
        };
    }
  };

  return (
    <>
      <style>{`
        :root[data-theme="dark"] .boost-header {
          background-color: rgba(15, 23, 42, 0.9) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        }
        :root[data-theme="dark"] .boost-header .boost-brand-title {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-header .boost-nav-link {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-header .boost-nav-link:hover,
        :root[data-theme="dark"] .boost-header .boost-nav-link.is-active {
          color: #f8fafc !important;
          background-color: rgba(255, 255, 255, 0.06) !important;
        }
        :root[data-theme="dark"] .boost-header .boost-hamburger-btn {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-header-mobile-drawer {
          background-color: rgba(15, 23, 42, 0.98) !important;
          border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5) !important;
        }
        :root[data-theme="dark"] .boost-header-mobile-drawer .boost-mobile-nav-link {
          color: #cbd5e1 !important;
        }
        :root[data-theme="dark"] .boost-header-mobile-drawer .boost-mobile-nav-link:hover,
        :root[data-theme="dark"] .boost-header-mobile-drawer .boost-mobile-nav-link.is-active {
          color: #818cf8 !important;
          background-color: rgba(99, 102, 241, 0.12) !important;
        }

        @container (max-width: 768px) {
          .boost-desktop-nav-group {
            display: none !important;
          }
          .boost-hamburger-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 768px) {
          .boost-header .boost-desktop-nav-group {
            display: none !important;
          }
          .boost-header .boost-hamburger-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 769px) {
          :root[data-theme="dark"] .boost-header-preset-neo-brutalism {
            background-color: #18181b !important;
            border-bottom-color: #f8fafc !important;
            box-shadow: 0 4px 0px #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-header-preset-glassmorphism {
            background-color: rgba(15, 23, 42, 0.85) !important;
            border-bottom-color: rgba(255, 255, 255, 0.12) !important;
          }
          :root[data-theme="dark"] .boost-header-preset-neumorphism {
            background-color: #0f172a !important;
            box-shadow: 0 6px 14px #090d15 !important;
          }
          :root[data-theme="dark"] .boost-header-preset-gradient-glow {
            background-color: #0f172a !important;
            border-bottom-color: rgba(99, 102, 241, 0.4) !important;
            box-shadow: 0 4px 25px rgba(99, 102, 241, 0.25) !important;
          }
          .boost-header .boost-hamburger-btn {
            display: none;
          }
          .boost-header-mobile-drawer {
            display: none;
          }
        }
      `}</style>

      <header
        className={`boost-header boost-header-preset-${preset} ${className}`}
        style={{
          containerType: 'inline-size',
          position: sticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 40,
          padding: '0 clamp(16px, 3.5vw, 28px)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
          ...getPresetHeaderStyles(),
          ...style,
        }}
      >
        {/* Left: Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {logo ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>{logo}</div>
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
              }}
            >
              ⚡
            </div>
          )}
          {(brandName || (!logo && !brandName)) && (
            <span
              className="boost-brand-title"
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--boost-text, #0f172a)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {brandName || 'Brand'}
            </span>
          )}
          {brandBadge && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(59, 130, 246, 0.18))',
                color: 'var(--boost-primary, #6366f1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                textTransform: 'uppercase',
              }}
            >
              {brandBadge}
            </span>
          )}
        </div>

        {/* Center: Desktop Navigation & Optional Search */}
        <div
          className="boost-desktop-nav-group"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
            maxWidth: '640px',
          }}
        >
          {searchBar && (
            <div style={{ width: '100%', maxWidth: '280px' }}>{searchBar}</div>
          )}

          {effectiveLinks.length > 0 && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {effectiveLinks.map((link, idx) => {
                const isActive = link.active || (activeHref ? activeHref === link.href : false);
                return (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    className={`boost-nav-link ${isActive ? 'is-active' : ''}`}
                    style={{
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--boost-primary, #4f46e5)' : 'var(--boost-text-muted, #475569)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--boost-primary, #4f46e5)',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                        }}
                      >
                        {link.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right: Actions & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {actions}
            </div>
          )}

          {/* Hamburger Toggle (Visible on Mobile) */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="boost-hamburger-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              color: 'var(--boost-text, #0f172a)',
              alignItems: 'center',
              justifyContent: 'center',
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
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="boost-header-mobile-drawer"
          style={{
            backgroundColor: 'var(--boost-surface, #ffffff)',
            borderBottom: '1px solid var(--boost-border, #e2e8f0)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'boost-slideDown 0.2s ease',
            position: sticky ? 'sticky' : 'relative',
            top: sticky ? '64px' : undefined,
            zIndex: 39,
          }}
        >
          {renderMobileMenu ? (
            renderMobileMenu({
              isOpen: mobileMenuOpen,
              onClose: () => setMobileMenuOpen(false),
              links: effectiveLinks,
            })
          ) : (
            <>
              {searchBar && (
                <div style={{ marginBottom: '8px' }}>{searchBar}</div>
              )}
              {effectiveLinks.map((link, idx) => {
                const isActive = link.active || (activeHref ? activeHref === link.href : false);
                return (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    className={`boost-mobile-nav-link ${isActive ? 'is-active' : ''}`}
                    style={{
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: isActive ? 'var(--boost-primary, #4f46e5)' : 'var(--boost-text, #1e293b)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--boost-primary, #4f46e5)',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        {link.badge}
                      </span>
                    )}
                  </a>
                );
              })}
              {actions && (
                <div style={{ borderTop: '1px solid var(--boost-border, #e2e8f0)', paddingTop: '14px', marginTop: '6px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {actions}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

Header.displayName = 'Header';
