import * as React from 'react';

export interface DropdownMenuItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`boost-dropdown ${className}`}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className="boost-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align === 'right' ? 'right' : 'left']: 0,
            zIndex: 500,
            backgroundColor: 'var(--boost-surface, #ffffff)',
            border: '1px solid var(--boost-border, #e2e8f0)',
            borderRadius: 'var(--boost-radius, 10px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            minWidth: '190px',
            padding: '6px',
            fontFamily: 'inherit',
          }}
        >
          <style>
            {`
              :root[data-theme="dark"] .boost-dropdown-menu,
              .dark .boost-dropdown-menu {
                background-color: var(--boost-surface, #1e293b) !important;
                border-color: rgba(255, 255, 255, 0.15) !important;
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6) !important;
              }
              :root[data-theme="dark"] .boost-dropdown-item,
              .dark .boost-dropdown-item {
                color: #f8fafc !important;
              }
              :root[data-theme="dark"] .boost-dropdown-item:hover:not(.disabled),
              .dark .boost-dropdown-item:hover:not(.disabled) {
                background-color: rgba(255, 255, 255, 0.06) !important;
              }
              :root[data-theme="dark"] .boost-dropdown-item.destructive,
              .dark .boost-dropdown-item.destructive {
                color: #f87171 !important;
              }
            `}
          </style>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.disabled) return;
                setIsOpen(false);
                if (item.onClick) item.onClick();
              }}
              className={`boost-dropdown-item ${item.disabled ? 'disabled' : ''} ${item.destructive ? 'destructive' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                borderRadius: '6px',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.45 : 1,
                color: item.destructive ? '#dc2626' : 'var(--boost-text, #1e293b)',
                transition: 'background-color 0.15s ease',
              }}
            >
              {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


DropdownMenu.displayName = 'DropdownMenu';
