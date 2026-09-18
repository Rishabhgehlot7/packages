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
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        borderRadius: 'var(--boost-radius, 16px)',
        padding: 'clamp(16px, 2.5vw, 22px)',
        fontFamily: 'inherit',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text-muted, #64748b)' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--boost-bg, #f1f5f9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--boost-primary, #2563eb)',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, color: 'var(--boost-text, #0f172a)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span
            style={{
              fontWeight: 700,
              color: isPositive ? '#16a34a' : '#dc2626',
              backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 38, 38, 0.1)',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            {isPositive ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {change}
          </span>
          <span style={{ color: 'var(--boost-text-muted, #94a3b8)' }}>{period}</span>
        </div>
      )}
    </div>
  );
};


StatsCard.displayName = 'StatsCard';
