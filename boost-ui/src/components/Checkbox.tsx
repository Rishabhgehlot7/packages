import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  stylePreset?: UIStylePreset;
}

export const Checkbox = /* @__PURE__ */ React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate, checked, disabled, className = '', style, stylePreset: stylePresetProp, ...props }, ref) => {
    const { stylePreset: inheritedPreset } = useBoostPreset();
    const preset = stylePresetProp ?? inheritedPreset;
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
            className={`boost-checkbox-input boost-checkbox-preset-${preset}`}
            style={{
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
