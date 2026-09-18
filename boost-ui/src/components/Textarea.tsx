import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxChars?: number;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxChars,
      fullWidth = true,
      disabled,
      className = '',
      id,
      value,
      onChange,
      style,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div
        className={`boost-textarea-wrapper ${className}`}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'inherit',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <label
              htmlFor={textareaId}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              {label}
            </label>
          )}

          {maxChars && (
            <span style={{ fontSize: '11px', color: charCount > maxChars ? '#ef4444' : '#64748b' }}>
              {charCount}/{maxChars}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            color: '#0f172a',
            backgroundColor: disabled ? '#f8fafc' : '#ffffff',
            border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
            borderRadius: '6px',
            outline: 'none',
            minHeight: '80px',
            resize: 'vertical',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            ...style,
          }}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
