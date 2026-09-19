import * as React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  showPercent?: boolean;
  color?: string;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage,
  showPercent,
  color = 'var(--boost-primary, #2563eb)',
  height = 8,
  className = '',
  style,
}) => {
  const shouldShowPercent = showPercent !== undefined ? showPercent : Boolean(showPercentage);
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`boost-progress-bar ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {(label || shouldShowPercent) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12.5px',
            fontWeight: 500,
            color: 'var(--boost-text, #334155)',
          }}
        >
          {label && <span>{label}</span>}
          {shouldShowPercent && (
            <span style={{ color: 'var(--boost-text-muted, #64748b)', fontWeight: 600 }}>
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}

      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'var(--boost-surface-secondary, #e2e8f0)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '9999px',
            transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
