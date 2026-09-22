import React from 'react';


/**
 * OrderSummaryItem — A single item in the order summary.
 */
export interface OrderSummaryItem {
  label: string;
  value: number | string;
  isDiscount?: boolean;
  helpText?: string;
}


/**
 * OrderSummaryProps — Properties for the order summary with item list.
 */
export interface OrderSummaryProps {
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  currencySymbol?: string;
  locale?: string;
  freeShippingThreshold?: number;
  onCheckout?: () => void;
  loading?: boolean;
  checkoutButtonText?: string;
  customRows?: OrderSummaryItem[];
  style?: React.CSSProperties;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal = 0,
  discount = 0,
  shippingFee = 0,
  tax = 0,
  currencySymbol = '$',
  locale = 'en-US',
  freeShippingThreshold,
  onCheckout,
  loading = false,
  checkoutButtonText = 'Proceed to Checkout',
  customRows = [],
  style,
}) => {
  const isFreeShipping = shippingFee === 0;
  const total = Math.max(0, subtotal - discount + (isFreeShipping ? 0 : shippingFee) + tax);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale).format(num);
  };

  const remainingForFreeShipping =
    freeShippingThreshold && subtotal < freeShippingThreshold
      ? freeShippingThreshold - subtotal
      : 0;

  return (
    <div
      className="boost-order-summary"
      style={{
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        borderRadius: 'var(--boost-radius, 16px)',
        padding: 'clamp(16px, 3vw, 24px)',
        fontFamily: 'inherit',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        boxSizing: 'border-box',
        width: '100%',
        ...style,
      }}
    >
      <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--boost-text, #0f172a)', margin: '0 0 16px' }}>
        Order Summary
      </h3>

      {freeShippingThreshold && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: isFreeShipping || remainingForFreeShipping === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(37, 99, 235, 0.08)',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: 600,
            color: isFreeShipping || remainingForFreeShipping === 0 ? '#16a34a' : 'var(--boost-primary, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>
            {isFreeShipping || remainingForFreeShipping === 0
              ? '🎉 You have qualified for Free Delivery!'
              : `Add ${currencySymbol}${formatNumber(remainingForFreeShipping)} more to get Free Delivery.`}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '13px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--boost-text-muted, #64748b)' }}>
          <span>Subtotal</span>
          <span style={{ fontWeight: 600, color: 'var(--boost-text, #0f172a)' }}>
            {currencySymbol}{formatNumber(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
            <span>Discount</span>
            <span style={{ fontWeight: 700 }}>
              -{currencySymbol}{formatNumber(discount)}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--boost-text-muted, #64748b)' }}>
          <span>Delivery Charges</span>
          <span style={{ fontWeight: 600, color: isFreeShipping ? '#16a34a' : 'var(--boost-text, #0f172a)' }}>
            {isFreeShipping ? 'FREE' : `${currencySymbol}${formatNumber(shippingFee)}`}
          </span>
        </div>

        {tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--boost-text-muted, #64748b)' }}>
            <span>Estimated Taxes (GST)</span>
            <span style={{ fontWeight: 600, color: 'var(--boost-text, #0f172a)' }}>
              {currencySymbol}{formatNumber(tax)}
            </span>
          </div>
        )}

        {customRows.map((row, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: row.isDiscount ? '#16a34a' : 'var(--boost-text-muted, #64748b)',
            }}
          >
            <span>{row.label}</span>
            <span style={{ fontWeight: 600 }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--boost-border, #e2e8f0)',
          marginTop: '16px',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--boost-text, #0f172a)' }}>Total Amount</span>
        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--boost-text, #0f172a)' }}>
          {currencySymbol}{formatNumber(total)}
        </span>
      </div>

      {onCheckout && (
        <button
          type="button"
          onClick={onCheckout}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '18px',
            padding: '13px',
            backgroundColor: 'var(--boost-primary, #2563eb)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 700,
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.35))',
            transition: 'all 0.15s ease',
          }}
        >
          {loading && (
            <svg
              style={{ animation: 'boost-spin 1s linear infinite', width: '16px', height: '16px' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          )}
          <span>{checkoutButtonText}</span>
        </button>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '14px',
          fontSize: '11px',
          color: 'var(--boost-text-muted, #64748b)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Safe & Secure 256-bit Encrypted Checkout</span>
      </div>
    </div>
  );
};


OrderSummary.displayName = 'OrderSummary';
