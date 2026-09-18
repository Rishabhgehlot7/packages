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

      <div style={{ width: '100%', overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', color: '#334155' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a', textAlign: col.align || 'left', width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No records matching your search
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: rIdx === paginatedData.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  {columns.map((col, cIdx) => {
                    const accessor = col.accessor;
                    const content = typeof accessor === 'function'
                      ? accessor(row)
                      : accessor !== undefined
                        ? row[accessor]
                        : '';
                    return (
                      <td key={cIdx} style={{ padding: '12px 16px', textAlign: col.align || 'left' }}>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
