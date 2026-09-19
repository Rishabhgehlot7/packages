import * as React from 'react';

export interface TagProps {
  label?: string;
  children?: React.ReactNode;
  onRemove?: () => void;
  color?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Tag: React.FC<TagProps> = ({
  label,
  children,
  onRemove,
  color,
  variant = 'default',
  size = 'md',
  className = '',
  style,
}) => {
  const content = children !== undefined ? children : label;

  const getVariantStyles = (): { bg: string; color: string; border: string } => {
    if (color) {
      return { bg: color, color: '#0f172a', border: 'transparent' };
    }
    switch (variant) {
      case 'primary':
        return {
          bg: 'rgba(59, 130, 246, 0.12)',
          color: '#2563eb',
          border: 'rgba(59, 130, 246, 0.25)',
        };
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.12)',
          color: '#16a34a',
          border: 'rgba(34, 197, 94, 0.25)',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          color: '#d97706',
          border: 'rgba(245, 158, 11, 0.25)',
        };
      case 'destructive':
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          border: 'rgba(239, 68, 68, 0.25)',
        };
      case 'purple':
        return {
          bg: 'rgba(168, 85, 247, 0.12)',
          color: '#9333ea',
          border: 'rgba(168, 85, 247, 0.25)',
        };
      case 'default':
      default:
        return {
          bg: 'var(--boost-surface-secondary, #f1f5f9)',
          color: 'var(--boost-text, #334155)',
          border: 'var(--boost-border, #e2e8f0)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '2px 8px', fontSize: '11px' };
      case 'lg':
        return { padding: '5px 14px', fontSize: '13px' };
      case 'md':
      default:
        return { padding: '3px 10px', fontSize: '12px' };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <span
      className={`boost-tag boost-tag-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '6px',
        fontWeight: 500,
        fontFamily: 'inherit',
        backgroundColor: vStyles.bg,
        color: vStyles.color,
        border: `1px solid ${vStyles.border}`,
        lineHeight: 1.4,
        userSelect: 'none',
        ...sStyles,
        ...style,
      }}
    >
      <style>{`
        :root[data-theme="dark"] .boost-tag-default {
          background-color: #1e293b !important;
          color: #f1f5f9 !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }
      `}</style>
      <span>{content}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove tag"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'currentColor',
            opacity: 0.7,
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
};

Tag.displayName = 'Tag';
