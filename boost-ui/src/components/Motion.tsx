'use client';

import * as React from 'react';

export interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?:
    | 'fade-in'
    | 'slide-up'
    | 'slide-down'
    | 'scale-in'
    | 'spring-pop'
    | 'slide-in-right'
    | 'slide-in-left'
    | 'spin'
    | 'pulse'
    | 'bounce'
    | 'shimmer';
  duration?: number; // ms
  delay?: number; // ms
  ease?: 'spring' | 'smooth' | 'linear' | 'ease-out';
  triggerOnce?: boolean;
  viewportThreshold?: number;
  children: React.ReactNode;
}

const keyframesStyle = `
  @keyframes boost-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes boost-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(0.95); }
  }
  @keyframes boost-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes boost-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

/**
 * Motion — Zero-dependency scroll and entrance animation wrapper.
 * Uses native IntersectionObserver to animate content into view smoothly,
 * and also supports continuous animations like spin, pulse, and shimmer.
 */
export const Motion: React.FC<MotionProps> = ({
  animation = 'fade-in',
  duration = 500,
  delay = 0,
  ease,
  triggerOnce = true,
  viewportThreshold = 0.1,
  children,
  style,
  className = '',
  ...props
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  // Determine if it's a continuous animation that doesn't rely on scroll entrance
  const isContinuous = ['spin', 'pulse', 'shimmer', 'bounce'].includes(animation);

  React.useEffect(() => {
    if (isContinuous) return; // Don't need intersection observer for continuous animations

    if (typeof IntersectionObserver === 'undefined' || !ref.current) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold: viewportThreshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggerOnce, viewportThreshold, isContinuous]);

  const getMotionStyle = (): React.CSSProperties => {
    if (animation === 'spin') {
      return {
        animation: `boost-spin ${duration}ms linear infinite`,
      };
    }
    if (animation === 'pulse') {
      return {
        animation: `boost-pulse ${duration * 2}ms cubic-bezier(0.4, 0, 0.6, 1) infinite`,
      };
    }
    if (animation === 'bounce') {
      return {
        animation: `boost-bounce ${duration * 2}ms ease-in-out infinite`,
      };
    }
    if (animation === 'shimmer') {
      return {
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: '200% 100%',
        animation: `boost-shimmer ${duration * 3}ms infinite`,
      };
    }

    // Easing curves
    const easingMap: Record<string, string> = {
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      linear: 'linear',
    };
    const chosenEasing = (ease && easingMap[ease]) ? easingMap[ease] : (animation === 'spring-pop' ? easingMap.spring : easingMap.smooth);

    // Entrance animations
    const transition = `opacity ${duration}ms ${chosenEasing} ${delay}ms, transform ${duration}ms ${chosenEasing} ${delay}ms`;

    if (inView) {
      return {
        opacity: 1,
        transform: 'none',
        transition,
      };
    }

    let transform = 'none';
    switch (animation) {
      case 'slide-up':
        transform = 'translateY(24px)';
        break;
      case 'slide-down':
        transform = 'translateY(-24px)';
        break;
      case 'scale-in':
        transform = 'scale(0.94)';
        break;
      case 'spring-pop':
        transform = 'scale(0.82)';
        break;
      case 'slide-in-right':
        transform = 'translateX(24px)';
        break;
      case 'slide-in-left':
        transform = 'translateX(-24px)';
        break;
      case 'fade-in':
      default:
        transform = 'none';
        break;
    }

    return {
      opacity: 0,
      transform,
      transition,
    };
  };

  return (
    <>
      <style>{keyframesStyle}</style>
      <div
        ref={ref}
        className={`boost-motion ${className}`}
        style={{
          ...getMotionStyle(),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

Motion.displayName = 'Motion';
