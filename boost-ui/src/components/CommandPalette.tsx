import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  group?: string;
  onSelect: () => void;
}


/**
 * CommandPaletteProps — Properties for the command palette / quick search overlay.
 */
export interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CommandItem[];
  placeholder?: string;
  emptyText?: string;
  stylePreset?: UIStylePreset;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen = false,
  onClose = () => {},
  items = [],
  placeholder = 'Type a command or search...',
  emptyText = 'No matching commands found.',
  stylePreset: stylePresetProp,
  className = '',
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
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

  const getModalStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      maxWidth: '580px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderRadius: '2px',
          border: '3px solid #000',
          boxShadow: '8px 8px 0px #000',
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(31, 38, 135, 0.25)',
        };
      case 'neumorphism':
        return {
          ...base,
          backgroundColor: '#e0e5ec',
          border: 'none',
          borderRadius: '20px',
          boxShadow: '8px 8px 18px #c8cdd5, -8px -8px 18px #f8fdff',
        };
      case 'gradient-glow':
        return {
          ...base,
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 0 35px rgba(99, 102, 241, 0.18), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        };
      case 'material-you':
        return {
          ...base,
          backgroundColor: 'var(--boost-surface, #fffbfe)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        };
      case 'dark-first':
        return {
          ...base,
          backgroundColor: 'var(--boost-surface, #0f172a)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderRadius: 'var(--boost-radius, 16px)',
          boxShadow: 'var(--boost-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
          border: '1px solid var(--boost-border, #e2e8f0)',
        };
    }
  };

  const getItemStyles = (isSelected: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      cursor: 'pointer',
      transition: 'background-color 0.1s ease',
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: isSelected ? '#fbbf24' : 'transparent',
          border: isSelected ? '2px solid #000' : '2px solid transparent',
          borderRadius: '2px',
          fontWeight: isSelected ? 700 : 500,
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          borderRadius: '12px',
        };
      case 'neumorphism':
        return {
          ...base,
          backgroundColor: isSelected ? '#d9dfe8' : 'transparent',
          boxShadow: isSelected ? 'inset 2px 2px 5px #c8cdd5, inset -2px -2px 5px #f8fdff' : 'none',
          borderRadius: '10px',
        };
      case 'gradient-glow':
        return {
          ...base,
          backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
          borderRadius: '8px',
        };
      case 'material-you':
        return {
          ...base,
          backgroundColor: isSelected ? 'var(--boost-surface-secondary, #e8def8)' : 'transparent',
          borderRadius: '9999px',
        };
      case 'dark-first':
        return {
          ...base,
          backgroundColor: isSelected ? '#1e293b' : 'transparent',
          borderRadius: '8px',
        };
      default:
        return {
          ...base,
          borderRadius: '8px',
          backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 'clamp(24px, 8vh, 80px)',
        paddingLeft: 'clamp(8px, 3vw, 16px)',
        paddingRight: 'clamp(8px, 3vw, 16px)',
        zIndex: 9999,
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <div
        className={`boost-command-palette boost-command-palette-preset-${preset} ${className}`}
        style={getModalStyles()}
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
                  style={getItemStyles(isSelected)}
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
