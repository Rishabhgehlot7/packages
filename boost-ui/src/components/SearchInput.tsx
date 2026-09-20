import * as React from 'react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  onSearch?: (query: string) => void;
  fullWidth?: boolean;
}

export const SearchInput = /* @__PURE__ */ React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      onSearch,
      onKeyDown,
      fullWidth = true,
      className = '',
      style,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(String(e.currentTarget.value || ''));
      }
      onKeyDown?.(e);
    };

    return (
      <div
        className={`boost-search-input-wrapper ${className}`}
        style={{
          position: 'relative',
          display: fullWidth ? 'flex' : 'inline-flex',
          alignItems: 'center',
          width: fullWidth ? '100%' : 'auto',
          fontFamily: 'inherit',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: '12px',
            display: 'inline-flex',
            color: 'var(--boost-text-muted, #64748b)',
            pointerEvents: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            paddingTop: '9px',
            paddingBottom: '9px',
            paddingLeft: '36px',
            paddingRight: value && onClear ? '36px' : '14px',
            fontSize: '14px',
            color: 'var(--boost-text, #0f172a)',
            backgroundColor: 'var(--boost-surface, #ffffff)',
            border: '1px solid var(--boost-border, #cbd5e1)',
            borderRadius: '8px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            ...style,
          }}
          {...props}
        />

        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: 'var(--boost-text-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

