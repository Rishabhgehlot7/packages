/**
 * @boostengine/core — WordPress/Shopify-style Action & Filter Hooks
 *
 * Actions are fire-and-forget callbacks (side effects). Filters transform a
 * value through an ordered pipeline. Both honour WordPress priority semantics:
 * callbacks registered with a lower `priority` number run first.
 */

export type ActionCallback = (...args: any[]) => Promise<void> | void;
export type FilterCallback<T = any> = (
  value: T,
  ...args: any[]
) => Promise<T> | T;

export interface RegisteredAction {
  id: number;
  callback: ActionCallback;
  priority: number;
}

export interface RegisteredFilter {
  id: number;
  callback: FilterCallback;
  priority: number;
}

export interface HookSystem {
  addAction(tag: string, callback: ActionCallback, priority?: number): void;
  doAction(tag: string, ...args: any[]): Promise<void>;
  removeAction(tag: string, callback?: ActionCallback): boolean;
  hasAction(tag: string, callback?: ActionCallback): boolean;
  removeAllActions(tag?: string): void;

  addFilter<T = any>(tag: string, callback: FilterCallback<T>, priority?: number): void;
  applyFilters<T = any>(tag: string, value: T, ...args: any[]): Promise<T>;
  removeFilter(tag: string, callback?: FilterCallback): boolean;
  hasFilter(tag: string, callback?: FilterCallback): boolean;
  removeAllFilters(tag?: string): void;

  removeAllHooks(tag?: string): void;
  clear(): void;

  listActionTags(): string[];
  listFilterTags(): string[];
  getActions(tag?: string): Array<{ tag: string; callback: ActionCallback; priority: number }>;
  getFilters(tag?: string): Array<{ tag: string; callback: FilterCallback; priority: number }>;
}

let hookId = 0;

function nextId(): number {
  hookId += 1;
  return hookId;
}

function sortByPriority<T extends { priority: number }>(list: T[]): T[] {
  // Stable sort by ascending priority.
  return list.sort((a, b) => a.priority - b.priority);
}

/**
 * A concrete hook registry. Also exported under the legacy alias
 * `BoostHookSystem` for backward compatibility with `@boostengine/core` 1.x.
 */
export class BoostHookSystem implements HookSystem {
  private actions = new Map<string, RegisteredAction[]>();
  private filters = new Map<string, RegisteredFilter[]>();

  /** Register an action callback for a tag (like WordPress `add_action`). */
  addAction(tag: string, callback: ActionCallback, priority = 10): void {
    const list = this.actions.get(tag) ?? [];
    list.push({ id: nextId(), callback, priority });
    this.actions.set(tag, sortByPriority(list));
  }

  /** Execute all callbacks for a tag in priority order (like `do_action`). */
  async doAction(tag: string, ...args: any[]): Promise<void> {
    const list = this.actions.get(tag);
    if (!list || list.length === 0) return;

    // Iterate over a snapshot so callbacks can register/remove actions safely.
    for (const item of [...list]) {
      try {
        await item.callback(...args);
      } catch (err) {
        console.error(`[BoostEngine Hook Error] Action '${tag}' failed:`, err);
      }
    }
  }

