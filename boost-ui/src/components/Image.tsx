import * as React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto' | string;
  objectFit?: 'cover' | 'contain' | 'fill';
  containerStyle?: React.CSSProperties;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  fallbackSrc,
  aspectRatio = 'auto',
  objectFit = 'cover',
  className = '',
  style,
  containerStyle,
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const getAspect = () => {
    if (typeof aspectRatio === 'string' && (aspectRatio.includes('/') || aspectRatio.includes(':'))) {
      return aspectRatio.replace(':', '/');
    }
    switch (aspectRatio) {
      case 'square': return '1 / 1';
      case 'video': return '16 / 9';
      case 'portrait': return '3 / 4';
      case 'auto':
      default: return undefined;
    }
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;
  const aspect = getAspect();

  return (
    <div
      className="boost-image-container"
      style={{
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: aspect,
        backgroundColor: 'var(--boost-surface-secondary, #f1f5f9)',
        borderRadius: 'var(--boost-radius, 8px)',
        display: 'block',
        width: '100%',
        ...containerStyle,
      }}
    >
      <style>{`
        :root[data-theme="dark"] .boost-image-container {
          background-color: var(--boost-surface, #1e293b);
        }
        .boost-image-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
          animation: boostImageShimmer 1.5s infinite;
        }
        @keyframes boostImageShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {!isLoaded && !hasError && (
        <div
          className="boost-image-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`boost-image ${className}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
          opacity: isLoaded ? 1 : 0.85,
          transition: 'opacity 0.25s ease',
          ...style,
        }}
        {...props}
      />
    </div>
  );
};

Image.displayName = 'Image';
