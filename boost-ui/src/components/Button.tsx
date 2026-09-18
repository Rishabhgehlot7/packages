import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading,
      loading,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: 'var(--boost-primary, #2563eb)',
            color: '#ffffff',
            border: '1px solid transparent',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.2)',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--boost-surface, #f1f5f9)',
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
            border: '1px solid transparent',
          };
        case 'destructive':
          return {
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: '1px solid transparent',
            boxShadow: '0 1px 3px rgba(220, 38, 38, 0.25)',
          };
        case 'link':
          return {
            backgroundColor: 'transparent',
            color: 'var(--boost-primary, #2563eb)',
            border: 'none',
            padding: 0,
            textDecoration: 'underline',
          };
        default:
          return {};
      }
    };

    const getSizeStyles = (): React.CSSProperties => {
      if (variant === 'link') return {};
      switch (size) {
        case 'sm':
          return {
            padding: '6px 14px',
            fontSize: '12px',
            borderRadius: 'var(--boost-radius, 8px)',
          };
        case 'lg':
          return {
            padding: '13px 26px',
            fontSize: '15px',
            borderRadius: 'var(--boost-radius, 12px)',
          };
        case 'md':
        default:
          return {
            padding: '9px 18px',
            fontSize: '14px',
            borderRadius: 'var(--boost-radius, 10px)',
          };
      }
    };

    const isBusy = loading ?? isLoading ?? false;

    const baseStyles: React.CSSProperties = {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'inherit',
      fontWeight: 600,
      cursor: disabled || isBusy ? 'not-allowed' : 'pointer',
      opacity: disabled || isBusy ? 0.6 : 1,
      transition: 'all 0.15s ease',
      outline: 'none',
      userSelect: 'none',
      ...getSizeStyles(),
      ...getVariantStyles(),
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isBusy}
        className={`boost-btn boost-btn-${variant} ${className}`}
        style={baseStyles}
        {...props}
      >
        {isBusy && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              animation: 'boost-spin 0.8s linear infinite',
            }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {!isLoading && leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
