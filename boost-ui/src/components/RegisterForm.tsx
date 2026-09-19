import React, { useState } from 'react';

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  acceptTerms: boolean;
}

export interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
  onLoginClick?: () => void;
  loading?: boolean;
  errorMessage?: string;
  title?: string;
  subtitle?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onLoginClick,
  loading = false,
  errorMessage,
  title = 'Create an account',
  subtitle = 'Start your experience in just a few clicks.',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    acceptTerms?: string;
  }>({});

  const validate = () => {
    const errs: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      acceptTerms?: string;
    } = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
        errs.phone = 'Please enter a valid 10-15 digit phone number';
      }
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!acceptTerms) {
      errs.acceptTerms = 'You must agree to the Terms of Service';
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit?.({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() || undefined, password, acceptTerms });
  };

  return (
    <div
      className="boost-auth-card"
      style={{
        maxWidth: '440px',
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

      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '6px' }}>
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
            }}
            placeholder="John Doe"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '11px 14px',
              fontSize: '14px',
              color: 'var(--boost-text, #0f172a)',
              backgroundColor: 'var(--boost-bg, #ffffff)',
              border: `1px solid ${errors.fullName ? '#ef4444' : 'var(--boost-border, #cbd5e1)'}`,
              borderRadius: 'var(--boost-radius, 10px)',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          />
          {errors.fullName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.fullName}
            </span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '6px' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
            placeholder="you@example.com"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '11px 14px',
              fontSize: '14px',
              color: 'var(--boost-text, #0f172a)',
              backgroundColor: 'var(--boost-bg, #ffffff)',
              border: `1px solid ${errors.email ? '#ef4444' : 'var(--boost-border, #cbd5e1)'}`,
              borderRadius: 'var(--boost-radius, 10px)',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          />
          {errors.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.email}
            </span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '6px' }}>
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
            }}
            placeholder="+91 98765 43210"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '11px 14px',
              fontSize: '14px',
              color: 'var(--boost-text, #0f172a)',
              backgroundColor: 'var(--boost-bg, #ffffff)',
              border: `1px solid ${errors.phone ? '#ef4444' : 'var(--boost-border, #cbd5e1)'}`,
              borderRadius: 'var(--boost-radius, 10px)',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          />
          {errors.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.phone}
            </span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--boost-text, #334155)', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              placeholder="Create a strong password"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 42px 11px 14px',
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
                padding: '4px',
                borderRadius: '4px',
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '4px', fontWeight: 500 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.password}
            </span>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
            <input
              type="checkbox"
              id="register-terms"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (errors.acceptTerms) setErrors(prev => ({ ...prev, acceptTerms: undefined }));
              }}
              style={{
                marginTop: '3px',
                cursor: 'pointer',
                width: '16px',
                height: '16px',
                accentColor: 'var(--boost-primary, #3b82f6)',
                flexShrink: 0,
              }}
            />
            <label htmlFor="register-terms" style={{ fontSize: '13px', color: 'var(--boost-text, #475569)', cursor: 'pointer', lineHeight: 1.4, userSelect: 'none' }}>
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>
          {errors.acceptTerms && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '6px', fontWeight: 500, paddingLeft: '26px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.acceptTerms}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '13px 20px',
            backgroundColor: 'var(--boost-primary, #2563eb)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: 'var(--boost-radius, 10px)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: 'var(--boost-shadow-sm, 0 2px 8px rgba(37,99,235,0.25))',
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
          <span>{loading ? 'Creating account...' : 'Create Account'}</span>
        </button>
      </form>

      {onLoginClick && (
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--boost-muted, #64748b)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
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
            Sign in
          </button>
        </div>
      )}
    </div>
  );
};


RegisterForm.displayName = 'RegisterForm';
