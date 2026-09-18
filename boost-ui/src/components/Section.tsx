import * as React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  maxWidth?: string | number;
  py?: string | number;
  px?: string | number;
  bg?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      maxWidth = '1200px',
      py = '64px',
      px = '24px',
      bg = 'transparent',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={`boost-section ${className}`}
        style={{
          width: '100%',
          backgroundColor: bg,
          paddingTop: typeof py === 'number' ? `${py}px` : py,
          paddingBottom: typeof py === 'number' ? `${py}px` : py,
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            margin: '0 auto',
            paddingLeft: typeof px === 'number' ? `${px}px` : px,
            paddingRight: typeof px === 'number' ? `${px}px` : px,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';
