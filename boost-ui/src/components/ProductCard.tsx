import * as React from 'react';
import { StarRating } from './StarRating';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockUrgencyText?: string;
  isWishlisted?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  onClick?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  compareAtPrice,
  images,
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

  const mainImage = images[0] || '';
  const secondaryImage = images[1] || mainImage;
  const currentImage = isHovered && secondaryImage ? secondaryImage : mainImage;

  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
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
        borderRadius: '16px',
        border: '1px solid #f3f4f6',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.06)' : 'none',
        fontFamily: 'inherit',
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/5',
          backgroundColor: '#f9fafb',
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        <img
          src={currentImage}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px',
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
              bottom: '10px',
              left: '10px',
              backgroundColor: 'rgba(220, 38, 38, 0.9)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px',
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
              onToggleWishlist();
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              backgroundColor: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isWishlisted ? '#f43f5e' : 'none'}
              stroke={isWishlisted ? '#f43f5e' : '#4b5563'}
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
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {brand && (
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>
            {brand}
          </span>
        )}

        <h3
          onClick={onClick}
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#111827',
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
          <StarRating rating={rating} reviewCount={reviewCount} size={13} />
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>₹{price}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through' }}>
              ₹{compareAtPrice}
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
              onAddToCart();
            }}
            style={{
              marginTop: '4px',
              width: '100%',
              backgroundColor: inStock ? '#000000' : '#9ca3af',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '12px',
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
