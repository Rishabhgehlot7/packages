import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';


/**
 * AlertVariant — Semantic color variants for Alert component.
 * - 'info': Blue (default)
 * - 'success': Green
 * - 'warning': Amber
 * - 'destructive': Red
 * - 'error': Red (same as destructive)
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'destructive' | 'error';

/**
 * AlertProps — Properties for the Alert/Notification banner component.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Done!" description="Operation completed." />
 * ```
 */
export interface AlertProps {
  title?: string;
  children?: React.ReactNode;
  description?: React.ReactNode;
  variant?: AlertVariant;
  type?: AlertVariant;
  icon?: React.ReactNode;
  onClose?: () => void;
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  description,
  variant,
  type,
  icon,
  onClose,
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const activeVariant = type || variant || 'info';
  const content = description || children;

  const getVariantColors = () => {
    switch (activeVariant) {
      case 'success': return { bg: 'var(--boost-success-bg, rgba(22,163,74,0.1))', border: 'var(--boost-success-border, rgba(22,163,74,0.25))', titleColor: 'var(--boost-success-text, #15803d)', textColor: 'var(--boost-text-muted, #64748b)', iconColor: 'var(--boost-success, #16a34a)' };
      case 'warning': return { bg: 'var(--boost-warning-bg, rgba(245,158,11,0.1))', border: 'var(--boost-warning-border, rgba(245,158,11,0.25))', titleColor: 'var(--boost-warning-text, #b45309)', textColor: 'var(--boost-text-muted, #64748b)', iconColor: 'var(--boost-warning, #f59e0b)' };
      case 'destructive':
      case 'error':    return { bg: 'var(--boost-destructive-bg, rgba(239,68,68,0.1))', border: 'var(--boost-destructive-border, rgba(239,68,68,0.25))', titleColor: 'var(--boost-destructive-text, #dc2626)', textColor: 'var(--boost-text-muted, #64748b)', iconColor: 'var(--boost-destructive, #ef4444)' };
      default:         return { bg: 'var(--boost-info-bg, rgba(37,99,235,0.1))', border: 'var(--boost-info-border, rgba(37,99,235,0.25))', titleColor: 'var(--boost-info-text, #1d4ed8)', textColor: 'var(--boost-text-muted, #64748b)', iconColor: 'var(--boost-info, #2563eb)' };
    }
  };

  const colors = getVariantColors();

  const getContainerStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '14px 16px', fontFamily: 'inherit', boxSizing: 'border-box',
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, backgroundColor: colors.bg, border: `3px solid ${colors.iconColor}`, borderRadius: '2px', boxShadow: `4px 4px 0px ${colors.iconColor}` };
      case 'glassmorphism':
        return { ...base, backgroundColor: `${colors.bg}`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: `1px solid ${colors.border}`, borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' };
      case 'neumorphism':
        return { ...base, backgroundColor: 'var(--boost-neuro-surface, var(--boost-surface, #e0e5ec))', border: 'none', borderRadius: '16px', boxShadow: 'var(--card-shadow, 6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff)', borderLeft: `4px solid ${colors.iconColor}` };
      case 'gradient-glow':
        return { ...base, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '12px', boxShadow: `0 0 16px ${colors.bg}` };
      case 'material-you':
        return { ...base, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '24px' };
      case 'dark-first':
        return { ...base, backgroundColor: 'var(--boost-surface, #0f172a)', border: `1px solid ${colors.border}`, borderRadius: '10px', borderLeft: `3px solid ${colors.iconColor}` };
      default:
        return { ...base, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 'var(--boost-radius, 10px)' };
    }
  };

  const isAssertive = activeVariant === 'error';

  return (
    <div
      className={`boost-alert boost-alert-${activeVariant} boost-alert-preset-${preset} ${className}`}
      role="alert"
      aria-live={isAssertive ? 'assertive' : 'polite'}
      style={{ ...getContainerStyles(), ...style }}
    >
      <div style={{ marginTop: '2px', display: 'flex', color: colors.iconColor, flexShrink: 0 }}>
        {icon ? icon : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 600, color: colors.titleColor, letterSpacing: '-0.01em' }}>
            {title}
          </h4>
        )}
        {content && (
          <div style={{ fontSize: '13px', color: preset === 'neo-brutalism' ? 'var(--boost-text, #000)' : colors.textColor, lineHeight: 1.5 }}>
            {content}
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'currentColor', opacity: 0.6, display: 'flex', transition: 'opacity 0.15s ease' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
