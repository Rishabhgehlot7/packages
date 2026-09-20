import * as crypto from 'crypto';

/**
 * Enterprise-grade Password Hashing using native Node.js crypto.scrypt.
 * Zero dependencies, OWASP-recommended, salt-protected, timing-safe.
 * Format: `<salt>:<derivedKeyHex>`
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verify a plain password against a stored hash in constant time (timing-attack resistant).
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const [salt, key] = storedHash.split(':');
      if (!salt || !key) return resolve(false);

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const keyBuffer = Buffer.from(key, 'hex');
        if (keyBuffer.length !== derivedKey.length) return resolve(false);
        const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      });
    } catch {
      resolve(false);
    }
  });
}
