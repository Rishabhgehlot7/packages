import * as React from 'react';


/**
 * SuccessMessageProps — Properties for the success message component.
 */
export interface SuccessMessageProps {
  title?: string;
  message?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  description,
  className = '',
  style,
}) => {
  const desc = description || message;

  return (
    <div
      className={`boost-success-message ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '16px 18px',
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.25)',
        borderRadius: 'var(--boost-radius, 12px)',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          marginTop: '2px',
          display: 'flex',
          color: '#16a34a',
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h4
            style={{
              margin: '0 0 4px 0',
              fontSize: '15px',
              fontWeight: 700,
              color: '#16a34a',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h4>
        )}
        {desc && (
          <div
            style={{
              fontSize: '13.5px',
              color: 'var(--boost-text-muted, #94a3b8)',
              lineHeight: 1.55,
            }}
          >
            {desc}
          </div>
        )}
      </div>
    </div>
  );
};

SuccessMessage.displayName = 'SuccessMessage';
