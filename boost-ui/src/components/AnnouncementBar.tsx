import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

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
  stylePreset?: UIStylePreset;
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
  backgroundColor,
  textColor,
  accentColor = '#fbbf24',
  onClose,
  stylePreset: stylePresetProp,
  className = '',
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [isVisible, setIsVisible] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const raw = messages || text || (props as any).text || ['Welcome to our store! Free shipping on all orders.'];
  const messageList = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);

  const getBarStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '10px 18px',
      fontSize: '13px',
      fontWeight: 600,
      position: 'relative',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
    };
    if (backgroundColor || textColor) {
      return {
        ...base,
        background: backgroundColor || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
        color: textColor || '#ffffff',
        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
      };
    }
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          background: '#fbbf24',
          color: '#000000',
          border: '2px solid #000000',
          borderRadius: '2px',
          boxShadow: '3px 3px 0px #000000',
          fontWeight: 700,
        };
      case 'glassmorphism':
        return {
          ...base,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: 'var(--boost-text-primary, #0f172a)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        };
      case 'neumorphism':
        return {
          ...base,
          background: '#e0e5ec',
          color: '#334155',
          border: 'none',
          borderRadius: '14px',
          boxShadow: '4px 4px 10px #d1d9e6, -4px -4px 10px #ffffff',
        };
      case 'gradient-glow':
        return {
          ...base,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.35)',
        };
      case 'material-you':
        return {
          ...base,
          background: 'var(--boost-surface-secondary, #e8def8)',
          color: 'var(--boost-primary, #6750a4)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '24px',
        };
      case 'dark-first':
        return {
          ...base,
          background: '#090d16',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        };
      default:
        return {
          ...base,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
        };
    }
  };

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
        background: backgroundColor,
        color: textColor,
        padding: '10px 18px',
        fontSize: '13px',
        fontWeight: 600,
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
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
