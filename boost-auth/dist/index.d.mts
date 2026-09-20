import { c as AuthConfig, d as AuthAdapter, e as AuthProvider, f as AuthCallbacks, S as SessionTokenPayload, g as CreateOTPParams, h as OTPResult, V as VerifyOTPParams, A as AuthUser, U as UserProfile, i as CookieHeaderResult, j as VerifiedSession, k as CartItemToMerge, M as MergeResult } from './types-Cgb56CTH.mjs';
export { l as AuthAccount, m as AuthSession, C as CredentialsProviderConfig, E as EmailOtpProviderConfig, b as OAuthProfile, O as OAuthProviderConfig, a as OAuthTokens, P as PhoneOtpProviderConfig } from './types-Cgb56CTH.mjs';
export { DrizzleDbLike, DrizzleSchemaLike, MemoryAdapter, MongoDbLike, PrismaClientLike, drizzleAdapter, memoryAdapter, mongodbAdapter, prismaAdapter } from './adapters.mjs';
export { AppleProvider, BoostCommunicationsProvider, CredentialsProvider, DiscordProvider, EmailOtpProvider, GitHubProvider, GoogleProvider, OAuthHelper, PhoneOtpProvider } from './providers.mjs';
export { AuthContextValue, AuthProvider, AuthStorage, BoostAuthClient, ClientConfig, ClientSessionState, SignInCard, SignInCardProps, createAuthClient, useSession } from './client.mjs';

declare class TokenManager {
    private secret;
    constructor(secret: string);
    private base64UrlEncode;
    private base64UrlDecode;
    /**
     * Generates a signed JWT-like token (Header.Payload.Signature)
     */
    sign<T extends Record<string, any>>(payload: T, expiresInSeconds: number): string;
    /**
     * Verifies a signed JWT-like token
     */
    verify<T extends Record<string, any>>(token: string): {
        valid: boolean;
        payload?: T;
        error?: string;
    };
    private consumedTokens;
    /**
     * Generates a stateless HMAC hash of phone + OTP + nonce + expiry
     */
    createStatelessOtpToken(phone: string, otp: string, expiresAt: number, customNonce?: string): string;
    /**
     * Verifies an OTP against a stateless token with anti-replay shield
     */
    verifyStatelessOtp(phone: string, otp: string, token: string, options?: {
        preventReplay?: boolean;
    }): {
        valid: boolean;
        error?: string;
    };
}

interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
interface OrganizationMember {
    id: string;
    organizationId: string;
    userId: string;
    role: 'owner' | 'admin' | 'member';
    createdAt: string;
}
interface CreateOrgParams {
    name: string;
    slug?: string;
    userId: string;
    metadata?: Record<string, any>;
}
declare class OrganizationManager {
    private orgs;
    private members;
    /**
     * Creates a new organization and assigns the user as 'owner'
     */
    create(params: CreateOrgParams): Promise<{
        organization: Organization;
        membership: OrganizationMember;
    }>;
    /**
     * Adds or updates a member in an organization
     */
    addMember(params: {
        organizationId: string;
        userId: string;
        role?: 'owner' | 'admin' | 'member';
    }): Promise<OrganizationMember>;
    /**
     * Removes a member from an organization
     */
    removeMember(organizationId: string, userId: string): Promise<void>;
    /**
     * Lists all organizations a user is a member of
     */
    listUserOrganizations(userId: string): Promise<Array<{
        organization: Organization;
        role: OrganizationMember['role'];
    }>>;
    /**
     * Gets details of an organization by ID or slug
     */
    get(idOrSlug: string): Promise<Organization | null>;
}

