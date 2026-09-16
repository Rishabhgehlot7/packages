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

// src/manager.ts
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
      secureCookies: config.secureCookies ?? process.env.NODE_ENV === "production"
    };
    this.tokenManager = new TokenManager(this.config.secret);
  }
  /**
   * Generates a cryptographically random numeric OTP & stateless verification token
   */
  generateOTP(params) {
    const length = params.otpLength || this.config.otpLength;
    const expirySec = params.expirySeconds || this.config.otpExpirySeconds;
    let otp = "";
    const digits = "0123456789";
    const randomBytes3 = crypto__namespace.randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[randomBytes3[i] % 10];
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
    const payload = {
      userId: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role || "customer",
      metadata: user.metadata || {}
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

exports.BoostAuth = BoostAuth;
exports.TokenManager = TokenManager;
exports.createBoostAuth = createBoostAuth;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map