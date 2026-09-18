import * as React from 'react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  avatar?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  onDelete,
  avatar,
  className = '',
}) => {
  return (
    <div
      className={`boost-chip ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: avatar ? '3px 10px 3px 4px' : '4px 12px',
        borderRadius: '9999px',
        backgroundColor: selected ? '#2563eb' : '#f1f5f9',
        color: selected ? '#ffffff' : '#1e293b',
        fontSize: '13px',
        fontWeight: 500,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
      }}
    >
      {avatar && <span style={{ display: 'inline-flex', borderRadius: '50%', overflow: 'hidden' }}>{avatar}</span>}
      <span>{label}</span>
      {onDelete && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            display: 'inline-flex',
            cursor: 'pointer',
            opacity: 0.7,
            marginLeft: '2px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )}
    </div>
  );
};


Chip.displayName = 'Chip';
