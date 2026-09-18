import * as React from 'react';
import { ButtonVariant, ButtonSize } from './Button';

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' };
      case 'outline':
        return { backgroundColor: 'transparent', color: '#0f172a', border: '1px solid #cbd5e1' };
      case 'ghost':
        return { backgroundColor: 'transparent', color: '#0f172a', border: 'none' };
      case 'destructive':
        return { backgroundColor: '#dc2626', color: '#ffffff', border: 'none' };
      case 'link':
        return { backgroundColor: 'transparent', color: '#2563eb', border: 'none', padding: 0, textDecoration: 'underline' };
      case 'primary':
      default:
        return { backgroundColor: '#2563eb', color: '#ffffff', border: 'none' };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    if (variant === 'link') return {};
    switch (size) {
      case 'sm': return { padding: '6px 12px', fontSize: '12px', borderRadius: '4px' };
      case 'lg': return { padding: '12px 24px', fontSize: '16px', borderRadius: '8px' };
      case 'md':
      default: return { padding: '9px 16px', fontSize: '14px', borderRadius: '6px' };
    }
  };

  return (
    <a
      href={href}
      className={`boost-link-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textDecoration: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
    </a>
  );
};


LinkButton.displayName = 'LinkButton';
