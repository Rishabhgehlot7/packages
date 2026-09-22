declare module 'react' {
  export interface Context<T> {
    Provider: any;
    Consumer: any;
  }
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T = any>(context: any): T;
  export function useState<T>(initialState: T | (() => T)): [T, (action: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export type ReactNode = any;
}
