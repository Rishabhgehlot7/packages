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
  style?: React.CSSProperties;
}

export const ReviewBreakdownBars: React.FC<ReviewBreakdownBarsProps> = ({
  averageRating,
  totalReviews,
  breakdown,
  onFilterByStar,
  selectedStar = null,
  className = '',
  style,
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
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '40px',
        padding: '32px',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        borderRadius: '24px',
        border: '1px solid var(--boost-border, rgba(0,0,0,0.05))',
        boxShadow: '0 20px 40px -20px var(--boost-shadow, rgba(0,0,0,0.05))',
        fontFamily: 'inherit',
        width: '100%',
        ...style,
      }}
    >
      <style>
        {`
          .boost-review-left {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1 1 200px; /* Flex grow, shrink, and basis */
            text-align: center;
          }
          .boost-review-score {
            font-size: 56px;
            font-weight: 800;
            color: var(--boost-text-primary, #0f172a);
            line-height: 1;
            letter-spacing: -0.03em;
            margin-bottom: 12px;
          }
          .boost-review-stars {
            display: flex;
            justify-content: center;
            margin-bottom: 8px;
          }
          .boost-review-total {
            font-size: 13px;
            color: var(--boost-text-muted, #64748b);
            font-weight: 500;
          }
          
          .boost-review-right {
            flex: 2 1 300px; /* Take up more space, wrap if < 300px */
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .boost-review-row {
            display: flex;
            align-items: center;
            gap: 16px;
            transition: opacity 0.2s ease, transform 0.2s ease;
          }
          .boost-review-row:hover {
            transform: translateX(2px);
          }
          
          .boost-review-star-label {
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 44px;
            font-size: 14px;
            font-weight: 600;
            color: var(--boost-text-primary, #334155);
          }
          
          .boost-review-track {
            flex: 1;
            height: 10px;
            background-color: var(--boost-bg-muted, #f1f5f9);
            border-radius: 9999px;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
            min-width: 100px; /* Ensure track never disappears completely */
          }
          
          .boost-review-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
          }
          .boost-review-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
            border-radius: inherit;
          }
          
          .boost-review-percent {
            min-width: 40px;
            text-align: right;
            font-size: 13px;
            color: var(--boost-text-secondary, #475569);
            font-weight: 600;
            font-variant-numeric: tabular-nums;
          }

          /* Dark Mode Tweaks */
          :root[data-theme="dark"] .boost-review-track,
          .dark .boost-review-track {
            background-color: rgba(255, 255, 255, 0.05);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
          }
        `}
      </style>

      {/* Left rating summary */}
      <div className="boost-review-left">
        <span className="boost-review-score">
          {safeRating.toFixed(1)}
        </span>
        <div className="boost-review-stars">
          <StarRating rating={safeRating} size={24} />
        </div>
        <span className="boost-review-total">
          Based on {safeTotal.toLocaleString()} reviews
        </span>
      </div>

      {/* Right progress bars */}
      <div className="boost-review-right">
        {rows.map(({ star, count }) => {
          const percent = safeTotal > 0 ? Math.round((count / safeTotal) * 100) : 0;
          const isSelected = selectedStar === star;
          
          // Use theme variables if available, otherwise fallback to premium colors
          const fillColor = star >= 4 
            ? 'var(--boost-success, #10b981)' 
            : star === 3 
              ? 'var(--boost-warning, #f59e0b)' 
              : 'var(--boost-danger, #ef4444)';

          return (
            <div
              key={star}
              className="boost-review-row"
              onClick={() => onFilterByStar && onFilterByStar(star)}
              role={onFilterByStar ? 'button' : undefined}
              tabIndex={onFilterByStar ? 0 : undefined}
              style={{
                cursor: onFilterByStar ? 'pointer' : 'default',
                opacity: selectedStar !== null && !isSelected ? 0.35 : 1,
              }}
            >
              <div className="boost-review-star-label">
                <span>{star}</span>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--boost-warning, #f59e0b)" style={{ filter: 'drop-shadow(0 1px 2px rgba(245, 158, 11, 0.2))' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              {/* Progress track */}
              <div className="boost-review-track">
                <div
                  className="boost-review-fill"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: fillColor,
                  }}
                />
              </div>

              {/* Percentage */}
              <span className="boost-review-percent">
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
