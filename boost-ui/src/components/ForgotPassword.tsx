import React, { useState } from 'react';

export interface ForgotPasswordProps {
  onSubmit?: (email: string) => void;
  onBackToLogin?: () => void;
  loading?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onSubmit,
  onBackToLogin,
  loading = false,
  successMessage,
  errorMessage,
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubmit?.(email);
  };

  return (
    <div
      className="boost-auth-card"
      style={{
        maxWidth: '420px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(24px, 5vw, 36px) clamp(18px, 4vw, 28px)',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        borderRadius: 'var(--boost-radius, 16px)',
        boxShadow: 'var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.05))',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
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
            borderRadius: '24px',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--boost-primary, #6366f1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
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
            borderRadius: '8px',
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
                borderRadius: '8px',
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
