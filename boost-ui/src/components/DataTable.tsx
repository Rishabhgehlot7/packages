import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';
import { TableColumn } from './Table';
import { Pagination } from './Pagination';
import { SearchInput } from './SearchInput';

export type DataTableColumn<T = any> = Omit<TableColumn<T>, 'header'> & {
  header?: string;
  title?: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
};

export interface DataTableProps<T = any> {
  columns?: DataTableColumn<T>[];
  data?: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selected: T[]) => void;
  stickyHeader?: boolean;
  maxHeight?: string | number;
  exportable?: boolean;
  exportFilename?: string;
  manualPagination?: boolean;
  totalCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export function DataTable<T extends Record<string, any>>({
  columns = [],
  data = [],
  pageSize = 10,
  searchable = false,
  searchPlaceholder = 'Search records...',
  searchFilter,
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  stickyHeader = false,
  maxHeight,
  exportable = false,
  exportFilename = 'export.csv',
  manualPagination = false,
  totalCount,
  page: controlledPage,
  onPageChange,
  stylePreset: stylePresetProp,
  className = '',
  style,
}: DataTableProps<T>) {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [internalPage, setInternalPage] = React.useState(1);
  const [internalSelectedRows, setInternalSelectedRows] = React.useState<T[]>([]);
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const currentPage = controlledPage !== undefined ? controlledPage : internalPage;
  const selectedRows = controlledSelectedRows !== undefined ? controlledSelectedRows : internalSelectedRows;

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
    if (controlledPage === undefined) {
      setInternalPage(newPage);
    }
  };

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  // Search & Sorting filtering
  const processedData = React.useMemo(() => {
    let list = [...(data || [])];

    if (searchable && searchQuery) {
      if (searchFilter) {
        list = list.filter((item) => searchFilter(item, searchQuery));
      } else {
        const q = searchQuery.toLowerCase();
        list = list.filter((item) =>
          Object.values(item).some(
            (val) => val && String(val).toLowerCase().includes(q)
          )
        );
      }
    }

    if (sortColumn) {
      list.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return list;
  }, [data, searchQuery, searchFilter, searchable, sortColumn, sortDirection]);

  const totalRecords = manualPagination && totalCount !== undefined ? totalCount : processedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const paginatedData = manualPagination
    ? processedData
    : processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Selection handlers
  const isRowSelected = (row: T) => selectedRows.includes(row);

  const toggleRow = (row: T) => {
    let next: T[];
    if (isRowSelected(row)) {
      next = selectedRows.filter((r) => r !== row);
    } else {
      next = [...selectedRows, row];
    }
    setInternalSelectedRows(next);
    onSelectionChange?.(next);
  };

  const toggleAll = () => {
    let next: T[];
    if (selectedRows.length === paginatedData.length && paginatedData.length > 0) {
      next = [];
    } else {
      next = [...paginatedData];
    }
    setInternalSelectedRows(next);
    onSelectionChange?.(next);
  };

  const handleExportCSV = () => {
    if (!processedData.length) return;
    const headerRow = columns
      .map((c) => {
        const colTitle = c.title || c.header || (typeof (c as any).key === 'string' ? (c as any).key : '');
        return `"${String(colTitle).replace(/"/g, '""')}"`;
      })
      .join(',');
    const rows = processedData.map((row) =>
      columns
        .map((col) => {
          const colKey = (col as any).key;
          const accessor = col.accessor !== undefined ? col.accessor : colKey;
          let val: any = '';
          if (typeof accessor === 'function') {
            val = accessor(row);
          } else if (accessor !== undefined && row[accessor] !== undefined) {
            val = row[accessor];
          } else if (colKey && row[colKey] !== undefined) {
            val = row[colKey];
          }
          if (typeof val === 'object' && val !== null && !React.isValidElement(val)) {
            val = JSON.stringify(val);
          } else if (React.isValidElement(val)) {
            val = colKey ? String(row[colKey] ?? '') : '';
          }
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length;

  const getTableCardStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      overflowX: 'auto',
      maxHeight: maxHeight || undefined,
      overflowY: maxHeight ? 'auto' : undefined,
      WebkitOverflowScrolling: 'touch',
      position: 'relative',
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          border: '3px solid var(--boost-border, #000000)',
          borderRadius: '2px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          boxShadow: '5px 5px 0px var(--boost-border, #000000)',
        };
      case 'glassmorphism':
        return {
          ...base,
          border: '1px solid var(--boost-glass-border, rgba(255, 255, 255, 0.4))',
          borderRadius: '16px',
          backgroundColor: 'var(--boost-glass-bg, rgba(255, 255, 255, 0.75))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.07)',
        };
      case 'neumorphism':
        return {
          ...base,
          border: 'none',
          borderRadius: '16px',
          backgroundColor: 'var(--boost-surface, #e0e5ec)',
          boxShadow: 'var(--card-shadow, 6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff)',
        };
      case 'gradient-glow':
        return {
          ...base,
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.08)',
        };
      case 'material-you':
        return {
          ...base,
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '24px',
          backgroundColor: 'var(--boost-surface, #fffbfe)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        };
      case 'dark-first':
        return {
          ...base,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          backgroundColor: '#0f172a',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        };
      default:
        return {
          ...base,
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: 'var(--boost-radius, 12px)',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04))',
        };
    }
  };

  const getHeaderRowStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: stickyHeader ? 'sticky' : undefined,
      top: stickyHeader ? 0 : undefined,
      zIndex: stickyHeader ? 2 : undefined,
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, backgroundColor: '#fef08a', borderBottom: '3px solid #000' };
      case 'glassmorphism':
        return { ...base, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.3)' };
      case 'neumorphism':
        return { ...base, backgroundColor: '#e0e5ec', borderBottom: '1px solid #d1d9e6' };
      case 'gradient-glow':
        return { ...base, backgroundColor: 'rgba(99, 102, 241, 0.05)', borderBottom: '1px solid rgba(99, 102, 241, 0.15)' };
      case 'material-you':
        return { ...base, backgroundColor: 'var(--boost-surface-secondary, #f3edf7)', borderBottom: '1px solid var(--boost-border, #e2e8f0)' };
      case 'dark-first':
        return { ...base, backgroundColor: '#1e293b', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' };
      default:
        return { ...base, backgroundColor: 'var(--boost-bg, #f8fafc)', borderBottom: '1px solid var(--boost-border, #e2e8f0)' };
    }
  };

  const getExportBtnStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.15s ease',
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '2px solid #000000',
          borderRadius: '2px',
          boxShadow: '2px 2px 0px #000000',
          fontWeight: 700,
        };
      case 'glassmorphism':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: 'var(--boost-text, #0f172a)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '8px',
        };
      case 'neumorphism':
        return {
          ...base,
          backgroundColor: '#e0e5ec',
          color: 'var(--boost-text, #0f172a)',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--boost-surface-secondary, #f1f5f9)',
          color: 'var(--boost-text, #0f172a)',
          border: '1px solid var(--boost-border, #cbd5e1)',
          borderRadius: '8px',
        };
    }
  };

  return (
    <div
      className={`boost-data-table boost-data-table-preset-${preset} ${className}`}
      style={{
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-data-table-preset-${preset} .boost-data-table-card,
          .dark .boost-data-table-preset-${preset} .boost-data-table-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-data-table-preset-${preset} thead tr,
          .dark .boost-data-table-preset-${preset} thead tr {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-data-table-preset-${preset} th,
          .dark .boost-data-table-preset-${preset} th {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-data-table-preset-${preset} td,
          .dark .boost-data-table-preset-${preset} td {
            color: #cbd5e1 !important;
            border-bottom-color: rgba(255, 255, 255, 0.06) !important;
          }
          :root[data-theme="dark"] .boost-data-table-preset-${preset} tbody tr:hover,
          .dark .boost-data-table-preset-${preset} tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
          }
          .boost-table-sort-btn {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            color: inherit;
            font: inherit;
            font-weight: inherit;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
        `}
      </style>

      {/* Toolbar: Search, Selection count, Export */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {searchable ? (
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (controlledPage === undefined) setInternalPage(1);
              }}
              onClear={() => setSearchQuery('')}
              placeholder={searchPlaceholder}
            />
          </div>
        ) : <div />}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--boost-muted, #64748b)' }}>
          {selectable && selectedRows.length > 0 && (
            <span style={{ fontWeight: 600, color: 'var(--boost-primary, #2563eb)' }}>
              {selectedRows.length} selected
            </span>
          )}
          <span>
            Showing {paginatedData.length} of {totalRecords} records
          </span>
          {exportable && (
            <button
              type="button"
              onClick={handleExportCSV}
              style={getExportBtnStyles()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div
        className="boost-data-table-card"
        style={getTableCardStyles()}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', color: 'var(--boost-text, #334155)', minWidth: '480px' }}>
          <thead>
            <tr
              style={getHeaderRowStyles()}
            >
              {selectable && (
                <th style={{ width: '40px', padding: '13px 16px' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--boost-primary, #2563eb)' }}
                  />
                </th>
              )}
              {columns.map((col, idx) => {
                const colKey = String((col as any).key || col.accessor || idx);
                const isSorted = sortColumn === colKey;
                const colTitle = col.title || col.header || (typeof (col as any).key === 'string' ? (col as any).key : '');
                return (
                  <th
                    key={idx}
                    style={{
                      padding: '13px 16px',
                      fontWeight: 700,
                      color: 'var(--boost-text, #0f172a)',
                      textAlign: col.align || 'left',
                      width: col.width,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(colKey)}
                        className="boost-table-sort-btn"
                      >
                        <span>{colTitle}</span>
                        <span style={{ fontSize: '11px', opacity: isSorted ? 1 : 0.4 }}>
                          {isSorted ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                        </span>
                      </button>
                    ) : (
                      colTitle
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: '36px', textAlign: 'center', color: 'var(--boost-text-muted, #94a3b8)' }}>
                  No records matching your search
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => {
                const selected = isRowSelected(row);
                return (
                  <tr
                    key={rIdx}
                    style={{
                      borderBottom: rIdx === paginatedData.length - 1 ? 'none' : '1px solid var(--boost-border, #f1f5f9)',
                      backgroundColor: selected ? 'rgba(37, 99, 235, 0.05)' : undefined,
                      transition: 'background-color 0.1s ease',
                    }}
                  >
                    {selectable && (
                      <td style={{ width: '40px', padding: '13px 16px' }}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRow(row)}
                          aria-label={`Select row ${rIdx + 1}`}
                          style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--boost-primary, #2563eb)' }}
                        />
                      </td>
                    )}
                    {columns.map((col, cIdx) => {
                      const colKey = (col as any).key;
                      const accessor = col.accessor !== undefined ? col.accessor : colKey;
                      const rawValue = colKey !== undefined && row ? row[colKey] : undefined;
                      let content: React.ReactNode = '';
                      if (typeof col.render === 'function') {
                        content = col.render(rawValue, row);
                      } else if (typeof accessor === 'function') {
                        content = (accessor as Function)(row);
                      } else if (accessor !== undefined && row && row[accessor as string] !== undefined) {
                        content = row[accessor as string];
                      } else if (rawValue !== undefined) {
                        content = rawValue;
                      }
                      return (
                        <td key={cIdx} style={{ padding: '13px 16px', textAlign: col.align || 'left' }}>
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

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            stylePreset={preset}
          />
        </div>
      )}
    </div>
  );
}

DataTable.displayName = 'DataTable';
