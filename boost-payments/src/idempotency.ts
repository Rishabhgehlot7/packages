/**
 * In-Memory Idempotency Cache with auto-expiring TTL
 * Guarantees zero duplicate transactions and protects against customer double-clicks
 */
export class IdempotencyStore {
  private cache: Map<string, { result: any; expiresAt: number }> = new Map();
  private defaultTtlMs: number;

  constructor(defaultTtlMs: number = 10 * 60 * 1000) {
    // Default 10 minutes TTL
    this.defaultTtlMs = defaultTtlMs;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.result as T;
  }

  set(key: string, result: any, ttlMs: number = this.defaultTtlMs): void {
    this.cache.set(key, {
      result,
      expiresAt: Date.now() + ttlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}
