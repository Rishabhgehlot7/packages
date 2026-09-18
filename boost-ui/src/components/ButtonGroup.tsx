import * as React from 'react';

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
  style,
}) => {
  return (
    <div
      className={`boost-button-group ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #cbd5e1',
        ...style,
      }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const typedChild = child as React.ReactElement<{ style?: React.CSSProperties }>;
        return React.cloneElement(typedChild, {
          style: {
            ...typedChild.props.style,
            borderRadius: 0,
            border: 'none',
            borderRight: orientation === 'horizontal' ? '1px solid #cbd5e1' : 'none',
            borderBottom: orientation === 'vertical' ? '1px solid #cbd5e1' : 'none',
          },
        });
      })}
    </div>
  );
};


ButtonGroup.displayName = 'ButtonGroup';
