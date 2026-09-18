import * as React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onChange,
      label,
      description,
      disabled = false,
      size = 'md',
      className = '',
    },
    ref
  ) => {
    const getSizes = () => {
      switch (size) {
        case 'sm': return { width: 32, height: 18, circle: 14, translate: 14 };
        case 'lg': return { width: 52, height: 28, circle: 22, translate: 24 };
        case 'md':
        default: return { width: 44, height: 24, circle: 18, translate: 20 };
      }
    };

    const s = getSizes();

    return (
      <label
        className={`boost-switch-wrapper ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          userSelect: 'none',
          fontFamily: 'inherit',
        }}
      >
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          style={{
            width: `${s.width}px`,
            height: `${s.height}px`,
            backgroundColor: checked ? '#2563eb' : '#cbd5e1',
            borderRadius: '9999px',
            position: 'relative',
            transition: 'background-color 0.2s ease',
            border: 'none',
            padding: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
          }}
        >
          <span
            style={{
              width: `${s.circle}px`,
              height: `${s.circle}px`,
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '3px',
              transform: `translateY(-50%) translateX(${checked ? `${s.translate}px` : '0px'})`,
              transition: 'transform 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
              display: 'block',
            }}
          />
        </button>

        {(label || description) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {label && (
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                {label}
              </span>
            )}
            {description && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
