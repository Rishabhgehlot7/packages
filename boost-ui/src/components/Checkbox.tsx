import * as React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate, checked, disabled, className = '', style, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    return (
      <label
        className={`boost-checkbox-label ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          fontFamily: 'inherit',
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <input
            ref={inputRef}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            style={{
              width: '16px',
              height: '16px',
              accentColor: 'var(--boost-primary, #2563eb)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              margin: 0,
            }}
            {...props}
          />
        </div>

        {(label || description) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {label && (
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--boost-text, #1e293b)' }}>
                {label}
              </span>
            )}
            {description && (
              <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
