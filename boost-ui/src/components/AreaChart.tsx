import * as React from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface AreaChartProps {
  data: ChartDataPoint[];
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
  showDots?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AreaChart: React.FC<AreaChartProps> = ({
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
  showDots = true,
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

  const allValues = data.flatMap((d) => [d.value, d.secondaryValue !== undefined ? d.secondaryValue : d.value]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const min = rawMin > 0 ? 0 : rawMin;
  const max = rawMax === min ? min + 10 : rawMax * 1.1; // Add 10% ceiling headroom
  const range = max - min || 1;

  const width = 600;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 40;
  const paddingRight = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / (data.length - 1 || 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - min) / range) * chartHeight;

  // Primary Path
  const primaryPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.value).toFixed(1)}`);
  const primaryPathD = `M ${primaryPoints.join(' L ')}`;
  const primaryAreaD = `M ${getX(0)},${paddingTop + chartHeight} L ${primaryPoints.join(' L ')} L ${getX(data.length - 1)},${paddingTop + chartHeight} Z`;

  // Secondary Path (if any)
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);
  const secondaryPoints = hasSecondary
    ? data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.secondaryValue || 0).toFixed(1)}`)
    : [];
  const secondaryPathD = hasSecondary ? `M ${secondaryPoints.join(' L ')}` : '';

  const rawId = React.useId();
  const gradientId = `boost-area-${rawId.replace(/:/g, '')}`;

  // Grid steps (4 horizontal lines)
  const gridSteps = [0, 0.33, 0.66, 1];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return Math.round(num).toString();
  };

  return (
    <div
      className={`boost-area-chart ${className}`}
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
          :root[data-theme="dark"] .boost-area-chart,
          .dark .boost-area-chart {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
        `}
      </style>
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
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
              {primaryLabel}
            </span>
            {hasSecondary && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--boost-text-muted, #64748b)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: secondaryColor }} />
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
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis values */}
          {showGrid &&
            gridSteps.map((step, idx) => {
              const yVal = min + (1 - step) * range;
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

          {/* Area Fill */}
          <path d={primaryAreaD} fill={`url(#${gradientId})`} />

          {/* Secondary Line (if available) */}
          {hasSecondary && (
            <path
              d={secondaryPathD}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* Primary Line */}
          <path
            d={primaryPathD}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Vertical Guide */}
          {hoverIndex !== null && (
            <line
              x1={getX(hoverIndex)}
              y1={paddingTop}
              x2={getX(hoverIndex)}
              y2={paddingTop + chartHeight}
              stroke="var(--boost-text-muted, #94a3b8)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Data Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.value);
            const isHovered = hoverIndex === i;

            return (
              <g key={i}>
                {showDots && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5 : 3.5}
                    fill="var(--boost-surface, #ffffff)"
                    stroke={color}
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                )}

                {/* X Axis Labels */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? 'var(--boost-primary, #3b82f6)' : 'var(--boost-text-muted, #64748b)'}
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                >
                  {d.label}
                </text>

                {/* Hover trigger invisible rect */}
                <rect
                  x={x - chartWidth / (data.length * 2)}
                  y={0}
                  width={chartWidth / data.length}
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
              left: `${(getX(hoverIndex) / width) * 100}%`,
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
              {valuePrefix}{data[hoverIndex].value.toLocaleString()}{valueSuffix}
            </span>
            {data[hoverIndex].secondaryValue !== undefined && (
              <span style={{ fontSize: '11px', opacity: 0.7 }}>
                Prev: {valuePrefix}{data[hoverIndex].secondaryValue?.toLocaleString()}{valueSuffix}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

AreaChart.displayName = 'AreaChart';
