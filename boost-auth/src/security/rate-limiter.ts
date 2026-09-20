export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export class InMemoryRateLimiter {
  private hits = new Map<string, number[]>();

  /**
   * Sliding-window rate limiter
   * @param key Unique identifier (e.g. `phone:+919876543210` or `ip:127.0.0.1`)
   * @param limit Maximum allowed hits within the window
   * @param windowSeconds Duration of the rate window in seconds
   */
  check(key: string, limit: number, windowSeconds: number): RateLimitResult {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;

    let timestamps = this.hits.get(key) || [];
    // Filter out timestamps outside the sliding window
    timestamps = timestamps.filter((t) => t > windowStart);

    if (timestamps.length >= limit) {
      const oldestHit = timestamps[0];
      const retryAfterSeconds = Math.max(1, oldestHit + windowSeconds - now);
      this.hits.set(key, timestamps);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    timestamps.push(now);
    this.hits.set(key, timestamps);

    // Housekeeping: prevent unbounded memory growth if map grows large
    if (this.hits.size > 5000) {
      this.cleanup(windowStart);
    }

    return {
      allowed: true,
      remaining: limit - timestamps.length,
      retryAfterSeconds: 0,
    };
  }

  private cleanup(windowStart: number) {
    for (const [key, timestamps] of this.hits.entries()) {
      const active = timestamps.filter((t) => t > windowStart);
      if (active.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, active);
      }
    }
  }

  reset(key: string) {
    this.hits.delete(key);
  }
}

export const defaultRateLimiter = new InMemoryRateLimiter();
