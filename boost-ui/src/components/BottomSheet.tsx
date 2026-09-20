import * as React from 'react';
import { Portal } from './Portal';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

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
  stylePreset?: UIStylePreset;
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
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
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

  const getPresetSheetStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          borderTop: '3px solid #000000',
          borderLeft: '3px solid #000000',
          borderRight: '3px solid #000000',
          borderRadius: '0px',
          boxShadow: '0 -8px 0px #000000',
          backgroundColor: 'var(--boost-surface, #ffffff)',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.88))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--boost-glass-border, rgba(255, 255, 255, 0.25))',
          borderLeft: '1px solid var(--boost-glass-border, rgba(255, 255, 255, 0.25))',
          borderRight: '1px solid var(--boost-glass-border, rgba(255, 255, 255, 0.25))',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.2)',
        };
      case 'neumorphism':
        return {
          backgroundColor: 'var(--boost-surface, #e8ebf0)',
          border: 'none',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 25px #cbd5e1',
        };
      case 'gradient-glow':
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderTop: '1px solid rgba(99, 102, 241, 0.4)',
          borderLeft: '1px solid rgba(99, 102, 241, 0.3)',
          borderRight: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 35px rgba(99, 102, 241, 0.3)',
        };
      case 'material-you':
        return {
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          borderRadius: '28px 28px 0 0',
          border: 'none',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.12)',
        };
      case 'dark-first':
        return {
          backgroundColor: '#0f172a',
          borderTop: '1px solid #1e293b',
          borderLeft: '1px solid #1e293b',
          borderRight: '1px solid #1e293b',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.7)',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid var(--boost-border, #e2e8f0)',
          borderLeft: '1px solid var(--boost-border, #e2e8f0)',
          borderRight: '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: '0 -15px 35px rgba(0, 0, 0, 0.2)',
        };
    }
  };

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
            background-color: #0f172a;
            border-top-color: rgba(255, 255, 255, 0.1);
            border-left-color: rgba(255, 255, 255, 0.1);
            border-right-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6);
          }
          :root[data-theme="dark"] .boost-bottom-sheet-preset-neo-brutalism {
            background-color: #18181b !important;
            border-top-color: #f8fafc !important;
            border-left-color: #f8fafc !important;
            border-right-color: #f8fafc !important;
            box-shadow: 0 -8px 0px #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-preset-glassmorphism {
            background-color: rgba(15, 23, 42, 0.88) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-preset-neumorphism {
            background-color: #0f172a !important;
            box-shadow: 0 -10px 25px #090d15 !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-preset-gradient-glow {
            background-color: #0f172a !important;
            border-color: rgba(99, 102, 241, 0.5) !important;
            box-shadow: 0 -10px 40px rgba(99, 102, 241, 0.45) !important;
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
          className={`boost-bottom-sheet-panel boost-bottom-sheet-preset-${preset}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '640px',
            maxHeight,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
            animation: 'boost-sheet-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            ...getPresetSheetStyles(),
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
