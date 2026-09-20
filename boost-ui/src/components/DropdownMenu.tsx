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
  trigger?: React.ReactNode;
  items?: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items = [],
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const enabledItems = React.useMemo(() => {
    return items.map((item, idx) => ({ ...item, originalIndex: idx })).filter((item) => !item.disabled);
  }, [items]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Handle global Escape when open
  React.useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
      setTimeout(() => {
        const first = itemRefs.current[0];
        first?.focus();
      }, 20);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        const next = (prev + 1) % (items.length || 1);
        itemRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        const next = (prev - 1 + items.length) % (items.length || 1);
        itemRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
      itemRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = items.length - 1;
      setFocusedIndex(last);
      itemRefs.current[last]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`boost-dropdown ${className}`}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        style={{ cursor: 'pointer', outline: 'none' }}
      >
        {trigger || <button type="button" style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--boost-border, #cbd5e1)', background: 'transparent' }}>Options</button>}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          onKeyDown={handleMenuKeyDown}
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
            outline: 'none',
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
              :root[data-theme="dark"] .boost-dropdown-item:focus:not(.disabled),
              .dark .boost-dropdown-item:hover:not(.disabled),
              .dark .boost-dropdown-item:focus:not(.disabled) {
                background-color: rgba(255, 255, 255, 0.08) !important;
              }
              :root[data-theme="dark"] .boost-dropdown-item.destructive,
              .dark .boost-dropdown-item.destructive {
                color: #f87171 !important;
              }
              .boost-dropdown-item:focus {
                outline: none;
                background-color: var(--boost-surface-secondary, #f1f5f9);
              }
            `}
          </style>
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
              aria-disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                setIsOpen(false);
                if (item.onClick) item.onClick();
                triggerRef.current?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (item.disabled) return;
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                  triggerRef.current?.focus();
                }
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
