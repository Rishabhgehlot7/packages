import React, { useState } from 'react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterProps {
  label?: string;
  options: FilterOption[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
  multiple?: boolean;
  clearable?: boolean;
}

export const Filter: React.FC<FilterProps> = ({
  label = 'Filter',
  options,
  selectedValues = [],
  onChange,
  multiple = true,
  clearable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (val: string) => {
    let nextValues: string[];
    if (multiple) {
      if (selectedValues.includes(val)) {
        nextValues = selectedValues.filter((v) => v !== val);
      } else {
        nextValues = [...selectedValues, val];
      }
    } else {
      nextValues = selectedValues.includes(val) ? [] : [val];
    }
    onChange?.(nextValues);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 500,
          color: selectedValues.length > 0 ? '#2563eb' : '#334155',
          backgroundColor: selectedValues.length > 0 ? '#eff6ff' : '#ffffff',
          border: `1px solid ${selectedValues.length > 0 ? '#93c5fd' : '#cbd5e1'}`,
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              width: '18px',
              height: '18px',
              borderRadius: '9px',
            }}
          >
            {selectedValues.length}
          </span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s ease' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 50,
            minWidth: '200px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            padding: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px 8px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Options</span>
            {clearable && selectedValues.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Clear all
              </button>
            )}
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '6px' }}>
            {options.map((opt) => {
              const checked = selectedValues.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#1e293b',
                    backgroundColor: checked ? '#f8fafc' : 'transparent',
                  }}
                >
                  <input
                    type={multiple ? 'checkbox' : 'radio'}
                    checked={checked}
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ flex: 1 }}>{opt.label}</span>
                  {typeof opt.count === 'number' && (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{opt.count}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


Filter.displayName = 'Filter';
