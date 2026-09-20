import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { presetTokens } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

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
  stylePreset?: UIStylePreset;
}

const NEURO_LIGHT = '6px 6px 12px #c5cad3, -6px -6px 12px #ffffff';

export const Button = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, ButtonProps>(
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
      stylePreset: stylePresetProp,
      ...props
    },
    ref
  ) => {
    const { stylePreset: inheritedPreset } = useBoostPreset();
    const preset = stylePresetProp ?? inheritedPreset;
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
            border: '1px solid transparent',
          };
        case 'destructive':
          return {
            backgroundColor: 'var(--boost-danger, #dc2626)',
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

    const getPresetStyles = (): React.CSSProperties => {
      if (variant === 'link') return {};
      switch (preset) {
        case 'neo-brutalism':
          return {
            border: '2px solid #000',
            borderRadius: '0px',
            boxShadow: '3px 3px 0 #000',
          };
        case 'glassmorphism':
          return {
            backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.85))',
            border: '1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          };
        case 'neumorphism':
          return {
            backgroundColor: 'var(--boost-surface, #e8ebf0)',
            border: 'none',
            borderRadius: presetTokens.neumorphism.radius,
            boxShadow: NEURO_LIGHT,
          };
        case 'gradient-glow':
          return {
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.35), 0 0 0 1px rgba(99, 102, 241, 0.45)',
          };
        case 'material-you':
          return {
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          };
        case 'dark-first':
          return {
            backgroundColor: 'var(--boost-surface, #0b0f17)',
            color: 'var(--boost-text, #f8fafc)',
            border: '1px solid var(--boost-border, #232a37)',
          };
        case 'minimal':
        default:
          return {
            border: '1px solid var(--boost-border, #e2e8f0)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
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
      ...getPresetStyles(),
      ...style,
    };

    return (
      <>
        <style>
          {`
            @keyframes boost-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .boost-btn:active:not(:disabled) {
              transform: scale(0.98);
            }
          `}
        </style>
        <button
          ref={ref}
          disabled={disabled || isBusy}
          className={`boost-btn boost-btn-${variant} boost-btn-preset-${preset} ${className}`}
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
          {!isBusy && leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>}
          <span>{children}</span>
          {!isBusy && rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
        </button>
      </>
    );
  }
);

Button.displayName = 'Button';

