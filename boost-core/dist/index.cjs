'use strict';

// src/money/index.ts
var CURRENCY_MINOR_UNITS = {
  BHD: 3,
  KWD: 3,
  OMR: 3,
  JPY: 0,
  KRW: 0,
  VND: 0
};
var DEFAULT_MINOR_UNITS = 2;
function getMinorUnits(currency) {
  const code = String(currency).toUpperCase();
  if (code in CURRENCY_MINOR_UNITS) return CURRENCY_MINOR_UNITS[code];
  return DEFAULT_MINOR_UNITS;
}
function pow10(n) {
  let result = 1;
  for (let i = 0; i < n; i++) result *= 10;
  return result;
}
function toMinorUnits(money) {
  const factor = pow10(getMinorUnits(money.currency));
  return Math.round(money.amount * factor);
}
function fromMinorUnits(minorUnits, currency) {
  const factor = pow10(getMinorUnits(currency));
  return { amount: minorUnits / factor, currency };
}
function assertSameCurrency(a, b) {
  if (String(a.currency).toUpperCase() !== String(b.currency).toUpperCase()) {
    throw new Error(
      `Currency mismatch: cannot operate on ${a.currency} and ${b.currency}.`
    );
  }
}
function addMoney(a, b) {
  assertSameCurrency(a, b);
  const sum = toMinorUnits(a) + toMinorUnits(b);
  return fromMinorUnits(sum, a.currency);
}
function subtractMoney(a, b) {
  assertSameCurrency(a, b);
  const diff = toMinorUnits(a) - toMinorUnits(b);
  return fromMinorUnits(diff, a.currency);
}
function multiplyMoney(money, factor) {
  const scaled = toMinorUnits(money) * factor;
  return fromMinorUnits(Math.round(scaled), money.currency);
}
function divideMoney(money, divisor) {
  if (divisor === 0) throw new Error("Cannot divide money by zero.");
  return fromMinorUnits(Math.round(toMinorUnits(money) / divisor), money.currency);
}
function negateMoney(money) {
  return fromMinorUnits(-toMinorUnits(money), money.currency);
}
function isZeroMoney(money) {
  return toMinorUnits(money) === 0;
}
function compareMoney(a, b) {
  assertSameCurrency(a, b);
  const diff = toMinorUnits(a) - toMinorUnits(b);
  return diff < 0 ? -1 : diff > 0 ? 1 : 0;
}
function convertMoney(money, targetCurrency, rate) {
  const sourceMajor = toMinorUnits(money) / pow10(getMinorUnits(money.currency));
  const targetMajor = sourceMajor * rate;
  const factor = pow10(getMinorUnits(targetCurrency));
  return { amount: Math.round(targetMajor * factor) / factor, currency: targetCurrency };
}
function formatMoney(money, options = {}) {
  const locale = options.locale ?? "en-US";
  const minorUnits = getMinorUnits(money.currency);
  let formatter;
  try {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: String(money.currency),
      minimumFractionDigits: options.minimumFractionDigits ?? minorUnits,
      maximumFractionDigits: options.maximumFractionDigits ?? minorUnits
    });
  } catch {
    formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: options.minimumFractionDigits ?? minorUnits,
      maximumFractionDigits: options.maximumFractionDigits ?? minorUnits
    });
    return `${String(money.currency).toUpperCase()} ${formatter.format(money.amount)}`;
  }
  return formatter.format(money.amount);
}

