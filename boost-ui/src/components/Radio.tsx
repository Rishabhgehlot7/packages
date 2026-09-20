import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  stylePreset?: UIStylePreset;
}

export const Radio = /* @__PURE__ */ React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', style, disabled, stylePreset: stylePresetProp, ...props }, ref) => {
    const { stylePreset: inheritedPreset } = useBoostPreset();
    const preset = stylePresetProp ?? inheritedPreset;

    return (
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          userSelect: 'none',
          fontFamily: 'inherit',
          ...style,
        }}
        className={`boost-radio boost-radio-preset-${preset} ${className}`}
      >
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className={`boost-radio-input boost-radio-preset-${preset}`}
          style={{
            marginTop: '3px',
            accentColor: 'var(--boost-primary, #2563eb)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          {...props}
        />
        {(label || description) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {label && (
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--boost-text, #0f172a)' }}>
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

Radio.displayName = 'Radio';

export interface RadioOption {
  label: React.ReactNode;
  value: string | number;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name?: string;
  options?: RadioOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  stylePreset?: UIStylePreset;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name = 'radio-group',
  options = [],
  value,
  onChange = () => {},
  orientation = 'vertical',
  className = '',
  style,
  disabled = false,
  stylePreset,
}) => {
  return (
    <div
      className={`boost-radio-group ${className}`}
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: '12px',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {options.map((opt) => {
        const isChecked = value === opt.value;
        const isDisabled = disabled || opt.disabled;

        return (
          <Radio
            key={String(opt.value)}
            name={name}
            value={opt.value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={() => onChange(opt.value)}
            label={opt.label}
            description={opt.description}
            stylePreset={stylePreset}
          />
        );
      })}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';
