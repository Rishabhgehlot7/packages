import React, { useState } from 'react';
import {
  LoginForm,
  RegisterForm,
  ForgotPassword,
  OTPInput,
  TestimonialCard,
  LogoCloud,
  Badge,
  Tabs,
  Button,
} from '@boostengine/ui';
import { ShieldCheck, Zap } from 'lucide-react';

interface AuthExampleProps {
  onShowToast: (msg: string) => void;
}

export const AuthExample: React.FC<AuthExampleProps> = ({ onShowToast }) => {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div style={{
      backgroundColor: 'var(--boost-bg, #090d16)',
      color: 'var(--boost-text, #f8fafc)',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      fontFamily: 'inherit'
    }}>
      {/* Left Column: Brand & Social Proof Showcase */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.06) 50%, rgba(15,23,42,0.95) 100%)',
        borderRight: '1px solid var(--boost-border, #334155)',
        padding: 'clamp(32px, 5vw, 64px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '40px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '18px' }}>
              B
            </div>
            <strong style={{ fontSize: '18px', letterSpacing: '0.5px' }}>BOOST ENGINE</strong>
            <Badge variant="primary">ENTERPRISE</Badge>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            The Modern Operating System for High-Growth Indian D2C Brands.
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--boost-text-muted, #94a3b8)', lineHeight: 1.6, margin: '0 0 32px' }}>
            125+ accessible components, automated Indian GST invoicing, single-click UPI checkout switch, and native carrier integration.
          </p>

          <TestimonialCard
            quote="BoostEngine transformed our customer checkout experience. Our cart abandonment dropped 34% within the first two weeks of launching our new storefront."
            author="Ananya Deshmukh"
            role="VP of Digital Experience"
            company="The Bombay Craft Co."
            rating={5}
          />
        </div>

        {/* Supported Ecosystem Badges */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--boost-text-muted, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '16px' }}>
            Trusted by modern payment & courier ecosystems
          </span>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', opacity: 0.85 }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>⚡ Razorpay</span>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>🟣 PhonePe</span>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>🚀 Shiprocket</span>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>📦 Delhivery</span>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Card Forms */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 4vw, 64px)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--boost-surface, #0f172a)',
          border: '1px solid var(--boost-border, #334155)',
          borderRadius: '16px',
          padding: 'clamp(24px, 4vw, 36px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
          {/* Form Switcher Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--boost-border, #334155)', marginBottom: '24px' }}>
            <button
              onClick={() => setAuthTab('login')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'none',
                border: 'none',
                borderBottom: authTab === 'login' ? '2px solid #6366f1' : '2px solid transparent',
                color: authTab === 'login' ? '#f8fafc' : '#94a3b8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthTab('register')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'none',
                border: 'none',
                borderBottom: authTab === 'register' ? '2px solid #6366f1' : '2px solid transparent',
                color: authTab === 'register' ? '#f8fafc' : '#94a3b8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
            <button
              onClick={() => setAuthTab('forgot')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'none',
                border: 'none',
                borderBottom: authTab === 'forgot' ? '2px solid #6366f1' : '2px solid transparent',
                color: authTab === 'forgot' ? '#f8fafc' : '#94a3b8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Recover
            </button>
          </div>

          {/* Tab 1: Login Form */}
          {authTab === 'login' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px' }}>Welcome Back</h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
                  Sign in to manage your merchant catalog, orders, and payouts.
                </p>
              </div>

              <LoginForm
                onSubmit={(data) => onShowToast(`Signed in as: ${data.identifier}`)}
                onForgotPassword={() => setAuthTab('forgot')}
                onRegisterClick={() => setAuthTab('register')}
              />
            </div>
          )}

          {/* Tab 2: Register Form */}
          {authTab === 'register' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px' }}>Start Your 14-Day Trial</h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
                  No credit card required. Instant sandbox & API access.
                </p>
              </div>

              <RegisterForm
                onSubmit={(data) => {
                  onShowToast(`Account created for ${data.fullName}!`);
                  setAuthTab('login');
                }}
                onLoginClick={() => setAuthTab('login')}
              />
            </div>
          )}

          {/* Tab 3: Forgot Password & OTP Flow */}
          {authTab === 'forgot' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px' }}>Reset Access Key</h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
                  Verify with 6-digit OTP dispatched to your phone/email.
                </p>
              </div>

              {!otpSent ? (
                <ForgotPassword
                  onSubmit={(email) => {
                    setOtpSent(true);
                    onShowToast(`OTP code dispatched to ${email}`);
                  }}
                  onBackToLogin={() => setAuthTab('login')}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
                    Enter 6-digit verification code:
                  </span>
                  <OTPInput
                    length={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    onComplete={(code) => onShowToast(`Verified OTP code: ${code}`)}
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      onShowToast('Identity verified! Password updated.');
                      setAuthTab('login');
                      setOtpSent(false);
                    }}
                  >
                    Confirm & Update Password
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOtpSent(false)}
                  >
                    ← Back to email entry
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Footer Security Note */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--boost-border, #334155)', textAlign: 'center', fontSize: '11px', color: 'var(--boost-text-muted, #94a3b8)' }}>
            Protected by BoostEngine Security Shield • ISO 27001 & SOC-2 Type II Certified
          </div>
        </div>
      </div>
    </div>
  );
};
