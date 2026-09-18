import * as React from 'react';

export type CarouselSlide = React.ReactNode;

export interface CarouselProps {
  items: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 4000,
  showIndicators = true,
  className = '',
  ...props
}) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const slidesList: React.ReactNode[] = Array.isArray(items)
    ? items
    : Array.isArray((props as any).slides)
    ? (props as any).slides.map((s: any) => s?.content || s)
    : [];

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? slidesList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev === slidesList.length - 1 ? 0 : prev + 1));
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
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '12px',
        backgroundColor: '#0f172a',
      }}
    >
      <div style={{ width: '100%' }}>
        {slidesList[currentIdx]}
      </div>

      {slidesList.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: '#0f172a',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
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
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: '#0f172a',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
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
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
              }}
            >
              {items.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    width: idx === currentIdx ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: idx === currentIdx ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
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
