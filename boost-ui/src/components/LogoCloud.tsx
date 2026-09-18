import * as React from 'react';

export interface LogoItem {
  name: string;
  logo: React.ReactNode;
  href?: string;
}

export interface LogoCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  logos: LogoItem[];
  title?: string;
  grayscale?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const LogoCloud: React.FC<LogoCloudProps> = ({
  logos,
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

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px 48px',
        }}
      >
        {logos.map((item, idx) => {
          const content = (
            <div
              key={idx}
              title={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: grayscale ? 'grayscale(100%) opacity(60%)' : 'none',
                transition: 'filter 0.2s ease, transform 0.2s ease',
                cursor: item.href ? 'pointer' : 'default',
              }}
            >
              {item.logo}
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
