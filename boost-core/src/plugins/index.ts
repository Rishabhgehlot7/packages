/**
 * @boostengine/core — Modular Plugin Runtime
 *
 * `BoostEngine` is the central kernel: it owns an action/filter hook system, a
 * decoupled event bus, and a reactive state store, then orchestrates plugin
 * lifecycles (`init` → `registerHooks` → `boot` → `shutdown`) with dependency
 * resolution and health checks.
 */

import { BoostHookSystem, createHooks, type HookSystem } from '../hooks';
import { createEventBus, type EventBus } from '../events';
import { createStore, type Store } from '../store';
import type { PluginCategory, PluginContext, Order } from '../types';

export type PluginStatus =
  | 'registered'
  | 'initialized'
  | 'booted'
  | 'failed'
  | 'shutdown';

export interface BoostPlugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  icon?: string;
  category?: PluginCategory;
  defaultSettings?: Record<string, any>;
  /** IDs of other plugins that must be registered before this one. */
  dependencies?: string[];

  // Modern lifecycle (preferred).
  init?(context: PluginContext): Promise<void> | void;
  registerHooks?(engine: BoostEngine): Promise<void> | void;
  boot?(context?: PluginContext): Promise<void> | void;
  shutdown?(): Promise<void> | void;

  // Legacy lifecycle (backward compatible aliases).
  onInit?(context: PluginContext): Promise<void> | void;
  onActivate?(): Promise<void> | void;
  onDeactivate?(): Promise<void> | void;

  // Legacy domain event listeners.
  onOrderCreated?(order: Order, context: PluginContext): Promise<void> | void;
  onProductViewed?(product: any, context: PluginContext): Promise<void> | void;
  onCartUpdated?(cart: any, context: PluginContext): Promise<void> | void;
}

export interface RegisteredPlugin {
  plugin: BoostPlugin;
  status: PluginStatus;
  enabled: boolean;
  settings: Record<string, any>;
  dependencies: string[];
  error?: string;
}

export interface PluginHealthReport {
  id: string;
  name: string;
  version: string;
  status: PluginStatus;
  healthy: boolean;
  dependenciesSatisfied: boolean;
  missingDependencies: string[];
  error?: string;
}

export interface BoostEngineConfig {
  id?: string;
  storeId?: string;
  debug?: boolean;
  /** Throw when a plugin's dependencies cannot be resolved. */
  strictDependencies?: boolean;
  /** Automatically boot registered plugins without an explicit `start()`. */
  autoStart?: boolean;
  env?: Record<string, string>;
  plugins?: BoostPlugin[];
  [key: string]: any;
}

export interface EngineState {
  status: 'created' | 'starting' | 'running' | 'stopping' | 'stopped';
  pluginCount: number;
  bootedAt?: number;
}

export interface EngineInspection {
  id: string;
  status: string;
  config: Record<string, any>;
  plugins: Array<{
    id: string;
    name: string;
    version: string;
    status: PluginStatus;
    enabled: boolean;
    dependencies: string[];
  }>;
  actionHooks: string[];
  filterHooks: string[];
  eventTopics: string[];
  eventListeners: string[];
  eventListenerCount: number;
}

export interface BoostEngine {
  readonly id: string;
  readonly config: BoostEngineConfig;
  readonly hooks: HookSystem;
  readonly events: EventBus;
  readonly store: Store<EngineState>;

  registerPlugin(plugin: BoostPlugin): Promise<RegisteredPlugin>;
  unregisterPlugin(id: string): Promise<void>;
  start(): Promise<void>;
  shutdown(): Promise<void>;
  getPlugin(id: string): RegisteredPlugin | undefined;
  getPlugins(): RegisteredPlugin[];
  enablePlugin(id: string): Promise<void>;
  disablePlugin(id: string): Promise<void>;
  isPluginHealthy(id: string): boolean;
  healthCheck(): PluginHealthReport[];
  inspect(): EngineInspection;
}

// ---------------------------------------------------------------------------
// Dependency resolution
// ---------------------------------------------------------------------------

function topologicalOrder(
  plugins: Map<string, RegisteredPlugin>,
): { order: string[]; cycles: string[][] } {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const order: string[] = [];
  const cycles: string[][] = [];

  function visit(id: string, stack: string[]): void {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      const cycleStart = stack.indexOf(id);
      cycles.push([...stack.slice(cycleStart), id]);
      return;
    }
    const entry = plugins.get(id);
    if (!entry) return;

    visiting.add(id);
    for (const dep of entry.dependencies) {
      if (plugins.has(dep)) {
        visit(dep, [...stack, id]);
      }
    }
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  }

  for (const id of plugins.keys()) {
    visit(id, []);
  }
  return { order, cycles };
}

