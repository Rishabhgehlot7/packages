import * as React from 'react';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number | string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const AspectRatio = /* @__PURE__ */ React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, children, className = '', style, ...props }, ref) => {
    let numericRatio: number;
    if (typeof ratio === 'number') {
      numericRatio = ratio;
    } else if (typeof ratio === 'string' && ratio.includes('/')) {
      const [w, h] = ratio.split('/').map(Number);
      numericRatio = w && h ? w / h : 16 / 9;
    } else {
      numericRatio = Number(ratio) || 16 / 9;
    }

    const paddingBottom = `${(1 / numericRatio) * 100}%`;

    return (
      <div
        ref={ref}
        className={`boost-aspect-ratio ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom,
          overflow: 'hidden',
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';
