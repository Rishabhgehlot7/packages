import * as React from 'react';

export interface MobileBottomBarItem {
  id: string;
  label: string;
  icon: 'home' | 'search' | 'categories' | 'wishlist' | 'cart' | 'account';
  badge?: number | string;
  href?: string;
}

export interface MobileBottomBarProps {
  activeTab?: string;
  cartCount?: number;
  wishlistCount?: number;
  items?: MobileBottomBarItem[];
  onTabChange?: (tabId: string, href?: string) => void;
  className?: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab = 'home',
  cartCount = 0,
  wishlistCount = 0,
  items,
  onTabChange,
  className = '',
}) => {
  const defaultItems: MobileBottomBarItem[] = [
    { id: 'home', label: 'Home', icon: 'home', href: '/' },
    { id: 'search', label: 'Search', icon: 'search', href: '/search' },
    { id: 'wishlist', label: 'Wishlist', icon: 'wishlist', badge: wishlistCount > 0 ? wishlistCount : undefined, href: '/wishlist' },
    { id: 'cart', label: 'Bag', icon: 'cart', badge: cartCount > 0 ? cartCount : undefined, href: '/cart' },
    { id: 'account', label: 'Profile', icon: 'account', href: '/account' },
  ];

  const barItems = items || defaultItems;

  const renderIcon = (type: MobileBottomBarItem['icon'], isActive: boolean) => {
    const stroke = isActive ? '#111827' : '#6b7280';
    const strokeWidth = isActive ? '2.3' : '1.8';

    switch (type) {
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

  return (
    <nav
      className={`boost-mobile-bottom-bar ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 4px calc(8px + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      {barItems.map((item) => {
        const isActive = activeTab === item.id;
        const badgeValue = item.id === 'cart' ? cartCount || item.badge : item.id === 'wishlist' ? wishlistCount || item.badge : item.badge;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange && onTabChange(item.id, item.href)}
            aria-label={item.label}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px 12px',
              flex: 1,
              maxWidth: '80px',
              color: isActive ? '#111827' : '#6b7280',
              transition: 'color 0.15s ease, transform 0.1s ease',
            }}
          >
            <div style={{ position: 'relative' }}>
              {renderIcon(item.icon, isActive)}
              {Boolean(badgeValue) && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: item.id === 'cart' ? '#111827' : '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    lineHeight: 1,
                  }}
                >
                  {badgeValue}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.01em',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
