import * as React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill';
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  fallbackSrc,
  aspectRatio = 'auto',
  objectFit = 'cover',
  className = '',
  style,
  ...props
}) => {
  const [hasError, setHasError] = React.useState(false);

  const getAspect = () => {
    if (typeof aspectRatio === 'string' && aspectRatio.includes('/')) {
      return aspectRatio;
    }
    switch (aspectRatio) {
      case 'square': return '1 / 1';
      case 'video': return '16 / 9';
      case 'portrait': return '3 / 4';
      case 'auto':
      default: return 'auto';
    }
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: getAspect(),
        minHeight: '160px',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
      }}
    >
      <img
        src={imageSrc}
        alt={alt}
        onError={() => setHasError(true)}
        className={`boost-image ${className}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
          ...style,
        }}
        {...props}
      />
    </div>
  );
};


Image.displayName = 'Image';
