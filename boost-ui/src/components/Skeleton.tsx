import * as React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style,
}) => {
  const getRadius = () => {
    switch (variant) {
      case 'circular': return '50%';
      case 'rectangular': return '8px';
      case 'text':
      default: return '4px';
    }
  };

  const getDefaultHeight = () => {
    switch (variant) {
      case 'circular': return width || 40;
      case 'rectangular': return 120;
      case 'text':
      default: return 16;
    }
  };

  return (
    <>
      <style>{`
        @keyframes boost-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div
        className={`boost-skeleton ${className}`}
        style={{
          width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
          height: height ? (typeof height === 'number' ? `${height}px` : height) : `${getDefaultHeight()}px`,
          borderRadius: getRadius(),
          background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
          backgroundSize: '200% 100%',
          animation: 'boost-shimmer 1.5s infinite',
          ...style,
        }}
      />
    </>
  );
};


Skeleton.displayName = 'Skeleton';
