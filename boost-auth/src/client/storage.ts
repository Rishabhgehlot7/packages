export interface AuthStorage {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
}

export class MemoryStorage implements AuthStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) || null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

export class WebStorage implements AuthStorage {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  }
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  }
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  }
}

/**
 * Universal Mobile Storage Adapter for React Native (Expo SecureStore, AsyncStorage, MMKV)
 */
export class ReactNativeStorage implements AuthStorage {
  constructor(private readonly backend: any) {
    if (!backend) {
      throw new Error(
        '[@boostengine/auth] ReactNativeStorage requires an underlying storage backend (e.g. AsyncStorage or SecureStore).'
      );
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof this.backend.getItemAsync === 'function') {
        // Expo SecureStore format
        return await this.backend.getItemAsync(key);
      }
      if (typeof this.backend.getItem === 'function') {
        // AsyncStorage / MMKV format
        return await this.backend.getItem(key);
      }
      if (typeof this.backend.getString === 'function') {
        // MMKV sync format
        return this.backend.getString(key) ?? null;
      }
    } catch {}
    return null;
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof this.backend.setItemAsync === 'function') {
        await this.backend.setItemAsync(key, value);
        return;
      }
      if (typeof this.backend.setItem === 'function') {
        await this.backend.setItem(key, value);
        return;
      }
      if (typeof this.backend.set === 'function') {
        this.backend.set(key, value);
        return;
      }
    } catch {}
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof this.backend.deleteItemAsync === 'function') {
        await this.backend.deleteItemAsync(key);
        return;
      }
      if (typeof this.backend.removeItem === 'function') {
        await this.backend.removeItem(key);
        return;
      }
      if (typeof this.backend.delete === 'function') {
        this.backend.delete(key);
        return;
      }
    } catch {}
  }
}

/**
 * Factory helper for React Native & Expo applications
 */
export function createReactNativeStorage(backend: any): ReactNativeStorage {
  return new ReactNativeStorage(backend);
}

/**
 * Auto-detects runtime environment and returns appropriate storage
 */
export function getDefaultAuthStorage(): AuthStorage {
  if (typeof window !== 'undefined' && window.localStorage) {
    return new WebStorage();
  }
  return new MemoryStorage();
}
