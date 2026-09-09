import * as React from 'react';

export interface VariantOption {
  id: string;
  name: string; // e.g. "Size", "Color", "Storage"
  value: string; // e.g. "M", "Midnight Black", "256GB"
  colorHex?: string; // Optional hex for color swatch e.g. "#111827"
  priceDelta?: number; // Optional e.g. +500
  inStock?: boolean;
}

export interface VariantGroup {
  name: string; // e.g. "Select Size"
  type?: 'color' | 'chip' | 'dropdown';
  options: VariantOption[];
}

export type SelectedVariants = Record<string, string>;

export interface VariantSelectorProps {
  groups: VariantGroup[];
  selectedValues: SelectedVariants; // { "Select Size": "M", "Select Color": "Black" }
  onChange: (groupName: string, optionValue: string, option: VariantOption) => void;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  groups,
  selectedValues,
  onChange,
  className = '',
}) => {
  return (
    <div className={`boost-variant-selector ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit' }}>
      {groups.map((group) => {
        const selected = selectedValues[group.name];
        const isColor = group.type === 'color';

        return (
          <div key={group.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#111827', letterSpacing: '0.05em' }}>
                {group.name}: <span style={{ fontWeight: 500, color: '#4b5563', textTransform: 'none' }}>{selected || 'None selected'}</span>
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {group.options.map((opt) => {
                const isSelected = selected === opt.value;
                const isOutOfStock = opt.inStock === false;

                if (isColor && opt.colorHex) {
                  // Color Swatch Circle
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => onChange(group.name, opt.value, opt)}
                      title={`${opt.value}${isOutOfStock ? ' (Sold Out)' : ''}`}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '999px',
                        backgroundColor: opt.colorHex,
                        border: isSelected ? '3px solid #000000' : '2px solid #e5e7eb',
                        outline: isSelected ? '2px solid #ffffff' : 'none',
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        opacity: isOutOfStock ? 0.35 : 1,
                        position: 'relative',
                        transition: 'transform 0.15s ease',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        padding: 0,
                      }}
                    >
                      {isOutOfStock && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '0',
                            right: '0',
                            height: '2px',
                            backgroundColor: '#ef4444',
                            transform: 'rotate(-45deg)',
                          }}
                        />
                      )}
                    </button>
                  );
                }

                // Standard Chip / Pill
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onChange(group.name, opt.value, opt)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 800 : 600,
                      border: isSelected ? '2px solid #000000' : '1px solid #d1d5db',
                      backgroundColor: isSelected ? '#000000' : '#ffffff',
                      color: isSelected ? '#ffffff' : isOutOfStock ? '#9ca3af' : '#111827',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      textDecoration: isOutOfStock ? 'line-through' : 'none',
                      opacity: isOutOfStock ? 0.45 : 1,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{opt.value}</span>
                    {opt.priceDelta && opt.priceDelta > 0 && (
                      <span style={{ fontSize: '11px', marginLeft: '4px', opacity: 0.8 }}>
                        (+₹{opt.priceDelta})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
