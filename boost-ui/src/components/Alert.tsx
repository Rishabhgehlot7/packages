import * as React from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'destructive';

export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  icon,
  onClose,
  className = '',
}) => {
  const getTheme = () => {
    switch (variant) {
      case 'success': return { bg: '#f0fdf4', border: '#86efac', text: '#15803d', iconColor: '#16a34a' };
      case 'warning': return { bg: '#fffbeb', border: '#fde047', text: '#a16207', iconColor: '#ca8a04' };
      case 'destructive': return { bg: '#fef2f2', border: '#fca5a5', text: '#b91c1c', iconColor: '#dc2626' };
      case 'info':
      default: return { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', iconColor: '#2563eb' };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`boost-alert boost-alert-${variant} ${className}`}
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ marginTop: '2px', display: 'flex', color: theme.iconColor }}>
        {icon ? icon : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: theme.text }}>
            {title}
          </h4>
        )}
        <div style={{ fontSize: '13px', color: theme.text, lineHeight: 1.5 }}>
          {children}
        </div>
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
            color: theme.text,
            opacity: 0.6,
            display: 'flex',
          }}
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
