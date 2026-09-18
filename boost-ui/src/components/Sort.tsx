import React, { useState } from 'react';

export interface SortOption {
  label: string;
  value: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortProps {
  options: SortOption[];
  currentValue?: string;
  currentDirection?: SortDirection;
  onChange?: (value: string, direction: SortDirection) => void;
  label?: string;
}

export const Sort: React.FC<SortProps> = ({
  options,
  currentValue = options[0]?.value || '',
  currentDirection = 'asc',
  onChange,
  label = 'Sort by',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: string) => {
    const nextDir = val === currentValue ? (currentDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    onChange?.(val, nextDir);
    setIsOpen(false);
  };

  const handleToggleDirection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextDir = currentDirection === 'asc' ? 'desc' : 'asc';
    onChange?.(currentValue, nextDir);
  };

  const currentOption = options.find((o) => o.value === currentValue);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#334155',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <polyline points="15 13 18 10 21 13" />
            <line x1="6" y1="4" x2="6" y2="14" />
            <polyline points="3 11 6 14 9 11" />
          </svg>
          <span style={{ color: '#64748b' }}>{label}:</span>
          <span>{currentOption?.label || currentValue}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <button
          onClick={handleToggleDirection}
          title={currentDirection === 'asc' ? 'Ascending' : 'Descending'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 10px',
            backgroundColor: '#f8fafc',
            borderLeft: '1px solid #e2e8f0',
            borderTop: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            cursor: 'pointer',
            color: '#475569',
          }}
        >
          {currentDirection === 'asc' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 50,
            minWidth: '180px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            padding: '4px',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                fontSize: '13px',
                color: opt.value === currentValue ? '#2563eb' : '#334155',
                fontWeight: opt.value === currentValue ? 600 : 400,
                backgroundColor: opt.value === currentValue ? '#eff6ff' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{opt.label}</span>
              {opt.value === currentValue && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


Sort.displayName = 'Sort';
