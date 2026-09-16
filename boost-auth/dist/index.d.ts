interface AuthConfig {
    /**
     * Secret key used to sign session JWTs and stateless OTP tokens
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
}
interface UserProfile {
    id: string;
    phone: string;
    email?: string;
    name?: string;
    role?: 'customer' | 'admin' | 'staff';
    metadata?: Record<string, any>;
    createdAt?: string;
}
interface CreateOTPParams {
    phone: string;
    otpLength?: number;
    expirySeconds?: number;
}
interface OTPResult {
    phone: string;
    otp: string;
    verificationToken: string;
    expiresAt: number;
}
interface VerifyOTPParams {
    phone: string;
    otp: string;
    verificationToken: string;
}
interface SessionTokenPayload {
    userId: string;
    phone: string;
    email?: string;
    role: string;
    iat: number;
    exp: number;
    [key: string]: any;
}
interface VerifiedSession {
    isValid: boolean;
    user?: SessionTokenPayload;
    error?: string;
}
interface CookieHeaderResult {
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
interface CartItemToMerge {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    [key: string]: any;
}
interface MergeResult<T extends CartItemToMerge = CartItemToMerge> {
    mergedItems: T[];
    itemCount: number;
    subtotal: number;
    conflictsResolved: number;
}

declare class BoostAuth {
    private config;
    private tokenManager;
    constructor(config: AuthConfig);
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
    createSession(user: UserProfile): {
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

export { type AuthConfig, BoostAuth, type CartItemToMerge, type CookieHeaderResult, type CreateOTPParams, type MergeResult, type OTPResult, type SessionTokenPayload, TokenManager, type UserProfile, type VerifiedSession, type VerifyOTPParams, createBoostAuth };
