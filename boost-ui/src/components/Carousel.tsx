import * as React from 'react';

export type CarouselSlide = React.ReactNode;


/**
 * CarouselProps — Properties for the image/content carousel component.
 */
export interface CarouselProps {
  items: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 4000,
  showIndicators = true,
  className = '',
  style,
  ...props
}) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const slidesList: React.ReactNode[] = Array.isArray(items)
    ? items
    : Array.isArray((props as any).slides)
    ? (props as any).slides.map((s: any) => s?.content || s)
    : [];

  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? slidesList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev === slidesList.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  React.useEffect(() => {
    if (!autoPlay || slidesList.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slidesList.length]);

  if (slidesList.length === 0) return null;

  return (
    <div
      className={`boost-carousel ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 'var(--boost-radius, 16px)',
        backgroundColor: 'var(--boost-surface, #0f172a)',
        boxShadow: 'var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.1))',
        touchAction: 'pan-y',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Sliding track for silky smooth transition */}
      <div
        style={{
          display: 'flex',
          width: `${slidesList.length * 100}%`,
          transform: `translateX(-${(currentIdx * 100) / slidesList.length}%)`,
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {slidesList.map((slide, idx) => (
          <div
            key={idx}
            style={{
              width: `${100 / slidesList.length}%`,
              flexShrink: 0,
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      {slidesList.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: 'clamp(8px, 2vw, 16px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(32px, 4vw, 42px)',
              height: 'clamp(32px, 4vw, 42px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              zIndex: 2,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: 'clamp(8px, 2vw, 16px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(32px, 4vw, 42px)',
              height: 'clamp(32px, 4vw, 42px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              zIndex: 2,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {showIndicators && (
            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 2,
              }}
            >
              {slidesList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    border: 'none',
                    padding: 0,
                    width: idx === currentIdx ? '22px' : '7px',
                    height: '7px',
                    borderRadius: '4px',
                    backgroundColor: idx === currentIdx ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};


Carousel.displayName = 'Carousel';
