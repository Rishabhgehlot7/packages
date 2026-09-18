import * as React from 'react';

export interface SnackbarProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
  isOpen: boolean;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  actionText,
  onAction,
  isOpen,
  onClose,
  duration = 4000,
  className = '',
}) => {
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
        padding: '10px 18px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '13px',
        fontWeight: 500,
        zIndex: 1000,
        fontFamily: 'inherit',
      }}
    >
      <span>{message}</span>

      {actionText && onAction && (
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
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};


Snackbar.displayName = 'Snackbar';
