import * as React from 'react';

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  position = 'bottom-right',
  className = '',
  style,
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

  return (
    <button
      className={`boost-fab ${className}`}
      style={{
        position: 'fixed',
        zIndex: 999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: label ? '12px 20px' : '14px',
        borderRadius: label ? '9999px' : '50%',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: 'none',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
        fontWeight: 600,
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...getPositionStyles(),
        ...style,
      }}
      {...props}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};


FloatingActionButton.displayName = 'FloatingActionButton';
