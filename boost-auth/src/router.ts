import * as crypto from 'crypto';
import { BoostAuth } from './manager';
import { OAuthHelper } from './providers/oauth';
import { OAuthProviderConfig, CredentialsProviderConfig, PhoneOtpProviderConfig, AuthUser } from './types';

export class AuthRouter {
  private auth: BoostAuth;

  constructor(auth: BoostAuth) {
    this.auth = auth;
  }

  /**
   * Main Web-Standard Request Handler (Compatible with Next.js App Router, Remix, Cloudflare, Fetch API)
   */
  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const basePath = this.auth.getBasePath(); // Default: "/api/auth"
    const pathname = url.pathname;

    // Normalize path relative to basePath
    let subpath = pathname;
    if (pathname.startsWith(basePath)) {
      subpath = pathname.slice(basePath.length);
    }
    if (!subpath.startsWith('/')) {
      subpath = '/' + subpath;
    }

    const method = request.method.toUpperCase();

    try {
      // 1. Phone OTP Routes
      if (subpath === '/otp/send' && method === 'POST') {
        return await this.handleSendOtp(request);
      }

      if (subpath === '/otp/verify' && method === 'POST') {
        return await this.handleVerifyOtp(request);
      }

      // 2. Credentials Sign In
      if (subpath === '/signin/credentials' && method === 'POST') {
        return await this.handleCredentialsSignIn(request);
      }

      // 3. OAuth Initiation (e.g. GET /api/auth/signin/google)
      if (subpath.startsWith('/signin/') && method === 'GET') {
        const providerId = subpath.replace('/signin/', '').split('/')[0];
        return await this.handleOAuthSignIn(request, providerId);
      }

      // 4. OAuth Callback (e.g. GET /api/auth/callback/google)
      if (subpath.startsWith('/callback/') && method === 'GET') {
        const providerId = subpath.replace('/callback/', '').split('/')[0];
        return await this.handleOAuthCallback(request, providerId);
      }

      // 5. Session Status
      if (subpath === '/session' && method === 'GET') {
        return await this.handleGetSession(request);
      }

      // 6. Sign Out
      if (subpath === '/signout' && method === 'POST') {
        return await this.handleSignOut(request);
      }

      // 7. eCommerce Guest Cart Merge
      if (subpath === '/guest-cart/merge' && method === 'POST') {
        return await this.handleMergeCart(request);
      }

      // Route Not Found
      return new Response(JSON.stringify({ error: `Route not found: ${method} ${pathname}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({
          error: err.message || 'Internal authentication error',
          status: 500,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  // -------------------------------------------------------------------------
  // Route Implementations
  // -------------------------------------------------------------------------

  private async handleSendOtp(request: Request): Promise<Response> {
    const body = await request.json().catch(() => ({}));
    const phone = body.phone;
    if (!phone || typeof phone !== 'string') {
      return new Response(JSON.stringify({ error: 'Phone number is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const otpRes = this.auth.generateOTP({
      phone,
      otpLength: body.otpLength,
      expirySeconds: body.expirySeconds,
    });

    // Check if phone-otp provider has custom dispatcher
    const phoneProvider = this.auth
      .getProviders()
      .find((p) => p.type === 'phone-otp') as PhoneOtpProviderConfig | undefined;

    if (phoneProvider && phoneProvider.sendOtp) {
      await phoneProvider.sendOtp({ phone: otpRes.phone, otp: otpRes.otp });
    }

    const isDev = process.env.NODE_ENV !== 'production';

    return new Response(
      JSON.stringify({
        success: true,
        phone: otpRes.phone,
        verificationToken: otpRes.verificationToken,
        expiresAt: otpRes.expiresAt,
        ...(isDev ? { devOtp: otpRes.otp } : {}),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  private async handleVerifyOtp(request: Request): Promise<Response> {
    const body = await request.json().catch(() => ({}));
    const { phone, otp, verificationToken } = body;

    if (!phone || !otp || !verificationToken) {
      return new Response(
        JSON.stringify({ error: 'phone, otp, and verificationToken are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const verification = this.auth.verifyOTP({ phone, otp, verificationToken });
    if (!verification.success) {
      return new Response(
        JSON.stringify({ success: false, error: verification.error || 'Invalid OTP' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Resolve or create user
    let user: AuthUser;
    const adapter = this.auth.getAdapter();

    if (adapter) {
      const existing = await adapter.getUserByPhone(phone);
      if (existing) {
        user = existing;
      } else {
        user = await adapter.createUser({
          phone,
          phoneVerified: new Date().toISOString(),
          role: 'customer',
        });
      }
    } else {
      user = {
        id: `usr_${crypto.createHash('md5').update(phone).digest('hex').slice(0, 12)}`,
        phone,
        role: 'customer',
      };
    }

    // Create session
    const session = this.auth.createSession(user);

    return new Response(
      JSON.stringify({
        success: true,
        user,
        token: session.token,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': session.cookie.headerString,
        },
      }
    );
  }

  private async handleCredentialsSignIn(request: Request): Promise<Response> {
    const body = await request.json().catch(() => ({}));
    const credentialsProvider = this.auth
      .getProviders()
      .find((p) => p.type === 'credentials') as CredentialsProviderConfig | undefined;

    if (!credentialsProvider) {
      return new Response(
        JSON.stringify({ error: 'No CredentialsProvider configured in BoostAuth' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await credentialsProvider.authorize(body, request);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const session = this.auth.createSession(user);

    return new Response(
      JSON.stringify({
        success: true,
        user,
        token: session.token,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': session.cookie.headerString,
        },
      }
    );
  }

  private async handleOAuthSignIn(request: Request, providerId: string): Promise<Response> {
    const provider = this.auth
      .getProviders()
      .find((p) => p.id === providerId && (p.type === 'oauth' || p.type === 'oidc')) as
      | OAuthProviderConfig
      | undefined;

    if (!provider) {
      return new Response(
        JSON.stringify({ error: `OAuth provider "${providerId}" not found in config` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reqUrl = new URL(request.url);
    const callbackUrl = reqUrl.searchParams.get('callbackUrl') || '/';
    const baseUrl = this.auth.getBaseUrl(request);
    const redirectUri = `${baseUrl}${this.auth.getBasePath()}/callback/${provider.id}`;

    // Create tamper-proof state containing nonce and destination callbackUrl
    const rawState = JSON.stringify({
      nonce: crypto.randomBytes(16).toString('hex'),
      callbackUrl,
    });
    const state = Buffer.from(rawState).toString('base64url');

    const authUrl = OAuthHelper.buildAuthorizationUrl(provider, {
      redirectUri,
      state,
    });

    // Store state in temporary cookie to prevent CSRF
    const stateCookie = `boost_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
        'Set-Cookie': stateCookie,
      },
    });
  }

