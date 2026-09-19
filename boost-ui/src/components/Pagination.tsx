import * as React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const getPages = () => {
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

  return (
    <nav
      aria-label="Pagination"
      className={`boost-pagination ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'inherit',
        flexWrap: 'wrap',
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-pagination-btn,
          .dark .boost-pagination-btn {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-pagination-btn:hover:not(:disabled),
          .dark .boost-pagination-btn:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-pagination-btn.active,
          .dark .boost-pagination-btn.active {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
            border-color: #6366f1 !important;
            color: #ffffff !important;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4) !important;
          }
          :root[data-theme="dark"] .boost-pagination-ellipsis,
          .dark .boost-pagination-ellipsis {
            color: #64748b !important;
          }
        `}
      </style>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="boost-pagination-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '34px',
          height: '34px',
          border: '1px solid var(--boost-border, #cbd5e1)',
          borderRadius: 'var(--boost-radius, 8px)',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          color: 'var(--boost-text, #334155)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.35 : 1,
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {getPages().map((page, idx) => {
        if (typeof page === 'string') {
          return (
            <span
              key={idx}
              className="boost-pagination-ellipsis"
              style={{
                width: '30px',
                height: '34px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--boost-muted, #94a3b8)',
                fontSize: '13px',
              }}
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? 'page' : undefined}
            className={`boost-pagination-btn ${isCurrent ? 'active' : ''}`}
            style={{
              width: '34px',
              height: '34px',
              border: isCurrent ? '1px solid var(--boost-primary, #2563eb)' : '1px solid var(--boost-border, #cbd5e1)',
              borderRadius: 'var(--boost-radius, 8px)',
              backgroundColor: isCurrent ? 'var(--boost-primary, #2563eb)' : 'var(--boost-surface, #ffffff)',
              color: isCurrent ? '#ffffff' : 'var(--boost-text, #334155)',
              fontSize: '13px',
              fontWeight: isCurrent ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="boost-pagination-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '34px',
          height: '34px',
          border: '1px solid var(--boost-border, #cbd5e1)',
          borderRadius: 'var(--boost-radius, 8px)',
          backgroundColor: 'var(--boost-surface, #ffffff)',
          color: 'var(--boost-text, #334155)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.35 : 1,
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
};


Pagination.displayName = 'Pagination';
