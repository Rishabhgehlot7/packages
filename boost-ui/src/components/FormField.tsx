import * as React from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
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
      }}
    >
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>

      {children}

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


FormField.displayName = 'FormField';
