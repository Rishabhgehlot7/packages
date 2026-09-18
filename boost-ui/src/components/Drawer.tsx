import * as React from 'react';
import { Portal } from './Portal';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  children: React.ReactNode;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  placement = 'right',
  size = '380px',
  children,
  className = '',
}) => {
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
    switch (placement) {
      case 'left':
        return { top: 0, bottom: 0, left: 0, width: size, maxWidth: '100vw' };
      case 'top':
        return { top: 0, left: 0, right: 0, height: size, maxHeight: '100vh' };
      case 'bottom':
        return { bottom: 0, left: 0, right: 0, height: size, maxHeight: '100vh' };
      case 'right':
      default:
        return { top: 0, bottom: 0, right: 0, width: size, maxWidth: '100vw' };
    }
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        className={`boost-drawer-backdrop ${className}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          fontFamily: 'inherit',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            backgroundColor: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ...getPositionStyles(),
          }}
        >
          {title && (
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

Drawer.displayName = 'Drawer';
