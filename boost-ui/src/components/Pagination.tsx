import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const getBtnBaseStyles = (isCurrent: boolean, disabled?: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '34px', height: '34px', fontSize: '13px', fontFamily: 'inherit',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.35 : 1,
      transition: 'all 0.15s ease',
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, border: isCurrent ? '3px solid #000' : '2px solid #000', borderRadius: '2px', backgroundColor: isCurrent ? '#fbbf24' : '#ffffff', color: '#000', fontWeight: isCurrent ? 800 : 500, boxShadow: isCurrent ? '3px 3px 0px #000' : '2px 2px 0px #000' };
      case 'glassmorphism':
        return { ...base, border: isCurrent ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', backgroundColor: isCurrent ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: isCurrent ? '#6366f1' : 'var(--boost-text,#0f172a)', fontWeight: isCurrent ? 700 : 500 };
      case 'neumorphism':
        return { ...base, border: 'none', borderRadius: '9999px', backgroundColor: '#e0e5ec', color: isCurrent ? 'var(--boost-primary,#2563eb)' : '#64748b', fontWeight: isCurrent ? 700 : 500, boxShadow: isCurrent ? 'inset 3px 3px 7px #c8cdd5, inset -3px -3px 7px #f8fdff' : '3px 3px 7px #c8cdd5, -3px -3px 7px #f8fdff' };
      case 'gradient-glow':
        return { ...base, border: isCurrent ? 'none' : '1px solid var(--boost-border,#e2e8f0)', borderRadius: '8px', background: isCurrent ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--boost-surface,#ffffff)', color: isCurrent ? '#ffffff' : 'var(--boost-text,#334155)', fontWeight: isCurrent ? 700 : 500, boxShadow: isCurrent ? '0 0 14px rgba(99,102,241,0.4)' : 'none' };
      case 'material-you':
        return { ...base, border: 'none', borderRadius: '9999px', backgroundColor: isCurrent ? 'var(--boost-primary,#6750a4)' : 'transparent', color: isCurrent ? '#ffffff' : 'var(--boost-text,#1c1b1f)', fontWeight: isCurrent ? 700 : 500 };
      case 'dark-first':
        return { ...base, border: isCurrent ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backgroundColor: isCurrent ? '#1e3a5f' : '#0f172a', color: isCurrent ? '#60a5fa' : '#94a3b8', fontWeight: isCurrent ? 700 : 500 };
      default:
        return { ...base, border: isCurrent ? '1px solid var(--boost-primary,#2563eb)' : '1px solid var(--boost-border,#cbd5e1)', borderRadius: 'var(--boost-radius,8px)', backgroundColor: isCurrent ? 'var(--boost-primary,#2563eb)' : 'var(--boost-surface,#ffffff)', color: isCurrent ? '#ffffff' : 'var(--boost-text,#334155)', fontWeight: isCurrent ? 700 : 500 };
    }
  };

  const getNavBtnStyles = (disabled: boolean): React.CSSProperties => ({
    ...getBtnBaseStyles(false, disabled),
  });

  return (
    <nav
      aria-label="Pagination"
      className={`boost-pagination boost-pagination-preset-${preset} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: preset === 'neumorphism' ? '8px' : '6px', fontFamily: 'inherit', flexWrap: 'wrap', ...style }}
    >
      <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Previous page" style={getNavBtnStyles(currentPage === 1)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
      </button>

      {getPages().map((page, idx) => {
        if (typeof page === 'string') {
          return (
            <span key={idx} style={{ width: '30px', height: '34px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: preset === 'dark-first' ? '#64748b' : 'var(--boost-text-muted,#94a3b8)', fontSize: '13px' }}>
              ...
            </span>
          );
        }
        const isCurrent = page === currentPage;
        return (
          <button key={idx} type="button" onClick={() => onPageChange(page)} aria-current={isCurrent ? 'page' : undefined} className={`boost-pagination-btn ${isCurrent ? 'active' : ''}`} style={getBtnBaseStyles(isCurrent)}>
            {page}
          </button>
        );
      })}

      <button type="button" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Next page" style={getNavBtnStyles(currentPage === totalPages)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
