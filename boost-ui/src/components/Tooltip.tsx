import * as React from 'react';

export interface TooltipProps {
  content?: React.ReactNode;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  style,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tooltipId = React.useId ? React.useId().replace(/:/g, '') : `tooltip-${Math.random().toString(36).substring(2, 7)}`;

  // Close on Escape key
  React.useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Close on outside touch for mobile
  React.useEffect(() => {
    const handleTouchOutside = (e: TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener('touchstart', handleTouchOutside);
    }
    return () => document.removeEventListener('touchstart', handleTouchOutside);
  }, [isVisible]);

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'bottom':
        return {
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          right: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          left: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'top':
      default:
        return {
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
    }
  };

  return (
    <div
      ref={containerRef}
      aria-describedby={content && isVisible ? tooltipId : undefined}
      className={`boost-tooltip-wrapper ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      onClick={() => setIsVisible((prev) => !prev)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        ...style,
      }}
    >
      <style>{`
        .boost-tooltip-bubble {
          animation: boostTooltipIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
          max-width: min(280px, calc(100vw - 32px));
          word-break: break-word;
        }
        @keyframes boostTooltipIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      {children}
      {isVisible && content && (
        <div
          id={tooltipId}
          role="tooltip"
          className="boost-tooltip-bubble"
          style={{
            position: 'absolute',
            zIndex: 1000,
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: typeof content === 'string' && content.length < 30 ? 'nowrap' : 'normal',
            pointerEvents: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.4,
            textAlign: 'center',
            ...getPositionStyles(),
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';