// src/hooks/index.ts
var hookId = 0;
function nextId() {
  hookId += 1;
  return hookId;
}
function sortByPriority(list) {
  return list.sort((a, b) => a.priority - b.priority);
}
var BoostHookSystem = class {
  constructor() {
    this.actions = /* @__PURE__ */ new Map();
    this.filters = /* @__PURE__ */ new Map();
  }
  /** Register an action callback for a tag (like WordPress `add_action`). */
  addAction(tag, callback, priority = 10) {
    const list = this.actions.get(tag) ?? [];
    list.push({ id: nextId(), callback, priority });
    this.actions.set(tag, sortByPriority(list));
  }
  /** Execute all callbacks for a tag in priority order (like `do_action`). */
  async doAction(tag, ...args) {
    const list = this.actions.get(tag);
    if (!list || list.length === 0) return;
    for (const item of [...list]) {
      try {
        await item.callback(...args);
      } catch (err) {
        console.error(`[BoostEngine Hook Error] Action '${tag}' failed:`, err);
      }
    }
  }
  /** Remove an action callback. Omitting `callback` removes all for the tag. */
  removeAction(tag, callback) {
    const list = this.actions.get(tag);
    if (!list || list.length === 0) return false;
    if (!callback) {
      this.actions.delete(tag);
      return true;
    }
    const next = list.filter((item) => item.callback !== callback);
    const removed = next.length !== list.length;
    if (next.length === 0) this.actions.delete(tag);
    else this.actions.set(tag, next);
    return removed;
  }
  /** Check whether an action tag (or a specific callback) is registered. */
  hasAction(tag, callback) {
    const list = this.actions.get(tag);
    if (!list || list.length === 0) return false;
    if (!callback) return true;
    return list.some((item) => item.callback === callback);
  }
  /** Remove all actions for a tag, or every action if no tag is given. */
  removeAllActions(tag) {
    if (tag === void 0) this.actions.clear();
    else this.actions.delete(tag);
  }
  /** Register a filter transformer for a tag (like WordPress `add_filter`). */
  addFilter(tag, callback, priority = 10) {
    const list = this.filters.get(tag) ?? [];
    list.push({ id: nextId(), callback, priority });
    this.filters.set(tag, sortByPriority(list));
  }
  /** Pipe a value through all filters for a tag in priority order. */
  async applyFilters(tag, value, ...args) {
    const list = this.filters.get(tag);
    if (!list || list.length === 0) return value;
    let current = value;
    for (const item of [...list]) {
      try {
        current = await item.callback(current, ...args);
      } catch (err) {
        console.error(`[BoostEngine Filter Error] Filter '${tag}' failed:`, err);
      }
    }
    return current;
  }
  /** Remove a filter callback. Omitting `callback` removes all for the tag. */
  removeFilter(tag, callback) {
    const list = this.filters.get(tag);
    if (!list || list.length === 0) return false;
    if (!callback) {
      this.filters.delete(tag);
      return true;
    }
    const next = list.filter((item) => item.callback !== callback);
    const removed = next.length !== list.length;
    if (next.length === 0) this.filters.delete(tag);
    else this.filters.set(tag, next);
    return removed;
  }
  /** Check whether a filter tag (or a specific callback) is registered. */
  hasFilter(tag, callback) {
    const list = this.filters.get(tag);
    if (!list || list.length === 0) return false;
    if (!callback) return true;
    return list.some((item) => item.callback === callback);
  }
  /** Remove all filters for a tag, or every filter if no tag is given. */
  removeAllFilters(tag) {
    if (tag === void 0) this.filters.clear();
    else this.filters.delete(tag);
  }
  /** Remove both actions and filters (optionally scoped to a single tag). */
  removeAllHooks(tag) {
    if (tag === void 0) {
      this.actions.clear();
      this.filters.clear();
    } else {
      this.actions.delete(tag);
      this.filters.delete(tag);
    }
  }
  /** Clear every registered action and filter. */
  clear() {
    this.removeAllHooks();
  }
  listActionTags() {
    return Array.from(this.actions.keys());
  }
  listFilterTags() {
    return Array.from(this.filters.keys());
  }
  getActions(tag) {
    const out = [];
    for (const [t, list] of this.actions.entries()) {
      if (tag !== void 0 && t !== tag) continue;
      for (const item of list) out.push({ tag: t, callback: item.callback, priority: item.priority });
    }
    return out;
  }
  getFilters(tag) {
    const out = [];
    for (const [t, list] of this.filters.entries()) {
      if (tag !== void 0 && t !== tag) continue;
      for (const item of list) out.push({ tag: t, callback: item.callback, priority: item.priority });
    }
    return out;
  }
};
function createHooks() {
  return new BoostHookSystem();
}
var defaultHooks = new BoostHookSystem();
function addAction(tag, callback, priority = 10) {
  defaultHooks.addAction(tag, callback, priority);
}
function doAction(tag, ...args) {
  return defaultHooks.doAction(tag, ...args);
}
function removeAction(tag, callback) {
  return defaultHooks.removeAction(tag, callback);
}
function hasAction(tag, callback) {
  return defaultHooks.hasAction(tag, callback);
}
function addFilter(tag, callback, priority = 10) {
  defaultHooks.addFilter(tag, callback, priority);
}
function applyFilters(tag, value, ...args) {
  return defaultHooks.applyFilters(tag, value, ...args);
}
function removeFilter(tag, callback) {
  return defaultHooks.removeFilter(tag, callback);
}
function hasFilter(tag, callback) {
  return defaultHooks.hasFilter(tag, callback);
}
function removeAllHooks(tag) {
  defaultHooks.removeAllHooks(tag);
}
function getDefaultHooks() {
  return defaultHooks;
}

