import * as React from 'react';


/**
 * ButtonGroupProps — Properties for grouping multiple buttons together.
 */
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  fullWidth = false,
  className = '',
  style,
}) => {
  return (
    <div
      className={`boost-button-group boost-button-group-${orientation} ${className}`}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        borderRadius: 'var(--boost-radius, 8px)',
        overflow: 'hidden',
        border: '1px solid var(--boost-border, #cbd5e1)',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.04))',
        ...style,
      }}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        const total = React.Children.count(children);
        const isLast = idx === total - 1;
        const typedChild = child as React.ReactElement<{ style?: React.CSSProperties; fullWidth?: boolean }>;

        return React.cloneElement(typedChild, {
          style: {
            ...typedChild.props.style,
            borderRadius: 0,
            border: 'none',
            flex: fullWidth ? 1 : undefined,
            borderRight: orientation === 'horizontal' && !isLast ? '1px solid var(--boost-border, #cbd5e1)' : 'none',
            borderBottom: orientation === 'vertical' && !isLast ? '1px solid var(--boost-border, #cbd5e1)' : 'none',
          },
        });
      })}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';
