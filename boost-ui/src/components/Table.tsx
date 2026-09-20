import * as React from 'react';

export interface TableColumn<T = any> {
  header: string;
  key?: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

export interface TableProps<T = any> {
  columns?: TableColumn<T>[];
  data?: T[];
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  className?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function Table<T extends Record<string, any>>({
  columns = [],
  data = [],
  striped = false,
  bordered = true,
  hoverable = true,
  className = '',
  keyExtractor = (_, idx) => idx,
}: TableProps<T>) {
  return (
    <div
      className={`boost-table-wrapper ${className}`}
      style={{
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        border: bordered ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
        borderRadius: 'var(--boost-radius, 12px)',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.03))',
        fontFamily: 'inherit',
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-table-wrapper,
          .dark .boost-table-wrapper {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper thead tr,
          .dark .boost-table-wrapper thead tr {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper th,
          .dark .boost-table-wrapper th {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper td,
          .dark .boost-table-wrapper td {
            color: #cbd5e1 !important;
            border-bottom-color: rgba(255, 255, 255, 0.06) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper tr.boost-table-row:hover,
          .dark .boost-table-wrapper tr.boost-table-row:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper tr.boost-table-striped,
          .dark .boost-table-wrapper tr.boost-table-striped {
            background-color: rgba(255, 255, 255, 0.02) !important;
          }
        `}
      </style>
      <table
        style={{
          width: '100%',
          minWidth: '480px',
          borderCollapse: 'collapse',
          fontSize: '13px',
          textAlign: 'left',
          color: 'var(--boost-text, #334155)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: 'var(--boost-bg-subtle, #f8fafc)', borderBottom: '1px solid var(--boost-border, #e2e8f0)' }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: '13px 16px',
                  fontWeight: 600,
                  color: 'var(--boost-text, #0f172a)',
                  textAlign: col.align || 'left',
                  width: col.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '36px',
                  textAlign: 'center',
                  color: 'var(--boost-muted, #94a3b8)',
                }}
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => {
              const isEven = rIdx % 2 === 0;
              const isStriped = striped && !isEven;
              return (
                <tr
                  key={keyExtractor(row, rIdx)}
                  className={`boost-table-row ${isStriped ? 'boost-table-striped' : ''}`}
                  style={{
                    backgroundColor: isStriped ? '#f8fafc' : 'transparent',
                    borderBottom: rIdx === data.length - 1 ? 'none' : '1px solid var(--boost-border, #f1f5f9)',
                    transition: hoverable ? 'background-color 0.15s ease' : 'none',
                  }}
                >
                  {columns.map((col, cIdx) => {
                    const colKey = col.accessor || col.key;
                    const content =
                      typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : colKey
                        ? (row as any)[colKey]
                        : null;

                    return (
                      <td
                        key={cIdx}
                        style={{
                          padding: '13px 16px',
                          textAlign: col.align || 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}


Table.displayName = 'Table';
