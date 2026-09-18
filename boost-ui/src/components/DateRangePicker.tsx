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
      }}
    >
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
          {label}
        </label>
      )}

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '4px 8px',
          backgroundColor: '#ffffff',
        }}
      >
        <input
          type="date"
          value={currentStart}
          onChange={(e) => handleStartChange(e.target.value)}
          style={{
            border: 'none',
            fontSize: '13px',
            color: '#0f172a',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        <span style={{ color: '#94a3b8', fontSize: '12px' }}>to</span>

        <input
          type="date"
          value={currentEnd}
          min={currentStart}
          onChange={(e) => handleEndChange(e.target.value)}
          style={{
            border: 'none',
            fontSize: '13px',
            color: '#0f172a',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
};


DateRangePicker.displayName = 'DateRangePicker';
