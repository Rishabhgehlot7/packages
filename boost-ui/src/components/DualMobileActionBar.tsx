import * as React from 'react';

export interface DualMobileActionBarProps {
  price: number;
  compareAtPrice?: number;
  currencySymbol?: string;
  isWishlisted?: boolean;
  isInCart?: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist?: () => void;
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
  className = '',
}) => {
  return (
    <div
      className={`boost-dual-mobile-action-bar md:hidden ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '8px 12px calc(8px + env(safe-area-inset-bottom, 0px))',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
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
  );
};
