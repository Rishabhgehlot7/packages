import * as React from 'react';

export interface TimePickerProps {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  className = '',
  style,
}) => {
  return (
    <div
      className={`boost-timepicker-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontFamily: 'inherit',
        width: '100%',
        ...style,
      }}
    >
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', letterSpacing: '-0.01em' }}>
          {label}
        </label>
      )}

      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '14px',
          color: 'var(--boost-text, #0f172a)',
          backgroundColor: disabled ? 'rgba(0, 0, 0, 0.04)' : 'var(--boost-surface, #ffffff)',
          border: `1px solid ${error ? 'var(--boost-danger, #ef4444)' : 'var(--boost-border, #cbd5e1)'}`,
          borderRadius: '8px',
          outline: 'none',
          boxSizing: 'border-box',
          colorScheme: 'inherit',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      />

      {error ? (
        <span style={{ fontSize: '12px', color: 'var(--boost-danger, #ef4444)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

TimePicker.displayName = 'TimePicker';
