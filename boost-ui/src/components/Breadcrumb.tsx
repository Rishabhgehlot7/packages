import * as React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  className = '',
}) => {
  const defaultSeparator = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={`boost-breadcrumb ${className}`} style={{ fontFamily: 'inherit' }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              {isLast || !item.href ? (
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  style={{
                    color: '#64748b',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {item.label}
                </a>
              )}

              {!isLast && (
                <span style={{ display: 'inline-flex' }}>
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};


Breadcrumb.displayName = 'Breadcrumb';
