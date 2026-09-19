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

  return (
    <>
      <style>{`
        .boost-add-to-cart-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
        }
        .boost-add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
        }
        .boost-add-to-cart-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .boost-add-to-cart-stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.1));
          border-radius: 12px;
          overflow: hidden;
          background: var(--boost-surface, #ffffff);
          box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
        }
        :root[data-theme="dark"] .boost-add-to-cart-stepper,
        .dark .boost-add-to-cart-stepper {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 4px 20px -3px rgba(0, 0, 0, 0.4) !important;
        }
        .boost-stepper-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 40px;
          background: transparent;
          border: none;
          color: var(--boost-text-primary, #0f172a);
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          transition: background-color 0.15s ease;
        }
        .boost-stepper-btn:hover:not(:disabled) {
          background-color: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }
        :root[data-theme="dark"] .boost-stepper-btn,
        .dark .boost-stepper-btn {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-stepper-btn:hover:not(:disabled),
        .dark .boost-stepper-btn:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.12) !important;
          color: #818cf8 !important;
        }
        .boost-stepper-qty {
          min-width: 38px;
          text-align: center;
          font-size: 14px;
          font-weight: 800;
          color: var(--boost-text-primary, #0f172a);
          font-variant-numeric: tabular-nums;
        }
        :root[data-theme="dark"] .boost-stepper-qty,
        .dark .boost-stepper-qty {
          color: #ffffff !important;
        }
      `}</style>

      {showStepperOnAdd && quantity > 0 ? (
        <div className="boost-add-to-cart-stepper" style={style}>
          <button
            type="button"
            onClick={handleDecrement}
            className="boost-stepper-btn"
            aria-label="Decrease quantity"
          >
            {quantity === 1 ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            ) : (
              <span>−</span>
            )}
          </button>

          <span className="boost-stepper-qty">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity}
            className="boost-stepper-btn"
            aria-label="Increase quantity"
            style={{ opacity: quantity >= maxQuantity ? 0.35 : 1, cursor: quantity >= maxQuantity ? 'not-allowed' : 'pointer' }}
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || loading}
          className="boost-add-to-cart-btn"
          style={{
            opacity: disabled ? 0.6 : 1,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            ...style,
          }}
        >
          {loading ? (
            <svg
              style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          )}
          <span>{label}</span>
        </button>
      )}
    </>
  );
};

AddToCart.displayName = 'AddToCart';

