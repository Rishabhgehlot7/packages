import * as React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = '#2563eb',
  text,
  className = '',
}) => {
  const getDimension = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 36;
      case 'md':
      default: return 24;
    }
  };

  const dim = getDimension();

  return (
    <div
      className={`boost-loader ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'inherit',
      }}
    >
      <style>{`
        @keyframes boost-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ animation: 'boost-spin 0.8s linear infinite' }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>

      {text && (
        <span style={{ fontSize: size === 'sm' ? '12px' : '14px', color: '#64748b' }}>
          {text}
        </span>
      )}
    </div>
  );
};


Loader.displayName = 'Loader';
