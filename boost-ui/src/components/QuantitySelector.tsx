import * as React from 'react';

export interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  };

  const sizeStyles = {
    sm: {
      padding: '4px 8px',
      fontSize: '13px',
      btnSize: '24px',
      gap: '8px',
    },
    md: {
      padding: '6px 12px',
      fontSize: '15px',
      btnSize: '30px',
      gap: '12px',
    },
    lg: {
      padding: '10px 16px',
      fontSize: '17px',
      btnSize: '36px',
      gap: '16px',
    },
  }[size];

  return (
    <div
      className={`boost-quantity-selector ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--boost-bg-subtle, rgba(255, 255, 255, 0.05))',
        border: '1px solid var(--boost-border, rgba(255, 255, 255, 0.12))',
        borderRadius: '10px',
        padding: sizeStyles.padding,
        gap: sizeStyles.gap,
        userSelect: 'none',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        style={{
          width: sizeStyles.btnSize,
          height: sizeStyles.btnSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: value <= min ? 'transparent' : 'var(--boost-surface, rgba(255, 255, 255, 0.1))',
          color: value <= min ? 'var(--boost-text-muted, #64748b)' : 'var(--boost-text-primary, #0f172a)',
          border: value <= min ? 'none' : '1px solid var(--boost-border, rgba(255, 255, 255, 0.12))',
          borderRadius: '7px',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          fontWeight: 700,
          fontSize: sizeStyles.fontSize,
          boxShadow: value <= min ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
          <path d="M1 1H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <span
        style={{
          fontWeight: 700,
          fontSize: sizeStyles.fontSize,
          color: 'var(--boost-text-primary, #0f172a)',
          minWidth: '24px',
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        style={{
          width: sizeStyles.btnSize,
          height: sizeStyles.btnSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: value >= max ? 'transparent' : 'var(--boost-surface, rgba(255, 255, 255, 0.1))',
          color: value >= max ? 'var(--boost-text-muted, #64748b)' : 'var(--boost-text-primary, #0f172a)',
          border: value >= max ? 'none' : '1px solid var(--boost-border, rgba(255, 255, 255, 0.12))',
          borderRadius: '7px',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          fontWeight: 700,
          fontSize: sizeStyles.fontSize,
          boxShadow: value >= max ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};


QuantitySelector.displayName = 'QuantitySelector';
