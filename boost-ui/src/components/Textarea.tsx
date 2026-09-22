import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

/**
 * TextareaProps — Properties for the Textarea component.
 * Extends native HTML textarea attributes.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Write a review..." rows={4} />
 * ```
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxChars?: number;
  showCount?: boolean;
  fullWidth?: boolean;
  stylePreset?: UIStylePreset;
}

export const Textarea = /* @__PURE__ */ React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxChars,
      maxLength,
      showCount = false,
      fullWidth = true,
      disabled,
      className = '',
      id,
      value,
      onChange,
      style,
      stylePreset: stylePresetProp,
      ...props
    },
    ref
  ) => {
    const { stylePreset: inheritedPreset } = useBoostPreset();
    const preset = stylePresetProp ?? inheritedPreset;
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const limit = maxLength || maxChars;
    const charCount = typeof value === 'string' ? value.length : 0;
    const shouldShowCount = showCount || Boolean(maxChars);

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

    const presetStyle = getPresetStyles();

    return (
      <div
        className={`boost-textarea-wrapper ${className}`}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'inherit',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        <style>{`
          .boost-textarea {
            background-color: var(--boost-surface, #ffffff);
            color: var(--boost-text, #0f172a);
            border: 1px solid var(--boost-border, #cbd5e1);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          :root[data-theme="dark"] .boost-textarea,
          .dark .boost-textarea {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: var(--boost-border, rgba(255, 255, 255, 0.12)) !important;
            color: var(--boost-text, #f8fafc) !important;
          }
          .boost-textarea:focus {
            border-color: var(--boost-primary, #2563eb) !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18) !important;
          }
        `}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <label
              htmlFor={textareaId}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--boost-text, #334155)',
              }}
            >
              {label}
            </label>
          )}

          {shouldShowCount && limit && (
            <span style={{ fontSize: '11px', color: charCount > limit ? '#ef4444' : 'var(--boost-text-muted, #64748b)' }}>
              {charCount}/{limit}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          value={value}
          onChange={onChange}
          maxLength={limit}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error && textareaId
              ? `${textareaId}-error`
              : helperText && textareaId
              ? `${textareaId}-helper`
              : undefined
          }
          className={`boost-textarea boost-textarea-preset-${preset}`}
          style={{
            ...presetStyle,
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: (presetStyle.borderRadius as string | undefined) ?? 'var(--boost-radius, 8px)',
            outline: 'none',
            minHeight: '90px',
            resize: 'vertical',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            border: (presetStyle.border as string | undefined) ?? '1px solid var(--boost-border, #cbd5e1)',
            borderColor: error ? '#ef4444' : undefined,
            backgroundColor: disabled
              ? 'rgba(0, 0, 0, 0.04)'
              : ((presetStyle.backgroundColor as string | undefined) ?? 'var(--boost-surface, #ffffff)'),
            ...style,
          }}
          {...props}
        />

        {error ? (
          <span
            id={textareaId ? `${textareaId}-error` : undefined}
            role="alert"
            style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500 }}
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={textareaId ? `${textareaId}-helper` : undefined}
            style={{ fontSize: '12px', color: 'var(--boost-text-muted, #64748b)' }}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
