import * as React from 'react';

export interface StickyAddToCartProps {
  title: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  onAddToCart: (quantity: number) => void;
  onBuyNow?: (quantity: number) => void;
  inStock?: boolean;
  className?: string;
}

export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  title,
  price,
  compareAtPrice,
  image,
  onAddToCart,
  onBuyNow,
  inStock = true,
  className = '',
}) => {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div
      className={`boost-sticky-add-to-cart ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        borderTop: '1px solid #e5e7eb',
        padding: '10px 16px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {image && (
          <img
            src={image}
            alt={title}
            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }}
          />
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>₹{price}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through' }}>₹{compareAtPrice}</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Quantity Selector */}
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ padding: '6px 10px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            -
          </button>
          <span style={{ padding: '6px 8px', fontSize: '13px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            style={{ padding: '6px 10px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            +
          </button>
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => onAddToCart(quantity)}
          disabled={!inStock}
          style={{
            backgroundColor: inStock ? '#000000' : '#9ca3af',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: inStock ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
          }}
        >
          {inStock ? 'Add to Cart' : 'Sold Out'}
        </button>

        {onBuyNow && inStock && (
          <button
            onClick={() => onBuyNow(quantity)}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};
