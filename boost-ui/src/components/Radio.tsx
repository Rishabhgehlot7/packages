import * as React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', style, disabled, ...props }, ref) => {
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
        className={`boost-radio ${className}`}
      >
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          style={{
            width: '16px',
            height: '16px',
            accentColor: 'var(--boost-primary, #2563eb)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            marginTop: '2px',
          }}
          {...props}
        />
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

Radio.displayName = 'Radio';

export interface RadioOption {
  label: string;
  value: string | number;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  orientation = 'vertical',
  className = '',
  style,
  disabled = false,
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
          />
        );
      })}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';
