import * as crypto from 'crypto';

export class TokenManager {
  private secret: string;

  constructor(secret: string) {
    if (!secret || secret.trim().length < 16) {
      throw new Error('[@boostengine/auth] secret must be at least 16 characters long.');
    }
    this.secret = secret;
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  /**
   * Generates a signed JWT-like token (Header.Payload.Signature)
   */
  sign<T extends Record<string, any>>(payload: T, expiresInSeconds: number): string {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(fullPayload));

    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Verifies a signed JWT-like token
   */
  verify<T extends Record<string, any>>(token: string): { valid: boolean; payload?: T; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' };
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return { valid: false, error: 'Signature mismatch (token tampered)' };
      }

      const payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as T & { exp?: number; iat?: number };
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        return { valid: false, error: 'Token expired' };
      }

      return { valid: true, payload };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Token verification failed' };
    }
  }

  private consumedTokens = new Set<string>();

  /**
   * Generates a stateless HMAC hash of phone + OTP + nonce + expiry
   */
  createStatelessOtpToken(phone: string, otp: string, expiresAt: number, customNonce?: string): string {
    const nonce = customNonce || crypto.randomBytes(8).toString('hex');
    const data = `${phone.trim()}:${otp.trim()}:${expiresAt}:${nonce}`;
    const hash = crypto.createHmac('sha256', this.secret).update(data).digest('hex');
    // Pack expiry, nonce, and hash into a single token string
    return Buffer.from(`${expiresAt}:${nonce}:${hash}`).toString('base64url');
  }

  /**
   * Verifies an OTP against a stateless token with anti-replay shield
   */
  verifyStatelessOtp(
    phone: string,
    otp: string,
    token: string,
    options: { preventReplay?: boolean } = { preventReplay: true }
  ): { valid: boolean; error?: string } {
    try {
      if (options.preventReplay && this.consumedTokens.has(token)) {
        return { valid: false, error: 'OTP token has already been consumed (replay attempt detected)' };
      }

      const decoded = Buffer.from(token, 'base64url').toString('utf-8');
      const parts = decoded.split(':');
      
      let expiresAt: number;
      let nonce = '';
      let expectedHash: string;

      if (parts.length === 3) {
        // Modern format with nonce
        expiresAt = parseInt(parts[0], 10);
        nonce = parts[1];
        expectedHash = parts[2];
      } else if (parts.length === 2) {
        // Legacy format fallback
        expiresAt = parseInt(parts[0], 10);
        expectedHash = parts[1];
      } else {
        return { valid: false, error: 'Invalid verification token format' };
      }

      const now = Math.floor(Date.now() / 1000);
      if (isNaN(expiresAt) || expiresAt < now) {
        return { valid: false, error: 'OTP has expired' };
      }

      const data = nonce
        ? `${phone.trim()}:${otp.trim()}:${expiresAt}:${nonce}`
        : `${phone.trim()}:${otp.trim()}:${expiresAt}`;
      const actualHash = crypto.createHmac('sha256', this.secret).update(data).digest('hex');

      const hashBuffer = Buffer.from(actualHash);
      const expectedBuffer = Buffer.from(expectedHash);

      if (hashBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(hashBuffer, expectedBuffer)) {
        return { valid: false, error: 'Incorrect OTP' };
      }

      if (options.preventReplay) {
        this.consumedTokens.add(token);
        // Automatic cleanup when set exceeds 10,000 to prevent memory growth
        if (this.consumedTokens.size > 10000) {
          this.consumedTokens.clear();
        }
      }

      return { valid: true };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Invalid verification token' };
    }
  }
}

