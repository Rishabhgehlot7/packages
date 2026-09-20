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
