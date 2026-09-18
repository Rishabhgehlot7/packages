import * as React from 'react';

export interface DualMobileActionBarProps {
  price?: number;
  compareAtPrice?: number;
  currencySymbol?: string;
  isWishlisted?: boolean;
  isInCart?: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist?: () => void;
  position?: 'fixed' | 'relative';
  className?: string;
}

export const DualMobileActionBar: React.FC<DualMobileActionBarProps> = ({
  price,
  compareAtPrice,
  currencySymbol = '₹',
  isWishlisted = false,
  isInCart = false,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  position,
  className = '',
  ...props
}) => {
  const isRelative = position === 'relative' || (props as any).position === 'relative';

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
      <div
        className={`boost-dual-mobile-action-bar ${isRelative ? '' : 'md:hidden'} ${className}`}
        style={{
          position: isRelative ? 'relative' : 'fixed',
          bottom: isRelative ? undefined : 0,
          left: isRelative ? undefined : 0,
          right: isRelative ? undefined : 0,
          width: '100%',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: isRelative ? '12px' : 0,
          padding: '12px 16px',
          zIndex: isRelative ? 1 : 50,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: isRelative ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 -4px 16px rgba(0, 0, 0, 0.08)',
          boxSizing: 'border-box',
        }}
      >
        {/* Optional Price Display */}
        {price !== undefined && (
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '65px', flexShrink: 0 }}>
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '15px', lineHeight: 1.1 }}>
              {currencySymbol}{Number(price).toLocaleString()}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span style={{ color: '#94a3b8', fontSize: '11px', textDecoration: 'line-through' }}>
                {currencySymbol}{Number(compareAtPrice).toLocaleString()}
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
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isWishlisted ? '#ef4444' : 'none'}
            stroke={isWishlisted ? '#ef4444' : '#6b7280'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      {/* Button 1: Add to Cart (Flipkart Yellow / Amazon Gold) */}
      <button
        type="button"
        onClick={onAddToCart}
        style={{
          flex: 1,
          height: '44px',
          backgroundColor: '#ff9f00',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '14px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 2px 4px rgba(255, 159, 0, 0.3)',
          transition: 'transform 0.1s active',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>

      {/* Button 2: Buy Now (Flipkart Orange / Amazon Orange #fb641b) */}
      <button
        type="button"
        onClick={onBuyNow}
        style={{
          flex: 1,
          height: '44px',
          backgroundColor: '#fb641b',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '14px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 2px 4px rgba(251, 100, 27, 0.3)',
          transition: 'transform 0.1s active',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        Buy Now
      </button>
    </div>
    </>
  );
};


DualMobileActionBar.displayName = 'DualMobileActionBar';
