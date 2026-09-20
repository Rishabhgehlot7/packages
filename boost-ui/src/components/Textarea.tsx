import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxChars?: number;
  showCount?: boolean;
  fullWidth?: boolean;
}

export const Textarea = /* @__PURE__ */ React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxChars,
      maxLength,
      showCount = false,
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
    const limit = maxLength || maxChars;
    const charCount = typeof value === 'string' ? value.length : 0;
    const shouldShowCount = showCount || Boolean(maxChars);

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
        <style>{`
          .boost-textarea {
            background-color: var(--boost-surface, #ffffff);
            color: var(--boost-text, #0f172a);
            border: 1px solid var(--boost-border, #cbd5e1);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          :root[data-theme="dark"] .boost-textarea {
            background-color: #1e293b !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
            color: #f8fafc !important;
          }
          .boost-textarea:focus {
            border-color: var(--boost-primary, #2563eb) !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18) !important;
          }
        `}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <label
              htmlFor={textareaId}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--boost-text, #334155)',
              }}
            >
              {label}
            </label>
          )}

          {shouldShowCount && limit && (
            <span style={{ fontSize: '11px', color: charCount > limit ? '#ef4444' : 'var(--boost-text-muted, #64748b)' }}>
              {charCount}/{limit}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          value={value}
          onChange={onChange}
          maxLength={limit}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error && textareaId
              ? `${textareaId}-error`
              : helperText && textareaId
              ? `${textareaId}-helper`
              : undefined
          }
          className="boost-textarea"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: 'var(--boost-radius, 8px)',
            outline: 'none',
            minHeight: '90px',
            resize: 'vertical',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            borderColor: error ? '#ef4444' : undefined,
            ...style,
          }}
          {...props}
        />

        {error ? (
          <span
            id={textareaId ? `${textareaId}-error` : undefined}
            role="alert"
            style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={textareaId ? `${textareaId}-helper` : undefined}
            style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
