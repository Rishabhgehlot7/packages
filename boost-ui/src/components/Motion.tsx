'use client';

import * as React from 'react';

export interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'slide-in-right' | 'slide-in-left';
  duration?: number; // ms
  delay?: number; // ms
  triggerOnce?: boolean;
  viewportThreshold?: number;
  children: React.ReactNode;
}

/**
 * Motion — Zero-dependency scroll and entrance animation wrapper.
 * Uses native IntersectionObserver to animate content into view smoothly.
 *
 * @example
 * <Motion animation="slide-up" delay={150}>
 *   <h2>Hero Header</h2>
 * </Motion>
 */
export const Motion: React.FC<MotionProps> = ({
  animation = 'fade-in',
  duration = 500,
  delay = 0,
  triggerOnce = true,
  viewportThreshold = 0.1,
  children,
  style,
  className = '',
  ...props
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
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
  }, [triggerOnce, viewportThreshold]);

  const getMotionStyle = (): React.CSSProperties => {
    const transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

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
  );
};

Motion.displayName = 'Motion';
