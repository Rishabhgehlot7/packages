import * as React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  cols?: number | string;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  className?: string;
  style?: React.CSSProperties;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      cols = 1,
      gap = '16px',
      rowGap,
      columnGap,
      align,
      justify,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const templateColumns =
      typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : cols;

    return (
      <div
        ref={ref}
        className={`boost-grid ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: templateColumns,
          gap: typeof gap === 'number' ? `${gap}px` : gap,
          ...(rowGap !== undefined && { rowGap: typeof rowGap === 'number' ? `${rowGap}px` : rowGap }),
          ...(columnGap !== undefined && {
            columnGap: typeof columnGap === 'number' ? `${columnGap}px` : columnGap,
          }),
          ...(align && { alignItems: align }),
          ...(justify && { justifyItems: justify }),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  colSpan?: number | 'full';
  rowSpan?: number;
  colStart?: number;
  rowStart?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      children,
      colSpan,
      rowSpan,
      colStart,
      rowStart,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const gridColumn =
      colSpan === 'full'
        ? '1 / -1'
        : colSpan !== undefined
        ? `span ${colSpan} / span ${colSpan}`
        : colStart
        ? `${colStart}`
        : undefined;

    const gridRow =
      rowSpan !== undefined
        ? `span ${rowSpan} / span ${rowSpan}`
        : rowStart
        ? `${rowStart}`
        : undefined;

    return (
      <div
        ref={ref}
        className={`boost-grid-item ${className}`}
        style={{
          ...(gridColumn && { gridColumn }),
          ...(gridRow && { gridRow }),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';
