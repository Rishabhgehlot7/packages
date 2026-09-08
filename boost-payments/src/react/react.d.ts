// Fallback ambient declaration for React hooks when building without local React types
declare module 'react' {
  export function useState<T>(
    initialState: T | (() => T)
  ): [T, (newState: T | ((prevState: T) => T)) => void];

  export function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: any[]
  ): T;

  export type ReactNode = any;
}
