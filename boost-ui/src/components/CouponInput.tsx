import React, { useState } from 'react';

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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#f0fdf4',
          border: '1px dashed #86efac',
          borderRadius: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', letterSpacing: '0.5px' }}>
              {appliedCode}
            </span>
            {discountText && (
              <span style={{ fontSize: '12px', color: '#166534', marginLeft: '6px' }}>
                ({discountText})
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '2px 6px',
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
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
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
              padding: '9px 12px 9px 34px',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'uppercase',
              border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!code.trim() || loading}
          style={{
            padding: '9px 16px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            cursor: !code.trim() || loading ? 'not-allowed' : 'pointer',
            opacity: !code.trim() || loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {loading && (
            <svg
              style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }}
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
        <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
