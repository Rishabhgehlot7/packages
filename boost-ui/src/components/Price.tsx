import React from 'react';


/**
 * PriceProps — Properties for the price display with currency formatting and discount.
 */
export interface PriceProps {
  amount?: number;
  originalAmount?: number;
  currencySymbol?: string;
  locale?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscount?: boolean;
  showSavings?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Price: React.FC<PriceProps> = ({
  amount = 0,
  originalAmount,
  currencySymbol = '$',
  locale = 'en-US',
  size = 'md',
  showDiscount = true,
  showSavings = false,
  className = '',
  style,
}) => {
  const hasDiscount = originalAmount && originalAmount > amount;
  const discountPercent = hasDiscount
    ? Math.round(((originalAmount - amount) / originalAmount) * 100)
    : 0;
  const savingsAmount = hasDiscount ? originalAmount - amount : 0;

  const sizeStyles: Record<string, { current: string; original: string; discount: string }> = {
    sm: { current: '14px', original: '12px', discount: '11px' },
    md: { current: '18px', original: '14px', discount: '12px' },
    lg: { current: '24px', original: '16px', discount: '13px' },
    xl: { current: '30px', original: '18px', discount: '14px' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale).format(num);
  };

  return (
    <div
      className={`boost-price ${className}`}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      <span
        style={{
          fontSize: currentSize.current,
          fontWeight: 700,
          color: 'var(--boost-text-primary, inherit)',
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}
      >
        {currencySymbol}
        {formatNumber(amount)}
      </span>

      {hasDiscount && (
        <span
          style={{
            fontSize: currentSize.original,
            color: 'var(--boost-text-muted, #94a3b8)',
            textDecoration: 'line-through',
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          {currencySymbol}
          {formatNumber(originalAmount)}
        </span>
      )}

      {hasDiscount && showDiscount && discountPercent > 0 && (
        <span
          style={{
            fontSize: currentSize.discount,
            fontWeight: 700,
            color: 'var(--boost-success, #16a34a)',
            backgroundColor: 'var(--boost-success-bg, rgba(22, 163, 74, 0.12))',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            padding: '2px 8px',
            borderRadius: '6px',
            lineHeight: 1.2,
            display: 'inline-flex',
            alignItems: 'center',
            letterSpacing: '0.02em',
          }}
        >
          {discountPercent}% OFF
        </span>
      )}

      {hasDiscount && showSavings && (
        <span style={{ width: '100%', fontSize: '12px', color: 'var(--boost-success, #16a34a)', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
          You save {currencySymbol}
          {formatNumber(savingsAmount)}
        </span>
      )}
    </div>
  );
};


Price.displayName = 'Price';
