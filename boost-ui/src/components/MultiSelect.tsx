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
      }}
    >
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          padding: '6px 12px',
          minHeight: '38px',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          border: `1px solid ${error ? '#ef4444' : isOpen ? '#2563eb' : '#cbd5e1'}`,
          borderRadius: '6px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
        }}
      >
        {value.length === 0 ? (
          <span style={{ fontSize: '14px', color: '#94a3b8' }}>{placeholder}</span>
        ) : (
          value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <span>{opt ? opt.label : val}</span>
                <span
                  onClick={(e) => removeChip(e, val)}
                  style={{
                    display: 'inline-flex',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: 1,
                  }}
                >
                  &times;
                </span>
              </span>
            );
          })
        )}

        <span style={{ marginLeft: 'auto', display: 'inline-flex', color: '#64748b' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  fontSize: '13px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                  color: '#0f172a',
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};


MultiSelect.displayName = 'MultiSelect';
