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
        backgroundColor: 'var(--boost-bg, #f8fafc)',
        color: 'var(--boost-text, #0f172a)',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-page-wrapper,
          .dark .boost-page-wrapper {
            background-color: var(--boost-bg, #0b0f19) !important;
            color: #f8fafc !important;
          }
        `}
      </style>
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
