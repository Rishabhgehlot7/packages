import * as React from 'react';
import { ButtonVariant, ButtonSize } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const getSize = () => {
      switch (size) {
        case 'sm': return { width: '28px', height: '28px', padding: '4px' };
        case 'lg': return { width: '44px', height: '44px', padding: '10px' };
        case 'md':
        default: return { width: '36px', height: '36px', padding: '8px' };
      }
    };

    const getBgColor = () => {
      switch (variant) {
        case 'primary': return { bg: '#2563eb', color: '#fff', border: 'none' };
        case 'outline': return { bg: 'transparent', color: '#0f172a', border: '1px solid #cbd5e1' };
        case 'ghost': return { bg: 'transparent', color: '#0f172a', border: 'none' };
        case 'destructive': return { bg: '#dc2626', color: '#fff', border: 'none' };
        case 'secondary':
        default: return { bg: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' };
      }
    };

    const s = getSize();
    const v = getBgColor();

    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        disabled={disabled || isLoading}
        className={`boost-icon-btn ${className}`}
        style={{
          width: s.width,
          height: s.height,
          padding: s.padding,
          backgroundColor: v.bg,
          color: v.color,
          border: v.border,
          borderRadius: '6px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled || isLoading ? 0.6 : 1,
          transition: 'all 0.15s ease',
          outline: 'none',
          ...style,
        }}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
