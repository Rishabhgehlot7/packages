import * as React from 'react';


/**
 * TrustBadgesProps — Properties for trust/payment badge displays.
 */
export interface TrustBadgesProps {
  layout?: 'row' | 'grid';
  showCodBadge?: boolean;
  showReturnsBadge?: boolean;
  showSecureBadge?: boolean;
  showGenuineBadge?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  layout = 'row',
  showCodBadge = true,
  showReturnsBadge = true,
  showSecureBadge = true,
  showGenuineBadge = true,
  className = '',
  style,
}) => {
  return (
    <div
      className={`boost-trust-badges boost-layout-${layout} ${className}`}
      style={{
        backgroundColor: 'var(--boost-surface, #f8fafc)',
        borderRadius: '16px',
        border: '1px solid var(--boost-border, rgba(0,0,0,0.06))',
        padding: '20px',
        margin: '16px 0',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      <style>
        {`
          .boost-trust-badges {
            transition: all 0.2s ease;
          }
          
          /* Grid Layout */
          .boost-trust-badges.boost-layout-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
            gap: 20px;
            align-items: start;
          }

          @media (max-width: 580px) {
            .boost-trust-badges.boost-layout-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
              padding: 16px !important;
            }
          }
          
          /* Row Layout */
          .boost-trust-badges.boost-layout-row {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            align-items: center;
            justify-content: center;
          }

          .boost-badge-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--boost-text-primary, #334155);
            font-size: 13px;
            font-weight: 600;
            line-height: 1.3;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .boost-badge-item:hover {
            transform: translateY(-2px);
          }

          .boost-badge-item:hover .boost-badge-icon-wrapper {
            transform: scale(1.08);
            box-shadow: 0 6px 16px rgba(0,0,0,0.08);
          }
          
          .boost-layout-grid .boost-badge-item {
            flex-direction: column;
            text-align: center;
            justify-content: center;
          }

          .boost-badge-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: var(--boost-bg-muted, #ffffff);
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            border: 1px solid var(--boost-border, rgba(0,0,0,0.05));
            flex-shrink: 0;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .boost-layout-row .boost-layout-grid-only {
            display: none;
          }

          /* Dark Mode Tweaks */
          :root[data-theme="dark"] .boost-trust-badges,
          .dark .boost-trust-badges {
            background-color: var(--boost-surface, #1e293b);
          }
          :root[data-theme="dark"] .boost-badge-icon-wrapper,
          .dark .boost-badge-icon-wrapper {
            background: rgba(255,255,255,0.04);
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border-color: rgba(255,255,255,0.08);
          }
        `}
      </style>

      {showGenuineBadge && (
        <div className="boost-badge-item">
          <div className="boost-badge-icon-wrapper" style={{ color: 'var(--boost-success, #10b981)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span>100%<br className="boost-layout-grid-only" /> Genuine</span>
        </div>
      )}

      {showReturnsBadge && (
        <div className="boost-badge-item">
          <div className="boost-badge-icon-wrapper" style={{ color: 'var(--boost-primary, #3b82f6)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </div>
          <span>7-Day<br className="boost-layout-grid-only" /> Easy Returns</span>
        </div>
      )}

      {showCodBadge && (
        <div className="boost-badge-item">
          <div className="boost-badge-icon-wrapper" style={{ color: 'var(--boost-warning, #f59e0b)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <span>COD<br className="boost-layout-grid-only" /> Available</span>
        </div>
      )}

      {showSecureBadge && (
        <div className="boost-badge-item">
          <div className="boost-badge-icon-wrapper" style={{ color: 'var(--boost-danger, #ef4444)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <span>256-Bit SSL<br className="boost-layout-grid-only" /> Secure</span>
        </div>
      )}
    </div>
  );
};

TrustBadges.displayName = 'TrustBadges';