  private async handleOAuthCallback(request: Request, providerId: string): Promise<Response> {
    const provider = this.auth
      .getProviders()
      .find((p) => p.id === providerId && (p.type === 'oauth' || p.type === 'oidc')) as
      | OAuthProviderConfig
      | undefined;

    if (!provider) {
      return new Response(
        JSON.stringify({ error: `OAuth provider "${providerId}" not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reqUrl = new URL(request.url);
    const code = reqUrl.searchParams.get('code');
    const state = reqUrl.searchParams.get('state');

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing OAuth authorization code in callback' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Decode state
    let targetCallbackUrl = '/';
    if (state) {
      try {
        const parsedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
        if (parsedState.callbackUrl) {
          targetCallbackUrl = parsedState.callbackUrl;
        }
      } catch {
        // Fallback default
      }
    }

    const baseUrl = this.auth.getBaseUrl(request);
    const redirectUri = `${baseUrl}${this.auth.getBasePath()}/callback/${provider.id}`;

    // Exchange code for tokens
    const tokens = await OAuthHelper.exchangeCodeForTokens(provider, {
      code,
      redirectUri,
    });

    // Fetch normalized profile
    const profile = await OAuthHelper.fetchUserProfile(provider, tokens);

    // Resolve or link user
    let user: AuthUser;
    const adapter = this.auth.getAdapter();

    if (adapter) {
      let existingUser = await adapter.getUserByAccount(provider.id, profile.id);

      if (!existingUser && profile.email) {
        existingUser = await adapter.getUserByEmail(profile.email);
        if (existingUser) {
          await adapter.linkAccount({
            userId: existingUser.id,
            provider: provider.id,
            providerAccountId: profile.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresIn ? Math.floor(Date.now() / 1000) + tokens.expiresIn : null,
          });
        }
      }

      if (!existingUser) {
        user = await adapter.createUser({
          name: profile.name,
          email: profile.email,
          image: profile.image,
          role: 'customer',
        });
        await adapter.linkAccount({
          userId: user.id,
          provider: provider.id,
          providerAccountId: profile.id,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      } else {
        user = existingUser;
      }
    } else {
      // Stateless mode
      user = {
        id: `usr_${provider.id}_${profile.id}`,
        name: profile.name,
        email: profile.email,
        image: profile.image,
        role: 'customer',
      };
    }

    // Create session
    const session = this.auth.createSession(user);

    // Clear state cookie & set session cookie
    const clearStateCookie = 'boost_oauth_state=; Path=/; HttpOnly; Max-Age=0';

    const responseHeaders = new Headers();
    responseHeaders.set('Location', targetCallbackUrl);
    responseHeaders.append('Set-Cookie', session.cookie.headerString);
    responseHeaders.append('Set-Cookie', clearStateCookie);

    return new Response(null, {
      status: 302,
      headers: responseHeaders,
    });
  }

  private async handleGetSession(request: Request): Promise<Response> {
    const token = this.auth.extractSessionToken(request.headers);
    if (!token) {
      return new Response(
        JSON.stringify({ authenticated: false, user: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const verified = this.auth.verifySession(token);
    if (!verified.isValid || !verified.user) {
      return new Response(
        JSON.stringify({ authenticated: false, user: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        user: verified.user,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  private async handleSignOut(request: Request): Promise<Response> {
    const token = this.auth.extractSessionToken(request.headers);
    const adapter = this.auth.getAdapter();

    if (token && adapter && adapter.deleteSession) {
      await adapter.deleteSession(token).catch(() => {});
    }

    const logoutCookie = this.auth.createLogoutCookie();

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': logoutCookie.headerString,
        },
      }
    );
  }

  private async handleMergeCart(request: Request): Promise<Response> {
    const body = await request.json().catch(() => ({}));
    const { guestItems = [], userItems = [] } = body;

    const merged = this.auth.mergeGuestCart(guestItems, userItems);

    return new Response(JSON.stringify(merged), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
