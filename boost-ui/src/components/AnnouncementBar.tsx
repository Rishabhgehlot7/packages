import * as React from 'react';

export interface AnnouncementBarProps {
  messages?: string[] | string;
  text?: string;
  couponCode?: string;
  couponBadgeText?: string;
  linkUrl?: string;
  linkText?: string;
  closable?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  onClose?: () => void;
  className?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  messages,
  text,
  couponCode,
  couponBadgeText = 'USE CODE',
  linkUrl,
  linkText,
  closable = true,
  backgroundColor = '#111827',
  textColor = '#ffffff',
  accentColor = '#f59e0b',
  onClose,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const raw = messages || text || (props as any).text || ['Welcome to our store! Free shipping on all orders.'];
  const messageList = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);

  // Auto rotate if multiple messages
  React.useEffect(() => {
    if (messageList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messageList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messageList.length]);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!couponCode) return;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || messageList.length === 0) return null;

  return (
    <div
      className={`boost-announcement-bar ${className}`}
      style={{
        backgroundColor,
        color: textColor,
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 500,
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <span>{messageList[currentIdx]}</span>

        {couponCode && (
          <button
            type="button"
            onClick={handleCopyCode}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: `1px dashed ${accentColor}`,
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 700,
              color: textColor,
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ color: accentColor }}>{couponBadgeText}:</span>
            <span style={{ textDecoration: 'underline' }}>{couponCode}</span>
            {copied ? (
              <span style={{ color: '#10b981', marginLeft: '2px' }}>✓ Copied</span>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        )}

        {linkUrl && linkText && (
          <a
            href={linkUrl}
            style={{
              color: accentColor,
              textDecoration: 'underline',
              fontWeight: 600,
              marginLeft: '4px',
            }}
          >
            {linkText} →
          </a>
        )}
      </div>

      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss banner"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: textColor,
            opacity: 0.7,
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};


AnnouncementBar.displayName = 'AnnouncementBar';
