import React, { useState } from 'react';

export interface AddToCartProps {
  onAdd?: (quantity: number) => void;
  onQuantityChange?: (quantity: number) => void;
  initialQuantity?: number;
  maxQuantity?: number;
  loading?: boolean;
  disabled?: boolean;
  showStepperOnAdd?: boolean;
  label?: string;
  style?: React.CSSProperties;
}

export const AddToCart: React.FC<AddToCartProps> = ({
  onAdd,
  onQuantityChange,
  initialQuantity = 0,
  maxQuantity = 10,
  loading = false,
  disabled = false,
  showStepperOnAdd = true,
  label = 'Add to Cart',
  style,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleAdd = () => {
    if (disabled || loading) return;
    const nextQty = 1;
    setQuantity(nextQty);
    onAdd?.(nextQty);
    onQuantityChange?.(nextQty);
  };

  const handleIncrement = () => {
    if (quantity >= maxQuantity) return;
    const nextQty = quantity + 1;
    setQuantity(nextQty);
    onQuantityChange?.(nextQty);
  };

  const handleDecrement = () => {
    const nextQty = quantity - 1;
    setQuantity(nextQty);
    onQuantityChange?.(nextQty);
  };

  if (showStepperOnAdd && quantity > 0) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          border: '1px solid #0f172a',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          ...style,
        }}
      >
        <button
          type="button"
          onClick={handleDecrement}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '38px',
            backgroundColor: '#ffffff',
            border: 'none',
            color: '#0f172a',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {quantity === 1 ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          ) : (
            <span>-</span>
          )}
        </button>

        <span
          style={{
            minWidth: '36px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '38px',
            backgroundColor: '#ffffff',
            border: 'none',
            color: quantity >= maxQuantity ? '#cbd5e1' : '#0f172a',
            cursor: quantity >= maxQuantity ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        borderRadius: '6px',
        border: 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        transition: 'background-color 0.15s ease',
        ...style,
      }}
    >
      {loading ? (
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
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
};


AddToCart.displayName = 'AddToCart';
