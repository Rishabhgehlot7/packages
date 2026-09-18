import React, { useState } from 'react';

export interface LoginFormProps {
  onSubmit?: (data: { identifier: string; password: string; rememberMe: boolean }) => void;
  onForgotPassword?: () => void;
  onRegisterClick?: () => void;
  loading?: boolean;
  errorMessage?: string;
  title?: string;
  subtitle?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onRegisterClick,
  loading = false,
  errorMessage,
  title = 'Sign In',
  subtitle = 'Welcome back! Please enter your details.',
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = () => {
    const errs: { identifier?: string; password?: string } = {};
    const trimmed = identifier.trim();
    if (!trimmed) {
      errs.identifier = 'Email or phone number is required';
    } else if (trimmed.includes('@')) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        errs.identifier = 'Please enter a valid email address';
      }
    } else {
      const cleanPhone = trimmed.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
        errs.identifier = 'Please enter a valid phone number or email';
      }
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit?.({ identifier: identifier.trim(), password, rememberMe });
  };

  return (
    <div
      style={{
        maxWidth: '420px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(24px, 5vw, 40px) clamp(18px, 4vw, 32px)',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #e2e8f0)',
        borderRadius: 'var(--boost-radius, 16px)',
        boxShadow: 'var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.05))',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: 'var(--boost-text, #0f172a)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>{title}</h2>
        <p style={{ fontSize: '14px', color: 'var(--boost-muted, #64748b)', margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
      </div>

      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--boost-radius, 10px)',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ lineHeight: 1.4 }}>{errorMessage}</span>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '8px' }}>
            Email or Phone
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier) setErrors(prev => ({ ...prev, identifier: undefined }));
            }}
            placeholder="you@example.com"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 14px',
              fontSize: '14px',
              color: 'var(--boost-text, #0f172a)',
              backgroundColor: 'var(--boost-bg, #ffffff)',
              border: `1px solid ${errors.identifier ? '#ef4444' : 'var(--boost-border, #cbd5e1)'}`,
              borderRadius: 'var(--boost-radius, 10px)',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          />
          {errors.identifier && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '6px', fontWeight: 500 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.identifier}
            </span>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)' }}>Password</label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--boost-primary, #3b82f6)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'opacity 0.15s ease',
                }}
              >
                Forgot password?
              </button>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              placeholder="Enter your password"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 42px 12px 14px',
                fontSize: '14px',
                color: 'var(--boost-text, #0f172a)',
                backgroundColor: 'var(--boost-bg, #ffffff)',
                border: `1px solid ${errors.password ? '#ef4444' : 'var(--boost-border, #cbd5e1)'}`,
                borderRadius: 'var(--boost-radius, 10px)',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--boost-muted, #64748b)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '6px', fontWeight: 500 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.password}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="login-remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              accentColor: 'var(--boost-primary, #3b82f6)',
              cursor: 'pointer',
            }}
          />
          <label htmlFor="login-remember" style={{ fontSize: '13px', color: 'var(--boost-text, #475569)', cursor: 'pointer', userSelect: 'none' }}>
            Remember for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px 20px',
            backgroundColor: 'var(--boost-primary, #0f172a)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: 'var(--boost-radius, 10px)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1,
            boxShadow: 'var(--boost-shadow-sm, 0 2px 8px rgba(0,0,0,0.1))',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
        </button>
      </form>

      {onRegisterClick && (
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--boost-muted, #64748b)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--boost-primary, #2563eb)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              marginLeft: '4px',
            }}
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
};


LoginForm.displayName = 'LoginForm';
