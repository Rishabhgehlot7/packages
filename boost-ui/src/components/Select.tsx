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
  options?: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = /* @__PURE__ */ React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
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
        <style>{`
          .boost-select {
            background-color: var(--boost-surface, #ffffff);
            color: var(--boost-text, #0f172a);
            border: 1px solid var(--boost-border, #cbd5e1);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          :root[data-theme="dark"] .boost-select {
            background-color: #1e293b !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-select option {
            background-color: #1e293b !important;
            color: #f8fafc !important;
          }
          .boost-select:focus {
            border-color: var(--boost-primary, #2563eb) !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18) !important;
          }
        `}</style>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--boost-text, #334155)',
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
            className="boost-select"
            style={{
              width: '100%',
              paddingTop: '9px',
              paddingBottom: '9px',
              paddingLeft: '12px',
              paddingRight: '36px',
              fontSize: '14px',
              borderRadius: 'var(--boost-radius, 8px)',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
              borderColor: error ? '#ef4444' : undefined,
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
              color: 'var(--boost-text-muted, #64748b)',
              display: 'flex',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {error ? (
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}>
            {error}
          </span>
        ) : helperText ? (
          <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
