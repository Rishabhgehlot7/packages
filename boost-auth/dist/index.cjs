'use strict';

var crypto = require('crypto');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var crypto__namespace = /*#__PURE__*/_interopNamespace(crypto);

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var TokenManager = class {
  constructor(secret) {
    this.consumedTokens = /* @__PURE__ */ new Set();
    if (!secret || secret.trim().length < 16) {
      throw new Error("[@boostengine/auth] secret must be at least 16 characters long.");
    }
    this.secret = secret;
  }
  base64UrlEncode(str) {
    return Buffer.from(str).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  base64UrlDecode(str) {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  /**
   * Generates a signed JWT-like token (Header.Payload.Signature)
   */
  sign(payload, expiresInSeconds) {
    const now = Math.floor(Date.now() / 1e3);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds
    };
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(fullPayload));
    const signature = crypto__namespace.createHmac("sha256", this.secret).update(`${encodedHeader}.${encodedPayload}`).digest("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
  /**
   * Verifies a signed JWT-like token
   */
  verify(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return { valid: false, error: "Invalid token format" };
      }
      const [encodedHeader, encodedPayload, signature] = parts;
      const expectedSignature = crypto__namespace.createHmac("sha256", this.secret).update(`${encodedHeader}.${encodedPayload}`).digest("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);
      if (sigBuffer.length !== expectedBuffer.length || !crypto__namespace.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return { valid: false, error: "Signature mismatch (token tampered)" };
      }
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
      const now = Math.floor(Date.now() / 1e3);
      if (payload.exp && payload.exp < now) {
        return { valid: false, error: "Token expired" };
      }
      return { valid: true, payload };
    } catch (err) {
      return { valid: false, error: err.message || "Token verification failed" };
    }
  }
  /**
   * Generates a stateless HMAC hash of phone + OTP + nonce + expiry
   */
  createStatelessOtpToken(phone, otp, expiresAt, customNonce) {
    const nonce = customNonce || crypto__namespace.randomBytes(8).toString("hex");
    const data = `${phone.trim()}:${otp.trim()}:${expiresAt}:${nonce}`;
    const hash = crypto__namespace.createHmac("sha256", this.secret).update(data).digest("hex");
    return Buffer.from(`${expiresAt}:${nonce}:${hash}`).toString("base64url");
  }
  /**
   * Verifies an OTP against a stateless token with anti-replay shield
   */
  verifyStatelessOtp(phone, otp, token, options = { preventReplay: true }) {
    try {
      if (options.preventReplay && this.consumedTokens.has(token)) {
        return { valid: false, error: "OTP token has already been consumed (replay attempt detected)" };
      }
      const decoded = Buffer.from(token, "base64url").toString("utf-8");
      const parts = decoded.split(":");
      let expiresAt;
      let nonce = "";
      let expectedHash;
      if (parts.length === 3) {
        expiresAt = parseInt(parts[0], 10);
        nonce = parts[1];
        expectedHash = parts[2];
      } else if (parts.length === 2) {
        expiresAt = parseInt(parts[0], 10);
        expectedHash = parts[1];
      } else {
        return { valid: false, error: "Invalid verification token format" };
      }
      const now = Math.floor(Date.now() / 1e3);
      if (isNaN(expiresAt) || expiresAt < now) {
        return { valid: false, error: "OTP has expired" };
      }
      const data = nonce ? `${phone.trim()}:${otp.trim()}:${expiresAt}:${nonce}` : `${phone.trim()}:${otp.trim()}:${expiresAt}`;
      const actualHash = crypto__namespace.createHmac("sha256", this.secret).update(data).digest("hex");
      const hashBuffer = Buffer.from(actualHash);
      const expectedBuffer = Buffer.from(expectedHash);
      if (hashBuffer.length !== expectedBuffer.length || !crypto__namespace.timingSafeEqual(hashBuffer, expectedBuffer)) {
        return { valid: false, error: "Incorrect OTP" };
      }
      if (options.preventReplay) {
        this.consumedTokens.add(token);
        if (this.consumedTokens.size > 1e4) {
          this.consumedTokens.clear();
        }
      }
      return { valid: true };
    } catch (err) {
      return { valid: false, error: err.message || "Invalid verification token" };
    }
  }
};

// src/providers/oauth.ts
var OAuthHelper = class {
  /**
   * Generates authorization URL for initiating OAuth 2.0 flow
   */
  static buildAuthorizationUrl(config, params) {
    const url = new URL(config.authorizationUrl);
    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("redirect_uri", params.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", params.state);
    const scopes = config.scope || ["openid", "email", "profile"];
    url.searchParams.set("scope", scopes.join(" "));
    if (params.codeChallenge) {
      url.searchParams.set("code_challenge", params.codeChallenge);
      url.searchParams.set("code_challenge_method", "S256");
    }
    if (config.id === "google") {
      url.searchParams.set("access_type", "offline");
      url.searchParams.set("prompt", "consent");
    }
    return url.toString();
  }
  /**
   * Exchanges authorization code for access and ID tokens using standard fetch
   */
  static async exchangeCodeForTokens(config, params) {
    const bodyParams = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: params.code,
      redirect_uri: params.redirectUri,
      grant_type: "authorization_code"
    });
    if (params.codeVerifier) {
      bodyParams.set("code_verifier", params.codeVerifier);
    }
    const res = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: bodyParams.toString()
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`[OAuth Error] Failed to exchange code for tokens with ${config.name}: ${errorText}`);
    }
    const data = await res.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      tokenType: data.token_type || "Bearer",
      expiresIn: data.expires_in,
      scope: data.scope
    };
  }
  /**
   * Fetches user profile from userinfo endpoint
   */
  static async fetchUserProfile(config, tokens) {
    if (!config.userInfoUrl) {
      throw new Error(`[OAuth Error] Provider ${config.name} does not have a userInfoUrl defined.`);
    }
    const res = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "User-Agent": "BoostEngine-Auth",
        Accept: "application/json"
      }
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`[OAuth Error] Failed to fetch user profile from ${config.name}: ${errorText}`);
    }
    const rawProfile = await res.json();
    if (config.profile) {
      return await config.profile(rawProfile, tokens);
    }
    return {
      id: rawProfile.id || rawProfile.sub,
      name: rawProfile.name,
      email: rawProfile.email,
      image: rawProfile.picture || rawProfile.avatar_url
    };
  }
};

// src/security/rate-limiter.ts
var InMemoryRateLimiter = class {
  constructor() {
    this.hits = /* @__PURE__ */ new Map();
  }
  /**
   * Sliding-window rate limiter
   * @param key Unique identifier (e.g. `phone:+919876543210` or `ip:127.0.0.1`)
   * @param limit Maximum allowed hits within the window
   * @param windowSeconds Duration of the rate window in seconds
   */
  check(key, limit, windowSeconds) {
    const now = Math.floor(Date.now() / 1e3);
    const windowStart = now - windowSeconds;
    let timestamps = this.hits.get(key) || [];
    timestamps = timestamps.filter((t) => t > windowStart);
    if (timestamps.length >= limit) {
      const oldestHit = timestamps[0];
      const retryAfterSeconds = Math.max(1, oldestHit + windowSeconds - now);
      this.hits.set(key, timestamps);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds
      };
    }
    timestamps.push(now);
    this.hits.set(key, timestamps);
    if (this.hits.size > 5e3) {
      this.cleanup(windowStart);
    }
    return {
      allowed: true,
      remaining: limit - timestamps.length,
      retryAfterSeconds: 0
    };
  }
  cleanup(windowStart) {
    for (const [key, timestamps] of this.hits.entries()) {
      const active = timestamps.filter((t) => t > windowStart);
      if (active.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, active);
      }
    }
  }
  reset(key) {
    this.hits.delete(key);
  }
};
var defaultRateLimiter = new InMemoryRateLimiter();