function resolvePluginDependencies(
  id: string,
  plugins: Map<string, RegisteredPlugin>,
): { satisfied: boolean; missing: string[] } {
  const entry = plugins.get(id);
  if (!entry) return { satisfied: false, missing: [id] };
  const missing = (entry.dependencies ?? []).filter((dep) => !plugins.has(dep));
  return { satisfied: missing.length === 0, missing };
}

// ---------------------------------------------------------------------------
// BoostEngine implementation
// ---------------------------------------------------------------------------

export class BoostEngineImpl implements BoostEngine {
  readonly id: string;
  readonly config: BoostEngineConfig;
  readonly hooks: HookSystem;
  readonly events: EventBus;
  readonly store: Store<EngineState>;

  private plugins = new Map<string, RegisteredPlugin>();
  private status: EngineState['status'] = 'created';

  constructor(config: BoostEngineConfig = {}) {
    this.id = config.id ?? `engine_${Date.now().toString(36)}`;
    this.config = { strictDependencies: true, autoStart: false, ...config };
    this.hooks = createHooks();
    this.events = createEventBus();
    this.store = createStore<EngineState>({
      status: 'created',
      pluginCount: 0,
    });
  }

  private contextFor(plugin: BoostPlugin): PluginContext {
    const settings = this.plugins.get(plugin.id)?.settings ?? {};
    return {
      storeId: this.config.storeId,
      config: settings,
      env: this.config.env,
    };
  }

  private setStatus(status: EngineState['status']): void {
    this.status = status;
    this.store.setState({ status });
  }

  private record(plugin: BoostPlugin): RegisteredPlugin {
    const entry: RegisteredPlugin = {
      plugin,
      status: 'registered',
      enabled: true,
      settings: { ...(plugin.defaultSettings ?? {}) },
      dependencies: plugin.dependencies ?? [],
    };
    this.plugins.set(plugin.id, entry);
    this.store.setState({ pluginCount: this.plugins.size });
    return entry;
  }

  private assertValid(plugin: BoostPlugin): void {
    if (!plugin || typeof plugin.id !== 'string' || !plugin.id) {
      throw new Error('Plugin must define a non-empty string `id`.');
    }
    if (!plugin.name || !plugin.version) {
      throw new Error(
        `Plugin '${plugin.id}' must define a "name" and "version".`,
      );
    }
  }

