import crypto from 'crypto';

/**
 * Computes HMAC-SHA256 hex digest.
 */
export function hmacSha256(data: string | Buffer, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Computes standard SHA-256 hex digest.
 */
export function sha256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Encodes string into Base64.
 */
export function base64Encode(data: string | object): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return Buffer.from(str, 'utf8').toString('base64');
}

/**
 * Decodes Base64 into utf-8 string.
 */
export function base64Decode(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf8');
}

/**
 * Constant-time safe string comparison to prevent timing attacks on signatures.
 */
export function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
