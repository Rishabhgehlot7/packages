import * as React from 'react';

export interface ActivityUser {
  name: string;
  avatar?: string;
  role?: string;
}

export interface ActivityItem {
  id: string;
  user: ActivityUser;
  action: string;
  target?: string;
  timestamp: string;
  statusBadge?: {
    label: string;
    variant?: 'success' | 'warning' | 'info' | 'error';
  };
  icon?: React.ReactNode;
}

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[];
  title?: string;
  emptyText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  title,
  emptyText = 'No recent activities found.',
  className = '',
  style,
  ...props
}) => {
  const getBadgeColors = (variant = 'info') => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.12)', color: '#16a34a' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706' };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626' };
      default:
        return { bg: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' };
    }
  };

  return (
    <div
      className={`boost-activity-feed ${className}`}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {title && (
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: '0 0 20px 0',
            color: 'var(--boost-text, #0f172a)',
          }}
        >
          {title}
        </h3>
      )}

      {items.length === 0 ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--boost-text-muted, #64748b)',
            fontSize: '14px',
          }}
        >
          {emptyText}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item, idx) => {
            const badgeStyle = item.statusBadge
              ? getBadgeColors(item.statusBadge.variant)
              : null;

            return (
              <div
                key={item.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: 'var(--boost-radius, 8px)',
                  backgroundColor: 'var(--boost-surface, #f8fafc)',
                  border: '1px solid var(--boost-border, #e2e8f0)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {item.user.avatar ? (
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid var(--boost-border, #cbd5e1)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--boost-primary, #2563eb)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    {item.user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--boost-text, #0f172a)',
                      lineHeight: 1.4,
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{item.user.name}</span>{' '}
                    <span style={{ color: 'var(--boost-text-muted, #64748b)' }}>
                      {item.action}
                    </span>{' '}
                    {item.target && (
                      <span style={{ fontWeight: 600, color: 'var(--boost-text, #0f172a)' }}>
                        {item.target}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--boost-text-muted, #94a3b8)',
                      }}
                    >
                      {item.timestamp}
                    </span>

                    {item.statusBadge && badgeStyle && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.color,
                        }}
                      >
                        {item.statusBadge.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


ActivityFeed.displayName = 'ActivityFeed';
