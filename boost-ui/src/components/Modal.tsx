import * as React from 'react';
import { Portal } from './Portal';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getWidth = () => {
    switch (size) {
      case 'sm': return '400px';
      case 'lg': return '680px';
      case 'xl': return '840px';
      case 'md':
      default: return '520px';
    }
  };

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        className={`boost-modal-backdrop ${className}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(12px, 3vw, 24px)',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: getWidth(),
            backgroundColor: 'var(--boost-surface, #ffffff)',
            borderRadius: 'var(--boost-radius, 18px)',
            border: '1px solid var(--boost-border, #e2e8f0)',
            boxShadow: 'var(--boost-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'min(90vh, 850px)',
            overflow: 'hidden',
            animation: 'boost-modal-scale 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <style>{`
            @keyframes boost-modal-scale {
              from { opacity: 0; transform: scale(0.95) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          {(title || description) && (
            <div
              style={{
                padding: 'clamp(16px, 3vw, 20px) clamp(18px, 4vw, 28px)',
                borderBottom: '1px solid var(--boost-border, #e2e8f0)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                {title && (
                  <h3 style={{ margin: 0, fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: 700, color: 'var(--boost-text, #0f172a)', letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                )}
                {description && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--boost-muted, #64748b)', lineHeight: 1.4 }}>
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--boost-muted, #94a3b8)',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          <div style={{ padding: 'clamp(18px, 3.5vw, 28px)', overflowY: 'auto', flex: 1, color: 'var(--boost-text, #334155)', fontSize: '14px', lineHeight: 1.6 }}>
            {children}
          </div>

          {footer && (
            <div
              style={{
                padding: 'clamp(12px, 2.5vw, 16px) clamp(18px, 4vw, 28px)',
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

export const Dialog = Modal;
export type DialogProps = ModalProps;

Modal.displayName = 'Modal';
Dialog.displayName = 'Dialog';
