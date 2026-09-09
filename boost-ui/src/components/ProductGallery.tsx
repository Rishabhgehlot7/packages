import * as React from 'react';

export interface ProductGalleryProps {
  images: string[];
  title?: string;
  layout?: 'stacked' | 'thumbnails-bottom' | 'thumbnails-left';
  aspectRatio?: 'square' | 'portrait' | 'wide';
  enableZoom?: boolean;
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  title = 'Product Image',
  layout = 'thumbnails-bottom',
  aspectRatio = 'portrait',
  enableZoom = true,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 0, y: 0 });

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: aspectRatio === 'portrait' ? '4/5' : aspectRatio === 'square' ? '1/1' : '16/9',
          backgroundColor: '#f3f4f6',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: '13px',
        }}
      >
        No Images Available
      </div>
    );
  }

  const handleMouseMove = (e: any) => {
    if (!enableZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const ratioStyle: React.CSSProperties = {
    aspectRatio: aspectRatio === 'portrait' ? '4/5' : aspectRatio === 'square' ? '1/1' : '16/9',
  };

  const isThumbnailsLeft = layout === 'thumbnails-left';

  return (
    <div
      className={`boost-product-gallery ${className}`}
      style={{
        display: 'flex',
        flexDirection: isThumbnailsLeft ? 'row-reverse' : 'column',
        gap: '12px',
        fontFamily: 'inherit',
      }}
    >
      {/* Main Image Showcase */}
      <div
        style={{
          ...ratioStyle,
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#f9fafb',
          border: '1px solid #f3f4f6',
          cursor: enableZoom ? 'crosshair' : 'default',
        }}
        onMouseEnter={() => enableZoom && setIsHovered(true)}
        onMouseLeave={() => enableZoom && setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[selectedIndex]}
          alt={`${title} - view ${selectedIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: isHovered ? 'none' : 'transform 0.3s ease',
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: isHovered ? 'scale(2.2)' : 'scale(1)',
          }}
        />

        {/* Counter Badge */}
        {images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '999px',
              pointerEvents: 'none',
              backdropFilter: 'blur(4px)',
            }}
          >
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row / Column */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            flexDirection: isThumbnailsLeft ? 'column' : 'row',
            gap: '8px',
            overflowX: isThumbnailsLeft ? 'hidden' : 'auto',
            overflowY: isThumbnailsLeft ? 'auto' : 'hidden',
            paddingBottom: isThumbnailsLeft ? '0' : '4px',
            scrollbarWidth: 'none',
          }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: isThumbnailsLeft ? '64px' : '72px',
                height: isThumbnailsLeft ? '80px' : '72px',
                flexShrink: 0,
                borderRadius: '10px',
                overflow: 'hidden',
                border: selectedIndex === idx ? '2px solid #000000' : '2px solid transparent',
                opacity: selectedIndex === idx ? 1 : 0.65,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                padding: 0,
                backgroundColor: '#f3f4f6',
              }}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
