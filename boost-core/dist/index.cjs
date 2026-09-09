'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.ts
var BoostHookSystem = class {
  constructor() {
    __publicField(this, "actions", /* @__PURE__ */ new Map());
    __publicField(this, "filters", /* @__PURE__ */ new Map());
  }
  /**
   * Register an action listener (like WordPress add_action)
   */
  addAction(hook, callback, priority = 10) {
    if (!this.actions.has(hook)) {
      this.actions.set(hook, []);
    }
    const list = this.actions.get(hook);
    list.push({ callback, priority });
    list.sort((a, b) => a.priority - b.priority);
  }
  /**
   * Execute all registered actions for a hook (like WordPress do_action)
   */
  async doAction(hook, ...args) {
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
  addFilter(hook, callback, priority = 10) {
    if (!this.filters.has(hook)) {
      this.filters.set(hook, []);
    }
    const list = this.filters.get(hook);
    list.push({ callback, priority });
    list.sort((a, b) => a.priority - b.priority);
  }
  /**
   * Pass a value through all registered filter transformations (like WordPress apply_filters)
   */
  async applyFilters(hook, initialValue, ...args) {
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
  clear() {
    this.actions.clear();
    this.filters.clear();
  }
};
var _BoostPluginEngine = class _BoostPluginEngine {
  constructor() {
    __publicField(this, "hooks", new BoostHookSystem());
    __publicField(this, "plugins", /* @__PURE__ */ new Map());
    __publicField(this, "activeStatus", /* @__PURE__ */ new Map());
    __publicField(this, "pluginConfigs", /* @__PURE__ */ new Map());
  }
  static getInstance() {
    if (!_BoostPluginEngine.instance) {
      _BoostPluginEngine.instance = new _BoostPluginEngine();
    }
    return _BoostPluginEngine.instance;
  }
  /**
   * Register a plugin with the engine
   */
  register(plugin, autoEnable = true) {
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
  unregister(pluginId) {
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
  enable(pluginId) {
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
  disable(pluginId) {
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
  isEnabled(pluginId) {
    return !!this.activeStatus.get(pluginId);
  }
  /**
   * Get registered plugin definition
   */
  get(pluginId) {
    return this.plugins.get(pluginId);
  }
  /**
   * Get all registered plugins with their status
   */
  getAll() {
    return Array.from(this.plugins.values()).map((p) => ({
      ...p,
      enabled: this.isEnabled(p.id),
      settings: this.pluginConfigs.get(p.id) || {}
    }));
  }
  /**
   * Update plugin runtime settings
   */
  updateSettings(pluginId, settings) {
    const existing = this.pluginConfigs.get(pluginId) || {};
    this.pluginConfigs.set(pluginId, { ...existing, ...settings });
  }
  /**
   * Dispatch an order creation event through all active plugins
   */
  async notifyOrderCreated(order) {
    await this.hooks.doAction(BOOST_HOOKS.ORDER_CREATED, order);
    for (const [id, plugin] of this.plugins.entries()) {
      if (this.isEnabled(id) && plugin.onOrderCreated) {
        try {
          await plugin.onOrderCreated(order, {
            config: this.pluginConfigs.get(id) || {}
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
  async notifyProductViewed(product) {
    await this.hooks.doAction(BOOST_HOOKS.PRODUCT_VIEWED, product);
    for (const [id, plugin] of this.plugins.entries()) {
      if (this.isEnabled(id) && plugin.onProductViewed) {
        try {
          await plugin.onProductViewed(product, {
            config: this.pluginConfigs.get(id) || {}
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
  async notifyCartUpdated(cart) {
    await this.hooks.doAction(BOOST_HOOKS.CART_UPDATED, cart);
    for (const [id, plugin] of this.plugins.entries()) {
      if (this.isEnabled(id) && plugin.onCartUpdated) {
        try {
          await plugin.onCartUpdated(cart, {
            config: this.pluginConfigs.get(id) || {}
          });
        } catch (err) {
          console.error(`[Plugin ${id}] Error handling onCartUpdated:`, err);
        }
      }
    }
  }
};
__publicField(_BoostPluginEngine, "instance");
var BoostPluginEngine = _BoostPluginEngine;
var BOOST_HOOKS = {
  // Actions
  INIT: "boost:init",
  CART_UPDATED: "boost:cart_updated",
  ITEM_ADDED_TO_CART: "boost:item_added_to_cart",
  ITEM_REMOVED_FROM_CART: "boost:item_removed_from_cart",
  CHECKOUT_STARTED: "boost:checkout_started",
  ORDER_CREATED: "boost:order_created",
  ORDER_STATUS_CHANGED: "boost:order_status_changed",
  PRODUCT_VIEWED: "boost:product_viewed",
  // Filters
  FILTER_PRODUCT_PRICE: "filter:product_price",
  FILTER_SHIPPING_RATES: "filter:shipping_rates",
  FILTER_TAX_CALCULATION: "filter:tax_calculation",
  FILTER_DISCOUNT_CALCULATION: "filter:discount_calculation",
  FILTER_CART_SUMMARY: "filter:cart_summary"
};
var boostCore = BoostPluginEngine.getInstance();

exports.BOOST_HOOKS = BOOST_HOOKS;
exports.BoostHookSystem = BoostHookSystem;
exports.BoostPluginEngine = BoostPluginEngine;
exports.boostCore = boostCore;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map