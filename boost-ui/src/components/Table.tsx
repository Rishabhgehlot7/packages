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
  columns: TableColumn<T>[];
  data: T[];
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  className?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
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
        border: bordered ? '1px solid #e2e8f0' : 'none',
        borderRadius: '8px',
        fontFamily: 'inherit',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          textAlign: 'left',
          color: '#334155',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: '12px 16px',
                  fontWeight: 600,
                  color: '#0f172a',
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
                  padding: '32px',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => {
              const isEven = rIdx % 2 === 0;
              return (
                <tr
                  key={keyExtractor(row, rIdx)}
                  style={{
                    backgroundColor: striped && !isEven ? '#f8fafc' : '#ffffff',
                    borderBottom: rIdx === data.length - 1 ? 'none' : '1px solid #f1f5f9',
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
                          padding: '12px 16px',
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
