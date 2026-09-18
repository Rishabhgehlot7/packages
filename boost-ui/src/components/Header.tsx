import * as React from 'react';

export interface HeaderProps {
  logo?: React.ReactNode;
  brandName?: string;
  navLinks?: Array<{ label: string; href: string }>;
  actions?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  brandName = 'Brand',
  navLinks = [],
  actions,
  sticky = true,
  className = '',
}) => {
  return (
    <header
      className={`boost-header ${className}`}
      style={{
        position: sticky ? 'sticky' : 'static',
        top: 0,
        zIndex: 40,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {logo}
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
          {brandName}
        </span>
      </div>

      {navLinks.length > 0 && (
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              style={{
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: '#475569',
                transition: 'color 0.15s ease',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {actions}
        </div>
      )}
    </header>
  );
};


Header.displayName = 'Header';
