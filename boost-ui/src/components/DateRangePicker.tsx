import * as React from 'react';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onRangeChange?: (start: string, end: string) => void;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  label?: string;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate: propStart,
  endDate: propEnd,
  onRangeChange,
  value,
  onChange,
  label,
  className = '',
}) => {
  const currentStart = value?.startDate !== undefined ? value.startDate : propStart || '';
  const currentEnd = value?.endDate !== undefined ? value.endDate : propEnd || '';

  const handleStartChange = (newStart: string) => {
    if (onRangeChange) onRangeChange(newStart, currentEnd);
    if (onChange) onChange({ startDate: newStart, endDate: currentEnd });
  };

  const handleEndChange = (newEnd: string) => {
    if (onRangeChange) onRangeChange(currentStart, newEnd);
    if (onChange) onChange({ startDate: currentStart, endDate: newEnd });
  };

  return (
    <div
      className={`boost-date-range-picker ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '6px',
        fontFamily: 'inherit',
        maxWidth: '100%',
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-date-range-box,
          .dark .boost-date-range-box {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-date-range-box input,
          .dark .boost-date-range-box input {
            color: #f8fafc !important;
            color-scheme: dark !important;
          }
          :root[data-theme="dark"] .boost-date-range-picker label,
          .dark .boost-date-range-picker label {
            color: #e2e8f0 !important;
          }
        `}
      </style>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)' }}>
          {label}
        </label>
      )}

      <div
        className="boost-date-range-box"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid var(--boost-border, #cbd5e1)',
          borderRadius: 'var(--boost-radius, 8px)',
          padding: '6px 12px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          flexWrap: 'wrap',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.03))',
        }}
      >
        <input
          type="date"
          value={currentStart}
          onChange={(e) => handleStartChange(e.target.value)}
          style={{
            border: 'none',
            fontSize: '13px',
            color: 'var(--boost-text, #0f172a)',
            backgroundColor: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        <span style={{ color: 'var(--boost-muted, #94a3b8)', fontSize: '12px', fontWeight: 500 }}>to</span>

        <input
          type="date"
          value={currentEnd}
          min={currentStart}
          onChange={(e) => handleEndChange(e.target.value)}
          style={{
            border: 'none',
            fontSize: '13px',
            color: 'var(--boost-text, #0f172a)',
            backgroundColor: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
};


DateRangePicker.displayName = 'DateRangePicker';
