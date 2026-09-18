import * as React from 'react';

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom-left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPositionStyles = (): React.CSSProperties => {
    switch (placement) {
      case 'bottom-right':
        return { top: 'calc(100% + 6px)', right: 0 };
      case 'top-left':
        return { bottom: 'calc(100% + 6px)', left: 0 };
      case 'top-right':
        return { bottom: 'calc(100% + 6px)', right: 0 };
      case 'bottom-left':
      default:
        return { top: 'calc(100% + 6px)', left: 0 };
    }
  };

  return (
    <div
      ref={popoverRef}
      className={`boost-popover-wrapper ${className}`}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 500,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '12px',
            minWidth: '200px',
            fontFamily: 'inherit',
            ...getPositionStyles(),
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};


Popover.displayName = 'Popover';
