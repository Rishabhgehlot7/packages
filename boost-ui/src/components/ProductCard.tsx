import * as React from 'react';
import { StarRating } from './StarRating';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  originalPrice?: number;
  images?: string[];
  image?: string;
  imageUrl?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockUrgencyText?: string;
  isWishlisted?: boolean;
  onAddToCart?: (id?: string) => void;
  onToggleWishlist?: (id?: string) => void;
  onClick?: (id?: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  compareAtPrice,
  originalPrice,
  images = [],
  image,
  imageUrl,
  brand,
  rating,
  reviewCount,
  inStock = true,
  stockUrgencyText,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const effectiveOriginalPrice = compareAtPrice ?? originalPrice;
  const imageList =
    images && images.length > 0
      ? images
      : imageUrl
      ? [imageUrl]
      : image
      ? [image]
      : [];

  const mainImage = imageList[0] || '';
  const secondaryImage = imageList[1] || mainImage;
  const currentImage = isHovered && secondaryImage ? secondaryImage : mainImage;

  const discountPercent =
    effectiveOriginalPrice && effectiveOriginalPrice > price
      ? Math.round(((effectiveOriginalPrice - price) / effectiveOriginalPrice) * 100)
      : null;

  return (
    <div
      className={`boost-product-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        borderRadius: 'var(--boost-radius, 16px)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered
          ? 'var(--boost-shadow-lg, 0 14px 28px rgba(0, 0, 0, 0.08))'
          : 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04))',
        fontFamily: 'inherit',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: 'var(--boost-bg, #f8fafc)',
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick ? () => onClick(id) : undefined}
      >
        <img
          src={currentImage}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)',
              zIndex: 2,
            }}
          >
            {discountPercent}% OFF
          </div>
        )}

        {/* Stock Urgency Tag */}
        {stockUrgencyText && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: 'rgba(220, 38, 38, 0.92)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              zIndex: 2,
            }}
          >
            {stockUrgencyText}
          </div>
        )}

        {/* Wishlist Glass Button */}
        {onToggleWishlist && (
          <button
            type="button"
            aria-label="Wishlist"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(id);
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              backgroundColor: isWishlisted ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              padding: 0,
              transition: 'transform 0.15s ease, background-color 0.15s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              zIndex: 2,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isWishlisted ? '#ef4444' : 'none'}
              stroke={isWishlisted ? '#ef4444' : '#475569'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Details & Actions */}
      <div
        style={{
          padding: 'clamp(10px, 2vw, 14px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {brand && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--boost-text-muted, #64748b)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '2px',
              }}
            >
              {brand}
            </span>
          )}

          <h3
            onClick={() => onClick?.(id)}
            style={{
              fontSize: 'clamp(13px, 1.2vw, 14px)',
              fontWeight: 600,
              color: 'var(--boost-text, #0f172a)',
              margin: '0 0 4px 0',
              cursor: onClick ? 'pointer' : 'default',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.35,
            }}
          >
            {title}
          </h3>

          {rating !== undefined && (
            <div style={{ margin: '2px 0' }}>
              <StarRating rating={rating} reviewCount={reviewCount} size={12} />
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px', marginBottom: '8px' }}>
            <span style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', fontWeight: 800, color: 'var(--boost-text, #0f172a)' }}>
              ₹{price}
            </span>
            {effectiveOriginalPrice && effectiveOriginalPrice > price && (
              <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)', textDecoration: 'line-through' }}>
                ₹{effectiveOriginalPrice}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          {onAddToCart && (
            <button
              type="button"
              disabled={!inStock}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(id);
              }}
              style={{
                width: '100%',
                backgroundColor: inStock ? 'var(--boost-primary, #2563eb)' : 'var(--boost-border, #cbd5e1)',
                color: inStock ? '#ffffff' : 'var(--boost-text-muted, #64748b)',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: inStock ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
                boxShadow: inStock ? 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))' : 'none',
              }}
            >
              {inStock ? '+ Add to Bag' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


ProductCard.displayName = 'ProductCard';
