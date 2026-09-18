import React from 'react';

export interface PriceProps {
  amount: number;
  originalAmount?: number;
  currencySymbol?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscount?: boolean;
  showSavings?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Price: React.FC<PriceProps> = ({
  amount,
  originalAmount,
  currencySymbol = '₹',
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
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        gap: '8px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      <span
        style={{
          fontSize: currentSize.current,
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.5px',
        }}
      >
        {currencySymbol}
        {formatNumber(amount)}
      </span>

      {hasDiscount && (
        <span
          style={{
            fontSize: currentSize.original,
            color: '#94a3b8',
            textDecoration: 'line-through',
            fontWeight: 400,
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
            color: '#16a34a',
            backgroundColor: '#dcfce7',
            padding: '2px 6px',
            borderRadius: '4px',
            lineHeight: 1.2,
          }}
        >
          {discountPercent}% OFF
        </span>
      )}

      {hasDiscount && showSavings && (
        <span style={{ width: '100%', fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
          You save {currencySymbol}
          {formatNumber(savingsAmount)}
        </span>
      )}
    </div>
  );
};


Price.displayName = 'Price';
