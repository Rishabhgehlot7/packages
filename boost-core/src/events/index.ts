/**
 * @boostengine/core — Type-safe Decoupled Event Bus
 *
 * A publish/subscribe bus with wildcard pattern matching (`order.*`,
 * `payment.success`), replay of recent events, and optional per-event TTL.
 * Listeners are isolated from emitters: a dispatch never blocks or throws
 * back into the emitting code path (errors are logged and swallowed).
 */

export interface EventEnvelope<T = any> {
  id: string;
  topic: string;
  payload: T;
  timestamp: number;
  expiresAt?: number;
}

export type EventListener<T = any> = (event: EventEnvelope<T>) => Promise<void> | void;

export interface EventBusOptions {
  defaultTtl?: number;
  historyLimit?: number;
}

export interface EventBus {
  on(pattern: string, listener: EventListener): () => void;
  once(pattern: string, listener: EventListener): () => void;
  off(pattern: string, listener?: EventListener): void;
  emit<T = any>(topic: string, payload?: T, options?: { ttl?: number }): Promise<void>;
  emitSync<T = any>(topic: string, payload?: T, options?: { ttl?: number }): void;
  replay(pattern?: string): EventEnvelope[];
  listenerCount(pattern?: string): number;
  listenerPatterns(): string[];
  topics(): string[];
  clear(): void;
}

interface ListenerEntry {
  id: number;
  pattern: string;
  listener: EventListener;
  once: boolean;
}

let eventId = 0;
let listenerId = 0;

function nextEventId(): string {
  eventId += 1;
  return `evt_${Date.now().toString(36)}_${eventId}`;
}

function nextListenerId(): number {
  listenerId += 1;
  return listenerId;
}

/**
 * Glob matcher over dot-delimited topic segments.
 *  - `*`  matches exactly one segment
 *  - `**` matches zero or more segments
 */
export function matchesPattern(topic: string, pattern: string): boolean {
  if (pattern === '*' || pattern === '**') return true;
  const t = topic.split('.');
  const p = pattern.split('.');
  const m = t.length;
  const n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === '**') dp[0][j] = dp[0][j - 1];
    else break;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '**') {
        dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      } else if (p[j - 1] === '*') {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = dp[i - 1][j - 1] && t[i - 1] === p[j - 1];
      }
    }
  }
  return dp[m][n];
}

export class EventBusImpl implements EventBus {
  private listeners: ListenerEntry[] = [];
  private history: EventEnvelope[] = [];
  private options: Required<EventBusOptions>;

  constructor(options: EventBusOptions = {}) {
    this.options = {
      defaultTtl: options.defaultTtl ?? 0,
      historyLimit: options.historyLimit ?? 1000,
    };
  }

  on(pattern: string, listener: EventListener): () => void {
    const entry: ListenerEntry = {
      id: nextListenerId(),
      pattern,
      listener,
      once: false,
    };
    this.listeners.push(entry);
    return () => this.off(pattern, listener);
  }

  once(pattern: string, listener: EventListener): () => void {
    const entry: ListenerEntry = {
      id: nextListenerId(),
      pattern,
      listener,
      once: true,
    };
    this.listeners.push(entry);
    return () => this.off(pattern, listener);
  }

  off(pattern: string, listener?: EventListener): void {
    this.listeners = this.listeners.filter((entry) => {
      if (entry.pattern !== pattern) return true;
      if (listener && entry.listener !== listener) return true;
      return false;
    });
  }

  private record(topic: string, payload: any, ttl?: number): EventEnvelope {
    const now = Date.now();
    const effectiveTtl = ttl ?? this.options.defaultTtl;
    const envelope: EventEnvelope = {
      id: nextEventId(),
      topic,
      payload,
      timestamp: now,
      expiresAt: effectiveTtl > 0 ? now + effectiveTtl : undefined,
    };
    this.history.push(envelope);
    if (this.history.length > this.options.historyLimit) {
      this.history.splice(0, this.history.length - this.options.historyLimit);
    }
    return envelope;
  }

  private matching(topic: string): ListenerEntry[] {
    return this.listeners.filter((entry) => matchesPattern(topic, entry.pattern));
  }

