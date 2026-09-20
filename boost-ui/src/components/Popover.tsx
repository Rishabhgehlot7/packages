import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'bottom' | 'top';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  showArrow?: boolean;
  stylePreset?: UIStylePreset;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom-left',
  isOpen: controlledOpen,
  onOpenChange,
  className = '',
  style,
  contentStyle,
  showArrow = true,
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const getPositionStyles = (): React.CSSProperties => {
    switch (placement) {
      case 'bottom-right':
        return { top: 'calc(100% + 8px)', right: 0 };
      case 'top-left':
        return { bottom: 'calc(100% + 8px)', left: 0 };
      case 'top-right':
        return { bottom: 'calc(100% + 8px)', right: 0 };
      case 'top':
        return { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-left':
      default:
        return { top: 'calc(100% + 8px)', left: 0 };
    }
  };

  const getPresetPopoverStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          borderRadius: '0px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.88))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--boost-glass-border, rgba(255, 255, 255, 0.25))',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        };
      case 'neumorphism':
        return {
          backgroundColor: 'var(--boost-surface, #e8ebf0)',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '6px 6px 14px #cbd5e1, -6px -6px 14px #ffffff',
        };
      case 'gradient-glow':
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '14px',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
        };
      case 'material-you':
        return {
          borderRadius: '20px',
          border: 'none',
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
        };
      case 'dark-first':
        return {
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.6)',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        };
    }
  };

  return (
    <div
      ref={popoverRef}
      className={`boost-popover-wrapper ${className}`}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
    >
      <style>{`
        .boost-popover-panel {
          background-color: var(--boost-surface, #ffffff);
          border: 1px solid var(--boost-border, #e2e8f0);
          color: var(--boost-text, #0f172a);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          animation: boostPopoverIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-width: min(380px, calc(100vw - 24px));
          box-sizing: border-box;
        }
        :root[data-theme="dark"] .boost-popover-panel {
          background-color: #1e293b;
          border-color: rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        }
        :root[data-theme="dark"] .boost-popover-preset-neo-brutalism {
          background-color: #18181b !important;
          border-color: #f8fafc !important;
          box-shadow: 4px 4px 0px #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-popover-preset-glassmorphism {
          background-color: rgba(15, 23, 42, 0.88) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        :root[data-theme="dark"] .boost-popover-preset-neumorphism {
          background-color: #0f172a !important;
          box-shadow: 6px 6px 14px #090d15, -6px -6px 14px #151d2c !important;
        }
        :root[data-theme="dark"] .boost-popover-preset-gradient-glow {
          background-color: #0f172a !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.4) !important;
        }
        @keyframes boostPopoverIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(placement?.startsWith('top') ? 4px : -4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      <div
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        style={{ display: 'inline-flex', cursor: 'pointer' }}
      >
        {trigger}
      </div>

      {open && (
        <div
          role="dialog"
          className={`boost-popover-panel boost-popover-preset-${preset}`}
          style={{
            position: 'absolute',
            zIndex: 1000,
            padding: '12px 14px',
            minWidth: '220px',
            fontFamily: 'inherit',
            ...getPositionStyles(),
            ...getPresetPopoverStyles(),
            ...contentStyle,
          }}
        >
          {showArrow && (
            <div
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                transform: 'rotate(45deg)',
                backgroundColor: 'inherit',
                borderLeft: placement.startsWith('bottom') ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
                borderTop: placement.startsWith('bottom') ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
                borderRight: placement.startsWith('top') ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
                borderBottom: placement.startsWith('top') ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
                ...(placement === 'bottom-left' ? { top: '-5px', left: '16px' } : {}),
                ...(placement === 'bottom-right' ? { top: '-5px', right: '16px' } : {}),
                ...(placement === 'bottom' ? { top: '-5px', left: 'calc(50% - 4px)' } : {}),
                ...(placement === 'top-left' ? { bottom: '-5px', left: '16px' } : {}),
                ...(placement === 'top-right' ? { bottom: '-5px', right: '16px' } : {}),
                ...(placement === 'top' ? { bottom: '-5px', left: 'calc(50% - 4px)' } : {}),
              }}
            />
          )}
          {content}
        </div>
      )}
    </div>
  );
};

Popover.displayName = 'Popover';
