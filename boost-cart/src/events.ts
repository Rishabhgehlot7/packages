import { CartEventType, CartEventPayload, CartEventListener } from './types';

/**
 * Lightweight, zero-dependency Event Bus for Universal JS / TS Environments
 */
export class CartEventEmitter {
  private listeners: Map<CartEventType, Set<CartEventListener>> = new Map();
  private anyListeners: Set<CartEventListener> = new Set();

  /**
   * Subscribe to a specific cart event
   */
  on(event: CartEventType, listener: CartEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Subscribe to all cart events
   */
  onAny(listener: CartEventListener): () => void {
    this.anyListeners.add(listener);
    return () => this.anyListeners.delete(listener);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: CartEventType, listener: CartEventListener): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event to all subscribed listeners safely
   */
  emit(payload: CartEventPayload): void {
    // Notify specific event listeners
    const specific = this.listeners.get(payload.type);
    if (specific) {
      for (const listener of specific) {
        try {
          listener(payload);
        } catch (err) {
          // Prevent listener error from breaking cart execution
          console.error(`[BoostCart Event Error] Error in '${payload.type}' listener:`, err);
        }
      }
    }

    // Notify wildcard listeners
    for (const listener of this.anyListeners) {
      try {
        listener(payload);
      } catch (err) {
        console.error(`[BoostCart Event Error] Error in wildcard listener:`, err);
      }
    }
  }

  /**
   * Clear all registered listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
    this.anyListeners.clear();
  }
}
