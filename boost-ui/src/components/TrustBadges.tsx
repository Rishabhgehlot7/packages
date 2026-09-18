import * as React from 'react';

export interface TrustBadgesProps {
  layout?: 'row' | 'grid';
  showCodBadge?: boolean;
  showReturnsBadge?: boolean;
  showSecureBadge?: boolean;
  showGenuineBadge?: boolean;
  className?: string;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  layout = 'row',
  showCodBadge = true,
  showReturnsBadge = true,
  showSecureBadge = true,
  showGenuineBadge = true,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: layout === 'grid' ? 'space-between' : 'flex-start',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #f3f4f6',
    margin: '12px 0',
  };

  const badgeItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#374151',
  };

  return (
    <div style={containerStyle} className={`boost-trust-badges ${className}`}>
      {showGenuineBadge && (
        <div style={badgeItemStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>100% Genuine</span>
        </div>
      )}

      {showReturnsBadge && (
        <div style={badgeItemStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          <span>7-Day Easy Returns</span>
        </div>
      )}

      {showCodBadge && (
        <div style={badgeItemStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          <span>COD Available</span>
        </div>
      )}

      {showSecureBadge && (
        <div style={badgeItemStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>256-Bit SSL Secure</span>
        </div>
      )}
    </div>
  );
};


TrustBadges.displayName = 'TrustBadges';
