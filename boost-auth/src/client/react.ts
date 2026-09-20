import { BoostAuthClient, ClientSessionState } from './index';

// Duck-typed minimal React hooks interface for universal bundling without requiring @types/react
declare const React: any;

export interface AuthContextValue extends ClientSessionState {
  client: BoostAuthClient;
  signIn: BoostAuthClient['signIn'];
  verifyOtp: BoostAuthClient['verifyOtp'];
  signOut: BoostAuthClient['signOut'];
  refreshSession: () => Promise<ClientSessionState>;
}

let AuthContext: any = null;

function getAuthContext() {
  if (!AuthContext && typeof React !== 'undefined' && React.createContext) {
    AuthContext = React.createContext(null);
  }
  return AuthContext;
}

/**
 * Universal React Provider for Next.js, Vite, and React Native (Expo)
 */
export function AuthProvider({ client, children }: { client: BoostAuthClient; children: any }) {
  const [sessionState, setSessionState] = (typeof React !== 'undefined' ? React.useState : ((init: any) => [init, () => {}]))(
    client.getState()
  );

  (typeof React !== 'undefined' ? React.useEffect : (() => {}))(() => {
    // Initial fetch
    client.getSession();
    // Subscribe to state changes
    const unsubscribe = client.subscribe((state: ClientSessionState) => {
      setSessionState(state);
    });
    return unsubscribe;
  }, [client]);

  const value: AuthContextValue = {
    ...sessionState,
    client,
    signIn: client.signIn,
    verifyOtp: client.verifyOtp.bind(client),
    signOut: client.signOut.bind(client),
    refreshSession: client.getSession.bind(client),
  };

  const Context = getAuthContext();
  if (Context && React.createElement) {
    return React.createElement(Context.Provider, { value }, children);
  }

  return children;
}

/**
 * Universal React Hook: useSession()
 * Usage:
 *   const { user, isAuthenticated, isLoading, signOut } = useSession();
 */
export function useSession(): AuthContextValue {
  const Context = getAuthContext();
  const context = (typeof React !== 'undefined' && Context ? React.useContext(Context) : null);

  if (!context) {
    throw new Error('[useSession] must be used within an <AuthProvider client={authClient}>');
  }

  return context;
}

export interface SignInCardProps {
  onSuccess?: (user: any) => void;
  socialProviders?: ('google' | 'github' | 'discord')[];
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Drop-in, Clerk-style Authentication Card
 * Works universally in Next.js, Vite, and pairs seamlessly with @boostengine/ui
 */
export function SignInCard({
  onSuccess,
  socialProviders = ['google', 'github'],
  title = 'Welcome Back',
  subtitle = 'Sign in with your phone or social account',
}: SignInCardProps) {
  const session = useSession();
  const [step, setStep] = React.useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [verificationToken, setVerificationToken] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [timer, setTimer] = React.useState(0);

  React.useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t: number) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e: any) => {
    e?.preventDefault();
    if (!phone.trim()) return setError('Please enter a valid phone number');
    setError('');
    setLoading(true);
    try {
      const res = await session.signIn.phone({ phone: phone.trim() });
      setVerificationToken(res.verificationToken);
      setStep('otp');
      setTimer(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: any) => {
    e?.preventDefault();
    if (!otp.trim()) return setError('Please enter the 6-digit OTP');
    setError('');
    setLoading(true);
    try {
      const res = await session.verifyOtp({ phone: phone.trim(), otp: otp.trim(), verificationToken });
      if (onSuccess) onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    'div',
    {
      style: {
        maxWidth: '420px',
        width: '100%',
        margin: '0 auto',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#0f172a',
        color: '#f8fafc',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    },
    React.createElement('h2', { style: { fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px 0' } }, title),
    React.createElement('p', { style: { fontSize: '14px', color: '#94a3b8', margin: '0 0 24px 0' } }, subtitle),

    error ? React.createElement('div', {
      style: {
        padding: '10px 14px',
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
      },
    }, error) : null,

    step === 'phone'
      ? React.createElement(
          'form',
          { onSubmit: handleSendOtp },
          React.createElement('input', {
            type: 'tel',
            placeholder: '+91 98765 43210',
            value: phone,
            onChange: (e: any) => setPhone(e.target.value),
            style: {
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#fff',
              fontSize: '15px',
              boxSizing: 'border-box',
              marginBottom: '16px',
            },
          }),
          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: loading,
              style: {
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              },
            },
            loading ? 'Sending OTP...' : 'Continue with Phone'
          )
        )
      : React.createElement(
          'form',
          { onSubmit: handleVerifyOtp },
          React.createElement('input', {
            type: 'text',
            placeholder: '6-digit OTP',
            maxLength: 6,
            value: otp,
            onChange: (e: any) => setOtp(e.target.value),
            style: {
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#fff',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '4px',
              boxSizing: 'border-box',
              marginBottom: '16px',
            },
          }),
          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: loading,
              style: {
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: '#10b981',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
              },
            },
            loading ? 'Verifying...' : 'Verify & Sign In'
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', fontSize: '13px' } },
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => setStep('phone'),
                style: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
              },
              'Change Phone'
            ),
            timer > 0
              ? React.createElement('span', { style: { color: '#64748b' } }, `Resend in ${timer}s`)
              : React.createElement(
                  'button',
                  {
                    type: 'button',
                    onClick: handleSendOtp,
                    style: { background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' },
                  },
                  'Resend OTP'
                )
          )
        ),

    socialProviders.length > 0
      ? React.createElement(
          'div',
          { style: { marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #334155' } },
          socialProviders.map((prov) =>
            React.createElement(
              'button',
              {
                key: prov,
                type: 'button',
                onClick: () => session.signIn.social({ provider: prov }),
                style: {
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                },
              },
              `Continue with ${prov.charAt(0).toUpperCase() + prov.slice(1)}`
            )
          )
        )
      : null
  );
}
