import * as React from 'react';

export interface SuccessMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  className = '',
}) => {
  return (
    <div
      className={`boost-success-message ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '8px',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ marginTop: '2px', display: 'flex', color: '#16a34a' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
            {title}
          </h4>
        )}
        <div style={{ fontSize: '13px', color: '#166534', lineHeight: 1.5 }}>
          {message}
        </div>
      </div>
    </div>
  );
};


SuccessMessage.displayName = 'SuccessMessage';
