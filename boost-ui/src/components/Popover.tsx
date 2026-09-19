import * as React from 'react';

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
}) => {
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
          className="boost-popover-panel"
          style={{
            position: 'absolute',
            zIndex: 1000,
            padding: '12px 14px',
            minWidth: '220px',
            fontFamily: 'inherit',
            ...getPositionStyles(),
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
