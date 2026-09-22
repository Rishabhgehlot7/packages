import { C as CartItem, S as StoreOriginConfig, a as CustomerShippingAddress, G as GSTBreakdown, b as StorageAdapter, c as CartEventType, d as CartEventListener, e as CartEventPayload, f as CurrencyConfig, F as FormattedCartSummary, B as BoostCart } from './react-CzONGC2-.mjs';
export { A as AbandonedCartMetadata, g as AppliedDiscount, h as BogoRuleConfig, i as BoostCartHookResult, j as CartOptions, k as CartSubscription, l as CartSummary, m as CustomFee, D as DiscountRule, n as DiscountType, o as DiscountValidationResult, p as FreeShippingProgress, H as HSNTaxEntry, M as MergeStrategy, P as PaymentConfig, q as ShippingConfig, T as TieredVolumeRule, r as createBoostCart, s as createCartHookBindings, u as useBoostCart } from './react-CzONGC2-.mjs';

/**
 * Normalizes Indian state names and short codes to standard lowercase strings
 */
declare function normalizeIndianState(state: string | undefined): string;
declare class GSTCalculator {
    /**
     * Calculates detailed GST breakdown across cart items
     * Compliant with Indian GST rules (Intra-state CGST + SGST vs Inter-state IGST)
     */
    static calculate(items: CartItem[], origin: StoreOriginConfig, destination?: CustomerShippingAddress): GSTBreakdown;
}

/**
 * In-Memory storage adapter (Universal fallback for SSR and Node.js environments)
 */
declare class MemoryStorageAdapter implements StorageAdapter {
    private memory;
    private syncListeners;
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
    onSync(callback: (raw: string) => void): () => void;
}
interface WebStorageOptions {
    /** Storage key prefix or exact key. Default: 'boost_cart' */
    key?: string;
    /** Enable cross-tab real-time synchronization via browser storage events. Default: true */
    crossTabSync?: boolean;
}
/**
 * Safe Browser LocalStorage adapter with Cross-Tab Synchronization
 */
declare class LocalStorageAdapter implements StorageAdapter {
    private key;
    private isBrowser;
    private syncCallbacks;
    private storageEventListener?;
    constructor(options?: WebStorageOptions);
    getItem(key?: string): string | null;
    setItem(key: string | undefined, value: string): void;
    removeItem(key?: string): void;
    /**
     * Registers a callback triggered whenever another browser tab updates the cart
     */
    onSync(callback: (rawState: string) => void): () => void;
    destroy(): void;
}
/**
 * Safe Browser SessionStorage adapter
 */
declare class SessionStorageAdapter implements StorageAdapter {
    private key;
    private isBrowser;
    constructor(options?: WebStorageOptions);
    getItem(key?: string): string | null;
    setItem(key: string | undefined, value: string): void;
    removeItem(key?: string): void;
}
/**
 * Adapter interface for React Native AsyncStorage or similar async storage systems
 */
interface GenericAsyncStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}
/**
 * Mobile-friendly React Native AsyncStorage adapter
 */
declare class AsyncStorageAdapter implements StorageAdapter {
    private storage;
    private key;
    constructor(storage: GenericAsyncStorage, options?: WebStorageOptions);
    getItem(key?: string): Promise<string | null>;
    setItem(key: string | undefined, value: string): Promise<void>;
    removeItem(key?: string): Promise<void>;
}
declare function createMemoryStorageAdapter(): MemoryStorageAdapter;
declare function createLocalStorageAdapter(options?: WebStorageOptions): LocalStorageAdapter;
declare function createSessionStorageAdapter(options?: WebStorageOptions): SessionStorageAdapter;
declare function createAsyncStorageAdapter(storage: GenericAsyncStorage, options?: WebStorageOptions): AsyncStorageAdapter;

/**
 * Lightweight, zero-dependency Event Bus for Universal JS / TS Environments
 */
declare class CartEventEmitter {
    private listeners;
    private anyListeners;
    /**
     * Subscribe to a specific cart event
     */
    on(event: CartEventType, listener: CartEventListener): () => void;
    /**
     * Subscribe to all cart events
     */
    onAny(listener: CartEventListener): () => void;
    /**
     * Unsubscribe from an event
     */
    off(event: CartEventType, listener: CartEventListener): void;
    /**
     * Emit an event to all subscribed listeners safely
     */
    emit(payload: CartEventPayload): void;
    /**
     * Clear all registered listeners
     */
    removeAllListeners(): void;
}

declare class CurrencyFormatter {
    private config;
    constructor(config?: CurrencyConfig);
    /**
     * Formats a raw number into a localized currency string
     * Example: 1499.5 -> "₹1,499.50"
     */
    format(amount: number): string;
    /**
     * Generates formatted strings for all summary values
     */
    formatSummary(raw: {
        subtotal: number;
        totalMRP: number;
        totalSavings: number;
        discountAmount: number;
        shippingFee: number;
        codFee: number;
        prepaidDiscount: number;
        totalCustomFees: number;
        totalTax: number;
        cgst: number;
        sgst: number;
        igst: number;
        finalTotal: number;
    }): FormattedCartSummary;
}

/**
 * AI Agent Introspection & Diagnostics Toolkit
 * Enables autonomous coding agents and LLM chatbots to inspect, validate,
 * and format cart state effortlessly.
 */
declare class CartAgentToolkit {
    /**
     * Generates a concise, LLM-friendly markdown report of the current cart
     */
    static inspect(cart: BoostCart): string;
    /**
     * Validates an item object before passing to addItem, giving agents actionable hints
     */
    static validateItem(item: any): {
        valid: boolean;
        errors: string[];
    };
}

export { AsyncStorageAdapter, BoostCart, CartAgentToolkit, CartEventEmitter, CartEventListener, CartEventPayload, CartEventType, CartItem, CurrencyConfig, CurrencyFormatter, CustomerShippingAddress, FormattedCartSummary, GSTBreakdown, GSTCalculator, type GenericAsyncStorage, LocalStorageAdapter, MemoryStorageAdapter, SessionStorageAdapter, StorageAdapter, StoreOriginConfig, type WebStorageOptions, createAsyncStorageAdapter, createLocalStorageAdapter, createMemoryStorageAdapter, createSessionStorageAdapter, normalizeIndianState };