// src/events/index.ts
var eventId = 0;
var listenerId = 0;
function nextEventId() {
  eventId += 1;
  return `evt_${Date.now().toString(36)}_${eventId}`;
}
function nextListenerId() {
  listenerId += 1;
  return listenerId;
}
function matchesPattern(topic, pattern) {
  if (pattern === "*" || pattern === "**") return true;
  const t = topic.split(".");
  const p = pattern.split(".");
  const m = t.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "**") dp[0][j] = dp[0][j - 1];
    else break;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "**") {
        dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      } else if (p[j - 1] === "*") {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = dp[i - 1][j - 1] && t[i - 1] === p[j - 1];
      }
    }
  }
  return dp[m][n];
}
var EventBusImpl = class {
  constructor(options = {}) {
    this.listeners = [];
    this.history = [];
    this.options = {
      defaultTtl: options.defaultTtl ?? 0,
      historyLimit: options.historyLimit ?? 1e3
    };
  }
  on(pattern, listener) {
    const entry = {
      id: nextListenerId(),
      pattern,
      listener,
      once: false
    };
    this.listeners.push(entry);
    return () => this.off(pattern, listener);
  }
  once(pattern, listener) {
    const entry = {
      id: nextListenerId(),
      pattern,
      listener,
      once: true
    };
    this.listeners.push(entry);
    return () => this.off(pattern, listener);
  }
  off(pattern, listener) {
    this.listeners = this.listeners.filter((entry) => {
      if (entry.pattern !== pattern) return true;
      if (listener && entry.listener !== listener) return true;
      return false;
    });
  }
  record(topic, payload, ttl) {
    const now = Date.now();
    const effectiveTtl = ttl ?? this.options.defaultTtl;
    const envelope = {
      id: nextEventId(),
      topic,
      payload,
      timestamp: now,
      expiresAt: effectiveTtl > 0 ? now + effectiveTtl : void 0
    };
    this.history.push(envelope);
    if (this.history.length > this.options.historyLimit) {
      this.history.splice(0, this.history.length - this.options.historyLimit);
    }
    return envelope;
  }
  matching(topic) {
    return this.listeners.filter((entry) => matchesPattern(topic, entry.pattern));
  }
  async emit(topic, payload, options) {
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
  emitSync(topic, payload, options) {
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
  removeListenerById(id) {
    this.listeners = this.listeners.filter((entry) => entry.id !== id);
  }
  replay(pattern) {
    const now = Date.now();
    const alive = this.history.filter(
      (e) => e.expiresAt === void 0 || e.expiresAt > now
    );
    if (!pattern) return alive;
    return alive.filter((e) => matchesPattern(e.topic, pattern));
  }
  listenerCount(pattern) {
    if (!pattern) return this.listeners.length;
    return this.listeners.filter((entry) => entry.pattern === pattern).length;
  }
  listenerPatterns() {
    return Array.from(new Set(this.listeners.map((entry) => entry.pattern)));
  }
  topics() {
    return Array.from(new Set(this.history.map((e) => e.topic)));
  }
  clear() {
    this.listeners = [];
    this.history = [];
  }
};
function createEventBus(options = {}) {
  return new EventBusImpl(options);
}
var DOMAIN_EVENTS = {
  AUTH: {
    LOGIN: "auth.login",
    LOGOUT: "auth.logout",
    REGISTERED: "auth.registered",
    PASSWORD_RESET: "auth.password_reset"
  },
  CART: {
    UPDATED: "cart.updated",
    ITEM_ADDED: "cart.item_added",
    ITEM_REMOVED: "cart.item_removed",
    CLEARED: "cart.cleared"
  },
  CHECKOUT: {
    STARTED: "checkout.started",
    ABANDONED: "checkout.abandoned",
    COMPLETED: "checkout.completed"
  },
  PAYMENT: {
    INITIATED: "payment.initiated",
    SUCCESS: "payment.success",
    FAILED: "payment.failed",
    REFUNDED: "payment.refunded"
  },
  ORDER: {
    CREATED: "order.created",
    UPDATED: "order.updated",
    CONFIRMED: "order.confirmed",
    SHIPPED: "order.shipped",
    DELIVERED: "order.delivered",
    CANCELLED: "order.cancelled"
  },
  INVENTORY: {
    UPDATED: "inventory.updated",
    STOCK_LOW: "inventory.stock_low",
    OUT_OF_STOCK: "inventory.out_of_stock"
  },
  SHIPPING: {
    RATE_CALCULATED: "shipping.rate_calculated",
    LABEL_CREATED: "shipping.label_created",
    DISPATCHED: "shipping.dispatched",
    DELIVERED: "shipping.delivered"
  }
};
var DOMAIN_NAMESPACES = [
  "auth",
  "cart",
  "checkout",
  "payment",
  "order",
  "inventory",
  "shipping"
];

// src/store/index.ts
var internals = /* @__PURE__ */ new WeakMap();
function resolveUpdate(current, update) {
  const partial = typeof update === "function" ? update(current) : update;
  return { ...current, ...partial };
}
function createStore(initialState) {
  const meta = {
    value: { ...initialState },
    listeners: /* @__PURE__ */ new Set()
  };
  const store = {
    getState() {
      return meta.value;
    },
    setState(update) {
      const prev = meta.value;
      const next = resolveUpdate(prev, update);
      if (next === prev) return;
      meta.value = next;
      for (const listener of [...meta.listeners]) {
        listener(next, prev);
      }
    },
    subscribe(listener) {
      meta.listeners.add(listener);
      return () => {
        meta.listeners.delete(listener);
      };
    },
    derive(selector) {
      return derive(store, selector);
    }
  };
  internals.set(store, meta);
  return store;
}
function getState(store) {
  return store.getState();
}
function setState(store, update) {
  store.setState(update);
}
function subscribe(store, listener) {
  return store.subscribe(listener);
}
function derive(store, selector) {
  const meta = {
    value: selector(store.getState()),
    listeners: /* @__PURE__ */ new Set()
  };
  const derived = {
    getState() {
      return meta.value;
    },
    setState(update) {
      const prev = meta.value;
      const next = resolveUpdate(prev, update);
      if (next === prev) return;
      meta.value = next;
      for (const listener of [...meta.listeners]) {
        listener(next, prev);
      }
    },
    subscribe(listener) {
      meta.listeners.add(listener);
      return () => {
        meta.listeners.delete(listener);
      };
    },
    derive(selector2) {
      return derive(derived, selector2);
    }
  };
  internals.set(derived, meta);
  meta.unsubscribeBase = store.subscribe((state) => {
    const next = selector(state);
    if (next === meta.value) return;
    const prev = meta.value;
    meta.value = next;
    for (const listener of [...meta.listeners]) {
      listener(next, prev);
    }
  });
  return derived;
}

// src/plugins/index.ts
function topologicalOrder(plugins) {
  const visiting = /* @__PURE__ */ new Set();
  const visited = /* @__PURE__ */ new Set();
  const order = [];
  const cycles = [];
  function visit(id, stack) {
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
function resolvePluginDependencies(id, plugins) {
  const entry = plugins.get(id);
  if (!entry) return { satisfied: false, missing: [id] };
  const missing = (entry.dependencies ?? []).filter((dep) => !plugins.has(dep));
  return { satisfied: missing.length === 0, missing };
}
var BoostEngineImpl = class {
  constructor(config = {}) {
    this.plugins = /* @__PURE__ */ new Map();
    this.status = "created";
    this.id = config.id ?? `engine_${Date.now().toString(36)}`;
    this.config = { strictDependencies: true, autoStart: false, ...config };
    this.hooks = createHooks();
    this.events = createEventBus();
    this.store = createStore({
      status: "created",
      pluginCount: 0
    });
  }
  contextFor(plugin) {
    const settings = this.plugins.get(plugin.id)?.settings ?? {};
    return {
      storeId: this.config.storeId,
      config: settings,
      env: this.config.env
    };
  }
  setStatus(status) {
    this.status = status;
    this.store.setState({ status });
  }
  record(plugin) {
    const entry = {
      plugin,
      status: "registered",
      enabled: true,
      settings: { ...plugin.defaultSettings ?? {} },
      dependencies: plugin.dependencies ?? []
    };
    this.plugins.set(plugin.id, entry);
    this.store.setState({ pluginCount: this.plugins.size });
    return entry;
  }
  assertValid(plugin) {
    if (!plugin || typeof plugin.id !== "string" || !plugin.id) {
      throw new Error("Plugin must define a non-empty string `id`.");
    }
    if (!plugin.name || !plugin.version) {
      throw new Error(
        `Plugin '${plugin.id}' must define a "name" and "version".`
      );
    }
  }
  async registerPlugin(plugin) {
    this.assertValid(plugin);
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin '${plugin.id}' is already registered.`);
    }
    const entry = this.record(plugin);
    if (this.status === "running") {
      await this.initializeOne(plugin.id);
      await this.registerHooksOne(plugin.id);
      await this.bootOne(plugin.id);
    }
    return entry;
  }
  async unregisterPlugin(id) {
    const entry = this.plugins.get(id);
    if (!entry) return;
    await this.shutdownOne(id);
    this.plugins.delete(id);
    this.store.setState({ pluginCount: this.plugins.size });
  }
  async initializeOne(id) {
    const entry = this.plugins.get(id);
    if (!entry) return;
    if (entry.status === "initialized" || entry.status === "booted") return;
    try {
      const context = this.contextFor(entry.plugin);
      if (entry.plugin.init) await entry.plugin.init(context);
      if (entry.plugin.onInit) await entry.plugin.onInit(context);
      entry.status = "initialized";
      entry.error = void 0;
    } catch (err) {
      entry.status = "failed";
      entry.error = err instanceof Error ? err.message : String(err);
      this.log("init", id, err);
    }
  }
  async registerHooksOne(id) {
    const entry = this.plugins.get(id);
    if (!entry || entry.status !== "initialized") return;
    try {
      if (entry.plugin.registerHooks) await entry.plugin.registerHooks(this);
    } catch (err) {
      entry.status = "failed";
      entry.error = err instanceof Error ? err.message : String(err);
      this.log("registerHooks", id, err);
    }
  }
  async bootOne(id) {
    const entry = this.plugins.get(id);
    if (!entry) return;
    if (entry.status === "booted") return;
    if (entry.status === "failed") return;
    try {
      const context = this.contextFor(entry.plugin);
      if (entry.plugin.boot) await entry.plugin.boot(context);
      if (entry.plugin.onActivate) await entry.plugin.onActivate();
      entry.status = "booted";
      entry.error = void 0;
    } catch (err) {
      entry.status = "failed";
      entry.error = err instanceof Error ? err.message : String(err);
      this.log("boot", id, err);
    }
  }
  async shutdownOne(id) {
    const entry = this.plugins.get(id);
    if (!entry) return;
    try {
      if (entry.plugin.shutdown) await entry.plugin.shutdown();
      if (entry.plugin.onDeactivate) await entry.plugin.onDeactivate();
      entry.status = "shutdown";
    } catch (err) {
      this.log("shutdown", id, err);
    }
  }
  async start() {
    if (this.status === "running") return;
    this.setStatus("starting");
    const { order, cycles } = topologicalOrder(this.plugins);
    if (cycles.length > 0 && this.config.strictDependencies) {
      this.setStatus("created");
      throw new Error(
        `Circular plugin dependencies detected: ${cycles.map((c) => c.join(" -> ")).join("; ")}`
      );
    }
    const blocked = /* @__PURE__ */ new Set();
    for (const id of order) {
      const { satisfied, missing } = resolvePluginDependencies(id, this.plugins);
      if (!satisfied) {
        const entry = this.plugins.get(id);
        entry.status = "failed";
        entry.error = `Missing dependencies: ${missing.join(", ")}`;
        blocked.add(id);
        if (this.config.strictDependencies) {
          this.setStatus("created");
          throw new Error(
            `Plugin '${id}' is missing dependencies: ${missing.join(", ")}`
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
    this.setStatus("running");
  }
  async shutdown() {
    if (this.status !== "running" && this.status !== "starting") return;
    this.setStatus("stopping");
    const { order } = topologicalOrder(this.plugins);
    for (const id of [...order].reverse()) {
      await this.shutdownOne(id);
    }
    this.setStatus("stopped");
  }
  getPlugin(id) {
    return this.plugins.get(id);
  }
  getPlugins() {
    return Array.from(this.plugins.values());
  }
  async enablePlugin(id) {
    const entry = this.plugins.get(id);
    if (!entry) throw new Error(`Plugin '${id}' is not registered.`);
    entry.enabled = true;
    if (this.status === "running") {
      await this.initializeOne(id);
      await this.registerHooksOne(id);
      await this.bootOne(id);
    }
  }
  async disablePlugin(id) {
    const entry = this.plugins.get(id);
    if (!entry) throw new Error(`Plugin '${id}' is not registered.`);
    entry.enabled = false;
    if (this.status === "running") {
      await this.shutdownOne(id);
    }
  }
  isPluginHealthy(id) {
    const report = this.healthCheck().find((r) => r.id === id);
    return report ? report.healthy : false;
  }
  healthCheck() {
    return Array.from(this.plugins.values()).map((entry) => {
      const { satisfied, missing } = resolvePluginDependencies(
        entry.plugin.id,
        this.plugins
      );
      const healthy = satisfied && entry.status !== "failed" && entry.status !== "shutdown" && entry.enabled;
      return {
        id: entry.plugin.id,
        name: entry.plugin.name,
        version: entry.plugin.version,
        status: entry.status,
        healthy,
        dependenciesSatisfied: satisfied,
        missingDependencies: missing,
        error: entry.error
      };
    });
  }
  inspect() {
    return {
      id: this.id,
      status: this.status,
      config: { ...this.config, plugins: void 0 },
      plugins: Array.from(this.plugins.values()).map((entry) => ({
        id: entry.plugin.id,
        name: entry.plugin.name,
        version: entry.plugin.version,
        status: entry.status,
        enabled: entry.enabled,
        dependencies: entry.dependencies
      })),
      actionHooks: this.hooks.listActionTags(),
      filterHooks: this.hooks.listFilterTags(),
      eventTopics: this.events.topics(),
      eventListeners: this.events.listenerPatterns(),
      eventListenerCount: this.events.listenerCount()
    };
  }
  log(phase, id, err) {
    if (this.config.debug) {
      console.error(`[BoostEngine] Plugin '${id}' failed during ${phase}:`, err);
    }
  }
};
function createBoostEngine(config = {}) {
  const engine = new BoostEngineImpl(config);
  const plugins = config.plugins ?? [];
  for (const plugin of plugins) {
    engine.registerPlugin(plugin).catch((err) => {
      if (config.debug) {
        console.error("[BoostEngine] Failed to register plugin:", err);
      }
    });
  }
  if (config.autoStart) {
    engine.start().catch((err) => {
      if (config.debug) {
        console.error("[BoostEngine] Bootstrap start failed:", err);
      }
    });
  }
  return engine;
}
var defaultEngine = null;
function getDefaultEngine() {
  if (!defaultEngine) defaultEngine = createBoostEngine();
  return defaultEngine;
}
async function registerPlugin(plugin) {
  const engine = getDefaultEngine();
  const entry = await engine.registerPlugin(plugin);
  await engine.start();
  return entry;
}
var BOOST_HOOKS = {
  INIT: "boost:init",
  CART_UPDATED: "boost:cart_updated",
  ITEM_ADDED_TO_CART: "boost:item_added_to_cart",
  ITEM_REMOVED_FROM_CART: "boost:item_removed_from_cart",
  CHECKOUT_STARTED: "boost:checkout_started",
  ORDER_CREATED: "boost:order_created",
  ORDER_STATUS_CHANGED: "boost:order_status_changed",
  PRODUCT_VIEWED: "boost:product_viewed",
  FILTER_PRODUCT_PRICE: "filter:product_price",
  FILTER_SHIPPING_RATES: "filter:shipping_rates",
  FILTER_TAX_CALCULATION: "filter:tax_calculation",
  FILTER_DISCOUNT_CALCULATION: "filter:discount_calculation",
  FILTER_CART_SUMMARY: "filter:cart_summary"
};
var BoostPluginEngine = class _BoostPluginEngine {
  constructor() {
    this.hooks = new BoostHookSystem();
    this.plugins = /* @__PURE__ */ new Map();
    this.activeStatus = /* @__PURE__ */ new Map();
    this.pluginConfigs = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!_BoostPluginEngine.instance) {
      _BoostPluginEngine.instance = new _BoostPluginEngine();
    }
    return _BoostPluginEngine.instance;
  }
  register(plugin, autoEnable = true) {
    this.plugins.set(plugin.id, plugin);
    this.activeStatus.set(plugin.id, autoEnable);
    this.pluginConfigs.set(plugin.id, plugin.defaultSettings || {});
    if (autoEnable) {
      const context = { config: plugin.defaultSettings || {} };
      if (plugin.init) void plugin.init(context);
      if (plugin.onInit) void plugin.onInit(context);
    }
  }
  unregister(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      if (plugin.shutdown) void plugin.shutdown();
      if (plugin.onDeactivate) void plugin.onDeactivate();
    }
    this.plugins.delete(pluginId);
    this.activeStatus.delete(pluginId);
    this.pluginConfigs.delete(pluginId);
  }
  enable(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} is not registered.`);
    this.activeStatus.set(pluginId, true);
    if (plugin.boot) void plugin.boot();
    if (plugin.onActivate) void plugin.onActivate();
  }
  disable(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} is not registered.`);
    this.activeStatus.set(pluginId, false);
    if (plugin.shutdown) void plugin.shutdown();
    if (plugin.onDeactivate) void plugin.onDeactivate();
  }
  isEnabled(pluginId) {
    return !!this.activeStatus.get(pluginId);
  }
  get(pluginId) {
    return this.plugins.get(pluginId);
  }
  getAll() {
    return Array.from(this.plugins.values()).map((p) => ({
      ...p,
      enabled: this.isEnabled(p.id),
      settings: this.pluginConfigs.get(p.id) || {}
    }));
  }
  updateSettings(pluginId, settings) {
    const existing = this.pluginConfigs.get(pluginId) || {};
    this.pluginConfigs.set(pluginId, { ...existing, ...settings });
  }
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
var boostCore = BoostPluginEngine.getInstance();

exports.BOOST_HOOKS = BOOST_HOOKS;
exports.BoostEngineImpl = BoostEngineImpl;
exports.BoostHookSystem = BoostHookSystem;
exports.BoostPluginEngine = BoostPluginEngine;
exports.CURRENCY_MINOR_UNITS = CURRENCY_MINOR_UNITS;
exports.DEFAULT_MINOR_UNITS = DEFAULT_MINOR_UNITS;
exports.DOMAIN_EVENTS = DOMAIN_EVENTS;
exports.DOMAIN_NAMESPACES = DOMAIN_NAMESPACES;
exports.EventBusImpl = EventBusImpl;
exports.addAction = addAction;
exports.addFilter = addFilter;
exports.addMoney = addMoney;
exports.applyFilters = applyFilters;
exports.assertSameCurrency = assertSameCurrency;
exports.boostCore = boostCore;
exports.compareMoney = compareMoney;
exports.convertMoney = convertMoney;
exports.createBoostEngine = createBoostEngine;
exports.createEventBus = createEventBus;
exports.createHooks = createHooks;
exports.createStore = createStore;
exports.derive = derive;
exports.divideMoney = divideMoney;
exports.doAction = doAction;
exports.formatMoney = formatMoney;
exports.fromMinorUnits = fromMinorUnits;
exports.getDefaultEngine = getDefaultEngine;
exports.getDefaultHooks = getDefaultHooks;
exports.getMinorUnits = getMinorUnits;
exports.getState = getState;
exports.hasAction = hasAction;
exports.hasFilter = hasFilter;
exports.isZeroMoney = isZeroMoney;
exports.matchesPattern = matchesPattern;
exports.multiplyMoney = multiplyMoney;
exports.negateMoney = negateMoney;
exports.registerPlugin = registerPlugin;
exports.removeAction = removeAction;
exports.removeAllHooks = removeAllHooks;
exports.removeFilter = removeFilter;
exports.setState = setState;
exports.subscribe = subscribe;
exports.subtractMoney = subtractMoney;
exports.toMinorUnits = toMinorUnits;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map