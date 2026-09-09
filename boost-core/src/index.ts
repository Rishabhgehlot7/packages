/**
 * @boostengine/core
 * WordPress/Shopify-style modular plugin runtime & event hook architecture for BoostEngine eCommerce stores.
 */

export type PluginCategory =
  | 'marketing'
  | 'operations'
  | 'payments'
  | 'sales'
  | 'engagement'
  | 'analytics'
  | 'inventory';

export interface PluginContext {
  storeId?: string;
  config: Record<string, any>;
  env?: Record<string, string>;
}

export interface BoostPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  icon?: string;
  category: PluginCategory;
  defaultSettings?: Record<string, any>;

  // Lifecycle Methods (WordPress Plugin Style)
  onInit?(context: PluginContext): Promise<void> | void;
  onActivate?(): Promise<void> | void;
  onDeactivate?(): Promise<void> | void;

  // Event Hooks
  onOrderCreated?(order: any, context: PluginContext): Promise<void> | void;
  onProductViewed?(product: any, context: PluginContext): Promise<void> | void;
  onCartUpdated?(cart: any, context: PluginContext): Promise<void> | void;
}

type ActionCallback = (...args: any[]) => Promise<void> | void;
type FilterCallback<T = any> = (value: T, ...args: any[]) => Promise<T> | T;

interface RegisteredAction {
  callback: ActionCallback;
  priority: number;
}

interface RegisteredFilter {
  callback: FilterCallback;
  priority: number;
}

/**
 * Global WordPress-style Hook & Filter System (Action/Filter Dispatcher)
 */
export class BoostHookSystem {
  private actions: Map<string, RegisteredAction[]> = new Map();
  private filters: Map<string, RegisteredFilter[]> = new Map();

  /**
   * Register an action listener (like WordPress add_action)
   */
  addAction(hook: string, callback: ActionCallback, priority: number = 10): void {
    if (!this.actions.has(hook)) {
      this.actions.set(hook, []);
    }
    const list = this.actions.get(hook)!;
    list.push({ callback, priority });
    list.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Execute all registered actions for a hook (like WordPress do_action)
   */
  async doAction(hook: string, ...args: any[]): Promise<void> {
    const list = this.actions.get(hook);
    if (!list || list.length === 0) return;

    for (const item of list) {
      try {
        await item.callback(...args);
      } catch (err) {
        console.error(`[BoostEngine Hook Error] Action '${hook}' failed:`, err);
      }
    }
  }

  /**
   * Register a filter transformer (like WordPress add_filter)
   */
  addFilter<T = any>(hook: string, callback: FilterCallback<T>, priority: number = 10): void {
    if (!this.filters.has(hook)) {
      this.filters.set(hook, []);
    }
    const list = this.filters.get(hook)!;
    list.push({ callback: callback as FilterCallback, priority });
    list.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Pass a value through all registered filter transformations (like WordPress apply_filters)
   */
  async applyFilters<T = any>(hook: string, initialValue: T, ...args: any[]): Promise<T> {
    const list = this.filters.get(hook);
    if (!list || list.length === 0) return initialValue;

    let currentValue = initialValue;
    for (const item of list) {
      try {
        currentValue = await item.callback(currentValue, ...args);
      } catch (err) {
        console.error(`[BoostEngine Filter Error] Filter '${hook}' failed:`, err);
      }
    }
    return currentValue;
  }

  /**
   * Clear all registered actions and filters
   */
  clear(): void {
    this.actions.clear();
    this.filters.clear();
  }
}

/**
 * The Central BoostEngine Plugin Runtime Manager
 */
export class BoostPluginEngine {
  private static instance: BoostPluginEngine;
  public hooks: BoostHookSystem = new BoostHookSystem();

  private plugins: Map<string, BoostPlugin> = new Map();
  private activeStatus: Map<string, boolean> = new Map();
  private pluginConfigs: Map<string, Record<string, any>> = new Map();

  private constructor() {}

  public static getInstance(): BoostPluginEngine {
    if (!BoostPluginEngine.instance) {
      BoostPluginEngine.instance = new BoostPluginEngine();
    }
    return BoostPluginEngine.instance;
  }

  /**
   * Register a plugin with the engine
   */
  register(plugin: BoostPlugin, autoEnable: boolean = true): void {
    this.plugins.set(plugin.id, plugin);
    this.activeStatus.set(plugin.id, autoEnable);
    this.pluginConfigs.set(plugin.id, plugin.defaultSettings || {});

    if (autoEnable && plugin.onInit) {
      plugin.onInit({ config: plugin.defaultSettings || {} });
    }
  }

  /**
   * Unregister a plugin
   */
  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin && plugin.onDeactivate) {
      plugin.onDeactivate();
    }
    this.plugins.delete(pluginId);
    this.activeStatus.delete(pluginId);
    this.pluginConfigs.delete(pluginId);
  }

