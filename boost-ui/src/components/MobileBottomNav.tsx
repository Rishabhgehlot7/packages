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
        minHeight: '60px',
        backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.85))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.7))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 999,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        paddingTop: '6px',
        boxShadow: 'var(--boost-shadow-md, 0 -4px 20px rgba(0, 0, 0, 0.05))',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
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
              color: isActive ? 'var(--boost-primary, #0f172a)' : 'var(--boost-muted, #64748b)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 14px',
                borderRadius: '999px',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {item.icon || (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.3 : 1.8}>
                  <circle cx="12" cy="12" r="9" />
                </svg>
              )}
              {item.badge !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
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
                    boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 600 : 500,
                marginTop: '3px',
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


MobileBottomNav.displayName = 'MobileBottomNav';
