import React from 'react';

export interface MobileBottomNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  href?: string;
}

export interface MobileBottomNavProps {
  items: MobileBottomNavItem[];
  activeId?: string;
  onChange?: (id: string, href?: string) => void;
  style?: React.CSSProperties;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  activeId,
  onChange,
  style,
}) => {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 999,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onChange?.(item.id, item.href)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: '6px 0',
              color: isActive ? '#0f172a' : '#64748b',
              transition: 'color 0.15s ease',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon || (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.2 : 1.8}>
                  <circle cx="12" cy="12" r="9" />
                </svg>
              )}
              {item.badge !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
                marginTop: '4px',
                letterSpacing: '-0.2px',
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


MobileBottomNav.displayName = 'MobileBottomNav';
