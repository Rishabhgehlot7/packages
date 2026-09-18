import * as React from 'react';
import { StarRating } from './StarRating';

export interface ReviewBreakdownItem {
  star: number;
  count: number;
}

export interface ReviewBreakdownBarsProps {
  averageRating?: number;
  totalReviews?: number;
  breakdown: Record<number, number> | ReviewBreakdownItem[] | any[];
  onFilterByStar?: (star: number) => void;
  selectedStar?: number | null;
  className?: string;
}

export const ReviewBreakdownBars: React.FC<ReviewBreakdownBarsProps> = ({
  averageRating,
  totalReviews,
  breakdown,
  onFilterByStar,
  selectedStar = null,
  className = '',
}) => {
  // Normalize breakdown to array [5, 4, 3, 2, 1]
  const rows: ReviewBreakdownItem[] = [5, 4, 3, 2, 1].map((star) => {
    let count = 0;
    if (Array.isArray(breakdown)) {
      const item = (breakdown as any[]).find((b) => (b.star === star || b.stars === star));
      count = item ? (item.count || item.percentage || 0) : 0;
    } else if (breakdown && typeof breakdown === 'object') {
      count = (breakdown as Record<number, number>)[star] || 0;
    }
    return { star, count };
  });

  const computedTotal = rows.reduce((sum, r) => sum + r.count, 0);
  const safeTotal = typeof totalReviews === 'number' ? totalReviews : (computedTotal || 100);
  const safeRating = typeof averageRating === 'number' ? averageRating : 4.7;

  return (
    <div
      className={`boost-review-breakdown ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '32px',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #f3f4f6',
      }}
    >
      {/* Left rating summary */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '140px',
          padding: '12px 16px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '48px',
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {safeRating.toFixed(1)}
        </span>
        <div style={{ marginTop: '8px' }}>
          <StarRating rating={safeRating} size={20} />
        </div>
        <span
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '8px',
            fontWeight: 500,
          }}
        >
          Based on {safeTotal.toLocaleString()} reviews
        </span>
      </div>

      {/* Right progress bars */}
      <div
        style={{
          flex: 1,
          minWidth: '220px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {rows.map(({ star, count }) => {
          const percent = safeTotal > 0 ? Math.round((count / safeTotal) * 100) : 0;
          const isSelected = selectedStar === star;

          return (
            <div
              key={star}
              onClick={() => onFilterByStar && onFilterByStar(star)}
              role={onFilterByStar ? 'button' : undefined}
              tabIndex={onFilterByStar ? 0 : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: onFilterByStar ? 'pointer' : 'default',
                opacity: selectedStar !== null && !isSelected ? 0.45 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '42px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                <span>{star}</span>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="#f59e0b">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              {/* Progress track */}
              <div
                style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    backgroundColor: star >= 4 ? '#10b981' : star === 3 ? '#f59e0b' : '#ef4444',
                    borderRadius: '9999px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>

              {/* Percentage / Count */}
              <span
                style={{
                  minWidth: '38px',
                  textAlign: 'right',
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


ReviewBreakdownBars.displayName = 'ReviewBreakdownBars';
