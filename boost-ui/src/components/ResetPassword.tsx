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
      style={{
        maxWidth: '400px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
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
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Set new password</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
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
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
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
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 14px',
              fontSize: '14px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 14px',
              fontSize: '14px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
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
