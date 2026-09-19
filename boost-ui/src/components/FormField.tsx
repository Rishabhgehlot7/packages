import * as React from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={`boost-form-field ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontFamily: 'inherit',
        width: '100%',
        ...style,
      }}
    >
      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', letterSpacing: '-0.01em' }}>
        {label}
        {required && <span style={{ color: 'var(--boost-danger, #ef4444)', marginLeft: '4px' }}>*</span>}
      </label>

      {children}

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

FormField.displayName = 'FormField';
