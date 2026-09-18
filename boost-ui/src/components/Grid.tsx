import * as React from 'react';

export interface ResponsiveBreakpoints<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  cols?: number | string | ResponsiveBreakpoints<number | string>;
  gap?: string | number | ResponsiveBreakpoints<string | number>;
  rowGap?: string | number;
  columnGap?: string | number;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  autoResponsive?: boolean;
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
      autoResponsive = true,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const rawId = React.useId ? React.useId() : Math.random().toString(36).substring(2, 9);
    const gridClassId = `bg-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    const toColVal = (val?: number | string) => {
      if (val === undefined) return undefined;
      return typeof val === 'number' ? `repeat(${val}, minmax(0, 1fr))` : val;
    };

    const toGapVal = (val?: string | number) => {
      if (val === undefined) return undefined;
      return typeof val === 'number' ? `${val}px` : val;
    };

    const isResponsiveCols = typeof cols === 'object' && cols !== null;
    const isResponsiveGap = typeof gap === 'object' && gap !== null;

    let baseCols = 'repeat(1, minmax(0, 1fr))';
    let smCols: string | undefined;
    let mdCols: string | undefined;
    let lgCols: string | undefined;
    let xlCols: string | undefined;

    if (isResponsiveCols) {
      baseCols = toColVal(cols.base) || 'repeat(1, minmax(0, 1fr))';
      smCols = toColVal(cols.sm);
      mdCols = toColVal(cols.md);
      lgCols = toColVal(cols.lg);
      xlCols = toColVal(cols.xl);
    } else if (typeof cols === 'number' && autoResponsive && cols > 1) {
      // Auto-responsive defaults: 1 col on mobile, min(2, cols) on tablet, full cols on desktop
      baseCols = 'repeat(1, minmax(0, 1fr))';
      smCols = cols >= 2 ? 'repeat(2, minmax(0, 1fr))' : undefined;
      mdCols = cols >= 3 ? `repeat(${Math.min(3, cols)}, minmax(0, 1fr))` : undefined;
      lgCols = `repeat(${cols}, minmax(0, 1fr))`;
    } else {
      baseCols = toColVal(cols) || 'repeat(1, minmax(0, 1fr))';
    }

    const baseGap = isResponsiveGap ? toGapVal(gap.base) || '16px' : toGapVal(gap) || '16px';
    const smGap = isResponsiveGap ? toGapVal(gap.sm) : undefined;
    const mdGap = isResponsiveGap ? toGapVal(gap.md) : undefined;
    const lgGap = isResponsiveGap ? toGapVal(gap.lg) : undefined;

    const responsiveCSS = `
      .${gridClassId} {
        display: grid;
        grid-template-columns: ${baseCols};
        gap: ${baseGap};
      }
      ${smCols || smGap ? `@media (min-width: 640px) { .${gridClassId} { ${smCols ? `grid-template-columns: ${smCols};` : ''} ${smGap ? `gap: ${smGap};` : ''} } }` : ''}
      ${mdCols || mdGap ? `@media (min-width: 768px) { .${gridClassId} { ${mdCols ? `grid-template-columns: ${mdCols};` : ''} ${mdGap ? `gap: ${mdGap};` : ''} } }` : ''}
      ${lgCols || lgGap ? `@media (min-width: 1024px) { .${gridClassId} { ${lgCols ? `grid-template-columns: ${lgCols};` : ''} ${lgGap ? `gap: ${lgGap};` : ''} } }` : ''}
      ${xlCols ? `@media (min-width: 1280px) { .${gridClassId} { grid-template-columns: ${xlCols}; } }` : ''}
    `;

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />
        <div
          ref={ref}
          className={`boost-grid ${gridClassId} ${className}`}
          style={{
            width: '100%',
            boxSizing: 'border-box',
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
      </>
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