  /**
   * Activate a plugin
   */
  enable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} is not registered.`);
    this.activeStatus.set(pluginId, true);
    if (plugin.onActivate) {
      plugin.onActivate();
    }
  }

  /**
   * Deactivate a plugin
   */
  disable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} is not registered.`);
    this.activeStatus.set(pluginId, false);
    if (plugin.onDeactivate) {
      plugin.onDeactivate();
    }
  }

  /**
   * Check if a plugin is currently enabled
   */
  isEnabled(pluginId: string): boolean {
    return !!this.activeStatus.get(pluginId);
  }

  /**
   * Get registered plugin definition
   */
  get(pluginId: string): BoostPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all registered plugins with their status
   */
  getAll(): Array<BoostPlugin & { enabled: boolean; settings: Record<string, any> }> {
    return Array.from(this.plugins.values()).map((p) => ({
      ...p,
      enabled: this.isEnabled(p.id),
      settings: this.pluginConfigs.get(p.id) || {},
    }));
  }

  /**
   * Update plugin runtime settings
   */
  updateSettings(pluginId: string, settings: Record<string, any>): void {
    const existing = this.pluginConfigs.get(pluginId) || {};
    this.pluginConfigs.set(pluginId, { ...existing, ...settings });
  }

  /**
   * Dispatch an order creation event through all active plugins
   */
  async notifyOrderCreated(order: any): Promise<void> {
    await this.hooks.doAction(BOOST_HOOKS.ORDER_CREATED, order);

    for (const [id, plugin] of this.plugins.entries()) {
      if (this.isEnabled(id) && plugin.onOrderCreated) {
        try {
          await plugin.onOrderCreated(order, {
            config: this.pluginConfigs.get(id) || {},
          });
        } catch (err) {
          console.error(`[Plugin ${id}] Error handling onOrderCreated:`, err);
        }
      }
    }
  }

  /**
   * Dispatch a product view event through all active plugins
   */
  async notifyProductViewed(product: any): Promise<void> {
    await this.hooks.doAction(BOOST_HOOKS.PRODUCT_VIEWED, product);

    for (const [id, plugin] of this.plugins.entries()) {
      if (this.isEnabled(id) && plugin.onProductViewed) {
        try {
          await plugin.onProductViewed(product, {
            config: this.pluginConfigs.get(id) || {},
          });
        } catch (err) {
          console.error(`[Plugin ${id}] Error handling onProductViewed:`, err);
        }
      }
    }
  }

  /**
   * Dispatch a cart update event
   */
  async notifyCartUpdated(cart: any): Promise<void> {
    await this.hooks.doAction(BOOST_HOOKS.CART_UPDATED, cart);

    for (const [id, plugin] of this.plugins.entries()) {
      if (this.isEnabled(id) && plugin.onCartUpdated) {
        try {
          await plugin.onCartUpdated(cart, {
            config: this.pluginConfigs.get(id) || {},
          });
        } catch (err) {
          console.error(`[Plugin ${id}] Error handling onCartUpdated:`, err);
        }
      }
    }
  }
}

/**
 * Standard eCommerce Event Hooks
 */
export const BOOST_HOOKS = {
  // Actions
  INIT: 'boost:init',
  CART_UPDATED: 'boost:cart_updated',
  ITEM_ADDED_TO_CART: 'boost:item_added_to_cart',
  ITEM_REMOVED_FROM_CART: 'boost:item_removed_from_cart',
  CHECKOUT_STARTED: 'boost:checkout_started',
  ORDER_CREATED: 'boost:order_created',
  ORDER_STATUS_CHANGED: 'boost:order_status_changed',
  PRODUCT_VIEWED: 'boost:product_viewed',

  // Filters
  FILTER_PRODUCT_PRICE: 'filter:product_price',
  FILTER_SHIPPING_RATES: 'filter:shipping_rates',
  FILTER_TAX_CALCULATION: 'filter:tax_calculation',
  FILTER_DISCOUNT_CALCULATION: 'filter:discount_calculation',
  FILTER_CART_SUMMARY: 'filter:cart_summary',
} as const;

// Export global singleton instance
export const boostCore = BoostPluginEngine.getInstance();
