import * as React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  borderRadius,
  className = '',
  style,
}) => {
  const getRadius = () => {
    if (borderRadius !== undefined) {
      return typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    }
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
        .boost-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: boost-shimmer 1.5s infinite;
        }
        :root[data-theme="dark"] .boost-skeleton {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.05) 75%) !important;
          background-size: 200% 100% !important;
        }
      `}</style>
      <div
        className={`boost-skeleton ${className}`}
        style={{
          width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
          height: height ? (typeof height === 'number' ? `${height}px` : height) : `${getDefaultHeight()}px`,
          borderRadius: getRadius(),
          ...style,
        }}
      />
    </>
  );
};

Skeleton.displayName = 'Skeleton';