declare class BoostAuth {
    private config;
    private tokenManager;
    private router;
    readonly organizations: OrganizationManager;
    constructor(config: AuthConfig);
    /**
     * Main Web-Standard Request Handler for Next.js, Express, Fastify, Cloudflare
     */
    handleRequest(request: Request): Promise<Response>;
    getBasePath(): string;
    getBaseUrl(req?: Request): string;
    getAdapter(): AuthAdapter | undefined;
    getProviders(): AuthProvider[];
    getCallbacks(): AuthCallbacks | undefined;
    getConfig(): AuthConfig;
    getTokenManager(): TokenManager;
    /**
     * Universal Server-side Session resolver for Next.js Server Components, Server Actions, & APIs.
     * Can be called with explicit headers/cookies or zero arguments in Next.js App Router!
     */
    getServerSession(context?: any): Promise<SessionTokenPayload | null>;
    /**
     * Generates a cryptographically random numeric OTP & stateless verification token
     */
    generateOTP(params: CreateOTPParams): OTPResult;
    /**
     * Verifies the provided OTP against the stateless verification token
     */
    verifyOTP(params: VerifyOTPParams): {
        success: boolean;
        error?: string;
    };
    /**
     * Creates a signed session token and prepares HTTP cookie parameters
     */
    createSession(user: AuthUser | UserProfile | SessionTokenPayload): {
        token: string;
        cookie: CookieHeaderResult;
    };
    /**
     * Verifies a session token string
     */
    verifySession(token: string): VerifiedSession;
    /**
     * Extracts session token from Cookie header or Authorization: Bearer header
     */
    extractSessionToken(headers: Record<string, string | string[] | undefined> | {
        get(name: string): string | null;
    }): string | null;
    /**
     * Generates a clear session cookie string to log out the user
     */
    createLogoutCookie(): CookieHeaderResult;
    /**
     * Generates a unique guest identifier (e.g. for guest checkout)
     */
    generateGuestId(): string;
    /**
     * Seamlessly merges a guest user's cart into an authenticated user's cart.
     * Merges quantities if the same item/variant exists.
     */
    mergeGuestCart<T extends CartItemToMerge = CartItemToMerge>(guestItems: T[], userItems: T[]): MergeResult<T>;
}
declare function createBoostAuth(config: AuthConfig): BoostAuth;

declare class AuthRouter {
    private auth;
    constructor(auth: BoostAuth);
    /**
     * Main Web-Standard Request Handler (Compatible with Next.js App Router, Remix, Cloudflare, Fetch API)
     */
    handleRequest(request: Request): Promise<Response>;
    private handleSendOtp;
    private handleVerifyOtp;
    private handleSendEmailOtp;
    private handleVerifyEmailOtp;
    private handleCredentialsSignIn;
    private handleOAuthSignIn;
    private handleOAuthCallback;
    private handleGetSession;
    private handleSignOut;
    private handleMergeCart;
}

interface NextJsHandlers {
    GET: (request: Request) => Promise<Response>;
    POST: (request: Request) => Promise<Response>;
}
/**
 * 1-Line Route Handler for Next.js App Router
 * Usage:
 * // app/api/auth/[...boost]/route.ts
 * export const { GET, POST } = toNextJsHandler(auth);
 */
declare function toNextJsHandler(auth: BoostAuth): NextJsHandlers;
/**
 * Direct Server-Side Session Fetcher for Next.js React Server Components (RSC) and Server Actions.
 * Usage in app/dashboard/page.tsx:
 *   const session = await getServerSession(auth);
 */
declare function getServerSession(auth: BoostAuth, context?: any): Promise<SessionTokenPayload | null>;
/**
 * Handler for Next.js Pages Router
 * Usage:
 * // pages/api/auth/[...boost].ts
 * export default toPagesHandler(auth);
 */
declare function toPagesHandler(auth: BoostAuth): (req: any, res: any) => Promise<void>;
interface AuthMiddlewareOptions {
    /**
     * Routes that require authentication (e.g. ['/dashboard', '/checkout', '/account'])
     */
    protectedRoutes?: string[];
    /**
     * Route where unauthenticated users should be redirected (default: '/login')
     */
    loginUrl?: string;
    /**
     * Where to redirect logged-in users if they visit loginUrl (e.g. '/dashboard')
     */
    afterLoginUrl?: string;
    /**
     * Roles allowed for specific route prefixes (e.g. { '/admin': ['admin'] })
     */
    rolePermissions?: Record<string, string[]>;
}
/**
 * 1-Line Route Protection Middleware for Next.js (middleware.ts)
 * Usage:
 * // middleware.ts
 * import { createAuthMiddleware } from '@boostengine/auth';
 * import { auth } from '@/lib/auth';
 *
 * export default createAuthMiddleware(auth, {
 *   protectedRoutes: ['/dashboard', '/account'],
 *   loginUrl: '/login',
 * });
 * export const config = { matcher: ['/dashboard/:path*', '/account/:path*', '/login'] };
 */
