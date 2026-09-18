import * as React from 'react';

export interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  actionText?: string;
  onAction?: () => void;
}

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  align?: 'left' | 'center';
  className?: string;
  style?: React.CSSProperties;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 3,
  align = 'left',
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`boost-feature-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${columns === 2 ? '340px' : '280px'}), 1fr))`,
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="boost-feature-card"
          style={{
            boxSizing: 'border-box',
            padding: '28px',
            borderRadius: 'var(--boost-radius, 12px)',
            backgroundColor: 'var(--boost-surface, #f8fafc)',
            border: '1px solid var(--boost-border, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : 'flex-start',
            textAlign: align,
            transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {feature.icon && (
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--boost-primary, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                fontSize: '22px',
              }}
            >
              {feature.icon}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--boost-text, #0f172a)',
              }}
            >
              {feature.title}
            </h3>
            {feature.badge && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--boost-primary, #2563eb)',
                  textTransform: 'uppercase',
                }}
              >
                {feature.badge}
              </span>
            )}
          </div>

          <p
            style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'var(--boost-text-muted, #64748b)',
              flex: 1,
            }}
          >
            {feature.description}
          </p>

          {feature.actionText && (
            <button
              type="button"
              onClick={feature.onAction}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--boost-primary, #2563eb)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {feature.actionText} →
            </button>
          )}
        </div>
      ))}
    </div>
  );
};


FeatureGrid.displayName = 'FeatureGrid';
