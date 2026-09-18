import * as React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  className = '',
  style,
  children,
  ...props
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm': return '640px';
      case 'md': return '768px';
      case 'lg': return '1024px';
      case 'xl': return '1280px';
      case '2xl': return '1536px';
      case 'full': return '100%';
    }
  };

  return (
    <div
      className={`boost-container ${className}`}
      style={{
        width: '100%',
        maxWidth: getMaxWidth(),
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 'clamp(16px, 3.5vw, 32px)',
        paddingRight: 'clamp(16px, 3.5vw, 32px)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};


Container.displayName = 'Container';