declare function createAuthMiddleware(auth: BoostAuth, options?: AuthMiddlewareOptions): (request: any) => Promise<Response>;

/**
 * Universal Node.js Middleware for Express, Fastify, Connect, and NestJS
 * Usage (Express):
 *   app.use('/api/auth', toNodeHandler(auth));
 * Usage (NestJS Middleware):
 *   consumer.apply(toNodeHandler(auth)).forRoutes('/api/auth');
 */
declare function toNodeHandler(auth: BoostAuth): (req: any, res: any, next?: () => void) => Promise<void>;

/**
 * Native RFC 6238 TOTP (Time-based One-Time Password) Engine
 * Compatible with Google Authenticator, Microsoft Authenticator, Authy, and 1Password.
 * Zero external dependencies!
 */
declare class TOTPManager {
    private static BASE32_ALPHABET;
    /**
     * Encodes a Buffer to a Base32 string
     */
    static base32Encode(buffer: Buffer): string;
    /**
     * Decodes a Base32 string to a Buffer
     */
    static base32Decode(base32: string): Buffer;
    /**
     * Generates a cryptographically secure random 20-byte Base32 secret for 2FA
     */
    static generateSecret(byteLength?: number): string;
    /**
     * Builds the standard `otpauth://` URI to display as a QR code in Google Authenticator
     */
    static generateOtpAuthUri(options: {
        secret: string;
        accountName: string;
        issuer?: string;
    }): string;
    /**
     * Generates a 6-digit TOTP token for the given secret at a specific Unix timestamp
     */
    static generateToken(secret: string, timestampSeconds?: number): string;
    /**
     * Verifies a 6-digit TOTP token with a ±1 step clock-drift window (covers 90 seconds)
     */
    static verifyToken(token: string, secret: string, options?: {
        window?: number;
    }): boolean;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}
declare class InMemoryRateLimiter {
    private hits;
    /**
     * Sliding-window rate limiter
     * @param key Unique identifier (e.g. `phone:+919876543210` or `ip:127.0.0.1`)
     * @param limit Maximum allowed hits within the window
     * @param windowSeconds Duration of the rate window in seconds
     */
    check(key: string, limit: number, windowSeconds: number): RateLimitResult;
    private cleanup;
    reset(key: string): void;
}
declare const defaultRateLimiter: InMemoryRateLimiter;

/**
 * Enterprise-grade Password Hashing using native Node.js crypto.scrypt.
 * Zero dependencies, OWASP-recommended, salt-protected, timing-safe.
 * Format: `<salt>:<derivedKeyHex>`
 */
declare function hashPassword(password: string): Promise<string>;
/**
 * Verify a plain password against a stored hash in constant time (timing-attack resistant).
 */
declare function verifyPassword(password: string, storedHash: string): Promise<boolean>;

export { AuthProvider as AnyAuthProvider, AuthAdapter, AuthCallbacks, AuthConfig, type AuthMiddlewareOptions, AuthRouter, AuthUser, BoostAuth, CartItemToMerge, CookieHeaderResult, CreateOTPParams, type CreateOrgParams, InMemoryRateLimiter, MergeResult, type NextJsHandlers, OTPResult, type Organization, OrganizationManager, type OrganizationMember, SessionTokenPayload, TOTPManager, TokenManager, UserProfile, VerifiedSession, VerifyOTPParams, createAuthMiddleware, createBoostAuth, defaultRateLimiter, getServerSession, hashPassword, toNextJsHandler, toNodeHandler, toPagesHandler, verifyPassword };
