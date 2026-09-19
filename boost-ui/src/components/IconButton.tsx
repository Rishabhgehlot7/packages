import * as React from 'react';
import { ButtonVariant, ButtonSize } from './Button';

export type IconButtonShape = 'square' | 'rounded' | 'circle';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  ariaLabel?: string;
  shape?: IconButtonShape;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      ariaLabel,
      shape = 'rounded',
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const effectiveLabel = ariaLabel || label || (props['aria-label'] as string) || 'button';
    const effectiveIcon = icon || children;

    const getSize = () => {
      switch (size) {
        case 'sm': return { width: '30px', height: '30px', padding: '6px' };
        case 'lg': return { width: '44px', height: '44px', padding: '10px' };
        case 'md':
        default: return { width: '36px', height: '36px', padding: '8px' };
      }
    };

    const getShapeRadius = () => {
      switch (shape) {
        case 'circle': return '9999px';
        case 'square': return '4px';
        case 'rounded':
        default: return '8px';
      }
    };

    const getBgColor = () => {
      switch (variant) {
        case 'primary': return { bg: 'var(--boost-primary, #2563eb)', color: '#ffffff', border: 'none' };
        case 'outline': return { bg: 'transparent', color: 'var(--boost-text, #0f172a)', border: '1px solid var(--boost-border, #cbd5e1)' };
        case 'ghost': return { bg: 'transparent', color: 'var(--boost-text, #0f172a)', border: 'none' };
        case 'destructive': return { bg: 'var(--boost-danger, #dc2626)', color: '#ffffff', border: 'none' };
        case 'secondary':
        default: return { bg: 'var(--boost-surface-secondary, #f1f5f9)', color: 'var(--boost-text, #0f172a)', border: '1px solid var(--boost-border, #e2e8f0)' };
      }
    };

    const s = getSize();
    const v = getBgColor();

    return (
      <button
        ref={ref}
        aria-label={effectiveLabel}
        title={effectiveLabel}
        disabled={disabled || isLoading}
        className={`boost-icon-btn boost-icon-btn-${shape} ${className}`}
        style={{
          width: s.width,
          height: s.height,
          padding: s.padding,
          backgroundColor: v.bg,
          color: v.color,
          border: v.border,
          borderRadius: getShapeRadius(),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled || isLoading ? 0.6 : 1,
          transition: 'all 0.15s ease',
          outline: 'none',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      >
        {effectiveIcon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

