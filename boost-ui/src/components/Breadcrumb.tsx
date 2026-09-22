import * as React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}


/**
 * BreadcrumbProps — Properties for the breadcrumb navigation trail.
 */
export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  onItemClick?: (href: string, item: BreadcrumbItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  separator,
  onItemClick,
  className = '',
  style,
}) => {
  const defaultSeparator = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, margin: '0 4px', flexShrink: 0 }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={`boost-breadcrumb ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        fontSize: '13px',
        fontFamily: 'inherit',
        color: 'var(--boost-text-muted, #64748b)',
        ...style,
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-breadcrumb a,
          .dark .boost-breadcrumb a {
            color: var(--boost-text-muted, #94a3b8) !important;
          }
          :root[data-theme="dark"] .boost-breadcrumb a:hover,
          .dark .boost-breadcrumb a:hover {
            color: var(--boost-primary, #818cf8) !important;
          }
          :root[data-theme="dark"] .boost-breadcrumb span[aria-current="page"],
          .dark .boost-breadcrumb span[aria-current="page"] {
            color: var(--boost-text, #f8fafc) !important;
          }
        `}
      </style>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (onItemClick) {
                      e.preventDefault();
                      onItemClick(item.href!, item);
                    }
                  }}
                  style={{
                    color: 'var(--boost-text-muted, #64748b)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--boost-primary, #2563eb)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--boost-text-muted, #64748b)';
                  }}
                >
                  {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span
                  style={{
                    color: isLast ? 'var(--boost-text, #0f172a)' : 'var(--boost-text-muted, #64748b)',
                    fontWeight: isLast ? 600 : 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </div>

            {!isLast && (
              <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {separator || defaultSeparator}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
