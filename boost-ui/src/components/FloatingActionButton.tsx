import * as React from 'react';

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  position = 'bottom-right',
  className = '',
  style,
  children,
  ...props
}) => {
  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'bottom-left': return { bottom: '24px', left: '24px' };
      case 'top-right': return { top: '24px', right: '24px' };
      case 'top-left': return { top: '24px', left: '24px' };
      case 'bottom-right':
      default: return { bottom: '24px', right: '24px' };
    }
  };

  const defaultIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );

  const effectiveIcon = icon || children || defaultIcon;

  return (
    <button
      type="button"
      className={`boost-fab ${className}`}
      style={{
        position: 'fixed',
        zIndex: 999,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: label ? '12px 20px' : '14px',
        minWidth: label ? 'auto' : '48px',
        minHeight: '48px',
        borderRadius: label ? '9999px' : '50%',
        backgroundColor: 'var(--boost-primary, #2563eb)',
        color: '#ffffff',
        border: 'none',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.45)',
        fontWeight: 600,
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...getPositionStyles(),
        ...style,
      }}
      {...props}
    >
      {effectiveIcon}
      {label && <span>{label}</span>}
    </button>
  );
};

FloatingActionButton.displayName = 'FloatingActionButton';
