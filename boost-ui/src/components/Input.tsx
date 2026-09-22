import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

/**
 * InputProps — Properties for the Input component.
 * Extends native HTML input attributes.
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter name" size="md" leftIcon={<SearchIcon />} />
 * ```
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  stylePreset?: UIStylePreset;
}

export const Input = /* @__PURE__ */ React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
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
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const getPresetStyles = (): React.CSSProperties => {
      switch (preset) {
        case 'neo-brutalism':
          return {
            borderRadius: '0px',
            border: '2px solid var(--boost-border, #000000)',
            backgroundColor: 'var(--boost-surface, #ffffff)',
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
            boxShadow: 'var(--card-shadow, 6px 6px 12px #c5cad3, -6px -6px 12px #ffffff)',
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
            borderRadius: 'var(--boost-radius, 10px)',
          };
      }
    };

    const presetStyle = getPresetStyles();

    return (
      <div
        className={`boost-input-wrapper ${className}`}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'inherit',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--boost-text, #334155)',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </label>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {leftIcon && (
            <span
              style={{
                position: 'absolute',
                left: '12px',
                display: 'inline-flex',
                color: 'var(--boost-muted, #64748b)',
                pointerEvents: 'none',
              }}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`boost-input-preset-${preset}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error && inputId
                ? `${inputId}-error`
                : helperText && inputId
                ? `${inputId}-helper`
                : undefined
            }
            style={{
              ...presetStyle,
              width: '100%',
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingLeft: leftIcon ? '38px' : '14px',
              paddingRight: rightIcon ? '38px' : '14px',
              fontSize: '14px',
              color: 'var(--boost-text, #0f172a)',
              border: (presetStyle.border as string | undefined) ?? (error ? '1px solid #ef4444' : '1px solid var(--boost-border, #cbd5e1)'),
              borderRadius: (presetStyle.borderRadius as string | undefined) ?? 'var(--boost-radius, 10px)',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              boxSizing: 'border-box',
              backgroundColor: disabled
                ? 'rgba(0, 0, 0, 0.04)'
                : ((presetStyle.backgroundColor as string | undefined) ?? 'var(--boost-surface, #ffffff)'),
              borderColor: error ? '#ef4444' : undefined,
              ...style,
            }}
            {...props}
          />

          {rightIcon && (
            <span
              style={{
                position: 'absolute',
                right: '12px',
                display: 'inline-flex',
                color: 'var(--boost-muted, #64748b)',
              }}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <span
            id={inputId ? `${inputId}-error` : undefined}
            role="alert"
            style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={inputId ? `${inputId}-helper` : undefined}
            style={{ fontSize: '12px', color: 'var(--boost-muted, #64748b)' }}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
