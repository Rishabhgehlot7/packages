import * as React from 'react';
import { ButtonVariant, ButtonSize } from './Button';


/**
 * LinkButtonProps — Properties for a button styled as a link.
 */
export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--boost-surface-secondary, #f1f5f9)',
          color: 'var(--boost-text, #0f172a)',
          border: '1px solid var(--boost-border, #e2e8f0)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--boost-text, #0f172a)',
          border: '1px solid var(--boost-border, #cbd5e1)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--boost-text, #0f172a)',
          border: 'none',
        };
      case 'destructive':
        return {
          backgroundColor: 'var(--boost-danger, #dc2626)',
          color: '#ffffff',
          border: 'none',
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          color: 'var(--boost-primary, #2563eb)',
          border: 'none',
          padding: 0,
          textDecoration: 'underline',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--boost-primary, #2563eb)',
          color: '#ffffff',
          border: 'none',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    if (variant === 'link') return {};
    switch (size) {
      case 'sm': return { padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--boost-radius, 8px)' };
      case 'lg': return { padding: '13px 26px', fontSize: '15px', borderRadius: 'var(--boost-radius, 12px)' };
      case 'md':
      default: return { padding: '9px 18px', fontSize: '14px', borderRadius: 'var(--boost-radius, 10px)' };
    }
  };

  return (
    <a
      href={href}
      className={`boost-link-btn boost-btn-${variant} ${className}`}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textDecoration: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxSizing: 'border-box',
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

