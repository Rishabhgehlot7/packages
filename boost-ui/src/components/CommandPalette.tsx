import * as React from 'react';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  group?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
  emptyText = 'No matching commands found.',
  className = '',
}) => {
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
      (item.group && item.group.toLowerCase().includes(query.toLowerCase()))
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        className={`boost-command-palette ${className}`}
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--boost-bg, #ffffff)',
          borderRadius: 'var(--boost-radius, 14px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          margin: '0 16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--boost-border, #e2e8f0)',
            gap: '12px',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--boost-text-muted, #64748b)"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={placeholder}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '16px',
              backgroundColor: 'transparent',
              color: 'var(--boost-text, #0f172a)',
            }}
          />
          <kbd
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--boost-surface, #f1f5f9)',
              border: '1px solid var(--boost-border, #cbd5e1)',
              color: 'var(--boost-text-muted, #64748b)',
            }}
          >
            ESC
          </kbd>
        </div>

        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'var(--boost-text-muted, #64748b)',
                fontSize: '14px',
              }}
            >
              {emptyText}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: isSelected
                      ? 'rgba(37, 99, 235, 0.08)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.icon && (
                      <div
                        style={{
                          color: isSelected
                            ? 'var(--boost-primary, #2563eb)'
                            : 'var(--boost-text-muted, #64748b)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {item.icon}
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: isSelected
                            ? 'var(--boost-primary, #2563eb)'
                            : 'var(--boost-text, #0f172a)',
                        }}
                      >
                        {item.label}
                      </div>
                      {item.description && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--boost-text-muted, #64748b)',
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.shortcut && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {item.shortcut.map((key, kIdx) => (
                        <kbd
                          key={kIdx}
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--boost-surface, #f1f5f9)',
                            border: '1px solid var(--boost-border, #cbd5e1)',
                            color: 'var(--boost-text-muted, #64748b)',
                          }}
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


CommandPalette.displayName = 'CommandPalette';