  async emit<T = any>(topic: string, payload?: T, options?: { ttl?: number }): Promise<void> {
    const envelope = this.record(topic, payload, options?.ttl);
    const matched = this.matching(topic);
    for (const entry of [...matched]) {
      if (entry.once) this.removeListenerById(entry.id);
      try {
        await entry.listener(envelope);
      } catch (err) {
        console.error(`[BoostEngine EventBus] Listener for '${topic}' failed:`, err);
      }
    }
  }

  emitSync<T = any>(topic: string, payload?: T, options?: { ttl?: number }): void {
    const envelope = this.record(topic, payload, options?.ttl);
    const matched = this.matching(topic);
    for (const entry of [...matched]) {
      if (entry.once) this.removeListenerById(entry.id);
      try {
        void entry.listener(envelope);
      } catch (err) {
        console.error(`[BoostEngine EventBus] Listener for '${topic}' failed:`, err);
      }
    }
  }

  private removeListenerById(id: number): void {
    this.listeners = this.listeners.filter((entry) => entry.id !== id);
  }

  replay(pattern?: string): EventEnvelope[] {
    const now = Date.now();
    const alive = this.history.filter(
      (e) => e.expiresAt === undefined || e.expiresAt > now,
    );
    if (!pattern) return alive;
    return alive.filter((e) => matchesPattern(e.topic, pattern));
  }

  listenerCount(pattern?: string): number {
    if (!pattern) return this.listeners.length;
    return this.listeners.filter((entry) => entry.pattern === pattern).length;
  }

  listenerPatterns(): string[] {
    return Array.from(new Set(this.listeners.map((entry) => entry.pattern)));
  }

  topics(): string[] {
    return Array.from(new Set(this.history.map((e) => e.topic)));
  }

  clear(): void {
    this.listeners = [];
    this.history = [];
  }
}

/** Create a new, isolated event bus. */
export function createEventBus(options: EventBusOptions = {}): EventBus {
  return new EventBusImpl(options);
}


/**
 * Built-in e-commerce domain event topics.
 *
 * Each category (`auth`, `cart`, `checkout`, `payment`, `order`, `inventory`,
 * `shipping`) is a dot-delimited namespace. Subscribe to a whole category with
 * a wildcard — e.g. `bus.on('order.*', …)` — or to a single topic such as
 * `payment.success`.
 */
export const DOMAIN_EVENTS = {
  AUTH: {
    LOGIN: 'auth.login',
    LOGOUT: 'auth.logout',
    REGISTERED: 'auth.registered',
    PASSWORD_RESET: 'auth.password_reset',
  },
  CART: {
    UPDATED: 'cart.updated',
    ITEM_ADDED: 'cart.item_added',
    ITEM_REMOVED: 'cart.item_removed',
    CLEARED: 'cart.cleared',
  },
  CHECKOUT: {
    STARTED: 'checkout.started',
    ABANDONED: 'checkout.abandoned',
    COMPLETED: 'checkout.completed',
  },
  PAYMENT: {
    INITIATED: 'payment.initiated',
    SUCCESS: 'payment.success',
    FAILED: 'payment.failed',
    REFUNDED: 'payment.refunded',
  },
  ORDER: {
    CREATED: 'order.created',
    UPDATED: 'order.updated',
    CONFIRMED: 'order.confirmed',
    SHIPPED: 'order.shipped',
    DELIVERED: 'order.delivered',
    CANCELLED: 'order.cancelled',
  },
  INVENTORY: {
    UPDATED: 'inventory.updated',
    STOCK_LOW: 'inventory.stock_low',
    OUT_OF_STOCK: 'inventory.out_of_stock',
  },
  SHIPPING: {
    RATE_CALCULATED: 'shipping.rate_calculated',
    LABEL_CREATED: 'shipping.label_created',
    DISPATCHED: 'shipping.dispatched',
    DELIVERED: 'shipping.delivered',
  },
} as const;

/** Top-level domain namespaces used by the event bus. */
export const DOMAIN_NAMESPACES = [
  'auth',
  'cart',
  'checkout',
  'payment',
  'order',
  'inventory',
  'shipping',
] as const;

export type DomainNamespace = (typeof DOMAIN_NAMESPACES)[number];

