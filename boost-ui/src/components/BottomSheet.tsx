import * as React from 'react';
import { Portal } from './Portal';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
  className?: string;
  style?: React.CSSProperties;
  dragHandle?: boolean;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxHeight = '85vh',
  className = '',
  style,
  dragHandle = true,
  showCloseButton = true,
  closeOnOverlayClick = true,
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

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        className={`boost-bottom-sheet-backdrop ${className}`}
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
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          fontFamily: 'inherit',
          animation: 'boost-sheet-fade 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes boost-sheet-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes boost-sheet-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          :root[data-theme="dark"] .boost-bottom-sheet-panel {
            background-color: #0f172a !important;
            border-top-color: rgba(255, 255, 255, 0.1) !important;
            border-left-color: rgba(255, 255, 255, 0.1) !important;
            border-right-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6) !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-handle {
            background-color: #475569 !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-body {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-footer {
            background-color: #090d16 !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #f8fafc !important;
          }
        `}</style>
        <div
          className="boost-bottom-sheet-panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '640px',
            maxHeight,
            backgroundColor: 'var(--boost-surface, #ffffff)',
            borderRadius: '24px 24px 0 0',
            borderTop: '1px solid var(--boost-border, #e2e8f0)',
            borderLeft: '1px solid var(--boost-border, #e2e8f0)',
            borderRight: '1px solid var(--boost-border, #e2e8f0)',
            boxShadow: '0 -15px 35px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
            animation: 'boost-sheet-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            ...style,
          }}
        >
          {dragHandle && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', cursor: 'grab' }}>
              <div className="boost-bottom-sheet-handle" style={{ width: '40px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '9999px', transition: 'background-color 0.2s ease' }} />
            </div>
          )}

          {title && (
            <div
              className="boost-bottom-sheet-header"
              style={{
                padding: '8px 20px 14px',
                borderBottom: '1px solid var(--boost-border, #f1f5f9)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 className="boost-bottom-sheet-title" style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--boost-text, #0f172a)' }}>
                {title}
              </h3>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close sheet"
                  className="boost-bottom-sheet-close-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--boost-muted, #94a3b8)',
                    cursor: 'pointer',
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

          <div className="boost-bottom-sheet-body" style={{ padding: '20px', overflowY: 'auto', flex: 1, color: 'var(--boost-text, #334155)' }}>
            {children}
          </div>

          {footer && (
            <div
              className="boost-bottom-sheet-footer"
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

BottomSheet.displayName = 'BottomSheet';
