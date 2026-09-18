import React from 'react';

export interface OrderSummaryItem {
  label: string;
  value: number | string;
  isDiscount?: boolean;
  helpText?: string;
}

export interface OrderSummaryProps {
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  currencySymbol?: string;
  freeShippingThreshold?: number;
  onCheckout?: () => void;
  loading?: boolean;
  checkoutButtonText?: string;
  customRows?: OrderSummaryItem[];
  style?: React.CSSProperties;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount = 0,
  shippingFee = 0,
  tax = 0,
  currencySymbol = '₹',
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
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const remainingForFreeShipping =
    freeShippingThreshold && subtotal < freeShippingThreshold
      ? freeShippingThreshold - subtotal
      : 0;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>
        Order Summary
      </h3>

      {freeShippingThreshold && (
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: isFreeShipping || remainingForFreeShipping === 0 ? '#f0fdf4' : '#eff6ff',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '12px',
            color: isFreeShipping || remainingForFreeShipping === 0 ? '#166534' : '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>
            {isFreeShipping || remainingForFreeShipping === 0
              ? 'You have qualified for Free Delivery!'
              : `Add ${currencySymbol}${formatNumber(remainingForFreeShipping)} more to get Free Delivery.`}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Subtotal</span>
          <span style={{ fontWeight: 500, color: '#0f172a' }}>
            {currencySymbol}{formatNumber(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
            <span>Discount</span>
            <span style={{ fontWeight: 600 }}>
              -{currencySymbol}{formatNumber(discount)}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
          <span>Delivery Charges</span>
          <span style={{ fontWeight: 500, color: isFreeShipping ? '#16a34a' : '#0f172a' }}>
            {isFreeShipping ? 'FREE' : `${currencySymbol}${formatNumber(shippingFee)}`}
          </span>
        </div>

        {tax > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>Estimated Taxes (GST)</span>
            <span style={{ fontWeight: 500, color: '#0f172a' }}>
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
              color: row.isDiscount ? '#16a34a' : '#475569',
            }}
          >
            <span>{row.label}</span>
            <span style={{ fontWeight: 500 }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid #e2e8f0',
          marginTop: '16px',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Total Amount</span>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
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
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {loading && (
            <svg
              style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }}
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
          color: '#64748b',
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
