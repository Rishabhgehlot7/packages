/**
 * @boostengine/auth Universal Types & Contracts
 * Supporting Stateless, Database-backed, Multi-Provider & Multi-Platform Architectures
 */

export interface AuthConfig {
  /**
   * Secret key used to sign session JWTs, verification tokens, and OAuth states (min 16 chars)
   */
  secret: string;

  /**
   * Session expiration in seconds (default: 30 days = 2592000s)
   */
  sessionExpirySeconds?: number;

  /**
   * Cookie name used for storing session (default: "boost_session")
   */
  cookieName?: string;

  /**
   * Default OTP expiration in seconds (default: 300s / 5 mins)
   */
  otpExpirySeconds?: number;

  /**
   * Length of numeric OTP (default: 6)
   */
  otpLength?: number;

  /**
   * Whether cookies should be set as Secure (default: process.env.NODE_ENV === 'production')
   */
  secureCookies?: boolean;

  /**
   * Base URL of the app / API (e.g. "https://example.com" or "http://localhost:3000")
   */
  baseUrl?: string;

  /**
   * Base path where the auth router is mounted (default: "/api/auth")
   */
  basePath?: string;

  /**
   * Database adapter for persistent user and session storage (Optional: default is 100% Stateless)
   */
  adapter?: AuthAdapter;

  /**
   * Authentication providers (OAuth, Phone OTP, Credentials)
   */
  providers?: AuthProvider[];

  /**
   * Custom lifecycle callbacks
   */
  callbacks?: AuthCallbacks;

  /**
   * Rate limiting configuration for OTP endpoints (SMS Bombing Shield)
   */
  rateLimit?: RateLimitConfig;
}

export interface RateLimitConfig {
  enabled?: boolean;
  maxPerPhone?: number; // default: 3 OTPs
  windowSecondsPhone?: number; // default: 600s (10 minutes)
  maxPerIp?: number; // default: 5 requests
  windowSecondsIp?: number; // default: 60s (1 minute)
}

// ---------------------------------------------------------------------------
// User & Session Data Models
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  image?: string | null;
  role?: 'customer' | 'admin' | 'staff' | string;
  emailVerified?: Date | string | null;
  phoneVerified?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  metadata?: Record<string, any>;
}

export interface UserProfile extends AuthUser {
  phone: string;
}

export interface AuthAccount {
  id?: string;
  userId: string;
  provider: string;
  providerAccountId: string;
  refreshToken?: string | null;
  accessToken?: string | null;
  expiresAt?: number | null;
  tokenType?: string | null;
  scope?: string | null;
  idToken?: string | null;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date | string | number;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SessionTokenPayload {
  userId: string;
  id?: string;
  phone?: string;
  email?: string;
  name?: string;
  image?: string;
  role: string;
  iat: number;
  exp: number;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface VerifiedSession {
  isValid: boolean;
  user?: SessionTokenPayload;
  error?: string;
}

// ---------------------------------------------------------------------------
// Database Adapter Contract
// ---------------------------------------------------------------------------

export interface AuthAdapter {
  name: string;
  createUser(user: Omit<AuthUser, 'id'> & { id?: string }): Promise<AuthUser>;
  getUser(id: string): Promise<AuthUser | null>;
  getUserByEmail(email: string): Promise<AuthUser | null>;
  getUserByPhone(phone: string): Promise<AuthUser | null>;
  getUserByAccount(provider: string, providerAccountId: string): Promise<AuthUser | null>;
  updateUser(user: Partial<AuthUser> & { id: string }): Promise<AuthUser>;
  deleteUser?(userId: string): Promise<void>;
  linkAccount(account: AuthAccount): Promise<void>;
  unlinkAccount?(provider: string, providerAccountId: string): Promise<void>;
  createSession?(session: Omit<AuthSession, 'id'> & { id?: string }): Promise<AuthSession>;
  getSessionAndUser?(sessionToken: string): Promise<{ session: AuthSession; user: AuthUser } | null>;
  updateSession?(session: Partial<AuthSession> & { token: string }): Promise<AuthSession | null>;
  deleteSession?(sessionToken: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Provider Specifications
// ---------------------------------------------------------------------------

export interface OAuthProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  [key: string]: any;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType?: string;
  expiresIn?: number;
  scope?: string;
}

export interface OAuthProviderConfig {
  id: string;
  name: string;
  type: 'oauth' | 'oidc';
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  scope?: string[];
  profile?: (profileData: any, tokens: OAuthTokens) => Promise<OAuthProfile> | OAuthProfile;
}

export interface CredentialsProviderConfig {
  id: string;
  name: string;
  type: 'credentials';
  authorize: (credentials: Record<string, any>, req?: Request) => Promise<AuthUser | null>;
}

export interface PhoneOtpProviderConfig {
  id: string;
  name: string;
  type: 'phone-otp';
  otpLength?: number;
  expirySeconds?: number;
  sendOtp?: (params: { phone: string; otp: string }) => Promise<boolean | void>;
}

export interface EmailOtpProviderConfig {
  id: string;
  name: string;
  type: 'email-otp';
  otpLength?: number;
  expirySeconds?: number;
  sendEmail: (params: { email: string; otp: string; magicLink?: string }) => Promise<boolean | void>;
}

export type AuthProvider =
  | OAuthProviderConfig
  | CredentialsProviderConfig
  | PhoneOtpProviderConfig
  | EmailOtpProviderConfig;

// ---------------------------------------------------------------------------
// Callbacks & Lifecycle
// ---------------------------------------------------------------------------

export interface AuthCallbacks {
  signIn?: (params: {
    user: AuthUser;
    account?: AuthAccount;
    profile?: OAuthProfile;
  }) => Promise<boolean> | boolean;

  session?: (params: {
    session: SessionTokenPayload;
    user?: AuthUser;
  }) => Promise<SessionTokenPayload> | SessionTokenPayload;

  jwt?: (params: {
    token: SessionTokenPayload;
    user?: AuthUser;
    account?: AuthAccount;
  }) => Promise<SessionTokenPayload> | SessionTokenPayload;
}

// ---------------------------------------------------------------------------
// Phone OTP & Stateless Protocols
// ---------------------------------------------------------------------------

export interface CreateOTPParams {
  phone: string;
  otpLength?: number;
  expirySeconds?: number;
}

export interface OTPResult {
  phone: string;
  otp: string;
  verificationToken: string;
  expiresAt: number;
}

export interface VerifyOTPParams {
  phone: string;
  otp: string;
  verificationToken: string;
}

// ---------------------------------------------------------------------------
// HTTP & Cookie Types
// ---------------------------------------------------------------------------

export interface CookieHeaderResult {
  name: string;
  value: string;
  headerString: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
    maxAge: number;
  };
}

// ---------------------------------------------------------------------------
// eCommerce Guest Cart Types
// ---------------------------------------------------------------------------

export interface CartItemToMerge {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  [key: string]: any;
}

export interface MergeResult<T extends CartItemToMerge = CartItemToMerge> {
  mergedItems: T[];
  itemCount: number;
  subtotal: number;
  conflictsResolved: number;
}
