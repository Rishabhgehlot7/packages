import * as React from 'react';
import { Portal } from './Portal';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  placement,
  position,
  size = '380px',
  children,
  footer,
  className = '',
  style,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  const effectivePlacement = position || placement || 'right';

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getPositionStyles = (): React.CSSProperties => {
    switch (effectivePlacement) {
      case 'left':
        return {
          top: 0,
          bottom: 0,
          left: 0,
          width: `min(${size}, 100vw)`,
          borderRight: '1px solid var(--boost-border, #e2e8f0)',
          animation: 'boost-drawer-slide-left 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        };
      case 'top':
        return {
          top: 0,
          left: 0,
          right: 0,
          height: `min(${size}, 100vh)`,
          borderBottom: '1px solid var(--boost-border, #e2e8f0)',
          animation: 'boost-drawer-slide-top 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        };
      case 'bottom':
        return {
          bottom: 0,
          left: 0,
          right: 0,
          height: `min(${size}, 100vh)`,
          borderTop: '1px solid var(--boost-border, #e2e8f0)',
          animation: 'boost-drawer-slide-bottom 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        };
      case 'right':
      default:
        return {
          top: 0,
          bottom: 0,
          right: 0,
          width: `min(${size}, 100vw)`,
          borderLeft: '1px solid var(--boost-border, #e2e8f0)',
          animation: 'boost-drawer-slide-right 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        };
    }
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        className={`boost-drawer-backdrop ${className}`}
        onClick={() => {
          if (closeOnOverlayClick) onClose();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1000,
          fontFamily: 'inherit',
          animation: 'boost-drawer-fade 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes boost-drawer-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes boost-drawer-slide-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes boost-drawer-slide-left {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes boost-drawer-slide-top {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
          @keyframes boost-drawer-slide-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          :root[data-theme="dark"] .boost-drawer-panel {
            background-color: #0f172a !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
          }
          :root[data-theme="dark"] .boost-drawer-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-drawer-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-drawer-body {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-drawer-footer {
            background-color: #090d16 !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-drawer-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #f8fafc !important;
          }
        `}</style>
        <div
          className="boost-drawer-panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            backgroundColor: 'var(--boost-surface, #ffffff)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
            ...getPositionStyles(),
            ...style,
          }}
        >
          {title && (
            <div
              className="boost-drawer-header"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--boost-border, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 className="boost-drawer-title" style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--boost-text, #0f172a)' }}>
                {title}
              </h3>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="boost-drawer-close-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--boost-muted, #64748b)',
                    padding: '6px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="boost-drawer-body" style={{ padding: '20px', overflowY: 'auto', flex: 1, color: 'var(--boost-text, #334155)' }}>
            {children}
          </div>

          {footer && (
            <div
              className="boost-drawer-footer"
              style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--boost-border, #e2e8f0)',
                backgroundColor: 'var(--boost-bg, #f8fafc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

Drawer.displayName = 'Drawer';
