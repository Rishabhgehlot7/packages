import * as React from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      fullWidth = true,
      disabled,
      className = '',
      id,
      style,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div
        className={`boost-select-wrapper ${className}`}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'inherit',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            {label}
          </label>
        )}

        <div style={{ position: 'relative', width: '100%' }}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            style={{
              width: '100%',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingLeft: '12px',
              paddingRight: '36px',
              fontSize: '14px',
              color: '#0f172a',
              backgroundColor: disabled ? '#f8fafc' : '#ffffff',
              border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              outline: 'none',
              appearance: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
              ...style,
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* SVG Chevron Down Icon */}
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#64748b',
              display: 'inline-flex',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
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
  }
);

Select.displayName = 'Select';
