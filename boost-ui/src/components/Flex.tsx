import * as React from 'react';


/**
 * FlexProps — Properties for the Flexbox layout primitive.
 */
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  direction?: React.CSSProperties['flexDirection'];
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  wrap?: React.CSSProperties['flexWrap'];
  gap?: string | number;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Flex = /* @__PURE__ */ React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      direction = 'row',
      justify = 'flex-start',
      align = 'center',
      wrap = 'nowrap',
      gap,
      inline = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const computedStyle: React.CSSProperties = {
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      flexWrap: wrap,
      ...(gap !== undefined && { gap: typeof gap === 'number' ? `${gap}px` : gap }),
      ...style,
    };

    return (
      <div ref={ref} className={`boost-flex ${className}`} style={computedStyle} {...props}>
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';
