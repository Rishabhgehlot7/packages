import * as React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = false,
  color = '#2563eb',
  height = 8,
  className = '',
}) => {
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
      }}
    >
      {(label || showPercentage) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 500, color: '#334155' }}>
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(clamped)}%</span>}
        </div>
      )}

      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#e2e8f0',
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
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};


ProgressBar.displayName = 'ProgressBar';