// src/router.ts
var AuthRouter = class {
  constructor(auth) {
    this.auth = auth;
  }
  /**
   * Main Web-Standard Request Handler (Compatible with Next.js App Router, Remix, Cloudflare, Fetch API)
   */
  async handleRequest(request) {
    const url = new URL(request.url);
    const basePath = this.auth.getBasePath();
    const pathname = url.pathname;
    let subpath = pathname;
    if (pathname.startsWith(basePath)) {
      subpath = pathname.slice(basePath.length);
    }
    if (!subpath.startsWith("/")) {
      subpath = "/" + subpath;
    }
    const method = request.method.toUpperCase();
    try {
      if (subpath === "/otp/send" && method === "POST") {
        return await this.handleSendOtp(request);
      }
      if (subpath === "/otp/verify" && method === "POST") {
        return await this.handleVerifyOtp(request);
      }
      if (subpath === "/email-otp/send" && method === "POST") {
        return await this.handleSendEmailOtp(request);
      }
      if (subpath === "/email-otp/verify" && method === "POST") {
        return await this.handleVerifyEmailOtp(request);
      }
      if (subpath === "/signin/credentials" && method === "POST") {
        return await this.handleCredentialsSignIn(request);
      }
      if (subpath.startsWith("/signin/") && method === "GET") {
        const providerId = subpath.replace("/signin/", "").split("/")[0];
        return await this.handleOAuthSignIn(request, providerId);
      }
      if (subpath.startsWith("/callback/") && method === "GET") {
        const providerId = subpath.replace("/callback/", "").split("/")[0];
        return await this.handleOAuthCallback(request, providerId);
      }
      if (subpath === "/session" && method === "GET") {
        return await this.handleGetSession(request);
      }
      if (subpath === "/signout" && method === "POST") {
        return await this.handleSignOut(request);
      }
      if (subpath === "/guest-cart/merge" && method === "POST") {
        return await this.handleMergeCart(request);
      }
      return new Response(JSON.stringify({ error: `Route not found: ${method} ${pathname}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: err.message || "Internal authentication error",
          status: 500
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
  // -------------------------------------------------------------------------
  // Route Implementations
  // -------------------------------------------------------------------------
  async handleSendOtp(request) {
    const body = await request.json().catch(() => ({}));
    const phone = body.phone;
    if (!phone || typeof phone !== "string") {
      return new Response(JSON.stringify({ error: "Phone number is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const rateLimitConfig = this.auth.getConfig().rateLimit;
    if (rateLimitConfig?.enabled !== false) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "127.0.0.1";
      const ipLimit = rateLimitConfig?.maxPerIp ?? 5;
      const ipWindow = rateLimitConfig?.windowSecondsIp ?? 60;
      const ipCheck = defaultRateLimiter.check(`ip:${ip}`, ipLimit, ipWindow);
      if (!ipCheck.allowed) {
        return new Response(
          JSON.stringify({
            error: "Too many requests from this IP. Please wait before requesting another OTP.",
            retryAfter: ipCheck.retryAfterSeconds
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(ipCheck.retryAfterSeconds)
            }
          }
        );
      }
      const phoneLimit = rateLimitConfig?.maxPerPhone ?? 3;
      const phoneWindow = rateLimitConfig?.windowSecondsPhone ?? 600;
      const phoneCheck = defaultRateLimiter.check(`phone:${phone.trim()}`, phoneLimit, phoneWindow);
      if (!phoneCheck.allowed) {
        return new Response(
          JSON.stringify({
            error: `Too many OTP requests for ${phone}. Please try again in ${Math.ceil(phoneCheck.retryAfterSeconds / 60)} minutes.`,
            retryAfter: phoneCheck.retryAfterSeconds
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(phoneCheck.retryAfterSeconds)
            }
          }
        );
      }
    }
    const otpRes = this.auth.generateOTP({
      phone,
      otpLength: body.otpLength,
      expirySeconds: body.expirySeconds
    });
    const phoneProvider = this.auth.getProviders().find((p) => p.type === "phone-otp");
    if (phoneProvider && phoneProvider.sendOtp) {
      await phoneProvider.sendOtp({ phone: otpRes.phone, otp: otpRes.otp });
    }
    const isDev = process.env.NODE_ENV !== "production";
    return new Response(
      JSON.stringify({
        success: true,
        phone: otpRes.phone,
        verificationToken: otpRes.verificationToken,
        expiresAt: otpRes.expiresAt,
        ...isDev ? { devOtp: otpRes.otp } : {}
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  async handleVerifyOtp(request) {
    const body = await request.json().catch(() => ({}));
    const { phone, otp, verificationToken } = body;
    if (!phone || !otp || !verificationToken) {
      return new Response(
        JSON.stringify({ error: "phone, otp, and verificationToken are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const verification = this.auth.verifyOTP({ phone, otp, verificationToken });
    if (!verification.success) {
      return new Response(
        JSON.stringify({ success: false, error: verification.error || "Invalid OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let user;
    const adapter = this.auth.getAdapter();
    if (adapter) {
      const existing = await adapter.getUserByPhone(phone);
      if (existing) {
        user = existing;
      } else {
        user = await adapter.createUser({
          phone,
          phoneVerified: (/* @__PURE__ */ new Date()).toISOString(),
          role: "customer"
        });
      }
    } else {
      user = {
        id: `usr_${crypto__namespace.createHash("md5").update(phone).digest("hex").slice(0, 12)}`,
        phone,
        role: "customer"
      };
    }
    const session = this.auth.createSession(user);
    return new Response(
      JSON.stringify({
        success: true,
        user,
        token: session.token
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": session.cookie.headerString
        }
      }
    );
  }
  async handleSendEmailOtp(request) {
    const body = await request.json().catch(() => ({}));
    const email = body.email;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Valid email address is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const cleanEmail = email.toLowerCase().trim();
    const emailProvider = this.auth.getProviders().find((p) => p.type === "email-otp");
    const length = body.otpLength || emailProvider?.otpLength || 6;
    const expirySec = body.expirySeconds || emailProvider?.expirySeconds || 600;
    let otp = "";
    const digits = "0123456789";
    const randomBytes6 = crypto__namespace.randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[randomBytes6[i] % 10];
    }
    const expiresAt = Math.floor(Date.now() / 1e3) + expirySec;
    const tokenManager = this.auth.tokenManager;
    const verificationToken = tokenManager.createStatelessOtpToken(cleanEmail, otp, expiresAt);
    const baseUrl = this.auth.getBaseUrl(request);
    const magicLink = `${baseUrl}${this.auth.getBasePath()}/email-otp/verify?email=${encodeURIComponent(cleanEmail)}&otp=${otp}&verificationToken=${encodeURIComponent(verificationToken)}`;
    if (emailProvider && emailProvider.sendEmail) {
      await emailProvider.sendEmail({ email: cleanEmail, otp, magicLink });
    }
    const isDev = process.env.NODE_ENV !== "production";
    return new Response(
      JSON.stringify({
        success: true,
        email: cleanEmail,
        verificationToken,
        expiresAt,
        ...isDev ? { devOtp: otp, magicLink } : {}
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  async handleVerifyEmailOtp(request) {
    let email = "";
    let otp = "";
    let verificationToken = "";
    if (request.method === "GET") {
      const url = new URL(request.url);
      email = url.searchParams.get("email") || "";
      otp = url.searchParams.get("otp") || "";
      verificationToken = url.searchParams.get("verificationToken") || "";
    } else {
      const body = await request.json().catch(() => ({}));
      email = body.email;
      otp = body.otp;
      verificationToken = body.verificationToken;
    }
    if (!email || !otp || !verificationToken) {
      return new Response(
        JSON.stringify({ error: "email, otp, and verificationToken are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const cleanEmail = email.toLowerCase().trim();
    const tokenManager = this.auth.tokenManager;
    const verification = tokenManager.verifyStatelessOtp(cleanEmail, otp, verificationToken);
    if (!verification.valid) {
      return new Response(
        JSON.stringify({ success: false, error: verification.error || "Invalid or expired OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let user;
    const adapter = this.auth.getAdapter();
    if (adapter) {
      const existing = await adapter.getUserByEmail(cleanEmail);
      if (existing) {
        user = existing;
      } else {
        user = await adapter.createUser({
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          emailVerified: (/* @__PURE__ */ new Date()).toISOString(),
          role: "customer"
        });
      }
    } else {
      user = {
        id: `usr_${crypto__namespace.createHash("md5").update(cleanEmail).digest("hex").slice(0, 12)}`,
        email: cleanEmail,
        name: cleanEmail.split("@")[0],
        role: "customer"
      };
    }
    const session = this.auth.createSession(user);
    if (request.method === "GET") {
      const resHeaders = new Headers();
      resHeaders.set("Location", "/");
      resHeaders.append("Set-Cookie", session.cookie.headerString);
      return new Response(null, { status: 302, headers: resHeaders });
    }
    return new Response(
      JSON.stringify({
        success: true,
        user,
        token: session.token
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": session.cookie.headerString
        }
      }
    );
  }
  async handleCredentialsSignIn(request) {
    const body = await request.json().catch(() => ({}));
    const credentialsProvider = this.auth.getProviders().find((p) => p.type === "credentials");
    if (!credentialsProvider) {
      return new Response(
        JSON.stringify({ error: "No CredentialsProvider configured in BoostAuth" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const user = await credentialsProvider.authorize(body, request);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const session = this.auth.createSession(user);
    return new Response(
      JSON.stringify({
        success: true,
        user,
        token: session.token
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": session.cookie.headerString
        }
      }
    );
  }
  async handleOAuthSignIn(request, providerId) {
    const provider = this.auth.getProviders().find((p) => p.id === providerId && (p.type === "oauth" || p.type === "oidc"));
    if (!provider) {
      return new Response(
        JSON.stringify({ error: `OAuth provider "${providerId}" not found in config` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const reqUrl = new URL(request.url);
    const callbackUrl = reqUrl.searchParams.get("callbackUrl") || "/";
    const baseUrl = this.auth.getBaseUrl(request);
    const redirectUri = `${baseUrl}${this.auth.getBasePath()}/callback/${provider.id}`;
    const rawState = JSON.stringify({
      nonce: crypto__namespace.randomBytes(16).toString("hex"),
      callbackUrl
    });
    const state = Buffer.from(rawState).toString("base64url");
    const authUrl = OAuthHelper.buildAuthorizationUrl(provider, {
      redirectUri,
      state
    });
    const stateCookie = `boost_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
        "Set-Cookie": stateCookie
      }
    });
  }
  async handleOAuthCallback(request, providerId) {
    const provider = this.auth.getProviders().find((p) => p.id === providerId && (p.type === "oauth" || p.type === "oidc"));
    if (!provider) {
      return new Response(
        JSON.stringify({ error: `OAuth provider "${providerId}" not found` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const reqUrl = new URL(request.url);
    const code = reqUrl.searchParams.get("code");
    const state = reqUrl.searchParams.get("state");
    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing OAuth authorization code in callback" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let targetCallbackUrl = "/";
    if (state) {
      try {
        const parsedState = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
        if (parsedState.callbackUrl) {
          targetCallbackUrl = parsedState.callbackUrl;
        }
      } catch {
      }
    }
    const baseUrl = this.auth.getBaseUrl(request);
    const redirectUri = `${baseUrl}${this.auth.getBasePath()}/callback/${provider.id}`;
    const tokens = await OAuthHelper.exchangeCodeForTokens(provider, {
      code,
      redirectUri
    });
    const profile = await OAuthHelper.fetchUserProfile(provider, tokens);
    let user;
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
            expiresAt: tokens.expiresIn ? Math.floor(Date.now() / 1e3) + tokens.expiresIn : null
          });
        }
      }
      if (!existingUser) {
        user = await adapter.createUser({
          name: profile.name,
          email: profile.email,
          image: profile.image,
          role: "customer"
        });
        await adapter.linkAccount({
          userId: user.id,
          provider: provider.id,
          providerAccountId: profile.id,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        });
      } else {
        user = existingUser;
      }
    } else {
      user = {
        id: `usr_${provider.id}_${profile.id}`,
        name: profile.name,
        email: profile.email,
        image: profile.image,
        role: "customer"
      };
    }
    const session = this.auth.createSession(user);
    const clearStateCookie = "boost_oauth_state=; Path=/; HttpOnly; Max-Age=0";
    const responseHeaders = new Headers();
    responseHeaders.set("Location", targetCallbackUrl);
    responseHeaders.append("Set-Cookie", session.cookie.headerString);
    responseHeaders.append("Set-Cookie", clearStateCookie);
    return new Response(null, {
      status: 302,
      headers: responseHeaders
    });
  }
  async handleGetSession(request) {
    const token = this.auth.extractSessionToken(request.headers);
    if (!token) {
      return new Response(
        JSON.stringify({ authenticated: false, user: null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const verified = this.auth.verifySession(token);
    if (!verified.isValid || !verified.user) {
      return new Response(
        JSON.stringify({ authenticated: false, user: null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const headers = new Headers({ "Content-Type": "application/json" });
    if (verified.user.exp && verified.user.iat) {
      const now = Math.floor(Date.now() / 1e3);
      const totalDuration = verified.user.exp - verified.user.iat;
      const elapsed = now - verified.user.iat;
      if (elapsed > totalDuration / 2) {
        const renewed = this.auth.createSession(verified.user);
        headers.set("Set-Cookie", renewed.cookie.headerString);
      }
    }
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: verified.user
      }),
      { status: 200, headers }
    );
  }
  async handleSignOut(request) {
    const token = this.auth.extractSessionToken(request.headers);
    const adapter = this.auth.getAdapter();
    if (token && adapter && adapter.deleteSession) {
      await adapter.deleteSession(token).catch(() => {
      });
    }
    const logoutCookie = this.auth.createLogoutCookie();
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": logoutCookie.headerString
        }
      }
    );
  }
  async handleMergeCart(request) {
    const body = await request.json().catch(() => ({}));
    const { guestItems = [], userItems = [] } = body;
    const merged = this.auth.mergeGuestCart(guestItems, userItems);
    return new Response(JSON.stringify(merged), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// src/organizations/index.ts
var OrganizationManager = class {
  constructor() {
    this.orgs = /* @__PURE__ */ new Map();
    this.members = /* @__PURE__ */ new Map();
  }
  // key: organizationId
  /**
   * Creates a new organization and assigns the user as 'owner'
   */
  async create(params) {
    const slug = params.slug || params.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const orgId = `org_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const organization = {
      id: orgId,
      name: params.name,
      slug,
      metadata: params.metadata || {},
      createdAt: now,
      updatedAt: now
    };
    const membership = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      organizationId: orgId,
      userId: params.userId,
      role: "owner",
      createdAt: now
    };
    this.orgs.set(orgId, organization);
    this.members.set(orgId, [membership]);
    return { organization, membership };
  }
  /**
   * Adds or updates a member in an organization
   */
  async addMember(params) {
    const org = this.orgs.get(params.organizationId);
    if (!org) throw new Error(`Organization ${params.organizationId} not found`);
    const membersList = this.members.get(params.organizationId) || [];
    const existing = membersList.find((m) => m.userId === params.userId);
    if (existing) {
      existing.role = params.role || existing.role;
      return existing;
    }
    const membership = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      organizationId: params.organizationId,
      userId: params.userId,
      role: params.role || "member",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    membersList.push(membership);
    this.members.set(params.organizationId, membersList);
    return membership;
  }
  /**
   * Removes a member from an organization
   */
  async removeMember(organizationId, userId) {
    const membersList = this.members.get(organizationId) || [];
    const filtered = membersList.filter((m) => m.userId !== userId);
    this.members.set(organizationId, filtered);
  }
  /**
   * Lists all organizations a user is a member of
   */
  async listUserOrganizations(userId) {
    const results = [];
    for (const [orgId, membersList] of this.members.entries()) {
      const match = membersList.find((m) => m.userId === userId);
      if (match) {
        const org = this.orgs.get(orgId);
        if (org) {
          results.push({ organization: org, role: match.role });
        }
      }
    }
    return results;
  }
  /**
   * Gets details of an organization by ID or slug
   */
  async get(idOrSlug) {
    const orgById = this.orgs.get(idOrSlug);
    if (orgById) return orgById;
    for (const org of this.orgs.values()) {
      if (org.slug === idOrSlug) return org;
    }
    return null;
  }
};

// src/manager.ts
var BoostAuth = class {
  constructor(config) {
    if (!config.secret) {
      throw new Error('[@boostengine/auth] "secret" key is required.');
    }
    this.config = {
      secret: config.secret,
      sessionExpirySeconds: config.sessionExpirySeconds ?? 30 * 24 * 60 * 60,
      // 30 days
      cookieName: config.cookieName ?? "boost_session",
      otpExpirySeconds: config.otpExpirySeconds ?? 300,
      // 5 minutes
      otpLength: config.otpLength ?? 6,
      secureCookies: config.secureCookies ?? process.env.NODE_ENV === "production",
      basePath: config.basePath ?? "/api/auth",
      baseUrl: config.baseUrl,
      adapter: config.adapter,
      providers: config.providers || [],
      callbacks: config.callbacks || {}
    };
    this.tokenManager = new TokenManager(this.config.secret);
    this.router = new AuthRouter(this);
    this.organizations = new OrganizationManager();
  }
  /**
   * Main Web-Standard Request Handler for Next.js, Express, Fastify, Cloudflare
   */
  async handleRequest(request) {
    return await this.router.handleRequest(request);
  }
  getBasePath() {
    return this.config.basePath;
  }
  getBaseUrl(req) {
    if (this.config.baseUrl) {
      return this.config.baseUrl.replace(/\/+$/, "");
    }
    if (req) {
      const url = new URL(req.url);
      return `${url.protocol}//${url.host}`;
    }
    return "http://localhost:3000";
  }
  getAdapter() {
    return this.config.adapter;
  }
  getProviders() {
    return this.config.providers || [];
  }
  getCallbacks() {
    return this.config.callbacks;
  }
  getConfig() {
    return { ...this.config };
  }
  getTokenManager() {
    return this.tokenManager;
  }
  /**
   * Universal Server-side Session resolver for Next.js Server Components, Server Actions, & APIs.
   * Can be called with explicit headers/cookies or zero arguments in Next.js App Router!
   */
  async getServerSession(context) {
    let token = null;
    if (context) {
      if (typeof context.get === "function") {
        token = this.extractSessionToken(context);
      } else if (context.headers) {
        token = this.extractSessionToken(context.headers);
      } else if (context.cookies) {
        if (typeof context.cookies.get === "function") {
          const cookieObj = context.cookies.get(this.config.cookieName);
          token = typeof cookieObj === "object" ? cookieObj?.value : cookieObj;
        } else {
          token = context.cookies[this.config.cookieName];
        }
      } else {
        token = this.extractSessionToken(context);
      }
    } else {
      try {
        const { cookies, headers } = __require("next/headers");
        if (typeof cookies === "function") {
          const store = await cookies();
          const cookieObj = store.get ? store.get(this.config.cookieName) : null;
          token = typeof cookieObj === "object" ? cookieObj?.value : cookieObj;
        }
        if (!token && typeof headers === "function") {
          const headerStore = await headers();
          token = this.extractSessionToken(headerStore);
        }
      } catch {
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
  generateOTP(params) {
    const length = params.otpLength || this.config.otpLength;
    const expirySec = params.expirySeconds || this.config.otpExpirySeconds;
    let otp = "";
    const digits = "0123456789";
    const randomBytes6 = crypto__namespace.randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[randomBytes6[i] % 10];
    }
    const expiresAt = Math.floor(Date.now() / 1e3) + expirySec;
    const verificationToken = this.tokenManager.createStatelessOtpToken(params.phone, otp, expiresAt);
    return {
      phone: params.phone.trim(),
      otp,
      verificationToken,
      expiresAt
    };
  }
  /**
   * Verifies the provided OTP against the stateless verification token
   */
  verifyOTP(params) {
    const result = this.tokenManager.verifyStatelessOtp(
      params.phone,
      params.otp,
      params.verificationToken
    );
    return {
      success: result.valid,
      error: result.error
    };
  }
  /**
   * Creates a signed session token and prepares HTTP cookie parameters
   */
  createSession(user) {
    const userId = "id" in user && user.id ? user.id : user.userId;
    const payload = {
      userId,
      id: userId,
      phone: user.phone || void 0,
      email: user.email || void 0,
      name: user.name || void 0,
      image: user.image || void 0,
      role: user.role || "customer",
      metadata: user.metadata || {},
      iat: Math.floor(Date.now() / 1e3),
      exp: Math.floor(Date.now() / 1e3) + this.config.sessionExpirySeconds
    };
    const token = this.tokenManager.sign(payload, this.config.sessionExpirySeconds);
    const cookieOptions = {
      httpOnly: true,
      secure: this.config.secureCookies,
      sameSite: "lax",
      path: "/",
      maxAge: this.config.sessionExpirySeconds
    };
    const cookieParts = [
      `${encodeURIComponent(this.config.cookieName)}=${encodeURIComponent(token)}`,
      `Max-Age=${cookieOptions.maxAge}`,
      `Path=${cookieOptions.path}`,
      "HttpOnly",
      `SameSite=${cookieOptions.sameSite.charAt(0).toUpperCase() + cookieOptions.sameSite.slice(1)}`
    ];
    if (cookieOptions.secure) {
      cookieParts.push("Secure");
    }
    return {
      token,
      cookie: {
        name: this.config.cookieName,
        value: token,
        headerString: cookieParts.join("; "),
        options: cookieOptions
      }
    };
  }
  /**
   * Verifies a session token string
   */
  verifySession(token) {
    const result = this.tokenManager.verify(token);
    if (!result.valid || !result.payload) {
      return { isValid: false, error: result.error || "Invalid session" };
    }
    return {
      isValid: true,
      user: result.payload
    };
  }
  /**
   * Extracts session token from Cookie header or Authorization: Bearer header
   */
  extractSessionToken(headers) {
    let authHeader;
    let cookieHeader;
    if (typeof headers.get === "function") {
      authHeader = headers.get("authorization") || headers.get("Authorization");
      cookieHeader = headers.get("cookie") || headers.get("Cookie");
    } else {
      const h = headers;
      authHeader = h["authorization"] || h["Authorization"];
      cookieHeader = h["cookie"] || h["Cookie"];
    }
    if (authHeader && typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
      return authHeader.slice(7).trim();
    }
    if (cookieHeader && typeof cookieHeader === "string") {
      const match = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${this.config.cookieName}=`));
      if (match) {
        return decodeURIComponent(match.split("=")[1]);
      }
    }
    return null;
  }
  /**
   * Generates a clear session cookie string to log out the user
   */
  createLogoutCookie() {
    const cookieParts = [
      `${encodeURIComponent(this.config.cookieName)}=`,
      "Max-Age=0",
      "Path=/",
      "HttpOnly",
      "SameSite=Lax"
    ];
    if (this.config.secureCookies) {
      cookieParts.push("Secure");
    }
    return {
      name: this.config.cookieName,
      value: "",
      headerString: cookieParts.join("; "),
      options: {
        httpOnly: true,
        secure: this.config.secureCookies,
        sameSite: "lax",
        path: "/",
        maxAge: 0
      }
    };
  }
  /**
   * Generates a unique guest identifier (e.g. for guest checkout)
   */
  generateGuestId() {
    return `guest_${Date.now()}_${crypto__namespace.randomBytes(8).toString("hex")}`;
  }
  /**
   * Seamlessly merges a guest user's cart into an authenticated user's cart.
   * Merges quantities if the same item/variant exists.
   */
  mergeGuestCart(guestItems, userItems) {
    const itemMap = /* @__PURE__ */ new Map();
    let conflictsResolved = 0;
    const getKey = (item) => `${item.productId}_${item.variantId || "default"}`;
    for (const item of userItems) {
      itemMap.set(getKey(item), { ...item });
    }
    for (const guestItem of guestItems) {
      const key = getKey(guestItem);
      if (itemMap.has(key)) {
        const existing = itemMap.get(key);
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
      conflictsResolved
    };
  }
};
function createBoostAuth(config) {
  return new BoostAuth(config);
}

// src/adapters/memory.ts
var MemoryAdapter = class {
  constructor() {
    this.name = "memory";
    this.users = /* @__PURE__ */ new Map();
    this.accounts = /* @__PURE__ */ new Map();
    // key: `${provider}:${providerAccountId}`
    this.sessions = /* @__PURE__ */ new Map();
  }
  // key: token
  async createUser(user) {
    const id = user.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newUser = {
      ...user,
      id,
      createdAt: user.createdAt || now,
      updatedAt: user.updatedAt || now
    };
    this.users.set(id, newUser);
    return newUser;
  }
  async getUser(id) {
    return this.users.get(id) || null;
  }
  async getUserByEmail(email) {
    const lowerEmail = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email && user.email.toLowerCase().trim() === lowerEmail) {
        return user;
      }
    }
    return null;
  }
  async getUserByPhone(phone) {
    const cleanPhone = phone.trim();
    for (const user of this.users.values()) {
      if (user.phone && user.phone.trim() === cleanPhone) {
        return user;
      }
    }
    return null;
  }
  async getUserByAccount(provider, providerAccountId) {
    const key = `${provider}:${providerAccountId}`;
    const account = this.accounts.get(key);
    if (!account) return null;
    return this.getUser(account.userId);
  }
  async updateUser(user) {
    const existing = this.users.get(user.id);
    if (!existing) {
      throw new Error(`[MemoryAdapter] User with id ${user.id} not found`);
    }
    const updated = {
      ...existing,
      ...user,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.users.set(user.id, updated);
    return updated;
  }
  async deleteUser(userId) {
    this.users.delete(userId);
    for (const [key, account] of this.accounts.entries()) {
      if (account.userId === userId) {
        this.accounts.delete(key);
      }
    }
  }
  async linkAccount(account) {
    const key = `${account.provider}:${account.providerAccountId}`;
    this.accounts.set(key, { ...account });
  }
  async unlinkAccount(provider, providerAccountId) {
    const key = `${provider}:${providerAccountId}`;
    this.accounts.delete(key);
  }
  async createSession(session) {
    const id = session.id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newSession = {
      ...session,
      id,
      createdAt: session.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: session.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
    };
    this.sessions.set(session.token, newSession);
    return newSession;
  }
  async getSessionAndUser(sessionToken) {
    const session = this.sessions.get(sessionToken);
    if (!session) return null;
    const expTime = typeof session.expiresAt === "number" ? session.expiresAt : new Date(session.expiresAt).getTime() / 1e3;
    if (expTime < Date.now() / 1e3) {
      this.sessions.delete(sessionToken);
      return null;
    }
    const user = await this.getUser(session.userId);
    if (!user) return null;
    return { session, user };
  }
  async updateSession(session) {
    const existing = this.sessions.get(session.token);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...session,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.sessions.set(session.token, updated);
    return updated;
  }
  async deleteSession(sessionToken) {
    this.sessions.delete(sessionToken);
  }
};
function memoryAdapter() {
  return new MemoryAdapter();
}

// src/adapters/prisma.ts
function prismaAdapter(prisma) {
  return {
    name: "prisma",
    async createUser(data) {
      const user = await prisma.user.create({
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          image: data.image,
          role: data.role || "customer",
          metadata: data.metadata
        }
      });
      return user;
    },
    async getUser(id) {
      return await prisma.user.findUnique({ where: { id } });
    },
    async getUserByEmail(email) {
      return await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    },
    async getUserByPhone(phone) {
      return await prisma.user.findFirst({ where: { phone: phone.trim() } });
    },
    async getUserByAccount(provider, providerAccountId) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        },
        include: { user: true }
      });
      return account?.user ?? null;
    },
    async updateUser(data) {
      return await prisma.user.update({
        where: { id: data.id },
        data
      });
    },
    async deleteUser(userId) {
      await prisma.user.delete({ where: { id: userId } });
    },
    async linkAccount(data) {
      await prisma.account.create({
        data: {
          userId: data.userId,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refreshToken: data.refreshToken,
          accessToken: data.accessToken,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType,
          scope: data.scope,
          idToken: data.idToken
        }
      });
    },
    async unlinkAccount(provider, providerAccountId) {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        }
      });
    },
    async createSession(data) {
      if (!prisma.session) {
        throw new Error("[prismaAdapter] prisma.session model is not defined in your schema.prisma");
      }
      return await prisma.session.create({
        data: {
          id: data.id,
          userId: data.userId,
          token: data.token,
          expiresAt: new Date(typeof data.expiresAt === "number" ? data.expiresAt * 1e3 : data.expiresAt),
          ipAddress: data.ipAddress,
          userAgent: data.userAgent
        }
      });
    },
    async getSessionAndUser(sessionToken) {
      if (!prisma.session) return null;
      const res = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true }
      });
      if (!res) return null;
      const { user, ...session } = res;
      return { session, user };
    },
    async deleteSession(sessionToken) {
      if (!prisma.session) return;
      await prisma.session.delete({ where: { token: sessionToken } });
    }
  };
}

// src/adapters/mongodb.ts
function mongodbAdapter(db) {
  const users = db.collection("users");
  const accounts = db.collection("accounts");
  const sessions = db.collection("sessions");
  const normalizeId = (doc) => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id ? String(_id) : rest.id, ...rest };
  };
  return {
    name: "mongodb",
    async createUser(data) {
      const id = data.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const doc = {
        _id: id,
        ...data,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      await users.insertOne(doc);
      return normalizeId(doc);
    },
    async getUser(id) {
      const doc = await users.findOne({ _id: id });
      return normalizeId(doc);
    },
    async getUserByEmail(email) {
      const doc = await users.findOne({ email: email.toLowerCase().trim() });
      return normalizeId(doc);
    },
    async getUserByPhone(phone) {
      const doc = await users.findOne({ phone: phone.trim() });
      return normalizeId(doc);
    },
    async getUserByAccount(provider, providerAccountId) {
      const account = await accounts.findOne({ provider, providerAccountId });
      if (!account) return null;
      return await this.getUser(account.userId);
    },
    async updateUser(data) {
      const { id, ...updateFields } = data;
      await users.updateOne(
        { _id: id },
        { $set: { ...updateFields, updatedAt: /* @__PURE__ */ new Date() } }
      );
      const updated = await users.findOne({ _id: id });
      return normalizeId(updated);
    },
    async deleteUser(userId) {
      await users.deleteOne({ _id: userId });
      await accounts.deleteMany({ userId });
      await sessions.deleteMany({ userId });
    },
    async linkAccount(account) {
      await accounts.insertOne({
        ...account,
        createdAt: /* @__PURE__ */ new Date()
      });
    },
    async unlinkAccount(provider, providerAccountId) {
      await accounts.deleteOne({ provider, providerAccountId });
    },
    async createSession(session) {
      const id = session.id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const doc = {
        _id: id,
        ...session,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      await sessions.insertOne(doc);
      return normalizeId(doc);
    },
    async getSessionAndUser(sessionToken) {
      const sessionDoc = await sessions.findOne({ token: sessionToken });
      if (!sessionDoc) return null;
      const session = normalizeId(sessionDoc);
      const user = await this.getUser(session.userId);
      if (!user) return null;
      return { session, user };
    },
    async deleteSession(sessionToken) {
      await sessions.deleteOne({ token: sessionToken });
    }
  };
}

// src/adapters/drizzle.ts
function drizzleAdapter(db, schema, operators) {
  const { eq, and } = operators;
  return {
    name: "drizzle",
    async createUser(data) {
      const id = data.id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const values = {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
        role: data.role || "customer"
      };
      const result = await db.insert(schema.users).values(values).returning();
      return result[0] || values;
    },
    async getUser(id) {
      const rows = await db.select().from(schema.users).where(eq(schema.users.id, id));
      return rows[0] || null;
    },
    async getUserByEmail(email) {
      const rows = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim()));
      return rows[0] || null;
    },
    async getUserByPhone(phone) {
      const rows = await db.select().from(schema.users).where(eq(schema.users.phone, phone.trim()));
      return rows[0] || null;
    },
    async getUserByAccount(provider, providerAccountId) {
      const rows = await db.select().from(schema.accounts).where(
        and(
          eq(schema.accounts.provider, provider),
          eq(schema.accounts.providerAccountId, providerAccountId)
        )
      );
      const account = rows[0];
      if (!account) return null;
      return await this.getUser(account.userId);
    },
    async updateUser(data) {
      const result = await db.update(schema.users).set(data).where(eq(schema.users.id, data.id)).returning();
      return result[0];
    },
    async deleteUser(userId) {
      await db.delete(schema.users).where(eq(schema.users.id, userId));
    },
    async linkAccount(account) {
      await db.insert(schema.accounts).values(account);
    },
    async unlinkAccount(provider, providerAccountId) {
      await db.delete(schema.accounts).where(
        and(
          eq(schema.accounts.provider, provider),
          eq(schema.accounts.providerAccountId, providerAccountId)
        )
      );
    },
    async createSession(session) {
      if (!schema.sessions) {
        throw new Error("[drizzleAdapter] sessions table is not provided in schema");
      }
      const id = session.id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const values = {
        id,
        userId: session.userId,
        token: session.token,
        expiresAt: new Date(typeof session.expiresAt === "number" ? session.expiresAt * 1e3 : session.expiresAt),
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      };
      const result = await db.insert(schema.sessions).values(values).returning();
      return result[0] || values;
    },
    async getSessionAndUser(sessionToken) {
      if (!schema.sessions) return null;
      const sessionRows = await db.select().from(schema.sessions).where(eq(schema.sessions.token, sessionToken));
      const session = sessionRows[0];
      if (!session) return null;
      const user = await this.getUser(session.userId);
      if (!user) return null;
      return { session, user };
    },
    async deleteSession(sessionToken) {
      if (!schema.sessions) return;
      await db.delete(schema.sessions).where(eq(schema.sessions.token, sessionToken));
    }
  };
}

// src/providers/index.ts
function GoogleProvider(options) {
  return {
    id: "google",
    name: "Google",
    type: "oidc",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: options.scope || ["openid", "email", "profile"],
    profile(data) {
      return {
        id: data.sub,
        name: data.name,
        email: data.email,
        image: data.picture,
        emailVerified: data.email_verified ? (/* @__PURE__ */ new Date()).toISOString() : null
      };
    }
  };
}
function GitHubProvider(options) {
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scope: options.scope || ["read:user", "user:email"],
    async profile(data, tokens) {
      let email = data.email;
      if (!email && tokens.accessToken) {
        try {
          const emailRes = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
              "User-Agent": "BoostEngine-Auth",
              Accept: "application/json"
            }
          });
          if (emailRes.ok) {
            const emails = await emailRes.json();
            const primary = emails.find((e) => e.primary && e.verified) || emails[0];
            if (primary) email = primary.email;
          }
        } catch {
        }
      }
      return {
        id: String(data.id),
        name: data.name || data.login,
        email,
        image: data.avatar_url
      };
    }
  };
}
function DiscordProvider(options) {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: "https://discord.com/api/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    userInfoUrl: "https://discord.com/api/users/@me",
    scope: options.scope || ["identify", "email"],
    profile(data) {
      const avatarUrl = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : null;
      return {
        id: data.id,
        name: data.global_name || data.username,
        email: data.email,
        image: avatarUrl
      };
    }
  };
}
function AppleProvider(options) {
  return {
    id: "apple",
    name: "Apple",
    type: "oidc",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: "https://appleid.apple.com/auth/authorize",
    tokenUrl: "https://appleid.apple.com/auth/token",
    scope: options.scope || ["name", "email"],
    profile(data, tokens) {
      let email = data.email;
      let sub = data.sub;
      if (!sub && tokens.idToken) {
        try {
          const payload = JSON.parse(
            Buffer.from(tokens.idToken.split(".")[1], "base64url").toString("utf-8")
          );
          sub = payload.sub;
          email = payload.email || email;
        } catch {
        }
      }
      return {
        id: sub || `apple_${Date.now()}`,
        name: data.name ? `${data.name.firstName || ""} ${data.name.lastName || ""}`.trim() : email ? email.split("@")[0] : "Apple User",
        email
      };
    }
  };
}
function CredentialsProvider(options) {
  return {
    id: options.id || "credentials",
    name: options.name || "Credentials",
    type: "credentials",
    authorize: options.authorize
  };
}
function EmailOtpProvider(options) {
  return {
    id: options.id || "email-otp",
    name: options.name || "Email OTP",
    type: "email-otp",
    otpLength: options.otpLength ?? 6,
    expirySeconds: options.expirySeconds ?? 600,
    sendEmail: options.sendEmail
  };
}
function PhoneOtpProvider(options) {
  return {
    id: options?.id || "phone-otp",
    name: options?.name || "Phone OTP",
    type: "phone-otp",
    otpLength: options?.otpLength ?? 6,
    expirySeconds: options?.expirySeconds ?? 300,
    sendOtp: options?.sendOtp
  };
}
function BoostCommunicationsProvider(options) {
  return {
    id: "boost-communications",
    name: "BoostEngine Omnichannel Communications",
    type: "phone-otp",
    otpLength: options?.otpLength ?? 6,
    expirySeconds: options?.expirySeconds ?? 300,
    async sendOtp({ phone, otp }) {
      let client = options?.client;
      if (!client) {
        try {
          const commsModule = __require("@boostengine/communications");
          client = commsModule.comms || commsModule.createOmnichannelEngine && commsModule.createOmnichannelEngine();
        } catch {
        }
      }
      if (client) {
        if (typeof client.sendOTP === "function") {
          await client.sendOTP({ phone, otp, channel: options?.channel || "auto" });
          return;
        }
        if (typeof client.send === "function") {
          await client.send({
            to: phone,
            channel: options?.channel || "whatsapp",
            message: `Your verification code is ${otp}. Valid for 5 minutes.`
          });
          return;
        }
      }
      if (process.env.NODE_ENV !== "production") {
        console.log(`\u{1F4E1} [@boostengine/communications] OTP Dispatch for ${phone}: ${otp}`);
      }
    }
  };
}

// src/frameworks/next.ts
function toNextJsHandler(auth) {
  const handler = async (request) => {
    return await auth.handleRequest(request);
  };
  return {
    GET: handler,
    POST: handler
  };
}
async function getServerSession(auth, context) {
  return await auth.getServerSession(context);
}
function toPagesHandler(auth) {
  return async (req, res) => {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else if (value) {
        headers.set(key, value);
      }
    }
    const init = {
      method: req.method,
      headers
    };
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }
    const webRequest = new Request(url.toString(), init);
    const webResponse = await auth.handleRequest(webRequest);
    res.status(webResponse.status);
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });
    const bodyText = await webResponse.text();
    res.send(bodyText);
  };
}
function createAuthMiddleware(auth, options = {}) {
  const protectedRoutes = options.protectedRoutes || [];
  const loginUrl = options.loginUrl || "/login";
  const afterLoginUrl = options.afterLoginUrl;
  const rolePermissions = options.rolePermissions || {};
  return async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const token = auth.extractSessionToken(request.headers);
    const session = token ? auth.verifySession(token) : { isValid: false, user: void 0 };
    const isAuthenticated = session.isValid && !!session.user;
    if (isAuthenticated && afterLoginUrl && pathname === loginUrl) {
      return Response.redirect(new URL(afterLoginUrl, request.url));
    }
    const isProtected = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (isProtected && !isAuthenticated) {
      const redirectTarget = new URL(loginUrl, request.url);
      redirectTarget.searchParams.set("callbackUrl", pathname);
      return Response.redirect(redirectTarget);
    }
    if (isAuthenticated && session.user) {
      for (const [prefix, allowedRoles] of Object.entries(rolePermissions)) {
        if (pathname === prefix || pathname.startsWith(prefix + "/")) {
          const userRole = session.user.role || "customer";
          if (!allowedRoles.includes(userRole)) {
            return new Response("Access Forbidden: Insufficient Permissions", { status: 403 });
          }
        }
      }
    }
    if (isAuthenticated && session.user && session.user.exp && session.user.iat) {
      const now = Math.floor(Date.now() / 1e3);
      const totalDuration = session.user.exp - session.user.iat;
      const elapsed = now - session.user.iat;
      if (elapsed > totalDuration / 2) {
        const renewed = auth.createSession(session.user);
        const res = new Response(null, { status: 200, headers: { "x-middleware-next": "1" } });
        res.headers.set("Set-Cookie", renewed.cookie.headerString);
        return res;
      }
    }
    return new Response(null, {
      status: 200,
      headers: { "x-middleware-next": "1" }
    });
  };
}

// src/frameworks/node.ts
function toNodeHandler(auth) {
  return async (req, res, next) => {
    try {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
      const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
      const fullUrl = `${protocol}://${host}${req.originalUrl || req.url}`;
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else if (value) {
          headers.set(key, value);
        }
      }
      let body = void 0;
      if (req.method !== "GET" && req.method !== "HEAD") {
        if (req.body) {
          body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        } else {
          body = await new Promise((resolve, reject) => {
            let data = "";
            req.on("data", (chunk) => data += chunk);
            req.on("end", () => resolve(data));
            req.on("error", reject);
          });
        }
      }
      const webRequest = new Request(fullUrl, {
        method: req.method,
        headers,
        body: body ? body : void 0
      });
      const webResponse = await auth.handleRequest(webRequest);
      res.statusCode = webResponse.status;
      webResponse.headers.forEach((val, key) => {
        if (key.toLowerCase() === "set-cookie") {
          const existing = res.getHeader("set-cookie");
          if (Array.isArray(existing)) {
            res.setHeader("set-cookie", [...existing, val]);
          } else if (existing) {
            res.setHeader("set-cookie", [existing, val]);
          } else {
            res.setHeader("set-cookie", val);
          }
        } else {
          res.setHeader(key, val);
        }
      });
      const text = await webResponse.text();
      res.end(text);
    } catch (err) {
      if (typeof next === "function") {
        next();
      } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
      }
    }
  };
}

// src/client/storage.ts
var MemoryStorage = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  getItem(key) {
    return this.map.get(key) || null;
  }
  setItem(key, value) {
    this.map.set(key, value);
  }
  removeItem(key) {
    this.map.delete(key);
  }
};
var WebStorage = class {
  getItem(key) {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  }
  setItem(key, value) {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }
  removeItem(key) {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  }
};

// src/client/react.ts
var AuthContext = null;
function getAuthContext() {
  if (!AuthContext && typeof React !== "undefined" && React.createContext) {
    AuthContext = React.createContext(null);
  }
  return AuthContext;
}
function AuthProvider({ client, children }) {
  const [sessionState, setSessionState] = (typeof React !== "undefined" ? React.useState : ((init) => [init, () => {
  }]))(
    client.getState()
  );
  (typeof React !== "undefined" ? React.useEffect : (() => {
  }))(() => {
    client.getSession();
    const unsubscribe = client.subscribe((state) => {
      setSessionState(state);
    });
    return unsubscribe;
  }, [client]);
  const value = {
    ...sessionState,
    client,
    signIn: client.signIn,
    verifyOtp: client.verifyOtp.bind(client),
    signOut: client.signOut.bind(client),
    refreshSession: client.getSession.bind(client)
  };
  const Context = getAuthContext();
  if (Context && React.createElement) {
    return React.createElement(Context.Provider, { value }, children);
  }
  return children;
}
function useSession() {
  const Context = getAuthContext();
  const context = typeof React !== "undefined" && Context ? React.useContext(Context) : null;
  if (!context) {
    throw new Error("[useSession] must be used within an <AuthProvider client={authClient}>");
  }
  return context;
}
function SignInCard({
  onSuccess,
  socialProviders = ["google", "github"],
  title = "Welcome Back",
  subtitle = "Sign in with your phone or social account"
}) {
  const session = useSession();
  const [step, setStep] = React.useState("phone");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [verificationToken, setVerificationToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1e3);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!phone.trim()) return setError("Please enter a valid phone number");
    setError("");
    setLoading(true);
    try {
      const res = await session.signIn.phone({ phone: phone.trim() });
      setVerificationToken(res.verificationToken);
      setStep("otp");
      setTimer(60);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otp.trim()) return setError("Please enter the 6-digit OTP");
    setError("");
    setLoading(true);
    try {
      const res = await session.verifyOtp({ phone: phone.trim(), otp: otp.trim(), verificationToken });
      if (onSuccess) onSuccess(res.user);
    } catch (err) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };
  return React.createElement(
    "div",
    {
      style: {
        maxWidth: "420px",
        width: "100%",
        margin: "0 auto",
        padding: "32px",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        background: "#0f172a",
        color: "#f8fafc",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }
    },
    React.createElement("h2", { style: { fontSize: "22px", fontWeight: "bold", margin: "0 0 6px 0" } }, title),
    React.createElement("p", { style: { fontSize: "14px", color: "#94a3b8", margin: "0 0 24px 0" } }, subtitle),
    error ? React.createElement("div", {
      style: {
        padding: "10px 14px",
        background: "rgba(239, 68, 68, 0.15)",
        color: "#ef4444",
        borderRadius: "8px",
        fontSize: "13px",
        marginBottom: "16px"
      }
    }, error) : null,
    step === "phone" ? React.createElement(
      "form",
      { onSubmit: handleSendOtp },
      React.createElement("input", {
        type: "tel",
        placeholder: "+91 98765 43210",
        value: phone,
        onChange: (e) => setPhone(e.target.value),
        style: {
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          background: "#1e293b",
          border: "1px solid #334155",
          color: "#fff",
          fontSize: "15px",
          boxSizing: "border-box",
          marginBottom: "16px"
        }
      }),
      React.createElement(
        "button",
        {
          type: "submit",
          disabled: loading,
          style: {
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }
        },
        loading ? "Sending OTP..." : "Continue with Phone"
      )
    ) : React.createElement(
      "form",
      { onSubmit: handleVerifyOtp },
      React.createElement("input", {
        type: "text",
        placeholder: "6-digit OTP",
        maxLength: 6,
        value: otp,
        onChange: (e) => setOtp(e.target.value),
        style: {
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          background: "#1e293b",
          border: "1px solid #334155",
          color: "#fff",
          fontSize: "18px",
          textAlign: "center",
          letterSpacing: "4px",
          boxSizing: "border-box",
          marginBottom: "16px"
        }
      }),
      React.createElement(
        "button",
        {
          type: "submit",
          disabled: loading,
          style: {
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "#10b981",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "12px"
          }
        },
        loading ? "Verifying..." : "Verify & Sign In"
      ),
      React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "space-between", fontSize: "13px" } },
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => setStep("phone"),
            style: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }
          },
          "Change Phone"
        ),
        timer > 0 ? React.createElement("span", { style: { color: "#64748b" } }, `Resend in ${timer}s`) : React.createElement(
          "button",
          {
            type: "button",
            onClick: handleSendOtp,
            style: { background: "none", border: "none", color: "#38bdf8", cursor: "pointer" }
          },
          "Resend OTP"
        )
      )
    ),
    socialProviders.length > 0 ? React.createElement(
      "div",
      { style: { marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #334155" } },
      socialProviders.map(
        (prov) => React.createElement(
          "button",
          {
            key: prov,
            type: "button",
            onClick: () => session.signIn.social({ provider: prov }),
            style: {
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#e2e8f0",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }
          },
          `Continue with ${prov.charAt(0).toUpperCase() + prov.slice(1)}`
        )
      )
    ) : null
  );
}

// src/client/index.ts
var BoostAuthClient = class {
  constructor(config) {
    this.tokenKey = "boost_auth_token";
    this.listeners = /* @__PURE__ */ new Set();
    this.currentState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true
    };
    // ---------------------------------------------------------------------------
    // Sign In Methods
    // ---------------------------------------------------------------------------
    this.signIn = {
      /**
       * Send OTP to customer's phone
       */
      phone: async (params) => {
        return await this.fetchApi("/otp/send", {
          method: "POST",
          body: JSON.stringify(params)
        });
      },
      /**
       * Sign in with username/email & password
       */
      credentials: async (credentials) => {
        const res = await this.fetchApi("/signin/credentials", {
          method: "POST",
          body: JSON.stringify(credentials)
        });
        if (res.token) {
          await this.setToken(res.token);
        }
        this.currentState = {
          user: res.user,
          token: res.token,
          isAuthenticated: true,
          isLoading: false
        };
        this.notify();
        return res;
      },
      /**
       * Sign in with Email and Password
       */
      emailPassword: async (params) => {
        return await this.signIn.credentials(params);
      },
      /**
       * Initiate OAuth Social Login (Google, GitHub, Discord, etc.)
       */
      social: async (params) => {
        const callback = params.callbackUrl || (typeof window !== "undefined" ? window.location.origin : "/");
        const url = `${this.baseURL}/signin/${params.provider}?callbackUrl=${encodeURIComponent(callback)}`;
        if (typeof window !== "undefined" && window.location) {
          window.location.href = url;
        }
        return { url };
      }
    };
    // ---------------------------------------------------------------------------
    // eCommerce Helper Methods
    // ---------------------------------------------------------------------------
    this.guestCart = {
      merge: async (guestItems, userItems) => {
        return await this.fetchApi("/guest-cart/merge", {
          method: "POST",
          body: JSON.stringify({ guestItems, userItems })
        });
      }
    };
    this.baseURL = config.baseURL.replace(/\/+$/, "");
    this.storage = config.storage || (typeof window !== "undefined" ? new WebStorage() : new MemoryStorage());
    this.customFetch = config.fetch || (typeof fetch !== "undefined" ? fetch.bind(globalThis) : null);
  }
  notify() {
    this.listeners.forEach((listener) => listener({ ...this.currentState }));
  }
  subscribe(listener) {
    this.listeners.add(listener);
    listener({ ...this.currentState });
    return () => this.listeners.delete(listener);
  }
  getState() {
    return { ...this.currentState };
  }
  async getToken() {
    return await this.storage.getItem(this.tokenKey);
  }
  async setToken(token) {
    await this.storage.setItem(this.tokenKey, token);
  }
  async removeToken() {
    await this.storage.removeItem(this.tokenKey);
  }
  async fetchApi(path, init = {}) {
    const url = `${this.baseURL}${path}`;
    const token = await this.getToken();
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init.headers || {}
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await this.customFetch(url, {
      ...init,
      headers,
      credentials: "include"
      // Ensures cookies are automatically sent/received in browser
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  }
  /**
   * Verifies Phone OTP and sets up authenticated session
   */
  async verifyOtp(params) {
    const res = await this.fetchApi("/otp/verify", {
      method: "POST",
      body: JSON.stringify(params)
    });
    if (res.token) {
      await this.setToken(res.token);
    }
    this.currentState = {
      user: res.user,
      token: res.token,
      isAuthenticated: true,
      isLoading: false
    };
    this.notify();
    return res;
  }
  /**
   * Retrieves active session user
   */
  async getSession() {
    try {
      this.currentState.isLoading = true;
      const res = await this.fetchApi("/session", { method: "GET" });
      if (res.authenticated && res.user) {
        const token = await this.getToken();
        this.currentState = {
          user: res.user,
          token,
          isAuthenticated: true,
          isLoading: false
        };
      } else {
        this.currentState = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        };
      }
    } catch {
      this.currentState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
    }
    this.notify();
    return { ...this.currentState };
  }
  /**
   * Signs out user and clears cookies and local tokens
   */
  async signOut() {
    try {
      await this.fetchApi("/signout", { method: "POST" });
    } finally {
      await this.removeToken();
      this.currentState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
      this.notify();
    }
  }
};
function createAuthClient(config) {
  return new BoostAuthClient(config);
}
var TOTPManager = class {
  /**
   * Encodes a Buffer to a Base32 string
   */
  static base32Encode(buffer) {
    let bits = 0;
    let value = 0;
    let output = "";
    for (let i = 0; i < buffer.length; i++) {
      value = value << 8 | buffer[i];
      bits += 8;
      while (bits >= 5) {
        output += this.BASE32_ALPHABET[value >>> bits - 5 & 31];
        bits -= 5;
      }
    }
    if (bits > 0) {
      output += this.BASE32_ALPHABET[value << 5 - bits & 31];
    }
    return output;
  }
  /**
   * Decodes a Base32 string to a Buffer
   */
  static base32Decode(base32) {
    const clean = base32.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
    let bits = 0;
    let value = 0;
    const bytes = [];
    for (let i = 0; i < clean.length; i++) {
      const idx = this.BASE32_ALPHABET.indexOf(clean[i]);
      if (idx === -1) continue;
      value = value << 5 | idx;
      bits += 5;
      if (bits >= 8) {
        bytes.push(value >>> bits - 8 & 255);
        bits -= 8;
      }
    }
    return Buffer.from(bytes);
  }
  /**
   * Generates a cryptographically secure random 20-byte Base32 secret for 2FA
   */
  static generateSecret(byteLength = 20) {
    const randomBytes6 = crypto__namespace.randomBytes(byteLength);
    return this.base32Encode(randomBytes6);
  }
  /**
   * Builds the standard `otpauth://` URI to display as a QR code in Google Authenticator
   */
  static generateOtpAuthUri(options) {
    const issuer = options.issuer || "BoostEngine";
    const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(options.accountName)}`;
    const params = new URLSearchParams({
      secret: options.secret,
      issuer,
      algorithm: "SHA1",
      digits: "6",
      period: "30"
    });
    return `otpauth://totp/${label}?${params.toString()}`;
  }
  /**
   * Generates a 6-digit TOTP token for the given secret at a specific Unix timestamp
   */
  static generateToken(secret, timestampSeconds) {
    const time = timestampSeconds ?? Math.floor(Date.now() / 1e3);
    const counter = Math.floor(time / 30);
    const secretBuffer = this.base32Decode(secret);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(counter));
    const hmac = crypto__namespace.createHmac("sha1", secretBuffer).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 15;
    const binary = (hmac[offset] & 127) << 24 | (hmac[offset + 1] & 255) << 16 | (hmac[offset + 2] & 255) << 8 | hmac[offset + 3] & 255;
    const otp = binary % 1e6;
    return otp.toString().padStart(6, "0");
  }
  /**
   * Verifies a 6-digit TOTP token with a ±1 step clock-drift window (covers 90 seconds)
   */
  static verifyToken(token, secret, options = { window: 1 }) {
    if (!token || token.trim().length !== 6) return false;
    const window2 = options.window ?? 1;
    const now = Math.floor(Date.now() / 1e3);
    for (let step = -window2; step <= window2; step++) {
      const checkTime = now + step * 30;
      const expectedToken = this.generateToken(secret, checkTime);
      const bufToken = Buffer.from(token.trim());
      const bufExpected = Buffer.from(expectedToken);
      if (bufToken.length === bufExpected.length && crypto__namespace.timingSafeEqual(bufToken, bufExpected)) {
        return true;
      }
    }
    return false;
  }
};
TOTPManager.BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto__namespace.randomBytes(16).toString("hex");
    crypto__namespace.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}
