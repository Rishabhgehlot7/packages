import * as React from 'react';

export interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  onRemove,
  color = '#e2e8f0',
  className = '',
}) => {
  return (
    <span
      className={`boost-tag ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        backgroundColor: color,
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#0f172a',
        fontFamily: 'inherit',
      }}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
};


Tag.displayName = 'Tag';
