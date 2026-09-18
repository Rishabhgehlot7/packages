import * as React from 'react';

export interface PageWrapperProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  header,
  footer,
  sidebar,
  className = '',
  style,
}) => {
  return (
    <div
      className={`boost-page-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {header}

      <div style={{ display: 'flex', flex: 1 }}>
        {sidebar}
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>

      {footer}
    </div>
  );
};


PageWrapper.displayName = 'PageWrapper';
