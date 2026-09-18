import * as React from 'react';

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
  active?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: string | number;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  isActive,
  active,
  leftIcon,
  rightIcon,
  badge,
  className = '',
  style,
  ...props
}) => {
  const activeState = active ?? isActive ?? false;
  return (
    <a
      href={href}
      className={`boost-nav-link ${activeState ? 'active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#2563eb' : '#475569',
        backgroundColor: isActive ? '#eff6ff' : 'transparent',
        transition: 'all 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          style={{
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '9999px',
            backgroundColor: isActive ? '#dbeafe' : '#f1f5f9',
            color: isActive ? '#1d4ed8' : '#64748b',
          }}
        >
          {badge}
        </span>
      )}
      {rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
    </a>
  );
};


NavLink.displayName = 'NavLink';
