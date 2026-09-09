/**
 * @boostengine/core
 * WordPress/Shopify-style modular plugin runtime & event hook architecture for BoostEngine eCommerce stores.
 */
type PluginCategory = 'marketing' | 'operations' | 'payments' | 'sales' | 'engagement' | 'analytics' | 'inventory';
interface PluginContext {
    storeId?: string;
    config: Record<string, any>;
    env?: Record<string, string>;
}
interface BoostPlugin {
    id: string;
    name: string;
    version: string;
    description: string;
    icon?: string;
    category: PluginCategory;
    defaultSettings?: Record<string, any>;
    onInit?(context: PluginContext): Promise<void> | void;
    onActivate?(): Promise<void> | void;
    onDeactivate?(): Promise<void> | void;
    onOrderCreated?(order: any, context: PluginContext): Promise<void> | void;
    onProductViewed?(product: any, context: PluginContext): Promise<void> | void;
    onCartUpdated?(cart: any, context: PluginContext): Promise<void> | void;
}
type ActionCallback = (...args: any[]) => Promise<void> | void;
type FilterCallback<T = any> = (value: T, ...args: any[]) => Promise<T> | T;
/**
 * Global WordPress-style Hook & Filter System (Action/Filter Dispatcher)
 */
declare class BoostHookSystem {
    private actions;
    private filters;
    /**
     * Register an action listener (like WordPress add_action)
     */
    addAction(hook: string, callback: ActionCallback, priority?: number): void;
    /**
     * Execute all registered actions for a hook (like WordPress do_action)
     */
    doAction(hook: string, ...args: any[]): Promise<void>;
    /**
     * Register a filter transformer (like WordPress add_filter)
     */
    addFilter<T = any>(hook: string, callback: FilterCallback<T>, priority?: number): void;
    /**
     * Pass a value through all registered filter transformations (like WordPress apply_filters)
     */
    applyFilters<T = any>(hook: string, initialValue: T, ...args: any[]): Promise<T>;
    /**
     * Clear all registered actions and filters
     */
    clear(): void;
}
/**
 * The Central BoostEngine Plugin Runtime Manager
 */
declare class BoostPluginEngine {
    private static instance;
    hooks: BoostHookSystem;
    private plugins;
    private activeStatus;
    private pluginConfigs;
    private constructor();
    static getInstance(): BoostPluginEngine;
    /**
     * Register a plugin with the engine
     */
    register(plugin: BoostPlugin, autoEnable?: boolean): void;
    /**
     * Unregister a plugin
     */
    unregister(pluginId: string): void;
    /**
     * Activate a plugin
     */
    enable(pluginId: string): void;
    /**
     * Deactivate a plugin
     */
    disable(pluginId: string): void;
    /**
     * Check if a plugin is currently enabled
     */
    isEnabled(pluginId: string): boolean;
    /**
     * Get registered plugin definition
     */
    get(pluginId: string): BoostPlugin | undefined;
    /**
     * Get all registered plugins with their status
     */
    getAll(): Array<BoostPlugin & {
        enabled: boolean;
        settings: Record<string, any>;
    }>;
    /**
     * Update plugin runtime settings
     */
    updateSettings(pluginId: string, settings: Record<string, any>): void;
    /**
     * Dispatch an order creation event through all active plugins
     */
    notifyOrderCreated(order: any): Promise<void>;
    /**
     * Dispatch a product view event through all active plugins
     */
    notifyProductViewed(product: any): Promise<void>;
    /**
     * Dispatch a cart update event
     */
    notifyCartUpdated(cart: any): Promise<void>;
}
/**
 * Standard eCommerce Event Hooks
 */
declare const BOOST_HOOKS: {
    readonly INIT: "boost:init";
    readonly CART_UPDATED: "boost:cart_updated";
    readonly ITEM_ADDED_TO_CART: "boost:item_added_to_cart";
    readonly ITEM_REMOVED_FROM_CART: "boost:item_removed_from_cart";
    readonly CHECKOUT_STARTED: "boost:checkout_started";
    readonly ORDER_CREATED: "boost:order_created";
    readonly ORDER_STATUS_CHANGED: "boost:order_status_changed";
    readonly PRODUCT_VIEWED: "boost:product_viewed";
    readonly FILTER_PRODUCT_PRICE: "filter:product_price";
    readonly FILTER_SHIPPING_RATES: "filter:shipping_rates";
    readonly FILTER_TAX_CALCULATION: "filter:tax_calculation";
    readonly FILTER_DISCOUNT_CALCULATION: "filter:discount_calculation";
    readonly FILTER_CART_SUMMARY: "filter:cart_summary";
};
declare const boostCore: BoostPluginEngine;

export { BOOST_HOOKS, BoostHookSystem, type BoostPlugin, BoostPluginEngine, type PluginCategory, type PluginContext, boostCore };
