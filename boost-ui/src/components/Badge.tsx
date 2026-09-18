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
        return { bg: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' };
      case 'outline':
        return { bg: 'transparent', color: '#0f172a', border: '1px solid #cbd5e1' };
      case 'success':
        return { bg: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };
      case 'destructive':
        return { bg: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
      case 'warning':
        return { bg: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
      case 'default':
      default:
        return { bg: '#2563eb', color: '#ffffff', border: '1px solid transparent' };
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