  async registerPlugin(plugin: BoostPlugin): Promise<RegisteredPlugin> {
    this.assertValid(plugin);
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin '${plugin.id}' is already registered.`);
    }
    const entry = this.record(plugin);

    if (this.status === 'running') {
      await this.initializeOne(plugin.id);
      await this.registerHooksOne(plugin.id);
      await this.bootOne(plugin.id);
    }
    return entry;
  }

  async unregisterPlugin(id: string): Promise<void> {
    const entry = this.plugins.get(id);
    if (!entry) return;
    await this.shutdownOne(id);
    this.plugins.delete(id);
    this.store.setState({ pluginCount: this.plugins.size });
  }

  private async initializeOne(id: string): Promise<void> {
    const entry = this.plugins.get(id);
    if (!entry) return;
    if (entry.status === 'initialized' || entry.status === 'booted') return;

    try {
      const context = this.contextFor(entry.plugin);
      if (entry.plugin.init) await entry.plugin.init(context);
      if (entry.plugin.onInit) await entry.plugin.onInit(context);
      entry.status = 'initialized';
      entry.error = undefined;
    } catch (err) {
      entry.status = 'failed';
      entry.error = err instanceof Error ? err.message : String(err);
      this.log('init', id, err);
    }
  }

  private async registerHooksOne(id: string): Promise<void> {
    const entry = this.plugins.get(id);
    if (!entry || entry.status !== 'initialized') return;
    try {
      if (entry.plugin.registerHooks) await entry.plugin.registerHooks(this);
    } catch (err) {
      entry.status = 'failed';
      entry.error = err instanceof Error ? err.message : String(err);
      this.log('registerHooks', id, err);
    }
  }

  private async bootOne(id: string): Promise<void> {
    const entry = this.plugins.get(id);
    if (!entry) return;
    if (entry.status === 'booted') return;
    if (entry.status === 'failed') return;

    try {
      const context = this.contextFor(entry.plugin);
      if (entry.plugin.boot) await entry.plugin.boot(context);
      if (entry.plugin.onActivate) await entry.plugin.onActivate();
      entry.status = 'booted';
      entry.error = undefined;
    } catch (err) {
      entry.status = 'failed';
      entry.error = err instanceof Error ? err.message : String(err);
      this.log('boot', id, err);
    }
  }

  private async shutdownOne(id: string): Promise<void> {
    const entry = this.plugins.get(id);
    if (!entry) return;
    try {
      if (entry.plugin.shutdown) await entry.plugin.shutdown();
      if (entry.plugin.onDeactivate) await entry.plugin.onDeactivate();
      entry.status = 'shutdown';
    } catch (err) {
      this.log('shutdown', id, err);
    }
  }

  async start(): Promise<void> {
    if (this.status === 'running') return;
    this.setStatus('starting');

    const { order, cycles } = topologicalOrder(this.plugins);
    if (cycles.length > 0 && this.config.strictDependencies) {
      this.setStatus('created');
      throw new Error(
        `Circular plugin dependencies detected: ${cycles
          .map((c) => c.join(' -> '))
          .join('; ')}`,
      );
    }

    const blocked = new Set<string>();
    for (const id of order) {
      const { satisfied, missing } = resolvePluginDependencies(id, this.plugins);
      if (!satisfied) {
        const entry = this.plugins.get(id)!;
        entry.status = 'failed';
        entry.error = `Missing dependencies: ${missing.join(', ')}`;
        blocked.add(id);
        if (this.config.strictDependencies) {
          this.setStatus('created');
          throw new Error(
            `Plugin '${id}' is missing dependencies: ${missing.join(', ')}`,
          );
        }
      }
    }

    for (const id of order) {
      if (blocked.has(id)) continue;
      await this.initializeOne(id);
      await this.registerHooksOne(id);
    }

    for (const id of order) {
      if (blocked.has(id)) continue;
      await this.bootOne(id);
    }

    this.store.setState({ bootedAt: Date.now() });
    this.setStatus('running');
  }

  async shutdown(): Promise<void> {
    if (this.status !== 'running' && this.status !== 'starting') return;
    this.setStatus('stopping');

    const { order } = topologicalOrder(this.plugins);
    for (const id of [...order].reverse()) {
      await this.shutdownOne(id);
    }

    this.setStatus('stopped');
  }

  getPlugin(id: string): RegisteredPlugin | undefined {
    return this.plugins.get(id);
  }

  getPlugins(): RegisteredPlugin[] {
    return Array.from(this.plugins.values());
  }

  async enablePlugin(id: string): Promise<void> {
    const entry = this.plugins.get(id);
    if (!entry) throw new Error(`Plugin '${id}' is not registered.`);
    entry.enabled = true;
    if (this.status === 'running') {
      await this.initializeOne(id);
      await this.registerHooksOne(id);
      await this.bootOne(id);
    }
  }

  async disablePlugin(id: string): Promise<void> {
    const entry = this.plugins.get(id);
    if (!entry) throw new Error(`Plugin '${id}' is not registered.`);
    entry.enabled = false;
    if (this.status === 'running') {
      await this.shutdownOne(id);
    }
  }

  isPluginHealthy(id: string): boolean {
    const report = this.healthCheck().find((r) => r.id === id);
    return report ? report.healthy : false;
  }

  healthCheck(): PluginHealthReport[] {
    return Array.from(this.plugins.values()).map((entry) => {
      const { satisfied, missing } = resolvePluginDependencies(
        entry.plugin.id,
        this.plugins,
      );
      const healthy =
        satisfied &&
        entry.status !== 'failed' &&
        entry.status !== 'shutdown' &&
        entry.enabled;
      return {
        id: entry.plugin.id,
        name: entry.plugin.name,
        version: entry.plugin.version,
        status: entry.status,
        healthy,
        dependenciesSatisfied: satisfied,
        missingDependencies: missing,
        error: entry.error,
      };
    });
  }

  inspect(): EngineInspection {
    return {
      id: this.id,
      status: this.status,
      config: { ...this.config, plugins: undefined },
      plugins: Array.from(this.plugins.values()).map((entry) => ({
        id: entry.plugin.id,
        name: entry.plugin.name,
        version: entry.plugin.version,
        status: entry.status,
        enabled: entry.enabled,
        dependencies: entry.dependencies,
      })),
      actionHooks: this.hooks.listActionTags(),
      filterHooks: this.hooks.listFilterTags(),
      eventTopics: this.events.topics(),
      eventListeners: this.events.listenerPatterns(),
      eventListenerCount: this.events.listenerCount(),
    };
  }

  private log(phase: string, id: string, err: unknown): void {
    if (this.config.debug) {
      console.error(`[BoostEngine] Plugin '${id}' failed during ${phase}:`, err);
    }
  }
}

/** Create a new `BoostEngine` kernel instance. */
export function createBoostEngine(config: BoostEngineConfig = {}): BoostEngine {
  const engine = new BoostEngineImpl(config);
  const plugins = config.plugins ?? [];
  for (const plugin of plugins) {
    engine.registerPlugin(plugin).catch((err) => {
      if (config.debug) {
        console.error('[BoostEngine] Failed to register plugin:', err);
      }
    });
  }
  if (config.autoStart) {
    engine.start().catch((err) => {
      if (config.debug) {
        console.error('[BoostEngine] Bootstrap start failed:', err);
      }
    });
  }
  return engine;
}

// ---------------------------------------------------------------------------
// Default kernel + standalone registration helper
// ---------------------------------------------------------------------------

let defaultEngine: BoostEngine | null = null;

/** Get (or lazily create) the process-wide default `BoostEngine`. */
export function getDefaultEngine(): BoostEngine {
  if (!defaultEngine) defaultEngine = createBoostEngine();
  return defaultEngine;
}

/** Register a plugin with the default engine and boot it. */
export async function registerPlugin(
  plugin: BoostPlugin,
): Promise<RegisteredPlugin> {
  const engine = getDefaultEngine();
  const entry = await engine.registerPlugin(plugin);
  await engine.start();
  return entry;
}

// ---------------------------------------------------------------------------
// Legacy singleton runtime (`boostCore`) for 1.x compatibility
// ---------------------------------------------------------------------------

/** Standard e-commerce action & filter hook tags (legacy `boost:*` namespace). */
export const BOOST_HOOKS = {
  INIT: 'boost:init',
  CART_UPDATED: 'boost:cart_updated',
  ITEM_ADDED_TO_CART: 'boost:item_added_to_cart',
  ITEM_REMOVED_FROM_CART: 'boost:item_removed_from_cart',
  CHECKOUT_STARTED: 'boost:checkout_started',
  ORDER_CREATED: 'boost:order_created',
  ORDER_STATUS_CHANGED: 'boost:order_status_changed',
  PRODUCT_VIEWED: 'boost:product_viewed',

  FILTER_PRODUCT_PRICE: 'filter:product_price',
  FILTER_SHIPPING_RATES: 'filter:shipping_rates',
  FILTER_TAX_CALCULATION: 'filter:tax_calculation',
  FILTER_DISCOUNT_CALCULATION: 'filter:discount_calculation',
  FILTER_CART_SUMMARY: 'filter:cart_summary',
} as const;

/**
 * The original `@boostengine/core` singleton runtime. Retained for backward
 * compatibility; new integrations should prefer `createBoostEngine()`.
 */
export class BoostPluginEngine {
  private static instance: BoostPluginEngine;
  public hooks: BoostHookSystem = new BoostHookSystem();

  private plugins = new Map<string, BoostPlugin>();
  private activeStatus = new Map<string, boolean>();
  private pluginConfigs = new Map<string, Record<string, any>>();

  private constructor() {}

  static getInstance(): BoostPluginEngine {
    if (!BoostPluginEngine.instance) {
      BoostPluginEngine.instance = new BoostPluginEngine();
    }
    return BoostPluginEngine.instance;
  }

  register(plugin: BoostPlugin, autoEnable = true): void {
    this.plugins.set(plugin.id, plugin);
    this.activeStatus.set(plugin.id, autoEnable);
    this.pluginConfigs.set(plugin.id, plugin.defaultSettings || {});

    if (autoEnable) {
      const context: PluginContext = { config: plugin.defaultSettings || {} };
      if (plugin.init) void plugin.init(context);
      if (plugin.onInit) void plugin.onInit(context);
    }
  }

  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      if (plugin.shutdown) void plugin.shutdown();
      if (plugin.onDeactivate) void plugin.onDeactivate();
    }
    this.plugins.delete(pluginId);
    this.activeStatus.delete(pluginId);
    this.pluginConfigs.delete(pluginId);
  }

  enable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} is not registered.`);
    this.activeStatus.set(pluginId, true);
    if (plugin.boot) void plugin.boot();
    if (plugin.onActivate) void plugin.onActivate();
  }

  disable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} is not registered.`);
    this.activeStatus.set(pluginId, false);
    if (plugin.shutdown) void plugin.shutdown();
    if (plugin.onDeactivate) void plugin.onDeactivate();
  }

  isEnabled(pluginId: string): boolean {
    return !!this.activeStatus.get(pluginId);
  }

  get(pluginId: string): BoostPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAll(): Array<BoostPlugin & { enabled: boolean; settings: Record<string, any> }> {
    return Array.from(this.plugins.values()).map((p) => ({
      ...p,
      enabled: this.isEnabled(p.id),
      settings: this.pluginConfigs.get(p.id) || {},
    }));
  }

  updateSettings(pluginId: string, settings: Record<string, any>): void {
    const existing = this.pluginConfigs.get(pluginId) || {};
    this.pluginConfigs.set(pluginId, { ...existing, ...settings });
  }

  async notifyOrderCreated(order: Order): Promise<void> {
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

/** Legacy global singleton runtime. */
export const boostCore = BoostPluginEngine.getInstance();

