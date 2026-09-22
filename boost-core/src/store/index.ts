/**
 * @boostengine/core — Lightweight Reactive Store
 *
 * A zero-dependency, observable state container. Stores expose
 * `getState`/`setState`/`subscribe`/`derive` and notify subscribers whenever
 * state is replaced. `derive` projects one store into another so UI slices can
 * subscribe to narrow, memoised selections.
 */

export type StoreListener<T> = (state: T, prevState: T) => void;
export type StateUpdater<T> = Partial<T> | ((state: T) => Partial<T>);

export interface Store<T> {
  getState(): T;
  setState(update: StateUpdater<T>): void;
  subscribe(listener: StoreListener<T>): () => void;
  derive<D>(selector: (state: T) => D): Store<D>;
}

/** Internal mutable bookkeeping for a store. */
interface StoreInternals<T> {
  value: T;
  listeners: Set<StoreListener<T>>;
  base?: Store<any>;
  selector?: (s: any) => T;
  unsubscribeBase?: () => void;
}

const internals = new WeakMap<object, StoreInternals<any>>();

function resolveUpdate<T>(current: T, update: StateUpdater<T>): T {
  const partial = typeof update === 'function'
    ? (update as (state: T) => Partial<T>)(current)
    : update;
  return { ...current, ...partial } as T;
}

/** Create a new reactive store seeded with `initialState`. */
export function createStore<T extends Record<string, any>>(initialState: T): Store<T> {
  const meta: StoreInternals<T> = {
    value: { ...initialState },
    listeners: new Set(),
  };
  const store: Store<T> = {
    getState(): T {
      return meta.value;
    },
    setState(update: StateUpdater<T>): void {
      const prev = meta.value;
      const next = resolveUpdate(prev, update);
      if (next === prev) return;
      meta.value = next;
      for (const listener of [...meta.listeners]) {
        listener(next, prev);
      }
    },
    subscribe(listener: StoreListener<T>): () => void {
      meta.listeners.add(listener);
      return () => {
        meta.listeners.delete(listener);
      };
    },
    derive<D>(selector: (state: T) => D): Store<D> {
      return derive(store, selector);
    },
  };
  internals.set(store, meta);
  return store;
}

/** Read the current state of a store. */
export function getState<T>(store: Store<T>): T {
  return store.getState();
}

/** Update a store's state (partial merge or updater function). */
export function setState<T>(store: Store<T>, update: StateUpdater<T>): void {
  store.setState(update);
}

/** Subscribe to store changes. Returns an unsubscribe function. */
export function subscribe<T>(store: Store<T>, listener: StoreListener<T>): () => void {
  return store.subscribe(listener);
}

/**
 * Derive a new store that projects (and memoises) a selection of another
 * store. The derived store re-emits only when its selected value changes.
 */
export function derive<S, D>(store: Store<S>, selector: (state: S) => D): Store<D> {
  const meta: StoreInternals<D> = {
    value: selector(store.getState()),
    listeners: new Set(),
  };
  const derived: Store<D> = {
    getState(): D {
      return meta.value;
    },
    setState(update: StateUpdater<D>): void {
      const prev = meta.value;
      const next = resolveUpdate(prev, update);
      if (next === prev) return;
      meta.value = next;
      for (const listener of [...meta.listeners]) {
        listener(next, prev);
      }
    },
    subscribe(listener: StoreListener<D>): () => void {
      meta.listeners.add(listener);
      return () => {
        meta.listeners.delete(listener);
      };
    },
    derive<D2>(selector2: (state: D) => D2): Store<D2> {
      return derive(derived, selector2);
    },
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
