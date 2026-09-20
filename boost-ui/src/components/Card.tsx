import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: 'elevated' | 'outlined' | 'glass';
  stylePreset?: UIStylePreset;
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const NEURO_LIGHT = '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff';
const NEURO_DARK = '8px 8px 16px #090d15, -8px -8px 16px #151d2c';

export const Card = /* @__PURE__ */ React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hoverable = false,
      variant = 'elevated',
      stylePreset: stylePresetProp,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const { stylePreset: inheritedPreset } = useBoostPreset();
    const preset = stylePresetProp ?? inheritedPreset;
    const isGlass = variant === 'glass' || preset === 'glassmorphism';
    const isOutlined = variant === 'outlined';

    const getPresetStyles = (): React.CSSProperties => {
      switch (preset) {
        case 'neo-brutalism':
          return {
            border: '3px solid var(--boost-border, #000000)',
            borderRadius: '2px',
            boxShadow: '5px 5px 0px var(--boost-border, #000000)',
            backgroundColor: 'var(--boost-surface, #ffffff)',
          };
        case 'glassmorphism':
          return {
            backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.85))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          };
        case 'neumorphism':
          return {
            backgroundColor: 'var(--boost-surface, #e8ebf0)',
            border: 'none',
            borderRadius: '20px',
            boxShadow: 'var(--card-shadow, 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff)',
          };
        case 'gradient-glow':
          return {
            backgroundColor: 'var(--boost-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.25)',
          };
        case 'material-you':
          return {
            backgroundColor: 'var(--boost-surface, #f8fafc)',
            borderRadius: '24px',
            border: 'none',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          };
        case 'dark-first':
          return {
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
          };
        case 'minimal':
        default:
          return {
            backgroundColor: isGlass
              ? 'var(--boost-glass-bg, rgba(255, 255, 255, 0.8))'
              : 'var(--boost-surface, #ffffff)',
            backdropFilter: isGlass ? 'blur(12px)' : undefined,
            WebkitBackdropFilter: isGlass ? 'blur(12px)' : undefined,
            border: `1px solid ${isGlass ? 'var(--boost-glass-border, rgba(226, 232, 240, 0.8))' : 'var(--boost-border, #e2e8f0)'}`,
            borderRadius: 'var(--boost-radius, 16px)',
            boxShadow: isOutlined
              ? 'none'
              : 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
          };
      }
    };

    const presetStyles = getPresetStyles();

    return (
      <div
        ref={ref}
        className={`boost-card boost-card-preset-${preset} ${hoverable ? 'boost-card-hoverable' : ''} ${className}`}
        style={{
          overflow: 'hidden',
          transition: hoverable
            ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
          ...presetStyles,
          ...style,
        }}
        {...props}
      >
        <style>{`
          :root[data-theme="dark"] .boost-card {
            background-color: #1e293b;
            border-color: rgba(255, 255, 255, 0.1);
            color: #f8fafc;
          }
          :root[data-theme="dark"] .boost-card-preset-neo-brutalism {
            background-color: #18181b !important;
            border-color: #f8fafc !important;
            box-shadow: 5px 5px 0px #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-card-preset-glassmorphism {
            background-color: rgba(15, 23, 42, 0.85) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-card-preset-neumorphism {
            background-color: #0f172a !important;
            box-shadow: 8px 8px 16px #090d15, -8px -8px 16px #151d2c !important;
          }
          :root[data-theme="dark"] .boost-card-preset-gradient-glow {
            background-color: #0f172a !important;
            border-color: rgba(99, 102, 241, 0.5) !important;
            box-shadow: 0 0 25px rgba(99, 102, 241, 0.35) !important;
          }
          :root[data-theme="dark"] .boost-card-preset-material-you {
            background-color: #1e293b !important;
          }
          :root[data-theme="dark"] .boost-card-preset-dark-first {
            background-color: #090d16 !important;
            border-color: #1e293b !important;
          }
          :root[data-theme="dark"] .boost-card-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-card-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-card-description {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-card-content {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-card-footer {
            background-color: #141e2e !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          .boost-card-preset-neo-brutalism.boost-card-hoverable:hover {
            transform: translate(-3px, -3px) !important;
            box-shadow: 8px 8px 0px #000000 !important;
          }
          :root[data-theme="dark"] .boost-card-preset-neo-brutalism.boost-card-hoverable:hover {
            box-shadow: 8px 8px 0px #f8fafc !important;
          }
          .boost-card-preset-gradient-glow.boost-card-hoverable:hover {
            box-shadow: 0 0 35px rgba(99, 102, 241, 0.45) !important;
          }
          :root[data-theme="dark"] .boost-card-hoverable:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.6);
          }
        `}</style>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', style, children, ...props }) => (
  <div
    style={{
      padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 24px)',
      borderBottom: '1px solid var(--boost-border, #f1f5f9)',
      boxSizing: 'border-box',
      ...style,
    }}
    className={`boost-card-header ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', style, children, ...props }) => (
  <h3
    style={{
      margin: 0,
      fontSize: 'clamp(16px, 1.8vw, 19px)',
      fontWeight: 700,
      color: 'var(--boost-text, #0f172a)',
      letterSpacing: '-0.015em',
      ...style,
    }}
    className={`boost-card-title ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ className = '', style, children, ...props }) => (
  <p
    style={{
      margin: '4px 0 0 0',
      fontSize: '13px',
      color: 'var(--boost-text-muted, #64748b)',
      lineHeight: 1.55,
      ...style,
    }}
    className={`boost-card-description ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<CardContentProps> = ({ className = '', style, children, ...props }) => (
  <div
    style={{
      padding: 'clamp(14px, 2.5vw, 24px) clamp(16px, 3vw, 24px)',
      boxSizing: 'border-box',
      color: 'var(--boost-text, #0f172a)',
      ...style,
    }}
    className={`boost-card-content ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', style, children, ...props }) => (
  <div
    style={{
      padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
      borderTop: '1px solid var(--boost-border, #f1f5f9)',
      backgroundColor: 'var(--boost-surface-secondary, #f8fafc)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '10px',
      boxSizing: 'border-box',
      ...style,
    }}
    className={`boost-card-footer ${className}`}
    {...props}
  >
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
