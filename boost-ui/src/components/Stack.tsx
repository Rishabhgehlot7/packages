import * as React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: number | string;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
  fullWidth?: boolean;
}

export type HStackProps = Omit<StackProps, 'direction'>;
export type VStackProps = Omit<StackProps, 'direction'>;

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  gap = '12px',
  align,
  justify,
  wrap = false,
  fullWidth = false,
  className = '',
  style,
  children,
  ...props
}) => {
  const getGapValue = (val: number | string) => (typeof val === 'number' ? `${val}px` : val);

  return (
    <div
      className={`boost-stack boost-stack-${direction} ${className}`}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: getGapValue(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap,
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const HStack: React.FC<HStackProps> = (props) => (
  <Stack direction="row" align="center" {...props} />
);

export const VStack: React.FC<VStackProps> = (props) => (
  <Stack direction="column" {...props} />
);

Stack.displayName = 'Stack';
HStack.displayName = 'HStack';
VStack.displayName = 'VStack';
