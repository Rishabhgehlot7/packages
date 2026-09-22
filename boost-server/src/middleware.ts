/**
 * @boostengine/server — Security & Middleware Primitives
 * Framework-agnostic (Express-style) middleware helpers: a standard error
 * handler, an idempotency-key handler, and a simple in-memory rate limiter.
 */

export interface BoostError {
  status?: number;
  statusCode?: number;
  message?: string;
  code?: string;
  [key: string]: any;
}

/**
 * Express-style error handler that formats a standard JSON error response.
 * Place it as the final error middleware: `app.use(errorHandler)`.
 */
export function errorHandler(err: BoostError, _req: any, res: any, _next: any): void {
  const status = err?.status || err?.statusCode || 500;
  const body: Record<string, any> = {
    success: false,
    error: err?.message || 'Internal Server Error',
  };
  if (err?.code) body.code = err.code;
  res.status(status).json(body);
}

export interface IdempotencyOptions {
  /** In-memory store (defaults to a new Map). */
  store?: Map<string, any>;
  /** Header name used for the idempotency key. */
  keyHeader?: string;
  /** Respond with this status when a duplicate key is detected (default: 409). */
  duplicateStatus?: number;
}

/**
 * Middleware that enforces request idempotency via an idempotency key header.
 * The first request stores the key; duplicates receive a 409 response.
 */
export function createIdempotencyHandler(options: IdempotencyOptions = {}) {
  const store = options.store ?? new Map<string, any>();
  const keyHeader = (options.keyHeader ?? 'idempotency-key').toLowerCase();
  const duplicateStatus = options.duplicateStatus ?? 409;

  return (req: any, res: any, next: (err?: any) => void): void => {
    const headers = req.headers || {};
    const key = headers[keyHeader] || headers['idempotency-key'];
    if (!key) return next();

    if (store.has(key)) {
      res.status(duplicateStatus).json({
        success: false,
        error: 'Duplicate request: idempotency key already processed.',
      });
      return;
    }

    store.set(key, { receivedAt: Date.now() });
    next();
  };
}

export interface RateLimitOptions {
  /** Sliding window in milliseconds (default: 60_000). */
  windowMs?: number;
  /** Maximum requests per window (default: 100). */
  max?: number;
  /** Optional shared store keyed by client identifier. */
  store?: Map<string, number[]>;
}

/** Simple in-memory sliding-window rate limiter keyed by client IP. */
export function createRateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 100;
  const hits = options.store ?? new Map<string, number[]>();

  return (req: any, res: any, next: (err?: any) => void): void => {
    const now = Date.now();
    const ip =
      req.ip ||
      req.headers?.['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      'unknown';
    const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);

    if (list.length >= max) {
      res.status(429).json({ success: false, error: 'Too many requests, slow down.' });
      return;
    }

    list.push(now);
    hits.set(ip, list);
    next();
  };
}
