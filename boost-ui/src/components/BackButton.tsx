import * as React from 'react';


/**
 * BackButtonProps — Properties for the back navigation button.
 */
export interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onBack?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  onBack,
  className = '',
  style,
  ...props
}) => {
  const handleClick = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history) {
      window.history.back();
    }
  };

  return (
    <>
      <style>
        {`
          :root[data-theme="dark"] .boost-back-btn,
          .dark .boost-back-btn {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-back-btn:hover,
          .dark .boost-back-btn:hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.06) !important;
          }
        `}
      </style>
      <button
        type="button"
        onClick={handleClick}
        className={`boost-back-btn ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--boost-text-muted, #475569)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: 'var(--boost-radius, 8px)',
          fontFamily: 'inherit',
          transition: 'color 0.15s ease, background-color 0.15s ease',
          ...style,
        }}
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>{label}</span>
      </button>
    </>
  );
};


BackButton.displayName = 'BackButton';
