import * as React from 'react';

export type BoxAsTag =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'main'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav'
  | 'p'
  | 'a'
  | 'button'
  | 'ul'
  | 'ol'
  | 'li'
  | 'form'
  | React.ElementType;

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: BoxAsTag;
  children?: React.ReactNode;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  m?: string | number;
  mx?: string | number;
  my?: string | number;
  mt?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  bg?: string;
  color?: string;
  border?: string;
  borderRadius?: string | number;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  display?: React.CSSProperties['display'];
  position?: React.CSSProperties['position'];
  className?: string;
  style?: React.CSSProperties;
}

export const Box = /* @__PURE__ */ React.forwardRef<HTMLElement, BoxProps>(
  (
    {
      as = 'div',
      children,
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      bg,
      color,
      border,
      borderRadius,
      width,
      height,
      maxWidth,
      minHeight,
      display,
      position,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const Component = as as any;

    const computedStyle: React.CSSProperties = {
      ...(display && { display }),
      ...(position && { position }),
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
      ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
      ...(minHeight && { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }),
      ...(bg && { backgroundColor: bg }),
      ...(color && { color }),
      ...(border && { border }),
      ...(borderRadius && {
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      }),
      ...(p !== undefined && { padding: typeof p === 'number' ? `${p}px` : p }),
      ...(px !== undefined && {
        paddingLeft: typeof px === 'number' ? `${px}px` : px,
        paddingRight: typeof px === 'number' ? `${px}px` : px,
      }),
      ...(py !== undefined && {
        paddingTop: typeof py === 'number' ? `${py}px` : py,
        paddingBottom: typeof py === 'number' ? `${py}px` : py,
      }),
      ...(pt !== undefined && { paddingTop: typeof pt === 'number' ? `${pt}px` : pt }),
      ...(pb !== undefined && { paddingBottom: typeof pb === 'number' ? `${pb}px` : pb }),
      ...(pl !== undefined && { paddingLeft: typeof pl === 'number' ? `${pl}px` : pl }),
      ...(pr !== undefined && { paddingRight: typeof pr === 'number' ? `${pr}px` : pr }),
      ...(m !== undefined && { margin: typeof m === 'number' ? `${m}px` : m }),
      ...(mx !== undefined && {
        marginLeft: typeof mx === 'number' ? `${mx}px` : mx,
        marginRight: typeof mx === 'number' ? `${mx}px` : mx,
      }),
      ...(my !== undefined && {
        marginTop: typeof my === 'number' ? `${my}px` : my,
        marginBottom: typeof my === 'number' ? `${my}px` : my,
      }),
      ...(mt !== undefined && { marginTop: typeof mt === 'number' ? `${mt}px` : mt }),
      ...(mb !== undefined && { marginBottom: typeof mb === 'number' ? `${mb}px` : mb }),
      ...(ml !== undefined && { marginLeft: typeof ml === 'number' ? `${ml}px` : ml }),
      ...(mr !== undefined && { marginRight: typeof mr === 'number' ? `${mr}px` : mr }),
      ...style,
    };

    return (
      <Component ref={ref} className={`boost-box ${className}`} style={computedStyle} {...props}>
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';
