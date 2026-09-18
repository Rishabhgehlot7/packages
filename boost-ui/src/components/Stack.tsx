import * as React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  direction?: 'row' | 'column';
  spacing?: string | number;
  gap?: string | number;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: React.CSSProperties['flexWrap'];
  className?: string;
  style?: React.CSSProperties;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      direction = 'column',
      spacing = '16px',
      gap,
      align = 'stretch',
      justify = 'flex-start',
      wrap = 'nowrap',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const finalGap = gap !== undefined ? gap : spacing;

    return (
      <div
        ref={ref}
        className={`boost-stack boost-stack-${direction} ${className}`}
        style={{
          display: 'flex',
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap,
          gap: typeof finalGap === 'number' ? `${finalGap}px` : finalGap,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

export interface VStackProps extends Omit<StackProps, 'direction'> {}

export const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => (
  <Stack ref={ref} direction="column" {...props} />
));
VStack.displayName = 'VStack';

export interface HStackProps extends Omit<StackProps, 'direction'> {}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <Stack ref={ref} direction="row" align="center" {...props} />
));
HStack.displayName = 'HStack';
