import * as React from 'react';

export interface DonutDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutDataPoint[];
  title?: string;
  subtitle?: string;
  size?: number;
  innerRadiusRatio?: number; // 0 for Pie, 0.65 for Donut
  centerLabel?: string;
  centerValue?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  showLegend?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export const DonutChart: React.FC<DonutChartProps> = ({
  data = [],
  title,
  subtitle,
  size = 220,
  innerRadiusRatio = 0.65,
  centerLabel,
  centerValue,
  valuePrefix = '',
  valueSuffix = '',
  showLegend = true,
  className = '',
  style,
}) => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--boost-text-muted, #94a3b8)',
          fontSize: '13px',
          fontFamily: 'inherit',
        }}
      >
        No chart data available
      </div>
    );
  }

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;

  const center = size / 2;
  const radius = (size / 2) * 0.85;
  const innerRadius = radius * innerRadiusRatio;

  // Compute slices angles
  let cumulativeAngle = -Math.PI / 2; // start from top (12 o'clock)

  const slices = data.map((d, index) => {
    const sliceAngle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    const sliceColor = d.color || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
    const isHovered = hoverIndex === index;

    // Outer arc points
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    // Inner arc points
    const x3 = center + innerRadius * Math.cos(endAngle);
    const y3 = center + innerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(startAngle);
    const y4 = center + innerRadius * Math.sin(startAngle);

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    // SVG path definition
    const pathD = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;

    const percentage = ((d.value / total) * 100).toFixed(1);

    return {
      ...d,
      pathD,
      color: sliceColor,
      percentage,
      isHovered,
    };
  });

  const activeSlice = hoverIndex !== null ? slices[hoverIndex] : null;

  return (
    <div
      className={`boost-donut-chart ${className}`}
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
      <style>
        {`
          :root[data-theme="dark"] .boost-donut-chart,
          .dark .boost-donut-chart {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
        `}
      </style>
      {(title || subtitle) && (
        <div style={{ marginBottom: '16px' }}>
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
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        {/* SVG Donut / Pie */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {slices.map((slice, i) => (
              <path
                key={i}
                d={slice.pathD}
                fill={slice.color}
                opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.45}
                transform={slice.isHovered ? `scale(1.04) translate(-${center * 0.04}, -${center * 0.04})` : undefined}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                }}
                onMouseEnter={() => setHoverIndex(i)}
              />
            ))}
          </svg>

          {/* Center Label (Inside Donut Hole) */}
          {innerRadiusRatio > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
                maxWidth: `${innerRadius * 1.6}px`,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--boost-text-muted, #94a3b8)', textTransform: 'uppercase' }}>
                {activeSlice ? activeSlice.label : centerLabel || 'Total'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--boost-text, #0f172a)', letterSpacing: '-0.02em', marginTop: '2px' }}>
                {activeSlice
                  ? `${valuePrefix}${activeSlice.value.toLocaleString()}${valueSuffix}`
                  : centerValue || `${valuePrefix}${total.toLocaleString()}${valueSuffix}`}
              </div>
              {activeSlice && (
                <div style={{ fontSize: '11px', fontWeight: 700, color: activeSlice.color }}>
                  {activeSlice.percentage}%
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
            {slices.map((slice, i) => {
              const isHovered = hoverIndex === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: isHovered ? 'var(--boost-bg, #f1f5f9)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: slice.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--boost-text, #0f172a)' }}>
                      {slice.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--boost-text, #0f172a)' }}>
                      {valuePrefix}{slice.value.toLocaleString()}{valueSuffix}
                    </span>
                    <span style={{ color: 'var(--boost-text-muted, #94a3b8)', fontSize: '11px' }}>
                      ({slice.percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

DonutChart.displayName = 'DonutChart';
