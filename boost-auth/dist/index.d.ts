import { B as BoostAuth } from './agent-BTZTO0Ih.js';
export { A as AgentToolDefinition, a as AuthAgentToolkit, C as CreateOrgParams, O as Organization, b as OrganizationManager, c as OrganizationMember, T as TokenManager, d as createBoostAuth } from './agent-BTZTO0Ih.js';
export { DrizzleDbLike, DrizzleSchemaLike, MemoryAdapter, MongoDbLike, PrismaClientLike, drizzleAdapter, memoryAdapter, mongodbAdapter, prismaAdapter } from './adapters.js';
export { AppleProvider, BoostCommunicationsProvider, CredentialsProvider, DiscordProvider, EmailOtpProvider, GitHubProvider, GoogleProvider, OAuthHelper, PhoneOtpProvider } from './providers.js';
import { S as SessionTokenPayload } from './types-CfLtXDN5.js';
export { e as AnyAuthProvider, l as AuthAccount, d as AuthAdapter, f as AuthCallbacks, c as AuthConfig, m as AuthSession, A as AuthUser, k as CartItemToMerge, i as CookieHeaderResult, g as CreateOTPParams, C as CredentialsProviderConfig, E as EmailOtpProviderConfig, M as MergeResult, b as OAuthProfile, O as OAuthProviderConfig, a as OAuthTokens, h as OTPResult, P as PhoneOtpProviderConfig, U as UserProfile, j as VerifiedSession, V as VerifyOTPParams } from './types-CfLtXDN5.js';
export { AuthContextValue, AuthProvider, AuthStorage, BoostAuthClient, ClientConfig, ClientSessionState, SignInCard, SignInCardProps, createAuthClient, createReactNativeStorage, getDefaultAuthStorage, useSession } from './client.js';

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

export { type AuthMiddlewareOptions, AuthRouter, BoostAuth, InMemoryRateLimiter, type NextJsHandlers, SessionTokenPayload, TOTPManager, createAuthMiddleware, defaultRateLimiter, getServerSession, hashPassword, toNextJsHandler, toNodeHandler, toPagesHandler, verifyPassword };
