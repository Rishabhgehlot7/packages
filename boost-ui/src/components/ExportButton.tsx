import React from 'react';

export interface ExportButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onExport?: (format: 'csv' | 'xlsx' | 'pdf' | 'json') => void;
  format?: 'csv' | 'xlsx' | 'pdf' | 'json';
  label?: string;
  loading?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  format = 'csv',
  label,
  loading = false,
  style,
  ...props
}) => {
  const displayLabel = label || `Export ${format.toUpperCase()}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    if (onExport) {
      onExport(format);
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || props.disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        fontSize: '13px',
        fontWeight: 500,
        color: '#334155',
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        opacity: loading || props.disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <svg
          style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" opacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      <span>{displayLabel}</span>
    </button>
  );
};


ExportButton.displayName = 'ExportButton';
