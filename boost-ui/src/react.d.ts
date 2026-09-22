declare namespace React {
  type ReactNode = any;
  type CSSProperties = Record<string, any>;
  interface FC<P = {}> {
    (props: P): any;
  }
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'vite' {
  export interface Plugin {
    name: string;
    [key: string]: any;
  }
}

declare module 'vue' {
  export type Ref<T = any> = { value: T };
  export function ref<T>(val?: T): Ref<T>;
  export function computed<T>(getter: () => T): Ref<T>;
  export function watch(source: any, cb: (val: any, oldVal?: any) => void, options?: any): void;
}

declare module 'svelte/store' {
  export interface Writable<T> {
    subscribe: (fn: (value: T) => void) => () => void;
    set: (value: T) => void;
    update: (fn: (value: T) => T) => void;
  }
  export function writable<T>(value?: T): Writable<T>;
  export function readable<T>(value?: T, start?: any): any;
  export function derived<T>(stores: any, fn: any): any;
}

declare module 'solid-js' {
  export type Accessor<T> = () => T;
  export type Setter<T> = (val: T | ((prev: T) => T)) => void;
  export type Signal<T> = [Accessor<T>, Setter<T>];
  export function createSignal<T>(val?: T, options?: any): Signal<T>;
  export function createMemo<T>(fn: () => T): Accessor<T>;
  export function createEffect(fn: () => void): void;
  export function onMount(fn: () => void): void;
  export function onCleanup(fn: () => void): void;
}

declare module '@angular/core' {
  export function Injectable(options?: any): ClassDecorator;
}

declare module 'rxjs' {
  export class BehaviorSubject<T> {
    value: T;
    constructor(val: T);
    asObservable(): any;
    next(val: T): void;
  }
  export class Observable<T> {
    pipe(...args: any[]): any;
    subscribe(fn: (val: T) => void): any;
  }
  export function combineLatest(sources: any[]): any;
}

declare module 'rxjs/operators' {
  export function map(fn: (val: any) => any): any;
  export function distinctUntilChanged(): any;
}

declare module '@builder.io/qwik' {
  export function component$<T>(fn: (props: T) => any): any;
  export function signal<T>(val?: T): { value: T };
  export function useSignal<T>(val?: T): { value: T };
  export function useVisibleTask$(fn: () => void | (() => void)): void;
}

declare module 'react-native' {
  export const StyleSheet: any;
  export const View: any;
  export const Text: any;
  export const TouchableOpacity: any;
}


