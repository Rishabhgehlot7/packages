import React, { useState } from 'react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}


/**
 * FilterProps — Properties for the filter controls component.
 */
export interface FilterProps {
  label?: string;
  options?: FilterOption[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
  multiple?: boolean;
  clearable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Filter: React.FC<FilterProps> = ({
  label = 'Filter',
  options = [],
  selectedValues = [],
  onChange,
  multiple = true,
  clearable = true,
  className = '',
  style,
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
    <div className={`boost-filter-wrapper ${className || ''}`} style={{ position: 'relative', display: 'inline-block', fontFamily: 'inherit', ...style }}>
      <style>
        {`
          :root[data-theme="dark"] .boost-filter-btn,
          .dark .boost-filter-btn {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-filter-btn.active,
          .dark .boost-filter-btn.active {
            background-color: rgba(99, 102, 241, 0.2) !important;
            border-color: var(--boost-primary, #6366f1) !important;
            color: #818cf8 !important;
          }
          :root[data-theme="dark"] .boost-filter-dropdown,
          .dark .boost-filter-dropdown {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-filter-dropdown .filter-header,
          .dark .boost-filter-dropdown .filter-header {
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-filter-opt,
          .dark .boost-filter-opt {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-filter-opt:hover,
          .dark .boost-filter-opt:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          :root[data-theme="dark"] .boost-filter-opt.checked,
          .dark .boost-filter-opt.checked {
            background-color: rgba(99, 102, 241, 0.12) !important;
          }
        `}
      </style>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`boost-filter-btn ${selectedValues.length > 0 ? 'active' : ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 500,
          color: selectedValues.length > 0 ? 'var(--boost-primary, #2563eb)' : 'var(--boost-text, #334155)',
          backgroundColor: selectedValues.length > 0 ? 'rgba(37, 99, 235, 0.08)' : 'var(--boost-surface, #ffffff)',
          border: `1px solid ${selectedValues.length > 0 ? 'var(--boost-primary, #93c5fd)' : 'var(--boost-border, #cbd5e1)'}`,
          borderRadius: 'var(--boost-radius, 8px)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
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
              backgroundColor: 'var(--boost-primary, #2563eb)',
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
          className="boost-filter-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 50,
            minWidth: '220px',
            backgroundColor: 'var(--boost-surface, #ffffff)',
            border: '1px solid var(--boost-border, #e2e8f0)',
            borderRadius: 'var(--boost-radius, 10px)',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            padding: '8px',
          }}
        >
          <div className="filter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px 8px', borderBottom: '1px solid var(--boost-border, #f1f5f9)' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--boost-muted, #64748b)' }}>Filter Options</span>
            {clearable && selectedValues.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Clear all
              </button>
            )}
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto', marginTop: '6px' }}>
            {options.map((opt) => {
              const checked = selectedValues.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={`boost-filter-opt ${checked ? 'checked' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: 'var(--boost-text, #1e293b)',
                    backgroundColor: checked ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    transition: 'background-color 0.15s ease',
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
                    <span style={{ fontSize: '11px', color: 'var(--boost-muted, #94a3b8)', fontWeight: 500 }}>{opt.count}</span>
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
