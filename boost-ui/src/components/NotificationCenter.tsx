import * as React from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  read?: boolean;
  avatar?: string;
  actionUrl?: string;
  icon?: React.ReactNode;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onItemClick?: (item: NotificationItem) => void;
  onClearAll?: () => void;
  title?: string;
  emptyText?: string;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllAsRead,
  onItemClick,
  onClearAll,
  title = 'Notifications',
  emptyText = 'You have no new notifications.',
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`boost-notification-center ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open notifications"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'inherit',
          transition: 'background-color 0.15s ease',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              minWidth: '16px',
              height: '16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '360px',
            maxWidth: '90vw',
            backgroundColor: 'var(--boost-bg, #ffffff)',
            border: '1px solid var(--boost-border, #e2e8f0)',
            borderRadius: 'var(--boost-radius, 12px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid var(--boost-border, #e2e8f0)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--boost-text, #0f172a)' }}>
                {title}
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    color: 'var(--boost-primary, #2563eb)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '9999px',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {onMarkAllAsRead && unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--boost-primary, #2563eb)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  color: 'var(--boost-text-muted, #64748b)',
                  fontSize: '13px',
                }}
              >
                {emptyText}
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onItemClick && onItemClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 18px',
                    borderBottom: '1px solid var(--boost-border, #f1f5f9)',
                    backgroundColor: item.read ? 'transparent' : 'rgba(37, 99, 235, 0.03)',
                    cursor: onItemClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt=""
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                  ) : item.icon ? (
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
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.read ? 'transparent' : '#2563eb',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                    />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: item.read ? 500 : 700,
                        color: 'var(--boost-text, #0f172a)',
                        marginBottom: '2px',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.title}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--boost-text-muted, #64748b)',
                          lineHeight: 1.4,
                          marginBottom: '4px',
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--boost-text-muted, #94a3b8)',
                      }}
                    >
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {onClearAll && notifications.length > 0 && (
            <div
              style={{
                padding: '10px',
                textAlign: 'center',
                borderTop: '1px solid var(--boost-border, #e2e8f0)',
                backgroundColor: 'var(--boost-surface, #f8fafc)',
              }}
            >
              <button
                type="button"
                onClick={onClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--boost-text-muted, #64748b)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


NotificationCenter.displayName = 'NotificationCenter';
