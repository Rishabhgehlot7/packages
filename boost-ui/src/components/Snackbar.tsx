import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface SnackbarProps {
  message: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  duration?: number;
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  actionText,
  actionLabel,
  onAction,
  isOpen = true,
  onClose,
  duration = 4000,
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const btnLabel = actionLabel || actionText;

  React.useEffect(() => {
    if (!isOpen || !onClose) return;
    const timer = setTimeout(() => { onClose(); }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  const getContainerStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      display: 'inline-flex', alignItems: 'center', gap: '16px',
      fontSize: '13.5px', fontWeight: 500, zIndex: 1000,
      fontFamily: 'inherit', maxWidth: 'calc(100vw - 32px)', boxSizing: 'border-box',
      padding: '10px 18px',
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, backgroundColor: '#fbbf24', color: '#000', border: '3px solid #000', borderRadius: '2px', boxShadow: '4px 4px 0px #000' };
      case 'glassmorphism':
        return { ...base, backgroundColor: 'rgba(15,23,42,0.75)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' };
      case 'neumorphism':
        return { ...base, backgroundColor: '#e0e5ec', color: '#0f172a', border: 'none', borderRadius: '9999px', boxShadow: '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff' };
      case 'gradient-glow':
        return { ...base, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 0 24px rgba(99,102,241,0.5)' };
      case 'material-you':
        return { ...base, backgroundColor: '#1c1b1f', color: '#e6e1e5', border: 'none', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' };
      case 'dark-first':
        return { ...base, backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b', borderRadius: '10px', boxShadow: '0 0 20px rgba(59,130,246,0.2)' };
      default:
        return { ...base, backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)' };
    }
  };

  const actionColor = preset === 'neo-brutalism' ? '#1d4ed8' : preset === 'neumorphism' ? '#2563eb' : '#60a5fa';

  return (
    <div
      className={`boost-snackbar boost-snackbar-preset-${preset} ${className}`}
      role="status"
      style={{ ...getContainerStyles(), ...style }}
    >
      <span>{message}</span>
      {btnLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{ background: 'none', border: 'none', color: actionColor, fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0, transition: 'opacity 0.15s ease', fontFamily: 'inherit' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
};

Snackbar.displayName = 'Snackbar';
