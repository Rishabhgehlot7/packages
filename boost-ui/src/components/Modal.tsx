import * as React from 'react';
import { Portal } from './Portal';
import { useFocusTrap } from '../hooks';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  stylePreset?: UIStylePreset;
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
  style,
  closeOnOverlayClick = true,
  showCloseButton = true,
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const modalRef = React.useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, isOpen);

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

  const getPresetCardStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '3px solid #000000',
          borderRadius: '2px',
          boxShadow: '8px 8px 0px #000000',
          backgroundColor: 'var(--boost-surface, #ffffff)',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.88))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--boost-glass-border, rgba(255, 255, 255, 0.25))',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
        };
      case 'neumorphism':
        return {
          backgroundColor: 'var(--boost-surface, #e8ebf0)',
          border: 'none',
          borderRadius: '24px',
          boxShadow: '12px 12px 28px #cbd5e1, -12px -12px 28px #ffffff',
        };
      case 'gradient-glow':
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderRadius: '20px',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 0 35px rgba(99, 102, 241, 0.35)',
        };
      case 'material-you':
        return {
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          borderRadius: '28px',
          border: 'none',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
        };
      case 'dark-first':
        return {
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderRadius: 'var(--boost-radius, 14px)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: 'var(--boost-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
        };
    }
  };

  return (
    <Portal>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'boost-modal-title' : undefined}
        aria-describedby={description ? 'boost-modal-desc' : undefined}
        className={`boost-modal-backdrop ${className}`}
        onClick={(e) => {
          if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(12px, 3vw, 24px)',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          animation: 'boost-modal-fade 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes boost-modal-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes boost-modal-scale {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          :root[data-theme="dark"] .boost-modal-card {
            background-color: #0f172a;
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8);
          }
          :root[data-theme="dark"] .boost-modal-preset-neo-brutalism {
            background-color: #18181b !important;
            border-color: #f8fafc !important;
            box-shadow: 8px 8px 0px #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-modal-preset-glassmorphism {
            background-color: rgba(15, 23, 42, 0.88) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-modal-preset-neumorphism {
            background-color: #0f172a !important;
            box-shadow: 12px 12px 28px #090d15, -12px -12px 28px #151d2c !important;
          }
          :root[data-theme="dark"] .boost-modal-preset-gradient-glow {
            background-color: #0f172a !important;
            border-color: rgba(99, 102, 241, 0.5) !important;
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.45) !important;
          }
          :root[data-theme="dark"] .boost-modal-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-modal-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-modal-desc {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-modal-body {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-modal-footer {
            background-color: #090d16 !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-modal-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #f8fafc !important;
          }
        `}</style>
        <div
          className={`boost-modal-card boost-modal-preset-${preset}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: `min(${getWidth()}, calc(100vw - 24px))`,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'min(90vh, 850px)',
            overflow: 'hidden',
            animation: 'boost-modal-scale 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            ...getPresetCardStyles(),
            ...style,
          }}
        >
          {(title || description) && (
            <div
              className="boost-modal-header"
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
                  <h3 id="boost-modal-title" className="boost-modal-title" style={{ margin: 0, fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: 700, color: 'var(--boost-text, #0f172a)', letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                )}
                {description && (
                  <p id="boost-modal-desc" className="boost-modal-desc" style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--boost-muted, #64748b)', lineHeight: 1.4 }}>
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="boost-modal-close-btn"
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="boost-modal-body" style={{ padding: 'clamp(18px, 3.5vw, 28px)', overflowY: 'auto', flex: 1, color: 'var(--boost-text, #334155)', fontSize: '14px', lineHeight: 1.6 }}>
            {children}
          </div>

          {footer && (
            <div
              className="boost-modal-footer"
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
