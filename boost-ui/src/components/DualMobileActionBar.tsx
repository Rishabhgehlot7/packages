import * as React from 'react';

export interface DualMobileActionBarProps {
  price?: number;
  compareAtPrice?: number;
  originalPrice?: number;
  currencySymbol?: string;
  isWishlisted?: boolean;
  isInCart?: boolean;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onToggleWishlist?: () => void;
  position?: 'fixed' | 'relative';
  addToCartText?: string;
  buyNowText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DualMobileActionBar: React.FC<DualMobileActionBarProps> = ({
  price,
  compareAtPrice,
  originalPrice,
  currencySymbol = '$',
  isWishlisted = false,
  isInCart = false,
  onAddToCart = () => {},
  onBuyNow = () => {},
  onToggleWishlist,
  position,
  addToCartText = 'Add to Cart',
  buyNowText = 'Buy Now',
  className = '',
  style,
  ...props
}) => {
  const isRelative = position === 'relative' || (props as any).position === 'relative';
  const effectiveOriginalPrice = compareAtPrice ?? originalPrice ?? (props as any).originalPrice;

  return (
    <>
      {!isRelative && (
        <style>{`
          @media (min-width: 768px) {
            .boost-dual-mobile-action-bar {
              display: none !important;
            }
          }
        `}</style>
      )}
      <style>{`
        .boost-dual-mobile-action-bar {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        :root[data-theme="dark"] .boost-dual-mobile-action-bar,
        .dark .boost-dual-mobile-action-bar {
          background: rgba(17, 24, 39, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1) !important;
        }

        .boost-dual-price-val {
          color: var(--boost-text-primary, #0f172a);
          font-weight: 800;
          font-size: 16px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }

        :root[data-theme="dark"] .boost-dual-price-val,
        .dark .boost-dual-price-val {
          color: #ffffff !important;
        }

        .boost-dual-btn-cart {
          background: var(--boost-bg-muted, #f1f5f9);
          color: var(--boost-text-primary, #0f172a);
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          font-weight: 700;
          font-size: 13px;
          border-radius: 12px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
        }

        .boost-dual-btn-cart:hover {
          transform: translateY(-1px);
          background: #e2e8f0;
        }

        :root[data-theme="dark"] .boost-dual-btn-cart,
        .dark .boost-dual-btn-cart {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-dual-btn-cart:hover,
        .dark .boost-dual-btn-cart:hover {
          background: rgba(255, 255, 255, 0.14) !important;
        }

        .boost-dual-btn-buy {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          border-radius: 12px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
          flex: 1;
        }

        .boost-dual-btn-buy:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
        }

        .boost-dual-btn-buy:active,
        .boost-dual-btn-cart:active {
          transform: scale(0.98);
        }

        .boost-wishlist-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          background: var(--boost-surface, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        :root[data-theme="dark"] .boost-wishlist-btn,
        .dark .boost-wishlist-btn {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div
        className={`boost-dual-mobile-action-bar ${isRelative ? '' : 'md:hidden'} ${className}`}
        style={{
          position: isRelative ? 'relative' : 'fixed',
          bottom: isRelative ? undefined : 0,
          left: isRelative ? undefined : 0,
          right: isRelative ? undefined : 0,
          width: '100%',
          borderRadius: isRelative ? '18px' : '16px 16px 0 0',
          padding: '12px 16px',
          zIndex: isRelative ? 1 : 50,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        {/* Optional Price Display */}
        {price !== undefined && (
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <span className="boost-dual-price-val">
              {currencySymbol}{Number(price).toLocaleString()}
            </span>
            {effectiveOriginalPrice && effectiveOriginalPrice > price && (
              <span style={{ color: 'var(--boost-text-muted, #94a3b8)', fontSize: '11px', textDecoration: 'line-through', fontWeight: 500 }}>
                {currencySymbol}{Number(effectiveOriginalPrice).toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Optional Wishlist heart button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={onToggleWishlist}
            aria-label="Wishlist"
            className="boost-wishlist-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted ? '#ef4444' : 'none'}
              stroke={isWishlisted ? '#ef4444' : 'currentColor'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: isWishlisted ? '#ef4444' : 'var(--boost-text-secondary, #64748b)' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}

        {/* Button 1: Add to Cart (Secondary Modern Button) */}
        <button
          type="button"
          onClick={onAddToCart}
          className="boost-dual-btn-cart"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>{isInCart ? 'In Cart' : addToCartText}</span>
        </button>

        {/* Button 2: Buy Now (Primary Accent Button) */}
        <button
          type="button"
          onClick={onBuyNow}
          className="boost-dual-btn-buy"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>{buyNowText}</span>
        </button>
      </div>
    </>
  );
};

DualMobileActionBar.displayName = 'DualMobileActionBar';
