import * as React from 'react';

export interface KPIWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number | string; // e.g. 12.5, "+12.5%", or -4.2
  changePeriod?: string; // e.g. "vs last month"
  icon?: React.ReactNode;
  subtitle?: string;
  sparkline?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs last month',
  icon,
  subtitle,
  sparkline,
  className = '',
  style,
  ...props
}) => {
  const numericChange = typeof change === 'string' ? parseFloat(change.replace('%', '').replace('+', '')) : change;
  const isPositive = numericChange !== undefined && !isNaN(numericChange) ? numericChange >= 0 : undefined;

  return (
    <div
      className={`boost-kpi-widget ${className}`}
      style={{
        padding: '24px',
        borderRadius: 'var(--boost-radius, 14px)',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--boost-text-muted, #64748b)',
          }}
        >
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              color: 'var(--boost-primary, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: 'var(--boost-text, #0f172a)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {numericChange !== undefined && !isNaN(numericChange) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '12px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: isPositive ? '#16a34a' : '#dc2626',
              }}
            >
              {isPositive ? '▲ +' : '▼ '}
              {Math.abs(numericChange)}%
            </span>
            {changePeriod && (
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--boost-text-muted, #94a3b8)',
                }}
              >
                {changePeriod}
              </span>
            )}
          </div>
        )}

        {subtitle && !change && (
          <span
            style={{
              fontSize: '12px',
              color: 'var(--boost-text-muted, #94a3b8)',
            }}
          >
            {subtitle}
          </span>
        )}

        {sparkline && <div>{sparkline}</div>}
      </div>
    </div>
  );
};


KPIWidget.displayName = 'KPIWidget';
