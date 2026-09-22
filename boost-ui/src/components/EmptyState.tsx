import * as React from 'react';


/**
 * EmptyStateProps — Properties for the empty state placeholder component.
 */
export interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLabel,
  onAction,
  icon,
  className = '',
  style,
}) => {
  const btnLabel = actionLabel || actionText;

  return (
    <div
      className={`boost-empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        fontFamily: 'inherit',
        backgroundColor: 'var(--boost-surface, transparent)',
        borderRadius: 'var(--boost-radius, 12px)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <style>{`
        :root[data-theme="dark"] .boost-empty-state-icon,
        .dark .boost-empty-state-icon {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: var(--boost-text-muted, #94a3b8) !important;
        }
        :root[data-theme="dark"] .boost-empty-state-title,
        .dark .boost-empty-state-title {
          color: var(--boost-text, #f8fafc) !important;
        }
        :root[data-theme="dark"] .boost-empty-state-desc,
        .dark .boost-empty-state-desc {
          color: var(--boost-text-muted, #94a3b8) !important;
        }
      `}</style>
      <div
        className="boost-empty-state-icon"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--boost-surface-secondary, #f1f5f9)',
          color: 'var(--boost-text-muted, #64748b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        {icon ? icon : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        )}
      </div>

      <h3
        className="boost-empty-state-title"
        style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--boost-text, #0f172a)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="boost-empty-state-desc"
          style={{
            margin: '0 0 20px 0',
            fontSize: '14px',
            color: 'var(--boost-text-muted, #64748b)',
            maxWidth: '380px',
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>
      )}

      {btnLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            backgroundColor: 'var(--boost-primary, #2563eb)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--boost-radius, 8px)',
            padding: '9px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease',
          }}
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
