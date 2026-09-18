import * as React from 'react';

export interface StarRatingProps {
  rating: number; // 0 to 5, e.g. 4.8
  reviewCount?: number;
  size?: number;
  color?: string;
  showText?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 16,
  color = '#f59e0b', // Amber-500 gold
  showText = true,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(5, rating));

  return (
    <div
      className={`boost-star-rating ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}
    >
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = clamped >= star;
          const isHalf = !isFilled && clamped >= star - 0.5;

          return (
            <svg
              key={star}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={isFilled ? color : isHalf ? 'url(#half-star)' : 'none'}
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="half-star">
                  <stop offset="50%" stopColor={color} />
                  <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                </linearGradient>
              </defs>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        })}
      </div>

      {showText && (
        <span style={{ fontSize: `${size * 0.85}px`, fontWeight: 600, color: '#374151', marginLeft: '4px' }}>
          {clamped.toFixed(1)}
          {reviewCount !== undefined && (
            <span style={{ color: '#6b7280', fontWeight: 400, marginLeft: '2px' }}>({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};


StarRating.displayName = 'StarRating';
