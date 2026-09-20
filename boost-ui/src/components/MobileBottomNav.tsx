import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

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
  defaultActiveId?: string;
  onChange?: (id: string, href?: string) => void;
  showLabels?: boolean;
  activeColor?: string;
  variant?: 'glass' | 'floating' | 'solid';
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items = [],
  activeId,
  defaultActiveId,
  onChange,
  showLabels = true,
  activeColor = '#4f46e5',
  variant = 'glass',
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [internalActiveId, setInternalActiveId] = React.useState(activeId || defaultActiveId || items[0]?.id);

  React.useEffect(() => {
    if (activeId !== undefined) {
      setInternalActiveId(activeId);
    }
  }, [activeId]);

  const handleItemClick = (id: string, href?: string) => {
    setInternalActiveId(id);
    if (onChange) {
      onChange(id, href);
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
      maxWidth: isFloating ? '440px' : undefined,
      zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: isFloating ? '8px 10px' : '6px 4px calc(6px + env(safe-area-inset-bottom, 8px))',
      fontFamily: 'inherit', boxSizing: 'border-box',
    };
    switch (preset) {
      case 'neo-brutalism': return { ...base, backgroundColor: '#ffffff', borderRadius: isFloating ? '2px' : undefined, borderTop: '3px solid #000', boxShadow: isFloating ? '0 -4px 0px #000' : 'none' };
      case 'glassmorphism': return { ...base, backgroundColor: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: isFloating ? '24px' : undefined, borderTop: isFloating ? 'none' : '1px solid rgba(255,255,255,0.4)', border: isFloating ? '1px solid rgba(255,255,255,0.4)' : undefined, boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' };
      case 'neumorphism': return { ...base, backgroundColor: '#e0e5ec', borderRadius: isFloating ? '9999px' : undefined, border: 'none', boxShadow: isFloating ? '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff' : '0 -4px 12px #d1d9e6' };
      case 'gradient-glow': return { ...base, backgroundColor: 'var(--boost-surface,#ffffff)', borderRadius: isFloating ? '24px' : undefined, borderTop: isFloating ? 'none' : '1px solid rgba(99,102,241,0.2)', boxShadow: '0 -4px 20px rgba(99,102,241,0.12)' };
      case 'material-you': return { ...base, backgroundColor: 'var(--boost-surface,#fffbfe)', borderRadius: isFloating ? '28px' : '28px 28px 0 0', borderTop: isFloating ? 'none' : '1px solid var(--boost-border,#e2e8f0)' };
      case 'dark-first': return { ...base, backgroundColor: 'rgba(15,23,42,0.97)', borderRadius: isFloating ? '24px' : undefined, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 -4px 20px rgba(0,0,0,0.5)' };
      default: return { ...base, backgroundColor: variant === 'solid' ? 'var(--boost-surface,#ffffff)' : 'rgba(255,255,255,0.92)', borderRadius: isFloating ? '24px' : undefined, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: isFloating ? 'none' : '1px solid rgba(226,232,240,0.8)', border: isFloating ? '1px solid rgba(226,232,240,0.8)' : undefined, boxShadow: isFloating ? '0 12px 30px rgba(0,0,0,0.15)' : '0 -4px 20px rgba(0,0,0,0.05)' };
    }
  };

  const computedActiveColor = getPresetActiveColor();

  return (
    <>
      <style>{`
        :root[data-theme="dark"] .boost-mobile-bottom-nav-preset-${preset} { background-color: rgba(15,23,42,0.94) !important; border-color: rgba(255,255,255,0.1) !important; box-shadow: 0 -4px 25px rgba(0,0,0,0.5) !important; }
        :root[data-theme="dark"] .boost-mobile-nav-btn { color: #94a3b8 !important; }
        :root[data-theme="dark"] .boost-mobile-nav-btn.is-active { color: #818cf8 !important; }
        :root[data-theme="dark"] .boost-mobile-nav-btn.is-active .boost-icon-pill { background-color: rgba(99,102,241,0.18) !important; }
      `}</style>
      <nav
        className={`boost-mobile-bottom-nav boost-mobile-bottom-nav-preset-${preset} ${className}`}
        style={{ ...getNavStyles(), ...style }}
      >
        {items.map((item) => {
          const isActive = item.id === internalActiveId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id, item.href)}
              className={`boost-mobile-nav-btn ${isActive ? 'is-active' : ''}`}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '4px 6px',
                color: isActive ? computedActiveColor : 'var(--boost-text-muted, #64748b)',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                className="boost-icon-pill"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  backgroundColor: isActive ? 'rgba(79, 70, 229, 0.12)' : 'transparent',
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
                      right: '0px',
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
              {showLabels && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 700 : 500,
                    marginTop: '2px',
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

MobileBottomNav.displayName = 'MobileBottomNav';
