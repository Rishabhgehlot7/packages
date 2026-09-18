import * as React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className = '',
  style,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={`boost-divider-v ${className}`}
        style={{
          display: 'inline-block',
          width: '1px',
          height: '100%',
          minHeight: '20px',
          backgroundColor: '#e2e8f0',
          margin: '0 8px',
          verticalAlign: 'middle',
          ...style,
        }}
      />
    );
  }

  if (label) {
    return (
      <div
        className={`boost-divider-labeled ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          margin: '16px 0',
          ...style,
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
      </div>
    );
  }

  return (
    <hr
      className={`boost-divider-h ${className}`}
      style={{
        border: 'none',
        height: '1px',
        backgroundColor: '#e2e8f0',
        width: '100%',
        margin: '16px 0',
        ...style,
      }}
    />
  );
};


Divider.displayName = 'Divider';
