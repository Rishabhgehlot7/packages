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
  className?: string;
  style?: React.CSSProperties;
}

export const Sort: React.FC<SortProps> = ({
  options,
  currentValue = options[0]?.value || '',
  currentDirection = 'asc',
  onChange,
  label = 'Sort by',
  className = '',
  style,
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
    <div className={`boost-sort-wrapper ${className || ''}`} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', fontFamily: 'inherit', ...style }}>
      <style>
        {`
          :root[data-theme="dark"] .boost-sort-box,
          .dark .boost-sort-box {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-sort-btn,
          .dark .boost-sort-btn {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-sort-dir-btn,
          .dark .boost-sort-dir-btn {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-left-color: rgba(255, 255, 255, 0.1) !important;
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-sort-dropdown,
          .dark .boost-sort-dropdown {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-sort-opt,
          .dark .boost-sort-opt {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-sort-opt:hover,
          .dark .boost-sort-opt:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          :root[data-theme="dark"] .boost-sort-opt.active,
          .dark .boost-sort-opt.active {
            background-color: rgba(99, 102, 241, 0.12) !important;
            color: #818cf8 !important;
          }
        `}
      </style>
      <div
        className="boost-sort-box"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          border: '1px solid var(--boost-border, #cbd5e1)',
          borderRadius: 'var(--boost-radius, 8px)',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          overflow: 'hidden',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.03))',
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="boost-sort-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--boost-text, #334155)',
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
          <span style={{ color: 'var(--boost-muted, #64748b)' }}>{label}:</span>
          <span style={{ fontWeight: 600 }}>{currentOption?.label || currentValue}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <button
          onClick={handleToggleDirection}
          title={currentDirection === 'asc' ? 'Ascending' : 'Descending'}
          className="boost-sort-dir-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 10px',
            backgroundColor: 'var(--boost-bg-subtle, #f8fafc)',
            borderLeft: '1px solid var(--boost-border, #e2e8f0)',
            borderTop: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            cursor: 'pointer',
            color: 'var(--boost-muted, #475569)',
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
          className="boost-sort-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 50,
            minWidth: '200px',
            backgroundColor: 'var(--boost-surface, #ffffff)',
            border: '1px solid var(--boost-border, #e2e8f0)',
            borderRadius: 'var(--boost-radius, 8px)',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            padding: '4px',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === currentValue;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`boost-sort-opt ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: isSelected ? 'var(--boost-primary, #2563eb)' : 'var(--boost-text, #334155)',
                  fontWeight: isSelected ? 600 : 400,
                  backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


Sort.displayName = 'Sort';
