declare module 'react' {
  export interface ReactNode {}
  export interface ReactElement {}
  export interface FC<P = {}> {
    (props: P): any;
  }
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T = any>(context: any): T;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function createElement(type: any, props?: any, ...children: any[]): any;
}
