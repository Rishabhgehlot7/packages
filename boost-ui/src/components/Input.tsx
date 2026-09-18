import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
              color: '#334155',
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
                color: '#64748b',
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
            style={{
              width: '100%',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingLeft: leftIcon ? '36px' : '12px',
              paddingRight: rightIcon ? '36px' : '12px',
              fontSize: '14px',
              color: '#0f172a',
              backgroundColor: disabled ? '#f8fafc' : '#ffffff',
              border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
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
                color: '#64748b',
              }}
            >
              {rightIcon}
            </span>
          )}
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

Input.displayName = 'Input';
