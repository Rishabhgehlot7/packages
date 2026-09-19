import * as React from 'react';

export interface SnackbarProps {
  message: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  actionText,
  actionLabel,
  onAction,
  isOpen = true,
  onClose,
  duration = 4000,
  className = '',
  style,
}) => {
  const btnLabel = actionLabel || actionText;

  React.useEffect(() => {
    if (!isOpen || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div
      className={`boost-snackbar ${className}`}
      role="status"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '10px 18px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '13.5px',
        fontWeight: 500,
        zIndex: 1000,
        fontFamily: 'inherit',
        maxWidth: 'calc(100vw - 32px)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <span>{message}</span>

      {btnLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            background: 'none',
            border: 'none',
            color: '#60a5fa',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#93c5fd')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#60a5fa')}
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
};

Snackbar.displayName = 'Snackbar';