async function verifyPassword(password, storedHash) {
  return new Promise((resolve) => {
    try {
      const [salt, key] = storedHash.split(":");
      if (!salt || !key) return resolve(false);
      crypto__namespace.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const keyBuffer = Buffer.from(key, "hex");
        if (keyBuffer.length !== derivedKey.length) return resolve(false);
        const match = crypto__namespace.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      });
    } catch {
      resolve(false);
    }
  });
}

exports.AppleProvider = AppleProvider;
exports.AuthProvider = AuthProvider;
exports.AuthRouter = AuthRouter;
exports.BoostAuth = BoostAuth;
exports.BoostAuthClient = BoostAuthClient;
exports.BoostCommunicationsProvider = BoostCommunicationsProvider;
exports.CredentialsProvider = CredentialsProvider;
exports.DiscordProvider = DiscordProvider;
exports.EmailOtpProvider = EmailOtpProvider;
exports.GitHubProvider = GitHubProvider;
exports.GoogleProvider = GoogleProvider;
exports.InMemoryRateLimiter = InMemoryRateLimiter;
exports.MemoryAdapter = MemoryAdapter;
exports.OAuthHelper = OAuthHelper;
exports.OrganizationManager = OrganizationManager;
exports.PhoneOtpProvider = PhoneOtpProvider;
exports.SignInCard = SignInCard;
exports.TOTPManager = TOTPManager;
exports.TokenManager = TokenManager;
exports.createAuthClient = createAuthClient;
exports.createAuthMiddleware = createAuthMiddleware;
exports.createBoostAuth = createBoostAuth;
exports.defaultRateLimiter = defaultRateLimiter;
exports.drizzleAdapter = drizzleAdapter;
exports.getServerSession = getServerSession;
exports.hashPassword = hashPassword;
exports.memoryAdapter = memoryAdapter;
exports.mongodbAdapter = mongodbAdapter;
exports.prismaAdapter = prismaAdapter;
exports.toNextJsHandler = toNextJsHandler;
exports.toNodeHandler = toNodeHandler;
exports.toPagesHandler = toPagesHandler;
exports.useSession = useSession;
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map