import * as React from 'react';


/**
 * NavLinkProps — Properties for a single navigation link with active state and badge support.
 */
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
    <>
      <style>
        {`
          :root[data-theme="dark"] .boost-nav-link,
          .dark .boost-nav-link {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-nav-link:hover,
          .dark .boost-nav-link:hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          :root[data-theme="dark"] .boost-nav-link.active,
          .dark .boost-nav-link.active {
            color: var(--boost-primary, #818cf8) !important;
            background-color: rgba(99, 102, 241, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-nav-badge,
          .dark .boost-nav-badge {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-nav-badge.active,
          .dark .boost-nav-badge.active {
            background-color: rgba(99, 102, 241, 0.25) !important;
            color: #a5b4fc !important;
          }
        `}
      </style>
      <a
        href={href}
        className={`boost-nav-link ${activeState ? 'active' : ''} ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: 'var(--boost-radius, 8px)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: activeState ? 600 : 500,
          color: activeState ? 'var(--boost-primary, #2563eb)' : 'var(--boost-text-muted, #475569)',
          backgroundColor: activeState ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
          transition: 'all 0.15s ease',
          ...style,
        }}
        {...props}
      >
        {leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>}
        <span>{children}</span>
        {badge !== undefined && (
          <span
            className={`boost-nav-badge ${activeState ? 'active' : ''}`}
            style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: activeState ? 'rgba(37, 99, 235, 0.12)' : 'var(--boost-bg-subtle, #f1f5f9)',
              color: activeState ? 'var(--boost-primary, #1d4ed8)' : 'var(--boost-text-muted, #64748b)',
              fontWeight: 600,
            }}
          >
            {badge}
          </span>
        )}
        {rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
      </a>
    </>
  );
};


NavLink.displayName = 'NavLink';
