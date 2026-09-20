import React, { useState } from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface ForgotPasswordProps {
  onSubmit?: (email: string) => void;
  onBackToLogin?: () => void;
  loading?: boolean;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onSubmit,
  onBackToLogin,
  loading = false,
  successMessage,
  errorMessage,
  className = '',
  style,
  stylePreset: stylePresetProp,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubmit?.(email);
  };

  const getCardPresetStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          backgroundColor: '#ffffff',
          border: '3px solid #000000',
          borderRadius: '0px',
          boxShadow: '6px 6px 0px #000000',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        };
      case 'neumorphism':
        return {
          border: 'none',
          backgroundColor: 'var(--boost-surface, #e6ecf5)',
          borderRadius: '20px',
          boxShadow: '8px 8px 18px #d1d9e6, -8px -8px 18px #ffffff',
        };
      case 'gradient-glow':
        return {
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.25)',
          borderRadius: '16px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
        };
      case 'material-you':
        return {
          borderRadius: '28px',
          backgroundColor: 'var(--boost-surface-variant, #f3edf7)',
          border: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        };
      case 'dark-first':
        return {
          border: '1px solid #334155',
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.5)',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '16px',
          boxShadow: 'var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.05))',
        };
    }
  };

  const getInputPresetStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: errorMessage ? '3px solid #ef4444' : '2px solid #000000',
          borderRadius: '0px',
          boxShadow: '2px 2px 0px #000000',
          backgroundColor: '#ffffff',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: errorMessage ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '10px',
        };
      case 'neumorphism':
        return {
          border: 'none',
          backgroundColor: 'var(--boost-surface, #e6ecf5)',
          borderRadius: '10px',
          boxShadow: errorMessage ? 'inset 2px 2px 4px rgba(239, 68, 68, 0.4)' : 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff',
        };
      case 'material-you':
        return {
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          border: errorMessage ? '2px solid #ef4444' : '1px solid rgba(0,0,0,0.08)',
        };
      default:
        return {};
    }
  };

  const getButtonPresetStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          backgroundColor: '#000000',
          color: '#ffffff',
          border: '3px solid #000000',
          borderRadius: '0px',
          boxShadow: '3px 3px 0px #000000',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'var(--boost-primary, #6366f1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
        };
      case 'neumorphism':
        return {
          backgroundColor: 'var(--boost-surface, #e6ecf5)',
          color: 'var(--boost-text-primary, #0f172a)',
          border: 'none',
          borderRadius: '10px',
          boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
          fontWeight: 700,
        };
      case 'gradient-glow':
        return {
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          border: 'none',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          color: '#ffffff',
        };
      case 'material-you':
        return {
          borderRadius: '24px',
          backgroundColor: 'var(--boost-primary, #6750a4)',
          color: '#ffffff',
          border: 'none',
        };
      case 'dark-first':
        return {
          backgroundColor: '#38bdf8',
          color: '#0f172a',
          fontWeight: 700,
          borderRadius: '10px',
        };
      case 'minimal':
      default:
        return {};
    }
  };

  const getIconPresetStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '2px solid #000000',
          borderRadius: '0px',
          boxShadow: '2px 2px 0px #000000',
          backgroundColor: '#ffffff',
          color: '#000000',
        };
      case 'neumorphism':
        return {
          border: 'none',
          borderRadius: '24px',
          backgroundColor: 'var(--boost-surface, #e6ecf5)',
          boxShadow: 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
          color: 'var(--boost-primary, #6366f1)',
        };
      case 'material-you':
        return {
          borderRadius: '16px',
          backgroundColor: '#eaddff',
          color: '#21005d',
        };
      default:
        return {
          borderRadius: '24px',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          color: 'var(--boost-primary, #6366f1)',
        };
    }
  };

  return (
    <div
      className={`boost-auth-card boost-auth-preset-${preset} ${className}`}
      style={{
        maxWidth: '420px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(24px, 5vw, 36px) clamp(18px, 4vw, 28px)',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        ...getCardPresetStyles(),
        ...style,
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-auth-card,
          .dark .boost-auth-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-auth-input,
          .dark .boost-auth-input {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-auth-input:focus,
          .dark .boost-auth-input:focus {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;
          }
        `}
      </style>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            ...getIconPresetStyles(),
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 22px)', fontWeight: 700, color: 'var(--boost-text, #0f172a)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Forgot password?</h2>
        <p style={{ fontSize: '13px', color: 'var(--boost-muted, #64748b)', margin: 0, lineHeight: 1.5 }}>
          No worries, we will send you reset instructions.
        </p>
      </div>

      {successMessage ? (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: preset === 'neo-brutalism' ? '0px' : '8px',
            color: '#10b981',
            fontSize: '13px',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: preset === 'neo-brutalism' ? '0px' : '8px',
                color: '#ef4444',
                fontSize: '13px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="boost-auth-input"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                fontSize: '14px',
                backgroundColor: 'var(--boost-surface, #ffffff)',
                color: 'var(--boost-text, #0f172a)',
                border: '1px solid var(--boost-border, #cbd5e1)',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                ...getInputPresetStyles(),
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, var(--boost-primary, #6366f1) 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              ...getButtonPresetStyles(),
            }}
          >
            {loading && (
              <svg
                style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            <span>Send Reset Instructions</span>
          </button>
        </form>
      )}

      {onBackToLogin && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to sign in</span>
          </button>
        </div>
      )}
    </div>
  );
};


ForgotPassword.displayName = 'ForgotPassword';
