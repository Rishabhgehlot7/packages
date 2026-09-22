import * as crypto from 'crypto';
import {
  AuthConfig,
  AuthUser,
  UserProfile,
  CreateOTPParams,
  OTPResult,
  VerifyOTPParams,
  SessionTokenPayload,
  VerifiedSession,
  CookieHeaderResult,
  CartItemToMerge,
  MergeResult,
  AuthAdapter,
  AuthProvider,
  AuthCallbacks,
} from './types';
import { TokenManager } from './tokens';
import { AuthRouter } from './router';
import { OrganizationManager } from './organizations';

export class BoostAuth {
  private config: Required<Pick<AuthConfig, 'secret' | 'sessionExpirySeconds' | 'cookieName' | 'otpExpirySeconds' | 'otpLength' | 'secureCookies' | 'basePath'>> & AuthConfig;
  private tokenManager: TokenManager;
  private router: AuthRouter;
  readonly organizations: OrganizationManager;

  constructor(config: AuthConfig) {
    if (!config.secret) {
      throw new Error('[@boostengine/auth] "secret" key is required.');
    }

    this.config = {
      secret: config.secret,
      sessionExpirySeconds: config.sessionExpirySeconds ?? 30 * 24 * 60 * 60, // 30 days
      cookieName: config.cookieName ?? 'boost_session',
      otpExpirySeconds: config.otpExpirySeconds ?? 300, // 5 minutes
      otpLength: config.otpLength ?? 6,
      secureCookies: config.secureCookies ?? (process.env.NODE_ENV === 'production'),
      basePath: config.basePath ?? '/api/auth',
      baseUrl: config.baseUrl,
      adapter: config.adapter,
      providers: config.providers || [],
      callbacks: config.callbacks || {},
    };

    this.tokenManager = new TokenManager(this.config.secret);
    this.router = new AuthRouter(this);
    this.organizations = new OrganizationManager();
  }

  /**
   * Main Web-Standard Request Handler for Next.js, Express, Fastify, Cloudflare
   */
  async handleRequest(request: Request): Promise<Response> {
    return await this.router.handleRequest(request);
  }

  getBasePath(): string {
    return this.config.basePath;
  }

  getBaseUrl(req?: Request): string {
    if (this.config.baseUrl) {
      return this.config.baseUrl.replace(/\/+$/, '');
    }
    if (req) {
      const url = new URL(req.url);
      return `${url.protocol}//${url.host}`;
    }
    return 'http://localhost:3000';
  }

  getAdapter(): AuthAdapter | undefined {
    return this.config.adapter;
  }

  getProviders(): AuthProvider[] {
    return this.config.providers || [];
  }

  getCallbacks(): AuthCallbacks | undefined {
    return this.config.callbacks;
  }

  getConfig(): AuthConfig {
    return { ...this.config };
  }

  getTokenManager(): TokenManager {
    return this.tokenManager;
  }

  /**
   * Universal Server-side Session resolver for Next.js Server Components, Server Actions, & APIs.
   * Can be called with explicit headers/cookies or zero arguments in Next.js App Router!
   */
  async getServerSession(context?: any): Promise<SessionTokenPayload | null> {
    let token: string | null = null;

    if (context) {
      if (typeof context.get === 'function') {
        token = this.extractSessionToken(context);
      } else if (context.headers) {
        token = this.extractSessionToken(context.headers);
      } else if (context.cookies) {
        if (typeof context.cookies.get === 'function') {
          const cookieObj = context.cookies.get(this.config.cookieName);
          token = typeof cookieObj === 'object' ? cookieObj?.value : cookieObj;
        } else {
          token = context.cookies[this.config.cookieName];
        }
      } else {
        token = this.extractSessionToken(context);
      }
    } else {
      // Auto-detect Next.js App Router cookies()
      try {
        const { cookies, headers } = require('next/headers');
        if (typeof cookies === 'function') {
          const store = await cookies();
          const cookieObj = store.get ? store.get(this.config.cookieName) : null;
          token = typeof cookieObj === 'object' ? cookieObj?.value : cookieObj;
        }
        if (!token && typeof headers === 'function') {
          const headerStore = await headers();
          token = this.extractSessionToken(headerStore);
        }
      } catch {
        // Not in Next.js Server Component or next/headers not in scope
      }
    }

    if (!token) return null;

    const verified = this.verifySession(token);
    if (!verified.isValid || !verified.user) return null;

    return verified.user;
  }

  /**
   * Generates a cryptographically random numeric OTP & stateless verification token
   */
  generateOTP(params: CreateOTPParams): OTPResult {
    const length = params.otpLength || this.config.otpLength;
    const expirySec = params.expirySeconds || this.config.otpExpirySeconds;

    // Secure numeric digits
    let otp = '';
    const digits = '0123456789';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[randomBytes[i] % 10];
    }

    const expiresAt = Math.floor(Date.now() / 1000) + expirySec;
    const verificationToken = this.tokenManager.createStatelessOtpToken(params.phone, otp, expiresAt);

