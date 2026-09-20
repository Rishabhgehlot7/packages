import * as React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Switch = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onChange = () => {},
      label,
      description,
      disabled = false,
      size = 'md',
      className = '',
      style,
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
          ...style,
        }}
      >
        <style>{`
          .boost-switch-btn {
            background-color: #cbd5e1;
          }
          :root[data-theme="dark"] .boost-switch-btn:not([aria-checked="true"]) {
            background-color: #334155 !important;
          }
          .boost-switch-btn[aria-checked="true"] {
            background-color: var(--boost-primary, #2563eb) !important;
          }
        `}</style>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className="boost-switch-btn"
          style={{
            width: `${s.width}px`,
            height: `${s.height}px`,
            borderRadius: '9999px',
            position: 'relative',
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            border: 'none',
            padding: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            flexShrink: 0,
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
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
              display: 'block',
            }}
          />
        </button>

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

Switch.displayName = 'Switch';
