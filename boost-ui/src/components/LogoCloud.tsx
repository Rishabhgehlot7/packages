import * as React from 'react';

export interface LogoItem {
  name: string;
  logo?: React.ReactNode;
  imageUrl?: string;
  href?: string;
}

export interface LogoCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  logos?: LogoItem[];
  title?: string;
  grayscale?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LogoCloud: React.FC<LogoCloudProps> = ({
  logos = [],
  title = 'TRUSTED BY 10,000+ MODERN BUSINESSES & D2C BRANDS',
  grayscale = true,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`boost-logo-cloud ${className}`}
      style={{
        width: '100%',
        padding: '36px 20px',
        textAlign: 'center',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <style>
        {`
          .boost-logo-grid {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 20px 24px;
          }
          .boost-logo-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            border-radius: 12px;
            background: var(--boost-surface, rgba(255, 255, 255, 0.8));
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.07));
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            color: var(--boost-text-primary, #0f172a);
          }
          .boost-logo-item:hover {
            filter: none !important;
            opacity: 1 !important;
            transform: translateY(-2px);
            border-color: rgba(99, 102, 241, 0.4);
            box-shadow: 0 8px 24px -6px rgba(99, 102, 241, 0.15);
          }
          @media (max-width: 640px) {
            .boost-logo-grid {
              gap: 12px 14px;
            }
            .boost-logo-item {
              padding: 8px 14px;
            }
            .boost-logo-item img {
              max-height: 24px !important;
              max-width: 90px !important;
            }
          }
          :root[data-theme="dark"] .boost-logo-item,
          .dark .boost-logo-item {
            background: rgba(255, 255, 255, 0.04) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-logo-item:hover,
          .dark .boost-logo-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(99, 102, 241, 0.5) !important;
            box-shadow: 0 8px 25px -6px rgba(99, 102, 241, 0.3) !important;
          }
          :root[data-theme="dark"] .boost-logo-item img,
          .dark .boost-logo-item img {
            filter: invert(1) brightness(1.8) contrast(1.1);
          }
        `}
      </style>
      {title && (
        <p
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--boost-text-muted, #64748b)',
            marginBottom: '28px',
          }}
        >
          {title}
        </p>
      )}

      <div className="boost-logo-grid">
        {logos.map((item, idx) => {
          const content = (
            <div
              key={idx}
              title={item.name}
              className="boost-logo-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: grayscale ? 'grayscale(100%) opacity(60%)' : 'none',
                transition: 'filter 0.2s ease, transform 0.2s ease',
                cursor: item.href ? 'pointer' : 'default',
              }}
            >
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  style={{ maxHeight: '36px', maxWidth: '160px', objectFit: 'contain' }} 
                />
              ) : (
                item.logo
              )}
            </div>
          );

          if (item.href) {
            return (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {content}
              </a>
            );
          }
          return content;
        })}
      </div>
    </div>
  );
};


LogoCloud.displayName = 'LogoCloud';
