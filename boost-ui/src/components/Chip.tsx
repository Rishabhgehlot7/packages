import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface ChipProps {
  label?: string;
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  avatar?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  children,
  selected = false,
  onClick,
  onDelete,
  avatar,
  className = '',
  style,
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const content = children !== undefined ? children : label;

  const getPresetStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          borderRadius: '0px',
          border: '2px solid #000',
          boxShadow: selected ? '3px 3px 0 #000' : 'none',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.8))',
          border: '1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        };
      case 'neumorphism':
        return {
          borderRadius: '14px',
          border: 'none',
          boxShadow: selected
            ? '5px 5px 10px #c5cad3, -5px -5px 10px #ffffff'
            : '4px 4px 8px #c5cad3, -4px -4px 8px #ffffff',
        };
      case 'gradient-glow':
        return {
          boxShadow: selected ? '0 0 18px rgba(99, 102, 241, 0.45)' : 'none',
        };
      case 'material-you':
        return {
          boxShadow: selected ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
        };
      case 'dark-first':
        return {
          backgroundColor: 'var(--boost-surface, #0b0f17)',
          border: '1px solid var(--boost-border, #232a37)',
        };
      case 'minimal':
      default:
        return {};
    }
  };

  const presetStyle = getPresetStyles();

  return (
    <div
      className={`boost-chip ${selected ? 'boost-chip-selected' : ''} boost-chip-preset-${preset} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: avatar ? '3px 12px 3px 4px' : '5px 14px',
        borderRadius: '9999px',
        backgroundColor: selected
          ? 'var(--boost-primary, #2563eb)'
          : 'var(--boost-surface-secondary, #f1f5f9)',
        color: selected ? '#ffffff' : 'var(--boost-text, #1e293b)',
        border: selected
          ? '1px solid transparent'
          : '1px solid var(--boost-border, #e2e8f0)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: 'inherit',
        lineHeight: 1.4,
        boxShadow: selected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
        ...presetStyle,
        ...style,
      }}
    >
      <style>{`
        :root[data-theme="dark"] .boost-chip:not(.boost-chip-selected) {
          background-color: #1e293b;
          color: #f1f5f9;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .boost-chip:hover {
          filter: brightness(0.97);
        }
        :root[data-theme="dark"] .boost-chip:hover {
          filter: brightness(1.1);
        }
      `}</style>
      {avatar && (
        <span style={{ display: 'inline-flex', borderRadius: '50%', overflow: 'hidden' }}>
          {avatar}
        </span>
      )}
      <span>{content}</span>
      {onDelete && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          role="button"
          aria-label="Delete chip"
          style={{
            display: 'inline-flex',
            cursor: 'pointer',
            opacity: 0.75,
            marginLeft: '2px',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.75')}
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
