import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface MobileBottomBarItem {
  id: string;
  label: string;
  icon: 'home' | 'search' | 'categories' | 'wishlist' | 'cart' | 'account' | React.ReactNode;
  badge?: number | string;
  href?: string;
}


/**
 * MobileBottomBarProps — Properties for mobile bottom action bar.
 */
export interface MobileBottomBarProps {
  activeTab?: string;
  defaultActiveTab?: string;
  cartCount?: number;
  wishlistCount?: number;
  items?: MobileBottomBarItem[];
  onTabChange?: (tabId: string, href?: string) => void;
  showLabels?: boolean;
  activeColor?: string;
  variant?: 'glass' | 'solid' | 'floating';
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  defaultActiveTab = 'home',
  cartCount = 0,
  wishlistCount = 0,
  items,
  onTabChange,
  showLabels = true,
  activeColor = '#4f46e5',
  variant = 'glass',
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [internalActiveTab, setInternalActiveTab] = React.useState(activeTab || defaultActiveTab);

  React.useEffect(() => {
    if (activeTab !== undefined) {
      setInternalActiveTab(activeTab);
    }
  }, [activeTab]);

  const defaultItems: MobileBottomBarItem[] = [
    { id: 'home', label: 'Home', icon: 'home', href: '/' },
    { id: 'search', label: 'Search', icon: 'search', href: '/search' },
    { id: 'wishlist', label: 'Wishlist', icon: 'wishlist', badge: wishlistCount > 0 ? wishlistCount : undefined, href: '/wishlist' },
    { id: 'cart', label: 'Bag', icon: 'cart', badge: cartCount > 0 ? cartCount : undefined, href: '/cart' },
    { id: 'account', label: 'Profile', icon: 'account', href: '/account' },
  ];

  const barItems = items || defaultItems;

  const handleItemClick = (id: string, href?: string) => {
    setInternalActiveTab(id);
    if (onTabChange) {
      onTabChange(id, href);
    }
  };

  const renderIcon = (icon: MobileBottomBarItem['icon'], isActive: boolean) => {
    if (typeof icon !== 'string') {
      return icon;
    }

    const stroke = 'currentColor';
    const strokeWidth = isActive ? '2.3' : '1.8';

    switch (icon) {
      case 'home':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'search':
      case 'categories':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 'wishlist':
        return (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={isActive ? '#ef4444' : 'none'}
            stroke={isActive ? '#ef4444' : stroke}
            strokeWidth={strokeWidth}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'cart':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        );
      case 'account':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const isFloating = variant === 'floating';

  const getPresetActiveColor = () => {
    switch (preset) {
      case 'neo-brutalism': return '#000';
      case 'glassmorphism': return '#6366f1';
      case 'gradient-glow': return '#8b5cf6';
      case 'material-you': return '#6750a4';
      case 'dark-first': return '#60a5fa';
      default: return activeColor;
    }
  };

  const getNavStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed', bottom: isFloating ? '12px' : 0, left: isFloating ? '16px' : 0,
      right: isFloating ? '16px' : 0, margin: isFloating ? '0 auto' : undefined,
      maxWidth: isFloating ? '440px' : undefined, borderRadius: isFloating ? '24px' : undefined,
      zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: isFloating ? '8px 10px' : '6px 4px calc(6px + env(safe-area-inset-bottom, 8px))',
      fontFamily: 'inherit', boxSizing: 'border-box',
    };
    switch (preset) {
      case 'neo-brutalism': return { ...base, backgroundColor: '#ffffff', borderTop: isFloating ? '3px solid #000' : '3px solid #000', boxShadow: isFloating ? '0 -4px 0px #000' : 'none' };
      case 'glassmorphism': return { ...base, backgroundColor: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: isFloating ? 'none' : '1px solid rgba(255,255,255,0.4)', border: isFloating ? '1px solid rgba(255,255,255,0.4)' : undefined, boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' };
      case 'neumorphism': return { ...base, backgroundColor: '#e0e5ec', border: 'none', boxShadow: isFloating ? '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff' : '0 -4px 12px #d1d9e6' };
      case 'gradient-glow': return { ...base, backgroundColor: 'var(--boost-surface,#ffffff)', borderTop: isFloating ? 'none' : '1px solid rgba(99,102,241,0.2)', boxShadow: `0 -4px 20px rgba(99,102,241,0.12)` };
      case 'material-you': return { ...base, backgroundColor: 'var(--boost-surface,#fffbfe)', borderTop: isFloating ? 'none' : '1px solid var(--boost-border,#e2e8f0)', borderRadius: isFloating ? '28px' : '28px 28px 0 0' };
      case 'dark-first': return { ...base, backgroundColor: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 -4px 20px rgba(0,0,0,0.5)' };
      default: return { ...base, backgroundColor: variant === 'solid' ? 'var(--boost-surface,#ffffff)' : 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: isFloating ? 'none' : '1px solid rgba(226,232,240,0.8)', border: isFloating ? '1px solid rgba(226,232,240,0.8)' : undefined, boxShadow: isFloating ? '0 12px 30px rgba(0,0,0,0.15)' : '0 -4px 20px rgba(0,0,0,0.05)' };
    }
  };

  const computedActiveColor = getPresetActiveColor();

  return (
    <>
      <style>{`
        :root[data-theme="dark"] .boost-mobile-bottom-bar-preset-${preset} { background-color: rgba(15,23,42,0.97) !important; border-top-color: rgba(255,255,255,0.08) !important; box-shadow: 0 -4px 25px rgba(0,0,0,0.5) !important; }
        :root[data-theme="dark"] .boost-mobile-bottom-bar-preset-${preset} .boost-bottom-btn { color: #94a3b8 !important; }
        :root[data-theme="dark"] .boost-mobile-bottom-bar-preset-${preset} .boost-bottom-btn.is-active { color: #818cf8 !important; }
        :root[data-theme="dark"] .boost-mobile-bottom-bar-preset-${preset} .boost-badge-cart { background-color: #6366f1 !important; color: #ffffff !important; }
      `}</style>
      <nav
        className={`boost-mobile-bottom-bar boost-mobile-bottom-bar-preset-${preset} ${className}`}
        style={{ ...getNavStyles(), ...style }}
      >
        {barItems.map((item) => {
          const isActive = internalActiveTab === item.id;
          const badgeValue = item.id === 'cart' ? cartCount || item.badge : item.id === 'wishlist' ? wishlistCount || item.badge : item.badge;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id, item.href)}
              aria-label={item.label}
              className={`boost-bottom-btn ${isActive ? 'is-active' : ''}`}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '4px 8px',
                flex: 1,
                maxWidth: '80px',
                color: isActive ? computedActiveColor : 'var(--boost-text-muted, #64748b)',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {renderIcon(item.icon, isActive)}
                {Boolean(badgeValue) && (
                  <span
                    className={item.id === 'cart' ? 'boost-badge-cart' : ''}
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '0px',
                      backgroundColor: item.id === 'cart' ? '#0f172a' : '#ef4444',
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
                      lineHeight: 1,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                  >
                    {badgeValue}
                  </span>
                )}
              </div>
              {showLabels && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

MobileBottomBar.displayName = 'MobileBottomBar';
