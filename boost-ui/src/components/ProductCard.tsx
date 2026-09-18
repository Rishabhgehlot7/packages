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
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.06)' : '0 1px 2px rgba(0,0,0,0.04)',
        fontFamily: 'inherit',
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          backgroundColor: '#f8fafc',
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
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
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
              bottom: '8px',
              left: '8px',
              backgroundColor: 'rgba(220, 38, 38, 0.9)',
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)',
            }}
          >
            {stockUrgencyText}
          </div>
        )}

        {/* Wishlist Heart Button */}
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
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '999px',
              backgroundColor: '#ffffff',
              border: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isWishlisted ? '#f43f5e' : 'none'}
              stroke={isWishlisted ? '#f43f5e' : '#64748b'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Details & Actions */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
        {brand && (
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            {brand}
          </span>
        )}

        <h3
          onClick={() => onClick?.(id)}
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
            cursor: onClick ? 'pointer' : 'default',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </h3>

        {rating !== undefined && (
          <StarRating rating={rating} reviewCount={reviewCount} size={11} />
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '1px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>₹{price}</span>
          {effectiveOriginalPrice && effectiveOriginalPrice > price && (
            <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
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
              marginTop: '4px',
              width: '100%',
              backgroundColor: inStock ? '#2563eb' : '#94a3b8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: inStock ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.15s ease',
            }}
          >
            {inStock ? '+ Add to Bag' : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  );
};


ProductCard.displayName = 'ProductCard';
