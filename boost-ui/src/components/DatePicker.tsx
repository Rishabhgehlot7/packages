import * as React from 'react';

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  helperText,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      className={`boost-datepicker-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontFamily: 'inherit',
        width: '100%',
      }}
    >
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
          {label}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '14px',
            color: '#0f172a',
            backgroundColor: disabled ? '#f8fafc' : '#ffffff',
            border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
            borderRadius: '6px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {error ? (
        <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};


DatePicker.displayName = 'DatePicker';
