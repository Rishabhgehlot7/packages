import { StorageAdapter } from './types';

/**
 * In-Memory storage adapter (Universal fallback for SSR and Node.js environments)
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private memory = new Map<string, string>();
  private syncListeners: Set<(raw: string) => void> = new Set();

  getItem(key: string): string | null {
    return this.memory.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.memory.set(key, value);
    for (const listener of this.syncListeners) {
      listener(value);
    }
  }

  removeItem(key: string): void {
    this.memory.delete(key);
  }

  clear(): void {
    this.memory.clear();
  }

  onSync(callback: (raw: string) => void): () => void {
    this.syncListeners.add(callback);
    return () => this.syncListeners.delete(callback);
  }
}

export interface WebStorageOptions {
  /** Storage key prefix or exact key. Default: 'boost_cart' */
  key?: string;
  /** Enable cross-tab real-time synchronization via browser storage events. Default: true */
  crossTabSync?: boolean;
}

/**
 * Safe Browser LocalStorage adapter with Cross-Tab Synchronization
 */
export class LocalStorageAdapter implements StorageAdapter {
  private key: string;
  private isBrowser: boolean;
  private syncCallbacks: Set<(rawState: string) => void> = new Set();
  private storageEventListener?: (e: StorageEvent) => void;

  constructor(options: WebStorageOptions = {}) {
    this.key = options.key || 'boost_cart';
    this.isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

    const enableCrossTab = options.crossTabSync !== false;
    if (this.isBrowser && enableCrossTab) {
      this.storageEventListener = (e: StorageEvent) => {
        if (e.key === this.key && e.newValue) {
          for (const cb of this.syncCallbacks) {
            try {
              cb(e.newValue);
            } catch (err) {
              console.error('[BoostCart Cross-Tab Sync Error]:', err);
            }
          }
        }
      };
      window.addEventListener('storage', this.storageEventListener);
    }
  }

  getItem(key: string = this.key): string | null {
    if (!this.isBrowser) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string = this.key, value: string): void {
    if (!this.isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore quota errors or private mode restrictions
    }
  }

  removeItem(key: string = this.key): void {
    if (!this.isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }

  /**
   * Registers a callback triggered whenever another browser tab updates the cart
   */
  onSync(callback: (rawState: string) => void): () => void {
    this.syncCallbacks.add(callback);
    return () => this.syncCallbacks.delete(callback);
  }

  destroy(): void {
    if (this.isBrowser && this.storageEventListener) {
      window.removeEventListener('storage', this.storageEventListener);
    }
    this.syncCallbacks.clear();
  }
}

/**
 * Safe Browser SessionStorage adapter
 */
export class SessionStorageAdapter implements StorageAdapter {
  private key: string;
  private isBrowser: boolean;

  constructor(options: WebStorageOptions = {}) {
    this.key = options.key || 'boost_cart_session';
    this.isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  getItem(key: string = this.key): string | null {
    if (!this.isBrowser) return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string = this.key, value: string): void {
    if (!this.isBrowser) return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Ignore
    }
  }

  removeItem(key: string = this.key): void {
    if (!this.isBrowser) return;
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }
}

/**
 * Adapter interface for React Native AsyncStorage or similar async storage systems
 */
export interface GenericAsyncStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Mobile-friendly React Native AsyncStorage adapter
 */
export class AsyncStorageAdapter implements StorageAdapter {
  private storage: GenericAsyncStorage;
  private key: string;

  constructor(storage: GenericAsyncStorage, options: WebStorageOptions = {}) {
    this.storage = storage;
    this.key = options.key || 'boost_cart_mobile';
  }

  async getItem(key: string = this.key): Promise<string | null> {
    try {
      return await this.storage.getItem(key);
    } catch {
      return null;
    }
  }

  async setItem(key: string = this.key, value: string): Promise<void> {
    try {
      await this.storage.setItem(key, value);
    } catch {
      // Ignore write errors
    }
  }

  async removeItem(key: string = this.key): Promise<void> {
    try {
      await this.storage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
  }
}

export function createMemoryStorageAdapter(): MemoryStorageAdapter {
  return new MemoryStorageAdapter();
}

export function createLocalStorageAdapter(options?: WebStorageOptions): LocalStorageAdapter {
  return new LocalStorageAdapter(options);
}

export function createSessionStorageAdapter(options?: WebStorageOptions): SessionStorageAdapter {
  return new SessionStorageAdapter(options);
}

export function createAsyncStorageAdapter(
  storage: GenericAsyncStorage,
  options?: WebStorageOptions
): AsyncStorageAdapter {
  return new AsyncStorageAdapter(storage, options);
}