  /** Remove an action callback. Omitting `callback` removes all for the tag. */
  removeAction(tag: string, callback?: ActionCallback): boolean {
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
  hasAction(tag: string, callback?: ActionCallback): boolean {
    const list = this.actions.get(tag);
    if (!list || list.length === 0) return false;
    if (!callback) return true;
    return list.some((item) => item.callback === callback);
  }

  /** Remove all actions for a tag, or every action if no tag is given. */
  removeAllActions(tag?: string): void {
    if (tag === undefined) this.actions.clear();
    else this.actions.delete(tag);
  }

  /** Register a filter transformer for a tag (like WordPress `add_filter`). */
  addFilter<T = any>(tag: string, callback: FilterCallback<T>, priority = 10): void {
    const list = this.filters.get(tag) ?? [];
    list.push({ id: nextId(), callback: callback as FilterCallback, priority });
    this.filters.set(tag, sortByPriority(list));
  }

  /** Pipe a value through all filters for a tag in priority order. */
  async applyFilters<T = any>(tag: string, value: T, ...args: any[]): Promise<T> {
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
  removeFilter(tag: string, callback?: FilterCallback): boolean {
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
  hasFilter(tag: string, callback?: FilterCallback): boolean {
    const list = this.filters.get(tag);
    if (!list || list.length === 0) return false;
    if (!callback) return true;
    return list.some((item) => item.callback === callback);
  }

  /** Remove all filters for a tag, or every filter if no tag is given. */
  removeAllFilters(tag?: string): void {
    if (tag === undefined) this.filters.clear();
    else this.filters.delete(tag);
  }

  /** Remove both actions and filters (optionally scoped to a single tag). */
  removeAllHooks(tag?: string): void {
    if (tag === undefined) {
      this.actions.clear();
      this.filters.clear();
    } else {
      this.actions.delete(tag);
      this.filters.delete(tag);
    }
  }

  /** Clear every registered action and filter. */
  clear(): void {
    this.removeAllHooks();
  }

  listActionTags(): string[] {
    return Array.from(this.actions.keys());
  }

  listFilterTags(): string[] {
    return Array.from(this.filters.keys());
  }

  getActions(tag?: string): Array<{ tag: string; callback: ActionCallback; priority: number }> {
    const out: Array<{ tag: string; callback: ActionCallback; priority: number }> = [];
    for (const [t, list] of this.actions.entries()) {
      if (tag !== undefined && t !== tag) continue;
      for (const item of list) out.push({ tag: t, callback: item.callback, priority: item.priority });
    }
    return out;
  }

  getFilters(tag?: string): Array<{ tag: string; callback: FilterCallback; priority: number }> {
    const out: Array<{ tag: string; callback: FilterCallback; priority: number }> = [];
    for (const [t, list] of this.filters.entries()) {
      if (tag !== undefined && t !== tag) continue;
      for (const item of list) out.push({ tag: t, callback: item.callback, priority: item.priority });
    }
    return out;
  }
}

/** Create a fresh, isolated hook system. */
export function createHooks(): HookSystem {
  return new BoostHookSystem();
}


// ---------------------------------------------------------------------------
// Global default hook system + standalone convenience functions.
// ---------------------------------------------------------------------------

const defaultHooks = new BoostHookSystem();

/** Register an action on the global hook system. */
export function addAction(tag: string, callback: ActionCallback, priority = 10): void {
  defaultHooks.addAction(tag, callback, priority);
}

/** Fire an action on the global hook system. */
export function doAction(tag: string, ...args: any[]): Promise<void> {
  return defaultHooks.doAction(tag, ...args);
}

/** Remove an action from the global hook system. */
export function removeAction(tag: string, callback?: ActionCallback): boolean {
  return defaultHooks.removeAction(tag, callback);
}

/** Check the global hook system for an action. */
export function hasAction(tag: string, callback?: ActionCallback): boolean {
  return defaultHooks.hasAction(tag, callback);
}

/** Register a filter on the global hook system. */
export function addFilter<T = any>(tag: string, callback: FilterCallback<T>, priority = 10): void {
  defaultHooks.addFilter(tag, callback, priority);
}

/** Apply filters on the global hook system. */
export function applyFilters<T = any>(tag: string, value: T, ...args: any[]): Promise<T> {
  return defaultHooks.applyFilters(tag, value, ...args);
}

/** Remove a filter from the global hook system. */
export function removeFilter(tag: string, callback?: FilterCallback): boolean {
  return defaultHooks.removeFilter(tag, callback);
}

/** Check the global hook system for a filter. */
export function hasFilter(tag: string, callback?: FilterCallback): boolean {
  return defaultHooks.hasFilter(tag, callback);
}

/** Remove all hooks (actions and filters) from the global hook system. */
export function removeAllHooks(tag?: string): void {
  defaultHooks.removeAllHooks(tag);
}

/** The global/default hook system instance. */
export function getDefaultHooks(): HookSystem {
  return defaultHooks;
}
