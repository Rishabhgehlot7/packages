import React from 'react';


/**
 * ExportButtonProps — Properties for the data export button.
 */
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
    <>
      <style>
        {`
          :root[data-theme="dark"] .boost-export-btn,
          .dark .boost-export-btn {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-export-btn:hover:not(:disabled),
          .dark .boost-export-btn:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.25) !important;
          }
        `}
      </style>
      <button
        onClick={handleClick}
        disabled={loading || props.disabled}
        className={`boost-export-btn ${props.className || ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--boost-text, #334155)',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: '1px solid var(--boost-border, #cbd5e1)',
          borderRadius: 'var(--boost-radius, 8px)',
          cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
          opacity: loading || props.disabled ? 0.6 : 1,
          boxShadow: 'var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.03))',
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
    </>
  );
};


ExportButton.displayName = 'ExportButton';
