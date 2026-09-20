import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = /* @__PURE__ */ React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      className = '',
      id,
      style,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div
        className={`boost-input-wrapper ${className}`}
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
            htmlFor={inputId}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--boost-text, #334155)',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </label>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {leftIcon && (
            <span
              style={{
                position: 'absolute',
                left: '12px',
                display: 'inline-flex',
                color: 'var(--boost-muted, #64748b)',
                pointerEvents: 'none',
              }}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error && inputId
                ? `${inputId}-error`
                : helperText && inputId
                ? `${inputId}-helper`
                : undefined
            }
            style={{
              width: '100%',
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingLeft: leftIcon ? '38px' : '14px',
              paddingRight: rightIcon ? '38px' : '14px',
              fontSize: '14px',
              color: 'var(--boost-text, #0f172a)',
              backgroundColor: disabled ? 'rgba(0, 0, 0, 0.04)' : 'var(--boost-surface, #ffffff)',
              border: `1px solid ${error ? '#ef4444' : 'var(--boost-border, #cbd5e1)'}`,
              borderRadius: 'var(--boost-radius, 10px)',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              boxSizing: 'border-box',
              ...style,
            }}
            {...props}
          />

          {rightIcon && (
            <span
              style={{
                position: 'absolute',
                right: '12px',
                display: 'inline-flex',
                color: 'var(--boost-muted, #64748b)',
              }}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <span
            id={inputId ? `${inputId}-error` : undefined}
            role="alert"
            style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={inputId ? `${inputId}-helper` : undefined}
            style={{ fontSize: '12px', color: 'var(--boost-muted, #64748b)' }}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
