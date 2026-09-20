import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const Switch = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onChange = () => {},
      label,
      description,
      disabled = false,
      size = 'md',
      className = '',
      style,
      stylePreset: stylePresetProp,
    },
    ref
  ) => {
    const { stylePreset: inheritedPreset } = useBoostPreset();
    const preset = stylePresetProp ?? inheritedPreset;

    const getPresetStyles = (): { track: React.CSSProperties; thumb: React.CSSProperties } => {
      switch (preset) {
        case 'neo-brutalism':
          return { track: { borderRadius: '6px', border: '2px solid var(--boost-border, #000000)' }, thumb: { borderRadius: '3px' } };
        case 'glassmorphism':
          return {
            track: {
              backgroundColor: 'rgba(148, 163, 184, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            },
            thumb: {},
          };
        case 'neumorphism':
          return {
            track: {
              backgroundColor: 'var(--boost-surface-secondary, #d7dce3)',
              border: 'none',
              boxShadow: 'var(--canvas-shadow, inset 4px 4px 8px #c5cad3, inset -4px -4px 8px #ffffff)',
            },
            thumb: { backgroundColor: 'var(--boost-surface, #eef0f4)', boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)' },
          };
        case 'gradient-glow':
          return { track: {}, thumb: { boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)' } };
        case 'material-you':
          return { track: {}, thumb: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)' } };
        case 'dark-first':
          return { track: { backgroundColor: '#232a37', border: '1px solid #2f3a4d' }, thumb: {} };
        case 'minimal':
        default:
          return { track: {}, thumb: {} };
      }
    };

    const presetStyle = getPresetStyles();
    const getSizes = () => {
      switch (size) {
        case 'sm': return { width: 32, height: 18, circle: 14, translate: 14 };
        case 'lg': return { width: 52, height: 28, circle: 22, translate: 24 };
        case 'md':
        default: return { width: 44, height: 24, circle: 18, translate: 20 };
      }
    };

    const s = getSizes();

    return (
      <label
        className={`boost-switch-wrapper ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          userSelect: 'none',
          fontFamily: 'inherit',
          ...style,
        }}
      >
        <style>{`
          .boost-switch-btn {
            background-color: #cbd5e1;
          }
          :root[data-theme="dark"] .boost-switch-btn:not([aria-checked="true"]) {
            background-color: #334155 !important;
          }
          .boost-switch-btn[aria-checked="true"] {
            background-color: var(--boost-primary, #2563eb) !important;
          }
        `}</style>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`boost-switch-btn boost-switch-preset-${preset}`}
          style={{
            width: `${s.width}px`,
            height: `${s.height}px`,
            borderRadius: '9999px',
            position: 'relative',
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            border: 'none',
            padding: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            flexShrink: 0,
            ...presetStyle.track,
          }}
        >
          <span
            className="boost-switch-thumb"
            style={{
              width: `${s.circle}px`,
              height: `${s.circle}px`,
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '3px',
              transform: `translateY(-50%) translateX(${checked ? `${s.translate}px` : '0px'})`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
              display: 'block',
              ...presetStyle.thumb,
            }}
          />
        </button>

        {(label || description) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {label && (
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--boost-text, #1e293b)' }}>
                {label}
              </span>
            )}
            {description && (
              <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
