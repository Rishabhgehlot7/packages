import * as React from 'react';


/**
 * LoaderProps — Properties for the loading spinner component.
 */
export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'var(--boost-primary, #2563eb)',
  text,
  className = '',
  style,
}) => {
  const getDimension = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm': return 18;
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
        ...style,
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
        <span
          style={{
            fontSize: size === 'sm' ? '12px' : '13.5px',
            color: 'var(--boost-text-muted, #64748b)',
            fontWeight: 500,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

Loader.displayName = 'Loader';
