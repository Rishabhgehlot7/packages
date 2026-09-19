import * as React from 'react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  description,
  onRetry,
  retryText = 'Try Again',
  className = '',
  style,
}) => {
  const desc = description || message || 'An unexpected error occurred while loading this content. Please try again.';

  return (
    <div
      className={`boost-error-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        textAlign: 'center',
        fontFamily: 'inherit',
        backgroundColor: 'rgba(239, 68, 68, 0.06)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--boost-radius, 12px)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.14)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h4
        style={{
          margin: '0 0 6px 0',
          fontSize: '16px',
          fontWeight: 700,
          color: '#ef4444',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h4>

      <p
        style={{
          margin: '0 0 18px 0',
          fontSize: '13.5px',
          color: 'var(--boost-text-muted, #94a3b8)',
          maxWidth: '380px',
          lineHeight: 1.55,
        }}
      >
        {desc}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--boost-radius, 8px)',
            padding: '8px 18px',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
            transition: 'all 0.15s ease',
          }}
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

ErrorState.displayName = 'ErrorState';
