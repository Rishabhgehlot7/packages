import * as React from 'react';

export interface SparklineProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showFill?: boolean;
  autoColor?: boolean; // If true, green for trending up, red for trending down
  className?: string;
  style?: React.CSSProperties;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data = [],
  width = '100%',
  height = 36,
  color,
  strokeWidth = 2,
  showFill = true,
  autoColor = true,
  className = '',
  style,
}) => {
  if (!data || data.length < 2) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const svgWidth = 120;
  const svgHeight = height;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((val - min) / range) * (svgHeight - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const firstPoint = points[0].split(',');
  const lastPoint = points[points.length - 1].split(',');
  const areaD = `M ${firstPoint[0]},${svgHeight} L ${points.join(' L ')} L ${lastPoint[0]},${svgHeight} Z`;

  const isUp = data[data.length - 1] >= data[0];
  const chartColor = color || (autoColor ? (isUp ? '#10b981' : '#ef4444') : '#3b82f6');
  const rawId = React.useId();
  const gradientId = `boost-spark-${rawId.replace(/:/g, '')}`;

  return (
    <div
      className={`boost-sparkline ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
        overflow: 'visible',
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {showFill && <path d={areaD} fill={`url(#${gradientId})`} />}
        <path
          d={pathD}
          fill="none"
          stroke={chartColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End pulse dot */}
        <circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r={2.5}
          fill={chartColor}
        />
      </svg>
    </div>
  );
};

Sparkline.displayName = 'Sparkline';
