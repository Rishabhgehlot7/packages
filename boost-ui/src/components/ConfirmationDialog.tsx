import * as React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning' | 'destructive';
  confirmVariant?: 'danger' | 'primary' | 'warning' | 'destructive';
  isLoading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  confirmVariant,
  isLoading = false,
  className = '',
  style,
}) => {
  // Respect confirmVariant if passed, fallback to variant
  const activeVariant = confirmVariant || variant;
  const isDestructive = activeVariant === 'danger' || activeVariant === 'destructive';
  const isWarning = activeVariant === 'warning';

  const getButtonVariant = (): 'primary' | 'destructive' | 'outline' => {
    if (isDestructive) return 'destructive';
    return 'primary';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
      className={className}
      style={style}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            style={
              isWarning
                ? { backgroundColor: '#d97706', borderColor: '#d97706', color: '#ffffff' }
                : undefined
            }
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: isDestructive
              ? 'rgba(239, 68, 68, 0.12)'
              : isWarning
              ? 'rgba(245, 158, 11, 0.12)'
              : 'rgba(59, 130, 246, 0.12)',
            color: isDestructive ? '#ef4444' : isWarning ? '#d97706' : '#2563eb',
          }}
        >
          {isDestructive ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : isWarning ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--boost-text, #0f172a)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '13.5px',
              color: 'var(--boost-text-muted, #64748b)',
              lineHeight: 1.55,
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

ConfirmationDialog.displayName = 'ConfirmationDialog';
