import * as React from 'react';
import { TableColumn } from './Table';
import { Pagination } from './Pagination';
import { SearchInput } from './SearchInput';

export type DataTableColumn<T = any> = TableColumn<T>;

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 5,
  searchable = false,
  searchPlaceholder = 'Search records...',
  searchFilter,
  className = '',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredData = React.useMemo(() => {
    if (!searchable || !searchQuery) return data;
    if (searchFilter) {
      return data.filter((item) => searchFilter(item, searchQuery));
    }
    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(q)
      )
    );
  }, [data, searchQuery, searchFilter, searchable]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={`boost-data-table ${className}`} style={{ fontFamily: 'inherit', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {searchable && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ maxWidth: '300px', width: '100%' }}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => setSearchQuery('')}
            placeholder={searchPlaceholder}
          />
        </div>

        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Showing {paginatedData.length} of {filteredData.length} records
        </span>
      </div>
      )}

      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: 'var(--boost-radius, 12px)',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04))',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', color: 'var(--boost-text, #334155)', minWidth: '480px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--boost-bg, #f8fafc)', borderBottom: '1px solid var(--boost-border, #e2e8f0)' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '13px 16px', fontWeight: 700, color: 'var(--boost-text, #0f172a)', textAlign: col.align || 'left', width: col.width, whiteSpace: 'nowrap' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '36px', textAlign: 'center', color: 'var(--boost-text-muted, #94a3b8)' }}>
                  No records matching your search
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: rIdx === paginatedData.length - 1 ? 'none' : '1px solid var(--boost-border, #f1f5f9)', transition: 'background-color 0.1s ease' }}>
                  {columns.map((col, cIdx) => {
                    const accessor = col.accessor;
                    const content = typeof accessor === 'function'
                      ? accessor(row)
                      : accessor !== undefined
                        ? row[accessor]
                        : '';
                    return (
                      <td key={cIdx} style={{ padding: '13px 16px', textAlign: col.align || 'left' }}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}


DataTable.displayName = 'DataTable';
