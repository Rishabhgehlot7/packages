import * as React from 'react';
import { StarRating } from './StarRating';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface ProductCardProps {
  id?: string;
  title?: string;
  price?: number;
  currencySymbol?: string;
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
  stylePreset?: UIStylePreset;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id = '',
  title = 'Product',
  price = 0,
  currencySymbol = '$',
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
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
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

  const getPresetCardStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '3px solid var(--boost-border, #000000)',
          borderRadius: '2px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          boxShadow: isHovered ? '6px 6px 0px var(--boost-border, #000000)' : '4px 4px 0px var(--boost-border, #000000)',
          transform: isHovered ? 'translate(-2px, -2px)' : 'none',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.85))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--boost-glass-border, rgba(255, 255, 255, 0.25))',
          borderRadius: '16px',
          boxShadow: isHovered ? '0 14px 32px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
          transform: isHovered ? 'translateY(-4px)' : 'none',
        };
      case 'neumorphism':
        return {
          backgroundColor: 'var(--boost-surface, #e8ebf0)',
          border: 'none',
          borderRadius: '20px',
          boxShadow: isHovered
            ? 'var(--card-shadow-hover, 8px 8px 18px #c5cad3, -8px -8px 18px #ffffff)'
            : 'var(--card-shadow, 6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff)',
          transform: isHovered ? 'translateY(-2px)' : 'none',
        };
      case 'gradient-glow':
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '16px',
          boxShadow: isHovered
            ? '0 0 30px rgba(99, 102, 241, 0.4)'
            : '0 0 16px rgba(99, 102, 241, 0.2)',
          transform: isHovered ? 'translateY(-4px)' : 'none',
        };
      case 'material-you':
        return {
          backgroundColor: 'var(--boost-surface, #f8fafc)',
          borderRadius: '24px',
          border: 'none',
          boxShadow: isHovered ? '0 6px 20px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.06)',
          transform: isHovered ? 'translateY(-3px)' : 'none',
        };
      case 'dark-first':
        return {
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.6)' : '0 4px 16px rgba(0, 0, 0, 0.4)',
          transform: isHovered ? 'translateY(-4px)' : 'none',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          borderRadius: 'var(--boost-radius, 14px)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          boxShadow: isHovered
            ? 'var(--boost-shadow-lg, 0 14px 28px rgba(0, 0, 0, 0.08))'
            : 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04))',
          transform: isHovered ? 'translateY(-4px)' : 'none',
        };
    }
  };

  const getPresetBadgeStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          borderRadius: '0px',
          border: '2px solid var(--boost-border, #000000)',
          boxShadow: '2px 2px 0px var(--boost-border, #000000)',
        };
      case 'glassmorphism':
        return {
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '9999px',
        };
      case 'material-you':
      default:
        return {
          borderRadius: '9999px',
        };
    }
  };

  const getPresetButtonStyles = (): React.CSSProperties => {
    if (!inStock) {
      return {
        backgroundColor: 'var(--boost-border, #cbd5e1)',
        color: 'var(--boost-text-muted, #64748b)',
        borderRadius: '10px',
      };
    }
    switch (preset) {
      case 'neo-brutalism':
        return {
          backgroundColor: 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          border: '2px solid var(--boost-border, #000000)',
          borderRadius: '0px',
          boxShadow: '3px 3px 0px var(--boost-border, #000000)',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'rgba(37, 99, 235, 0.85)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
        };
      case 'neumorphism':
        return {
          backgroundColor: 'var(--boost-surface, #e8ebf0)',
          color: 'var(--boost-primary, #2563eb)',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '4px 4px 8px #c5cad3, -4px -4px 8px #ffffff',
          fontWeight: 700,
        };
      case 'gradient-glow':
        return {
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
          fontWeight: 700,
        };
      case 'material-you':
        return {
          backgroundColor: 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          fontWeight: 700,
        };
      case 'dark-first':
        return {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          borderRadius: '10px',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))',
        };
    }
  };

  return (
    <div
      className={`boost-product-card boost-product-card-preset-${preset} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
        fontFamily: 'inherit',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        ...getPresetCardStyles(),
      }}
    >
      <style>{`
        :root[data-theme="dark"] .boost-product-card {
          background-color: #0f172a;
          border-color: rgba(255, 255, 255, 0.1);
        }
        :root[data-theme="dark"] .boost-product-card-preset-neo-brutalism {
          background-color: #18181b !important;
          border-color: #f8fafc !important;
          box-shadow: 4px 4px 0px #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-product-card-preset-glassmorphism {
          background-color: rgba(15, 23, 42, 0.85) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        :root[data-theme="dark"] .boost-product-card-preset-neumorphism {
          background-color: #0f172a !important;
          box-shadow: 6px 6px 14px #090d15, -6px -6px 14px #151d2c !important;
        }
        :root[data-theme="dark"] .boost-product-card-preset-gradient-glow {
          background-color: #0f172a !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.3) !important;
        }
      `}</style>
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
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)',
              zIndex: 2,
              ...getPresetBadgeStyles(),
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
              {currencySymbol}{price}
            </span>
            {effectiveOriginalPrice && effectiveOriginalPrice > price && (
              <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #94a3b8)', textDecoration: 'line-through' }}>
                {currencySymbol}{effectiveOriginalPrice}
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
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: inStock ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
                ...getPresetButtonStyles(),
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
