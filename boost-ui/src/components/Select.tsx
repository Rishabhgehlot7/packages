import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

/**
 * SelectOption — A single option item for Select component.
 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/**
 * SelectProps — Properties for the Select dropdown component.
 *
 * @example
 * ```tsx
 * <Select
 *   options={[{ value: '1', label: 'Option 1' }]}
 *   placeholder="Choose..."
 * />
 * ```
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  stylePreset?: UIStylePreset;
}

export const Select = /* @__PURE__ */ React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder,
      fullWidth = true,
      disabled,
      className = '',
      id,
      style,
      stylePreset: stylePresetProp,
      ...props
    },
    ref
  ) => {
    const { stylePreset: inheritedPreset } = useBoostPreset();
    const preset = stylePresetProp ?? inheritedPreset;
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const getPresetStyles = (): React.CSSProperties => {
      switch (preset) {
        case 'neo-brutalism':
          return {
            borderRadius: '0px',
            border: '2px solid #000',
            backgroundColor: '#ffffff',
            boxShadow: 'none',
          };
        case 'glassmorphism':
          return {
            borderRadius: '12px',
            border: '1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))',
            backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.75))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          };
        case 'neumorphism':
          return {
            borderRadius: '16px',
            border: 'none',
            backgroundColor: 'var(--boost-surface, #eef0f4)',
            boxShadow: '6px 6px 12px #c5cad3, -6px -6px 12px #ffffff',
          };
        case 'gradient-glow':
          return {
            border: '1px solid rgba(99, 102, 241, 0.3)',
          };
        case 'material-you':
          return {
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          };
        case 'dark-first':
          return {
            border: '1px solid var(--boost-border, #232a37)',
            backgroundColor: 'var(--boost-surface, #0b0f17)',
          };
        case 'minimal':
        default:
          return {
            borderRadius: 'var(--boost-radius, 8px)',
          };
      }
    };

    return (
      <div
        className={`boost-select-wrapper ${className}`}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'inherit',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        <style>{`
          .boost-select {
            background-color: var(--boost-surface, #ffffff);
            color: var(--boost-text, #0f172a);
            border: 1px solid var(--boost-border, #cbd5e1);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          :root[data-theme="dark"] .boost-select,
          .dark .boost-select {
            background-color: var(--boost-surface, #1e293b);
            border-color: var(--boost-border, rgba(255, 255, 255, 0.12));
            color: var(--boost-text, #f8fafc);
          }
          :root[data-theme="dark"] .boost-select option,
          .dark .boost-select option {
            background-color: var(--boost-surface, #1e293b) !important;
            color: var(--boost-text, #f8fafc) !important;
          }
          .boost-select:focus {
            border-color: var(--boost-primary, #2563eb) !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18) !important;
          }
          .boost-select-preset-neo-brutalism:focus {
            box-shadow: 3px 3px 0px #000000 !important;
            border-color: #000000 !important;
          }
          :root[data-theme="dark"] .boost-select-preset-neo-brutalism {
            background-color: #18181b !important;
            border-color: var(--boost-text, #f8fafc) !important;
          }
          :root[data-theme="dark"] .boost-select-preset-neo-brutalism:focus {
            box-shadow: 3px 3px 0px #f8fafc !important;
            border-color: var(--boost-text, #f8fafc) !important;
          }
          :root[data-theme="dark"] .boost-select-preset-glassmorphism {
            background-color: rgba(15, 23, 42, 0.8) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-select-preset-neumorphism {
            background-color: var(--boost-surface, #0f172a) !important;
            box-shadow: 6px 6px 12px #090d15, -6px -6px 12px #151d2c !important;
          }
          .boost-select-preset-gradient-glow:focus {
            border-color: rgba(99, 102, 241, 0.8) !important;
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.4) !important;
          }
        `}</style>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--boost-text, #334155)',
            }}
          >
            {label}
          </label>
        )}

        <div style={{ position: 'relative', width: '100%' }}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`boost-select boost-select-preset-${preset}`}
            style={{
              width: '100%',
              paddingTop: '9px',
              paddingBottom: '9px',
              paddingLeft: '12px',
              paddingRight: '36px',
              fontSize: '14px',
              borderRadius: 'var(--boost-radius, 8px)',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
              borderColor: error ? '#ef4444' : undefined,
              ...getPresetStyles(),
              ...style,
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* SVG Chevron Down Icon */}
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--boost-text-muted, #64748b)',
              display: 'flex',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {error ? (
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}>
            {error}
          </span>
        ) : helperText ? (
          <span style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
