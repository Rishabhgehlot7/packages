import * as React from 'react';


/**
 * DatePickerProps — Properties for the date picker input component.
 */
export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  min?: string;
  max?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange = () => {},
  minDate,
  maxDate,
  min,
  max,
  error,
  helperText,
  disabled = false,
  id: explicitId,
  className = '',
  style,
}) => {
  const generatedId = React.useId ? React.useId().replace(/:/g, '') : `date-picker-${Math.random().toString(36).substring(2, 7)}`;
  const inputId = explicitId || (label ? `datepicker-${label.toLowerCase().replace(/\s+/g, '-')}` : generatedId);
  const helpId = `${inputId}-desc`;

  const effectiveMin = min || minDate;
  const effectiveMax = max || maxDate;

  return (
    <div
      role="group"
      aria-label={label || 'Date picker'}
      className={`boost-datepicker-wrapper ${className}`}
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
        <label
          htmlFor={inputId}
          style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', letterSpacing: '-0.01em' }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        <input
          id={inputId}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={effectiveMin}
          max={effectiveMax}
          disabled={disabled}
          aria-label={label || 'Select date'}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? helpId : undefined}
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
      </div>

      {error ? (
        <span id={helpId} role="alert" style={{ fontSize: '12px', color: 'var(--boost-danger, #ef4444)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span id={helpId} style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';
