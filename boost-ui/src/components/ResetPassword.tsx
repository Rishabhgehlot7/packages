import React, { useState } from 'react';

export interface ResetPasswordProps {
  onSubmit?: (newPassword: string) => void;
  onBackToLogin?: () => void;
  loading?: boolean;
  errorMessage?: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  onSubmit,
  onBackToLogin,
  loading = false,
  errorMessage,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    setValidationError('');
    onSubmit?.(password);
  };

  const activeError = validationError || errorMessage;

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
            <path d="M21 2l-2 2m-1-1l2 2" />
            <path d="M15 7l2 2" />
            <path d="M19 11l-9 9-4-1 1-4 9-9" />
          </svg>
        </div>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 22px)', fontWeight: 700, color: 'var(--boost-text, #0f172a)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Set new password</h2>
        <p style={{ fontSize: '13px', color: 'var(--boost-muted, #64748b)', margin: 0, lineHeight: 1.5 }}>
          Must be at least 8 characters long.
        </p>
      </div>

      {activeError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
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
          <span>{activeError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '6px' }}>
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
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

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '6px' }}>
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
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
          <span>{loading ? 'Updating password...' : 'Reset Password'}</span>
        </button>
      </form>

      {onBackToLogin && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Cancel and return to sign in
          </button>
        </div>
      )}
    </div>
  );
};


ResetPassword.displayName = 'ResetPassword';