    return {
      phone: params.phone.trim(),
      otp,
      verificationToken,
      expiresAt,
    };
  }

  /**
   * Verifies the provided OTP against the stateless verification token
   */
  verifyOTP(params: VerifyOTPParams): { success: boolean; error?: string } {
    const result = this.tokenManager.verifyStatelessOtp(
      params.phone,
      params.otp,
      params.verificationToken
    );

    return {
      success: result.valid,
      error: result.error,
    };
  }

  /**
   * Creates a signed session token and prepares HTTP cookie parameters
   */
  createSession(user: AuthUser | UserProfile | SessionTokenPayload): { token: string; cookie: CookieHeaderResult } {
    const userId = ('id' in user && user.id) ? user.id : (user as SessionTokenPayload).userId;
    const payload: SessionTokenPayload = {
      userId,
      id: userId,
      phone: user.phone || undefined,
      email: user.email || undefined,
      name: user.name || undefined,
      image: user.image || undefined,
      role: user.role || 'customer',
      metadata: user.metadata || {},
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.config.sessionExpirySeconds,
    };

    const token = this.tokenManager.sign(payload, this.config.sessionExpirySeconds);

    const cookieOptions = {
      httpOnly: true,
      secure: this.config.secureCookies,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: this.config.sessionExpirySeconds,
    };

    const cookieParts = [
      `${encodeURIComponent(this.config.cookieName)}=${encodeURIComponent(token)}`,
      `Max-Age=${cookieOptions.maxAge}`,
      `Path=${cookieOptions.path}`,
      'HttpOnly',
      `SameSite=${cookieOptions.sameSite.charAt(0).toUpperCase() + cookieOptions.sameSite.slice(1)}`,
    ];

    if (cookieOptions.secure) {
      cookieParts.push('Secure');
    }

    return {
      token,
      cookie: {
        name: this.config.cookieName,
        value: token,
        headerString: cookieParts.join('; '),
        options: cookieOptions,
      },
    };
  }

  /**
   * Verifies a session token string
   */
  verifySession(token: string): VerifiedSession {
    const result = this.tokenManager.verify<SessionTokenPayload>(token);
    if (!result.valid || !result.payload) {
      return { isValid: false, error: result.error || 'Invalid session' };
    }
    return {
      isValid: true,
      user: result.payload,
    };
  }

  /**
   * Extracts session token from Cookie header or Authorization: Bearer header
   */
  extractSessionToken(headers: Record<string, string | string[] | undefined> | { get(name: string): string | null }): string | null {
    let authHeader: string | undefined | null;
    let cookieHeader: string | undefined | null;

    if (typeof (headers as any).get === 'function') {
      // Standard Fetch / NextRequest Headers
      authHeader = (headers as any).get('authorization') || (headers as any).get('Authorization');
      cookieHeader = (headers as any).get('cookie') || (headers as any).get('Cookie');
    } else {
      // Node.js IncomingHttpHeaders or plain object
      const h = headers as Record<string, any>;
      authHeader = h['authorization'] || h['Authorization'];
      cookieHeader = h['cookie'] || h['Cookie'];
    }

    if (authHeader && typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
      return authHeader.slice(7).trim();
    }

    if (cookieHeader && typeof cookieHeader === 'string') {
      const match = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${this.config.cookieName}=`));

      if (match) {
        return decodeURIComponent(match.split('=')[1]);
      }
    }

    return null;
  }

  /**
   * Generates a clear session cookie string to log out the user
   */
  createLogoutCookie(): CookieHeaderResult {
    const cookieParts = [
      `${encodeURIComponent(this.config.cookieName)}=`,
      'Max-Age=0',
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
    ];

    if (this.config.secureCookies) {
      cookieParts.push('Secure');
    }

    return {
      name: this.config.cookieName,
      value: '',
      headerString: cookieParts.join('; '),
      options: {
        httpOnly: true,
        secure: this.config.secureCookies,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      },
    };
  }

  /**
   * Generates a unique guest identifier (e.g. for guest checkout)
   */
  generateGuestId(): string {
    return `guest_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Seamlessly merges a guest user's cart into an authenticated user's cart.
   * Merges quantities if the same item/variant exists.
   */
  mergeGuestCart<T extends CartItemToMerge = CartItemToMerge>(
    guestItems: T[],
    userItems: T[]
  ): MergeResult<T> {
    const itemMap = new Map<string, T>();
    let conflictsResolved = 0;

    const getKey = (item: T) => `${item.productId || item.id || 'item'}_${item.variantId || 'default'}`;

    // Add existing user items first
    for (const item of userItems) {
      itemMap.set(getKey(item), { ...item });
    }

    // Merge guest items
    for (const guestItem of guestItems) {
      const key = getKey(guestItem);
      if (itemMap.has(key)) {
        const existing = itemMap.get(key)!;
        existing.quantity += guestItem.quantity;
        conflictsResolved++;
      } else {
        itemMap.set(key, { ...guestItem });
      }
    }

    const mergedItems = Array.from(itemMap.values());
    const itemCount = mergedItems.reduce((acc, curr) => acc + curr.quantity, 0);
    const subtotal = Math.round(
      mergedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) * 100
    ) / 100;

    return {
      mergedItems,
      itemCount,
      subtotal,
      conflictsResolved,
    };
  }
}

export function createBoostAuth(config: AuthConfig): BoostAuth {
  return new BoostAuth(config);
}
