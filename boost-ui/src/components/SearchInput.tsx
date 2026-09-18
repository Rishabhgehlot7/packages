import * as React from 'react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  fullWidth?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, fullWidth = true, className = '', style, placeholder = 'Search...', ...props }, ref) => {
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
            color: '#64748b',
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
          placeholder={placeholder}
          style={{
            width: '100%',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '36px',
            paddingRight: value && onClear ? '36px' : '12px',
            fontSize: '14px',
            color: '#0f172a',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            outline: 'none',
            boxSizing: 'border-box',
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
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '2px',
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
