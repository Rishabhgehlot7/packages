import React, { useState, useEffect, useRef } from 'react';
import { PackageDoc } from '../types';
import { UI_COMPONENTS_DATA, UIComponentItem } from '../data/uiComponentsData';
import { Search, X, Layers, Component, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchResultItem {
  type: 'component' | 'preset' | 'guide' | 'template' | 'package';
  id: string;
  name: string;
  badge?: string;
  description: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: PackageDoc[];
  onSelectPackage: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  packages,
  onSelectPackage
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Combined searchable list (Packages + Components + Presets + Templates + Setup Guide)
  const allSearchableItems: SearchResultItem[] = [
    ...packages.map(pkg => ({
      type: (pkg.id === 'getting-started' || pkg.id === 'create-boost-app' ? 'guide' : 'package') as 'guide' | 'package',
      id: pkg.id,
      name: pkg.id === 'getting-started' ? 'BoostEngine Ecosystem Overview' : (pkg.id === 'create-boost-app' ? 'create-boost-app CLI Quickstart' : pkg.name),
      badge: pkg.categoryId.replace('-', ' ').toUpperCase(),
      description: pkg.useCase
    })),
    {
      type: 'guide' as const,
      id: 'docs',
      name: 'Boost UI Overview & Setup',
      badge: 'Getting Started',
      description: 'Installation via npm/pnpm/yarn, BoostProvider setup, tokens.json, and Tailwind integration'
    },
    {
      type: 'component' as const,
      id: 'PresetSwitcher',
      name: 'PresetSwitcher (7 Design Presets)',
      badge: 'Theme Engine',
      description: 'Runtime theme switcher supporting Minimal, Glassmorphism, Neumorphism, Neo-Brutalism, Dark First, Gradient Glow, Material You'
    },
    {
      type: 'template' as const,
      id: 'storefront',
      name: 'Storefront Template',
      badge: 'Template',
      description: 'Full D2C eCommerce storefront with hero banner, product grid, and cart drawer'
    },
    {
      type: 'template' as const,
      id: 'checkout',
      name: 'Checkout Template',
      badge: 'Template',
      description: 'Multi-step Indian D2C checkout with address form, coupon input, and UPI/COD switch'
    },
    ...UI_COMPONENTS_DATA.map(c => ({
      type: 'component' as const,
      id: c.id,
      name: c.name,
      badge: 'UI Component',
      description: c.description
    }))
  ];

  const filtered = query.trim() === ''
    ? allSearchableItems.slice(0, 8)
    : allSearchableItems.filter(item => {
        const q = query.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      });

  const handleSelect = (item: SearchResultItem) => {
    if (item.type === 'component') {
      window.location.hash = `ui/${item.id}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else if (item.type === 'template') {
      window.location.hash = `examples/${item.id}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else if (item.type === 'package') {
      window.location.hash = `docs/${item.id}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = 'docs';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-search-input-box">
          <Search size={20} style={{ color: 'var(--primary)' }} />
          <input
            ref={inputRef}
            type="text"
            className="modal-search-input"
            placeholder="Search 24 packages, 180+ UI components, 7 presets, templates..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="modal-results-list">
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              No items matching "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isComponent = item.type === 'component';

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`search-result-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: isComponent ? 'rgba(6, 182, 212, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isComponent ? 'var(--cyan)' : '#818cf8'
                    }}>
                      {isComponent ? <Component size={16} /> : <Layers size={16} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="item-badge" style={{
                            fontSize: '0.65rem',
                            background: isComponent ? 'rgba(6, 182, 212, 0.15)' : undefined,
                            color: isComponent ? 'var(--cyan)' : undefined
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        maxWidth: '420px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        margin: 0
                      }}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={14} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-dim)' }} />
                </div>
              );
            })
          )}
        </div>

        <div className="modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span><kbd className="kbd-shortcut">↑</kbd> <kbd className="kbd-shortcut">↓</kbd> to navigate</span>
            <span><kbd className="kbd-shortcut"><CornerDownLeft size={10} /></kbd> to select</span>
            <span><kbd className="kbd-shortcut">esc</kbd> to close</span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
};
