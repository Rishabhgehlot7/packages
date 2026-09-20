import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'destructive' | 'warning' | 'info';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  style,
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const getPresetStyles = (): React.CSSProperties => {
    const isNeutral = variant === 'default' || variant === 'secondary' || variant === 'outline';
    switch (preset) {
      case 'neo-brutalism':
        return {
          borderRadius: '0px',
          border: '2px solid var(--boost-border, #000000)',
          boxShadow: '2px 2px 0 var(--boost-border, #000000)',
          fontWeight: 700,
        };
      case 'glassmorphism':
        return {
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          ...(isNeutral ? {
            backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.85))',
            border: '1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))',
          } : {}),
        };
      case 'neumorphism':
        return {
          borderRadius: '12px',
          border: 'none',
          boxShadow: 'var(--card-shadow, 4px 4px 8px #c5cad3, -4px -4px 8px #ffffff)',
          ...(isNeutral ? {
            backgroundColor: 'var(--boost-surface, #e8ebf0)',
          } : {}),
        };
      case 'gradient-glow':
        return {
          boxShadow: '0 0 14px rgba(99, 102, 241, 0.35)',
        };
      case 'material-you':
        return {
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        };
      case 'dark-first':
        return {
          ...(isNeutral ? {
            backgroundColor: 'var(--boost-surface, #0b0f17)',
            border: '1px solid var(--boost-border, #232a37)',
          } : {}),
        };
      case 'minimal':
      default:
        return {};
    }
  };

  const getTheme = () => {
    switch (variant) {
      case 'secondary':
        return { bg: 'var(--boost-surface-secondary, #f1f5f9)', color: 'var(--boost-text, #334155)', border: '1px solid var(--boost-border, #e2e8f0)' };
      case 'outline':
        return { bg: 'transparent', color: 'var(--boost-text, #0f172a)', border: '1px solid var(--boost-border, #cbd5e1)' };
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.25)' };
      case 'destructive':
        return { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.25)' };
      case 'info':
        return { bg: 'rgba(14, 165, 233, 0.12)', color: '#0284c7', border: '1px solid rgba(14, 165, 233, 0.25)' };
      case 'primary':
      case 'default':
      default:
        return { bg: 'var(--boost-primary, #2563eb)', color: '#ffffff', border: '1px solid transparent' };
    }
  };

  const theme = getTheme();
  const presetStyle = getPresetStyles();

  return (
    <span
      className={`boost-badge boost-badge-${variant} boost-badge-preset-${preset} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2.5px 8.5px',
        fontSize: '11px',
        fontWeight: 600,
        borderRadius: '9999px',
        backgroundColor: theme.bg,
        color: theme.color,
        border: theme.border,
        letterSpacing: '0.02em',
        fontFamily: 'inherit',
        lineHeight: 1.4,
        userSelect: 'none',
        ...presetStyle,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
