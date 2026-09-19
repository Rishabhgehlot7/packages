import * as React from 'react';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  error,
  className = '',
  disabled = false,
  style,
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

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeChip = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div
      ref={containerRef}
      className={`boost-multiselect-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontFamily: 'inherit',
        position: 'relative',
        width: '100%',
        ...style,
      }}
    >
      <style>{`
        .boost-multiselect-input {
          background-color: var(--boost-surface, #ffffff);
          border: 1px solid var(--boost-border, #cbd5e1);
          color: var(--boost-text, #0f172a);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        :root[data-theme="dark"] .boost-multiselect-input {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        .boost-multiselect-dropdown {
          background-color: var(--boost-surface, #ffffff);
          border: 1px solid var(--boost-border, #e2e8f0);
          color: var(--boost-text, #0f172a);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12);
        }
        :root[data-theme="dark"] .boost-multiselect-dropdown {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #f8fafc !important;
          box-shadow: 0 14px 30px -5px rgba(0, 0, 0, 0.6) !important;
        }
        .boost-multiselect-option {
          transition: background-color 0.15s ease;
          color: var(--boost-text, #0f172a);
        }
        :root[data-theme="dark"] .boost-multiselect-option {
          color: #f8fafc !important;
        }
        .boost-multiselect-option:hover {
          background-color: var(--boost-surface-secondary, #f1f5f9);
        }
        :root[data-theme="dark"] .boost-multiselect-option:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)' }}>
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className="boost-multiselect-input"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          padding: '6px 12px',
          minHeight: '38px',
          borderRadius: 'var(--boost-radius, 8px)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          borderColor: error ? '#ef4444' : isOpen ? 'var(--boost-primary, #2563eb)' : undefined,
        }}
      >
        {value.length === 0 ? (
          <span style={{ fontSize: '14px', color: 'var(--boost-text-muted, #94a3b8)' }}>{placeholder}</span>
        ) : (
          value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span>{opt ? opt.label : val}</span>
                <span
                  onClick={(e) => removeChip(e, val)}
                  role="button"
                  aria-label={`Remove ${opt ? opt.label : val}`}
                  style={{
                    display: 'inline-flex',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: 1,
                    opacity: 0.7,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                >
                  &times;
                </span>
              </span>
            );
          })
        )}

        <span style={{ marginLeft: 'auto', display: 'inline-flex', color: 'var(--boost-text-muted, #64748b)' }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div
          className="boost-multiselect-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            borderRadius: 'var(--boost-radius, 8px)',
            zIndex: 100,
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className="boost-multiselect-option"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  fontSize: '13.5px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--boost-primary, #2563eb)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};

MultiSelect.displayName = 'MultiSelect';
