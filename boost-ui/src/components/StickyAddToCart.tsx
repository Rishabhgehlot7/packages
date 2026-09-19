import * as React from 'react';

export interface StickyAddToCartProps {
  title: string;
  price: number;
  compareAtPrice?: number;
  originalPrice?: number;
  image?: string;
  onAddToCart: (quantity: number) => Promise<void> | void;
  onBuyNow?: (quantity: number) => Promise<void> | void;
  inStock?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  title,
  price,
  compareAtPrice,
  originalPrice,
  image,
  onAddToCart,
  onBuyNow,
  inStock = true,
  className = '',
  style,
}) => {
  const finalComparePrice = compareAtPrice ?? originalPrice;
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
      className={`boost-sticky-bar ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '12px 20px',
        zIndex: 999,
        fontFamily: 'inherit',
        color: 'var(--boost-text-primary, #0f172a)',
        transition: 'all 0.3s ease',
        containerType: 'inline-size',
        ...style,
      }}
    >
      <style>
        {`
          .boost-sticky-bar {
            background-color: var(--boost-surface, rgba(255, 255, 255, 0.92));
            box-shadow: 0 -10px 40px -10px rgba(0, 0, 0, 0.1);
            border-top: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          }
          :root[data-theme="dark"] .boost-sticky-bar,
          .dark .boost-sticky-bar {
            background-color: var(--boost-surface, rgba(15, 23, 42, 0.95)) !important;
            border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
            box-shadow: 0 -10px 40px -10px rgba(0, 0, 0, 0.7) !important;
            color: #f8fafc !important;
          }
          .boost-sticky-bar-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
            gap: 16px;
            flex-wrap: wrap;
          }
          .boost-sticky-product {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
            min-width: 0;
          }
          .boost-sticky-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .boost-sticky-qty {
            display: flex;
            align-items: center;
            background: var(--boost-bg-muted, rgba(0,0,0,0.04));
            border-radius: 8px;
            border: 1px solid var(--boost-border, rgba(0,0,0,0.08));
          }
          .boost-sticky-btn-primary, .boost-sticky-btn-secondary {
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.1s, opacity 0.2s, background-color 0.2s;
            white-space: nowrap;
          }
          .boost-sticky-btn-primary:active, .boost-sticky-btn-secondary:active {
            transform: scale(0.98);
          }
          .boost-sticky-btn-primary {
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }
          .boost-sticky-btn-primary:hover {
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.45);
          }
          .boost-sticky-btn-secondary {
            background-color: var(--boost-surface, rgba(255, 255, 255, 0.08));
            color: var(--boost-text-primary, #0f172a);
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.12));
          }
          
          /* Dark mode specific overrides */
          :root[data-theme="dark"] .boost-sticky-btn-secondary,
          .dark .boost-sticky-btn-secondary {
            background-color: rgba(255, 255, 255, 0.08);
            color: #f8fafc;
            border-color: rgba(255, 255, 255, 0.15);
          }
          :root[data-theme="dark"] .boost-sticky-qty,
          .dark .boost-sticky-qty {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.12);
            color: #f8fafc;
          }

          /* Mobile Optimization using Container Queries for perfect responsiveness anywhere */
          @container (max-width: 600px) {
            .boost-sticky-bar {
              padding: 12px 16px !important;
            }
            .boost-sticky-bar-content {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
            }
            .boost-sticky-product {
              justify-content: space-between;
              width: 100%;
            }
            .boost-sticky-product-title {
              font-size: 13px !important;
              max-width: 120px;
            }
            .boost-sticky-actions {
              width: 100%;
              justify-content: stretch;
            }
            .boost-sticky-actions > button {
              flex: 1;
              padding: 12px 8px;
            }
            .boost-sticky-qty {
              display: none !important; /* Hide quantity to give buttons more space */
            }
          }
        `}
      </style>

      <div className="boost-sticky-bar-content">
        <div className="boost-sticky-product">
          {image && (
            <img
              src={image}
              alt={title}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--boost-border, rgba(0,0,0,0.1))' }}
            />
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="boost-sticky-product-title" style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>₹{price}</span>
              {finalComparePrice && finalComparePrice > price && (
                <span style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)', textDecoration: 'line-through' }}>₹{finalComparePrice}</span>
              )}
            </div>
          </div>
        </div>

        <div className="boost-sticky-actions">
          {/* Quantity Selector */}
          <div className="boost-sticky-qty">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              disabled={isAdding || isBuying}
              style={{ padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: 500, color: 'inherit' }}
            >
              -
            </button>
            <span style={{ padding: '8px', fontSize: '14px', fontWeight: 600, minWidth: '32px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
              disabled={isAdding || isBuying}
              style={{ padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: 500, color: 'inherit' }}
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding || isBuying}
            className="boost-sticky-btn-primary"
            style={{
              backgroundColor: !inStock ? 'var(--boost-bg-muted, #9ca3af)' : addedFeedback ? '#10b981' : undefined,
              opacity: (!inStock || isAdding || isBuying) && !addedFeedback ? 0.7 : 1,
              cursor: (!inStock || isAdding || isBuying) ? 'not-allowed' : 'pointer'
            }}
          >
            {!inStock ? 'Sold Out' : isAdding ? 'Adding...' : addedFeedback ? 'Added! ✓' : 'Add to Cart'}
          </button>

          {onBuyNow && inStock && (
            <button
              onClick={handleBuyNow}
              disabled={isAdding || isBuying}
              className="boost-sticky-btn-secondary"
              style={{
                opacity: (isAdding || isBuying) ? 0.7 : 1,
                cursor: (isAdding || isBuying) ? 'not-allowed' : 'pointer'
              }}
            >
              {isBuying ? 'Processing...' : 'Buy Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


StickyAddToCart.displayName = 'StickyAddToCart';
