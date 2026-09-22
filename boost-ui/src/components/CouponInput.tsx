import React, { useState } from 'react';


/**
 * CouponInputProps — Properties for the coupon/discount code input.
 */
export interface CouponInputProps {
  onApply?: (code: string) => void;
  onRemove?: () => void;
  appliedCode?: string;
  discountText?: string;
  loading?: boolean;
  error?: string;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  onApply,
  onRemove,
  appliedCode,
  discountText,
  loading = false,
  error,
  placeholder = 'Enter promo code',
  style,
}) => {
  const [code, setCode] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onApply?.(code.trim().toUpperCase());
  };

  const handleRemove = () => {
    setCode('');
    onRemove?.();
  };

  if (appliedCode) {
    return (
      <div
        className="boost-coupon-applied"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: 'rgba(34, 197, 94, 0.08)',
          border: '1px dashed rgba(34, 197, 94, 0.4)',
          borderRadius: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e', letterSpacing: '0.5px' }}>
              {appliedCode}
            </span>
            {discountText && (
              <span style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)', marginLeft: '8px' }}>
                {discountText}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', ...style }}>
      <form
        onSubmit={handleApply}
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--boost-text-muted, #94a3b8)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={placeholder}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 12px 12px 38px',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: 'var(--boost-text-primary, inherit)',
              backgroundColor: 'transparent',
              border: `1px solid ${error ? '#ef4444' : 'var(--boost-border, #334155)'}`,
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!code.trim() || loading}
          style={{
            padding: '0 20px',
            backgroundColor: 'var(--boost-primary, #3b82f6)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            border: 'none',
            cursor: !code.trim() || loading ? 'not-allowed' : 'pointer',
            opacity: !code.trim() || loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'opacity 0.2s, background-color 0.2s',
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
          <span>Apply</span>
        </button>
      </form>

      {error && (
        <div style={{ fontSize: '13px', color: '#ef4444', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};


CouponInput.displayName = 'CouponInput';
