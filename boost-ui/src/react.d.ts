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
