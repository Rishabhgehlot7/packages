import * as React from 'react';

export interface BarChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  color?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  showGrid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BarChart: React.FC<BarChartProps> = ({
  data = [],
  title,
  subtitle,
  height = 240,
  color = '#3b82f6',
  secondaryColor = '#94a3b8',
  primaryLabel = 'Current',
  secondaryLabel = 'Previous',
  valuePrefix = '',
  valueSuffix = '',
  showGrid = true,
  className = '',
  style,
}) => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--boost-text-muted, #94a3b8)',
          fontSize: '13px',
          fontFamily: 'inherit',
        }}
      >
        No chart data available
      </div>
    );
  }

  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);
  const allValues = data.flatMap((d) => [d.value, d.secondaryValue || 0]);
  const rawMax = Math.max(...allValues);
  const max = rawMax === 0 ? 10 : rawMax * 1.15;

  const width = 600;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 40;
  const paddingRight = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const barGroupWidth = chartWidth / data.length;
  const barWidth = hasSecondary ? Math.min(22, barGroupWidth * 0.35) : Math.min(36, barGroupWidth * 0.55);

  const getY = (val: number) => paddingTop + chartHeight - (val / max) * chartHeight;
  const getBarHeight = (val: number) => (val / max) * chartHeight;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return Math.round(num).toString();
  };

  const gridSteps = [0, 0.33, 0.66, 1];

  return (
    <div
      className={`boost-bar-chart ${className}`}
      style={{
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        borderRadius: 'var(--boost-radius, 16px)',
        padding: '20px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        width: '100%',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            {title && (
              <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--boost-text, #0f172a)', letterSpacing: '-0.01em' }}>
                {title}
              </h4>
            )}
            {subtitle && (
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #64748b)' }}>
                {subtitle}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--boost-text, #0f172a)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: color }} />
              {primaryLabel}
            </span>
            {hasSecondary && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--boost-text-muted, #64748b)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: secondaryColor }} />
                {secondaryLabel}
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Grid lines */}
          {showGrid &&
            gridSteps.map((step, idx) => {
              const yVal = (1 - step) * max;
              const yPos = paddingTop + step * chartHeight;
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={width - paddingRight}
                    y2={yPos}
                    stroke="var(--boost-border, #e2e8f0)"
                    strokeDasharray={step === 1 ? 'none' : '3 3'}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={yPos + 4}
                    textAnchor="end"
                    fill="var(--boost-text-muted, #94a3b8)"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {valuePrefix}{formatNumber(yVal)}
                  </text>
                </g>
              );
            })}

          {/* Bars */}
          {data.map((d, i) => {
            const groupX = paddingLeft + i * barGroupWidth;
            const centerX = groupX + barGroupWidth / 2;
            const isHovered = hoverIndex === i;

            const primaryHeight = getBarHeight(d.value);
            const primaryY = getY(d.value);

            const primaryX = hasSecondary ? centerX - barWidth - 2 : centerX - barWidth / 2;
            const secondaryX = centerX + 2;

            return (
              <g key={i}>
                {/* Primary Bar */}
                <rect
                  x={primaryX}
                  y={primaryY}
                  width={barWidth}
                  height={primaryHeight}
                  rx="4"
                  ry="4"
                  fill={color}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Secondary Bar */}
                {hasSecondary && d.secondaryValue !== undefined && (
                  <rect
                    x={secondaryX}
                    y={getY(d.secondaryValue)}
                    width={barWidth}
                    height={getBarHeight(d.secondaryValue)}
                    rx="4"
                    ry="4"
                    fill={secondaryColor}
                    opacity={isHovered ? 0.9 : 0.65}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                )}

                {/* X Axis Label */}
                <text
                  x={centerX}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? 'var(--boost-primary, #3b82f6)' : 'var(--boost-text-muted, #64748b)'}
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                >
                  {d.label}
                </text>

                {/* Hover trigger zone */}
                <rect
                  x={groupX}
                  y={0}
                  width={barGroupWidth}
                  height={height}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoverIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: `${getY(data[hoverIndex].value) - 45}px`,
              left: `${((paddingLeft + hoverIndex * barGroupWidth + barGroupWidth / 2) / width) * 100}%`,
              transform: 'translate(-50%, -100%)',
              backgroundColor: 'var(--boost-text, #0f172a)',
              color: 'var(--boost-surface, #ffffff)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--boost-shadow-md, 0 4px 12px rgba(0,0,0,0.15))',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              animation: 'boost-fadeIn 0.15s ease',
            }}
          >
            <span style={{ fontSize: '10px', opacity: 0.8, textTransform: 'uppercase' }}>
              {data[hoverIndex].label}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#60a5fa' }}>
              {primaryLabel}: {valuePrefix}{data[hoverIndex].value.toLocaleString()}{valueSuffix}
            </span>
            {hasSecondary && data[hoverIndex].secondaryValue !== undefined && (
              <span style={{ fontSize: '11px', opacity: 0.8 }}>
                {secondaryLabel}: {valuePrefix}{data[hoverIndex].secondaryValue?.toLocaleString()}{valueSuffix}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

BarChart.displayName = 'BarChart';
