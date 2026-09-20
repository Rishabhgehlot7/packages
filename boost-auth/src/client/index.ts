import { AuthStorage, WebStorage, MemoryStorage } from './storage';

export interface ClientConfig {
  baseURL: string; // e.g. "https://myapp.com/api/auth" or "http://localhost:3000/api/auth"
  storage?: AuthStorage;
  fetch?: typeof fetch;
  onSessionChange?: (session: any) => void;
}

export interface ClientSessionState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export class BoostAuthClient {
  private baseURL: string;
  private storage: AuthStorage;
  private customFetch: typeof fetch;
  private tokenKey = 'boost_auth_token';
  private listeners: Set<(state: ClientSessionState) => void> = new Set();

  private currentState: ClientSessionState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  };

  constructor(config: ClientConfig) {
    this.baseURL = config.baseURL.replace(/\/+$/, '');
    this.storage = config.storage || (typeof window !== 'undefined' ? new WebStorage() : new MemoryStorage());
    this.customFetch = config.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : (null as any));
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.currentState }));
  }

  subscribe(listener: (state: ClientSessionState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.currentState });
    return () => this.listeners.delete(listener);
  }

  getState(): ClientSessionState {
    return { ...this.currentState };
  }

  async getToken(): Promise<string | null> {
    return await this.storage.getItem(this.tokenKey);
  }

  async setToken(token: string): Promise<void> {
    await this.storage.setItem(this.tokenKey, token);
  }

  async removeToken(): Promise<void> {
    await this.storage.removeItem(this.tokenKey);
  }

  private async fetchApi(path: string, init: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${path}`;
    const token = await this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((init.headers as any) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await this.customFetch(url, {
      ...init,
      headers,
      credentials: 'include', // Ensures cookies are automatically sent/received in browser
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  }

  // ---------------------------------------------------------------------------
  // Sign In Methods
  // ---------------------------------------------------------------------------

  readonly signIn = {
    /**
     * Send OTP to customer's phone
     */
    phone: async (params: { phone: string; otpLength?: number; expirySeconds?: number }) => {
      return await this.fetchApi('/otp/send', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    /**
     * Sign in with username/email & password
     */
    credentials: async (credentials: Record<string, any>) => {
      const res = await this.fetchApi('/signin/credentials', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.token) {
        await this.setToken(res.token);
      }
      this.currentState = {
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
      };
      this.notify();
      return res;
    },

    /**
     * Sign in with Email and Password
     */
    emailPassword: async (params: { email: string; password: string; [key: string]: any }) => {
      return await this.signIn.credentials(params);
    },

    /**
     * Initiate OAuth Social Login (Google, GitHub, Discord, etc.)
     */
    social: async (params: { provider: string; callbackUrl?: string }) => {
      const callback = params.callbackUrl || (typeof window !== 'undefined' ? window.location.origin : '/');
      const url = `${this.baseURL}/signin/${params.provider}?callbackUrl=${encodeURIComponent(callback)}`;

      // In browser, redirect directly
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = url;
      }
      return { url };
    },
  };

  /**
   * Verifies Phone OTP and sets up authenticated session
   */
  async verifyOtp(params: { phone: string; otp: string; verificationToken: string }): Promise<any> {
    const res = await this.fetchApi('/otp/verify', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (res.token) {
      await this.setToken(res.token);
    }

    this.currentState = {
      user: res.user,
      token: res.token,
      isAuthenticated: true,
      isLoading: false,
    };
    this.notify();

    return res;
  }

  /**
   * Retrieves active session user
   */
  async getSession(): Promise<ClientSessionState> {
    try {
      this.currentState.isLoading = true;
      const res = await this.fetchApi('/session', { method: 'GET' });

      if (res.authenticated && res.user) {
        const token = await this.getToken();
        this.currentState = {
          user: res.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        };
      } else {
        this.currentState = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        };
      }
    } catch {
      this.currentState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    }

    this.notify();
    return { ...this.currentState };
  }

  /**
   * Signs out user and clears cookies and local tokens
   */
  async signOut(): Promise<void> {
    try {
      await this.fetchApi('/signout', { method: 'POST' });
    } finally {
      await this.removeToken();
      this.currentState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
      this.notify();
    }
  }

  // ---------------------------------------------------------------------------
  // eCommerce Helper Methods
  // ---------------------------------------------------------------------------

  readonly guestCart = {
    merge: async (guestItems: any[], userItems: any[]) => {
      return await this.fetchApi('/guest-cart/merge', {
        method: 'POST',
        body: JSON.stringify({ guestItems, userItems }),
      });
    },
  };
}

export function createAuthClient(config: ClientConfig): BoostAuthClient {
  return new BoostAuthClient(config);
}

export { AuthStorage, WebStorage, MemoryStorage } from './storage';
export { AuthProvider, useSession, SignInCard, type AuthContextValue, type SignInCardProps } from './react';
