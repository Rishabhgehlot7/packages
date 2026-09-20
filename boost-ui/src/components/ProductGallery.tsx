import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export type ProductGalleryImageItem = string | { id?: string; url?: string; src?: string; alt?: string };

export interface ProductGalleryProps {
  images?: ProductGalleryImageItem[];
  title?: string;
  layout?: 'stacked' | 'thumbnails-bottom' | 'thumbnails-left';
  aspectRatio?: 'square' | 'portrait' | 'wide';
  enableZoom?: boolean;
  className?: string;
  stylePreset?: UIStylePreset;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  title = 'Product Image',
  layout = 'thumbnails-bottom',
  aspectRatio = 'portrait',
  enableZoom = true,
  className = '',
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 0, y: 0 });

  const normalizedImages: string[] = React.useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    return images
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') return item.url || item.src || '';
        return '';
      })
      .filter(Boolean);
  }, [images]);

  if (normalizedImages.length === 0) {
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

    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const isThumbnailsLeft = layout === 'thumbnails-left' && !isMobile;

    const handlePrev = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : normalizedImages.length - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedIndex((prev) => (prev < normalizedImages.length - 1 ? prev + 1 : 0));
    };

    const getMainShowcasePresetStyles = (): React.CSSProperties => {
      switch (preset) {
        case 'neo-brutalism':
          return {
            border: '3px solid #000000',
            boxShadow: '5px 5px 0px #000000',
            borderRadius: '0px',
            backgroundColor: '#ffffff',
          };
        case 'glassmorphism':
          return {
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          };
        case 'neumorphism':
          return {
            border: 'none',
            boxShadow: '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff',
            borderRadius: '16px',
            backgroundColor: 'var(--boost-surface, #e6ecf5)',
          };
        case 'gradient-glow':
          return {
            border: '1px solid rgba(99, 102, 241, 0.35)',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.25)',
            borderRadius: '16px',
            backgroundColor: 'var(--boost-surface, #ffffff)',
          };
        case 'material-you':
          return {
            borderRadius: '24px',
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            backgroundColor: 'var(--boost-surface-variant, #f3edf7)',
          };
        case 'dark-first':
          return {
            border: '1px solid #334155',
            borderRadius: '16px',
            backgroundColor: '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          };
        case 'minimal':
        default:
          return {
            borderRadius: '16px',
            backgroundColor: 'var(--boost-surface, #f8fafc)',
            border: '1px solid var(--boost-border, #e2e8f0)',
          };
      }
    };

    const getThumbnailPresetStyles = (isSelected: boolean): React.CSSProperties => {
      switch (preset) {
        case 'neo-brutalism':
          return {
            borderRadius: '0px',
            border: isSelected ? '3px solid #000000' : '2px solid #94a3b8',
            boxShadow: isSelected ? '3px 3px 0px #000000' : 'none',
            opacity: isSelected ? 1 : 0.7,
          };
        case 'glassmorphism':
          return {
            borderRadius: '10px',
            border: isSelected ? '2px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: isSelected ? '0 0 12px rgba(255, 255, 255, 0.5)' : 'none',
            opacity: isSelected ? 1 : 0.65,
          };
        case 'neumorphism':
          return {
            borderRadius: '10px',
            border: 'none',
            boxShadow: isSelected ? 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff' : '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
            opacity: isSelected ? 1 : 0.75,
          };
        case 'material-you':
          return {
            borderRadius: '16px',
            border: isSelected ? '2px solid var(--boost-primary, #6750a4)' : '2px solid transparent',
            boxShadow: isSelected ? '0 0 0 2px rgba(103, 80, 164, 0.2)' : 'none',
            opacity: isSelected ? 1 : 0.65,
          };
        case 'gradient-glow':
          return {
            borderRadius: '10px',
            border: isSelected ? '2px solid #818cf8' : '1px solid transparent',
            boxShadow: isSelected ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
            opacity: isSelected ? 1 : 0.65,
          };
        case 'dark-first':
          return {
            borderRadius: '10px',
            border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
            opacity: isSelected ? 1 : 0.6,
          };
        case 'minimal':
        default:
          return {
            borderRadius: '10px',
            border: isSelected ? '2px solid var(--boost-primary, #2563eb)' : '2px solid transparent',
            boxShadow: isSelected ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
            opacity: isSelected ? 1 : 0.6,
          };
      }
    };

    const getNavButtonPresetStyles = (): React.CSSProperties => {
      switch (preset) {
        case 'neo-brutalism':
          return {
            borderRadius: '0px',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            backgroundColor: '#ffffff',
            color: '#000000',
          };
        case 'neumorphism':
          return {
            borderRadius: '9999px',
            border: 'none',
            boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
            backgroundColor: 'var(--boost-surface, #e6ecf5)',
            color: 'var(--boost-text-primary, #0f172a)',
          };
        case 'material-you':
          return {
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          };
        default:
          return {};
      }
    };

    return (
      <div
        className={`boost-product-gallery boost-gallery-preset-${preset} ${className}`}
        style={{
          display: 'flex',
          flexDirection: isThumbnailsLeft ? 'row-reverse' : 'column',
          gap: 'clamp(8px, 1.5vw, 14px)',
          fontFamily: 'inherit',
          width: '100%',
        }}
      >
        {/* Main Image Showcase */}
        <div
          style={{
            ...ratioStyle,
            position: 'relative',
            width: '100%',
            flex: isThumbnailsLeft ? '1 1 0%' : undefined,
            minWidth: 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
            cursor: enableZoom ? 'crosshair' : 'default',
            ...getMainShowcasePresetStyles(),
          }}
          onMouseEnter={() => enableZoom && setIsHovered(true)}
          onMouseLeave={() => enableZoom && setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={normalizedImages[selectedIndex]}
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

          {/* Navigation Arrows for Mobile / Touch */}
          {normalizedImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={handlePrev}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  zIndex: 3,
                  transition: 'background-color 0.15s ease',
                  ...getNavButtonPresetStyles(),
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  zIndex: 3,
                  transition: 'background-color 0.15s ease',
                  ...getNavButtonPresetStyles(),
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Counter Badge */}
          {normalizedImages.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: preset === 'neo-brutalism' ? '#000000' : 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: preset === 'neo-brutalism' ? '0px' : '999px',
                border: preset === 'neo-brutalism' ? '1px solid #ffffff' : undefined,
                pointerEvents: 'none',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                zIndex: 2,
              }}
            >
              {selectedIndex + 1} / {normalizedImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails Row / Column */}
        {normalizedImages.length > 1 && (
          <div
            style={{
              display: 'flex',
              flexDirection: isThumbnailsLeft ? 'column' : 'row',
              gap: '8px',
              overflowX: isThumbnailsLeft ? 'hidden' : 'auto',
              overflowY: isThumbnailsLeft ? 'auto' : 'hidden',
              paddingBottom: isThumbnailsLeft ? '0' : '4px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {normalizedImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                style={{
                  width: isThumbnailsLeft ? '64px' : 'clamp(58px, 12vw, 74px)',
                  height: isThumbnailsLeft ? '80px' : 'clamp(58px, 12vw, 74px)',
                  flexShrink: 0,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: 'var(--boost-surface, #f8fafc)',
                  ...getThumbnailPresetStyles(selectedIndex === idx),
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


ProductGallery.displayName = 'ProductGallery';
