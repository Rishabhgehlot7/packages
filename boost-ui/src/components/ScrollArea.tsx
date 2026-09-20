import * as React from 'react';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  maxHeight?: string | number;
  maxWidth?: string | number;
  direction?: 'vertical' | 'horizontal' | 'both';
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollArea = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      maxHeight = '400px',
      maxWidth = '100%',
      direction = 'vertical',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const overflowX = direction === 'horizontal' || direction === 'both' ? 'auto' : 'hidden';
    const overflowY = direction === 'vertical' || direction === 'both' ? 'auto' : 'hidden';

    return (
      <div
        ref={ref}
        className={`boost-scroll-area ${className}`}
        style={{
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          overflowX,
          overflowY,
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--boost-border, #cbd5e1) transparent',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
