import * as React from 'react';

export interface StickyAddToCartProps {
  title: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  onAddToCart: (quantity: number) => Promise<void> | void;
  onBuyNow?: (quantity: number) => Promise<void> | void;
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
  const [isAdding, setIsAdding] = React.useState(false);
  const [isBuying, setIsBuying] = React.useState(false);
  const [addedFeedback, setAddedFeedback] = React.useState(false);

  const handleAddToCart = async () => {
    if (!inStock || isAdding || isBuying) return;
    try {
      setIsAdding(true);
      await Promise.resolve(onAddToCart(quantity));
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1500);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!inStock || isAdding || isBuying || !onBuyNow) return;
    try {
      setIsBuying(true);
      await Promise.resolve(onBuyNow(quantity));
    } finally {
      setIsBuying(false);
    }
  };

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
            aria-label="Decrease quantity"
            disabled={isAdding || isBuying}
            style={{ padding: '6px 10px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            -
          </button>
          <span style={{ padding: '6px 8px', fontSize: '13px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
            disabled={isAdding || isBuying}
            style={{ padding: '6px 10px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            +
          </button>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAdding || isBuying}
          style={{
            backgroundColor: !inStock ? '#9ca3af' : addedFeedback ? '#16a34a' : '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: inStock && !isAdding && !isBuying ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.2s ease',
          }}
        >
          {!inStock ? 'Sold Out' : isAdding ? 'Adding...' : addedFeedback ? 'Added! ✓' : 'Add to Cart'}
        </button>

        {onBuyNow && inStock && (
          <button
            onClick={handleBuyNow}
            disabled={isAdding || isBuying}
            style={{
              backgroundColor: isBuying ? '#1d4ed8' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: !isAdding && !isBuying ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s ease',
            }}
          >
            {isBuying ? 'Processing...' : 'Buy Now'}
          </button>
        )}
      </div>
    </div>
  );
};
