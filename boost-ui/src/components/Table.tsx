import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';


/**
 * TableColumn — Defines a single column in the Table component.
 */
export interface TableColumn<T = any> {
  header: string;
  key?: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}


/**
 * TableProps — Properties for the data table component.
 */
export interface TableProps<T = any> {
  columns?: TableColumn<T>[];
  data?: T[];
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  stylePreset?: UIStylePreset;
  className?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function Table<T extends Record<string, any>>({
  columns = [],
  data = [],
  striped = false,
  bordered = true,
  hoverable = true,
  stylePreset: stylePresetProp,
  className = '',
  keyExtractor = (_, idx) => idx,
}: TableProps<T>) {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const getTableWrapperStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      fontFamily: 'inherit',
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          border: bordered ? '3px solid #000' : 'none',
          borderRadius: '2px',
          backgroundColor: '#ffffff',
          boxShadow: '5px 5px 0px #000',
        };
      case 'glassmorphism':
        return {
          ...base,
          border: bordered ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        };
      case 'neumorphism':
        return {
          ...base,
          border: 'none',
          borderRadius: '16px',
          backgroundColor: '#e0e5ec',
          boxShadow: '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff',
        };
      case 'gradient-glow':
        return {
          ...base,
          border: bordered ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
          borderRadius: '12px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.08)',
        };
      case 'material-you':
        return {
          ...base,
          border: bordered ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
          borderRadius: '24px',
          backgroundColor: 'var(--boost-surface, #fffbfe)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        };
      case 'dark-first':
        return {
          ...base,
          border: bordered ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          borderRadius: '12px',
          backgroundColor: 'var(--boost-surface, #0f172a)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        };
      default:
        return {
          ...base,
          border: bordered ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
          borderRadius: 'var(--boost-radius, 12px)',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.03))',
        };
    }
  };

  const getHeaderRowStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return { backgroundColor: '#fef08a', borderBottom: '3px solid #000' };
      case 'glassmorphism':
        return { backgroundColor: 'rgba(255, 255, 255, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.3)' };
      case 'neumorphism':
        return { backgroundColor: '#e0e5ec', borderBottom: '1px solid #d1d9e6' };
      case 'gradient-glow':
        return { backgroundColor: 'rgba(99, 102, 241, 0.05)', borderBottom: '1px solid rgba(99, 102, 241, 0.15)' };
      case 'material-you':
        return { backgroundColor: 'var(--boost-surface-secondary, #f3edf7)', borderBottom: '1px solid var(--boost-border, #e2e8f0)' };
      case 'dark-first':
        return { backgroundColor: '#1e293b', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' };
      default:
        return { backgroundColor: 'var(--boost-bg-subtle, #f8fafc)', borderBottom: '1px solid var(--boost-border, #e2e8f0)' };
    }
  };

  return (
    <div
      className={`boost-table-wrapper boost-table-wrapper-preset-${preset} ${className}`}
      style={getTableWrapperStyles()}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-table-wrapper-preset-${preset},
          .dark .boost-table-wrapper-preset-${preset} {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper-preset-${preset} thead tr,
          .dark .boost-table-wrapper-preset-${preset} thead tr {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper-preset-${preset} th,
          .dark .boost-table-wrapper-preset-${preset} th {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper-preset-${preset} td,
          .dark .boost-table-wrapper-preset-${preset} td {
            color: #cbd5e1 !important;
            border-bottom-color: rgba(255, 255, 255, 0.06) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper-preset-${preset} tr.boost-table-row:hover,
          .dark .boost-table-wrapper-preset-${preset} tr.boost-table-row:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper-preset-${preset} tr.boost-table-striped,
          .dark .boost-table-wrapper-preset-${preset} tr.boost-table-striped {
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
          <tr style={getHeaderRowStyles()}>
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
