import * as crypto from 'crypto';

/**
 * Native RFC 6238 TOTP (Time-based One-Time Password) Engine
 * Compatible with Google Authenticator, Microsoft Authenticator, Authy, and 1Password.
 * Zero external dependencies!
 */
export class TOTPManager {
  private static BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  /**
   * Encodes a Buffer to a Base32 string
   */
  static base32Encode(buffer: Buffer): string {
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        output += this.BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += this.BASE32_ALPHABET[(value << (5 - bits)) & 31];
    }

    return output;
  }

  /**
   * Decodes a Base32 string to a Buffer
   */
  static base32Decode(base32: string): Buffer {
    const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
    let bits = 0;
    let value = 0;
    const bytes: number[] = [];

    for (let i = 0; i < clean.length; i++) {
      const idx = this.BASE32_ALPHABET.indexOf(clean[i]);
      if (idx === -1) continue;

      value = (value << 5) | idx;
      bits += 5;

      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(bytes);
  }

  /**
   * Generates a cryptographically secure random 20-byte Base32 secret for 2FA
   */
  static generateSecret(byteLength: number = 20): string {
    const randomBytes = crypto.randomBytes(byteLength);
    return this.base32Encode(randomBytes);
  }

  /**
   * Builds the standard `otpauth://` URI to display as a QR code in Google Authenticator
   */
  static generateOtpAuthUri(options: {
    secret: string;
    accountName: string;
    issuer?: string;
  }): string {
    const issuer = options.issuer || 'BoostEngine';
    const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(options.accountName)}`;
    const params = new URLSearchParams({
      secret: options.secret,
      issuer,
      algorithm: 'SHA1',
      digits: '6',
      period: '30',
    });

    return `otpauth://totp/${label}?${params.toString()}`;
  }

  /**
   * Generates a 6-digit TOTP token for the given secret at a specific Unix timestamp
   */
  static generateToken(secret: string, timestampSeconds?: number): string {
    const time = timestampSeconds ?? Math.floor(Date.now() / 1000);
    const counter = Math.floor(time / 30);

    const secretBuffer = this.base32Decode(secret);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(counter));

    const hmac = crypto.createHmac('sha1', secretBuffer).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  }

  /**
   * Verifies a 6-digit TOTP token with a ±1 step clock-drift window (covers 90 seconds)
   */
  static verifyToken(
    token: string,
    secret: string,
    options: { window?: number } = { window: 1 }
  ): boolean {
    if (!token || token.trim().length !== 6) return false;

    const window = options.window ?? 1;
    const now = Math.floor(Date.now() / 1000);

    for (let step = -window; step <= window; step++) {
      const checkTime = now + step * 30;
      const expectedToken = this.generateToken(secret, checkTime);

      const bufToken = Buffer.from(token.trim());
      const bufExpected = Buffer.from(expectedToken);

      if (bufToken.length === bufExpected.length && crypto.timingSafeEqual(bufToken, bufExpected)) {
        return true;
      }
    }

    return false;
  }
}
