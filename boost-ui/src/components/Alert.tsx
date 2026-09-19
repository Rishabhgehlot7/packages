import * as React from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'destructive' | 'error';

export interface AlertProps {
  title?: string;
  children?: React.ReactNode;
  description?: React.ReactNode;
  variant?: AlertVariant;
  type?: AlertVariant;
  icon?: React.ReactNode;
  onClose?: () => void;
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
  className = '',
  style,
}) => {
  const activeVariant = type || variant || 'info';
  const content = description || children;

  const getTheme = () => {
    switch (activeVariant) {
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.1)',
          border: 'rgba(34, 197, 94, 0.25)',
          titleColor: '#16a34a',
          textColor: 'var(--boost-text-muted, #94a3b8)',
          iconColor: '#16a34a',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.25)',
          titleColor: '#d97706',
          textColor: 'var(--boost-text-muted, #94a3b8)',
          iconColor: '#d97706',
        };
      case 'destructive':
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.25)',
          titleColor: '#ef4444',
          textColor: 'var(--boost-text-muted, #94a3b8)',
          iconColor: '#ef4444',
        };
      case 'info':
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.1)',
          border: 'rgba(59, 130, 246, 0.25)',
          titleColor: '#2563eb',
          textColor: 'var(--boost-text-muted, #94a3b8)',
          iconColor: '#2563eb',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`boost-alert boost-alert-${activeVariant} ${className}`}
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: 'var(--boost-radius, 10px)',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ marginTop: '2px', display: 'flex', color: theme.iconColor, flexShrink: 0 }}>
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
          <h4
            style={{
              margin: '0 0 3px 0',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.titleColor,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h4>
        )}
        {content && (
          <div style={{ fontSize: '13px', color: theme.textColor, lineHeight: 1.5 }}>
            {content}
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'currentColor',
            opacity: 0.6,
            display: 'flex',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
