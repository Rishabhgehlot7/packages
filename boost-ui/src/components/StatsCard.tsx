import * as React from 'react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  isPositive?: boolean;
  period?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  period = 'vs last month',
  icon,
  className = '',
}) => {
  return (
    <div
      className={`boost-stats-card ${className}`}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '20px',
        fontFamily: 'inherit',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
        {value}
      </div>

      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span
            style={{
              fontWeight: 600,
              color: isPositive ? '#16a34a' : '#dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {isPositive ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {change}
          </span>
          <span style={{ color: '#94a3b8' }}>{period}</span>
        </div>
      )}
    </div>
  );
};


StatsCard.displayName = 'StatsCard';
