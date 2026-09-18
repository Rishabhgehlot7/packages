import * as React from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'destructive' | 'warning';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  style,
}) => {
  const getTheme = () => {
    switch (variant) {
      case 'secondary':
        return { bg: 'var(--boost-surface, #f1f5f9)', color: 'var(--boost-text, #334155)', border: '1px solid var(--boost-border, #e2e8f0)' };
      case 'outline':
        return { bg: 'transparent', color: 'var(--boost-text, #0f172a)', border: '1px solid var(--boost-border, #cbd5e1)' };
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.25)' };
      case 'destructive':
        return { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.25)' };
      case 'default':
      default:
        return { bg: 'var(--boost-primary, #2563eb)', color: '#ffffff', border: '1px solid transparent' };
    }
  };

  const theme = getTheme();

  return (
    <span
      className={`boost-badge boost-badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: 600,
        borderRadius: '9999px',
        backgroundColor: theme.bg,
        color: theme.color,
        border: theme.border,
        letterSpacing: '0.02em',
        fontFamily: 'inherit',
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
};


Badge.displayName = 'Badge';
