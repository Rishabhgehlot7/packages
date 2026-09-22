import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';


/**
 * VariantOption — A single selectable variant option.
 */
export interface VariantOption {
  id: string;
  name?: string; // e.g. "Size", "Color", "Storage"
  value?: string; // e.g. "M", "Midnight Black", "256GB"
  label?: string; // e.g. "S", "M", "L"
  colorHex?: string; // Optional hex for color swatch e.g. "#111827"
  priceDelta?: number; // Optional e.g. +500
  inStock?: boolean;
}


/**
 * VariantGroup — A group of related variant options (e.g., all sizes).
 */
export interface VariantGroup {
  name: string; // e.g. "Select Size"
  type?: 'color' | 'chip' | 'dropdown';
  options: VariantOption[];
}

export type SelectedVariants = Record<string, string>;


/**
 * VariantSelectorProps — Properties for the product variant picker (size, color, etc.).
 */
export interface VariantSelectorProps {
  groups?: VariantGroup[];
  selectedValues?: SelectedVariants; // { "Select Size": "M", "Select Color": "Black" }
  selectedVariants?: SelectedVariants;
  currencySymbol?: string;
  onChange?: (groupName: string, optionValue: string, option?: VariantOption) => void;
  stylePreset?: UIStylePreset;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  groups = [],
  selectedValues,
  currencySymbol = '$',
  onChange,
  stylePreset: stylePresetProp,
  className = '',
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const values = selectedValues || (props as any).selectedVariants || {};

  const getChipStyles = (isSelected: boolean, isOutOfStock: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
      textDecoration: isOutOfStock ? 'line-through' : 'none',
      opacity: isOutOfStock ? 0.45 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          border: '2px solid #000000',
          backgroundColor: isSelected ? '#fbbf24' : '#ffffff',
          color: '#000000',
          boxShadow: isSelected ? '3px 3px 0px #000000' : '2px 2px 0px #000000',
          fontWeight: isSelected ? 800 : 700,
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '12px',
          border: isSelected ? '1px solid rgba(99, 102, 241, 0.6)' : '1px solid rgba(255, 255, 255, 0.4)',
          backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: isSelected ? '#4f46e5' : 'var(--boost-text-primary, #0f172a)',
          boxShadow: isSelected ? '0 4px 14px rgba(99, 102, 241, 0.25)' : 'none',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '10px',
          border: 'none',
          backgroundColor: '#e0e5ec',
          color: isSelected ? 'var(--boost-primary, #2563eb)' : '#334155',
          boxShadow: isSelected ? 'inset 3px 3px 6px #c8cdd5, inset -3px -3px 6px #f8fdff' : '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
          fontWeight: isSelected ? 700 : 600,
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '10px',
          border: isSelected ? '1px solid #6366f1' : '1px solid rgba(99, 102, 241, 0.2)',
          background: isSelected ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'var(--boost-surface, #ffffff)',
          color: isSelected ? '#ffffff' : 'var(--boost-text-primary, #0f172a)',
          boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.5)' : 'none',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '9999px',
          border: isSelected ? 'none' : '1px solid var(--boost-border, #e2e8f0)',
          backgroundColor: isSelected ? 'var(--boost-surface-secondary, #e8def8)' : 'transparent',
          color: isSelected ? 'var(--boost-primary, #6750a4)' : 'var(--boost-text-primary, #49454f)',
          fontWeight: isSelected ? 700 : 600,
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '10px',
          border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: isSelected ? '#2563eb' : '#1e293b',
          color: '#ffffff',
          boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none',
        };
      default:
        return {
          ...base,
          borderRadius: '10px',
          border: isSelected ? '1px solid #4f46e5' : '1px solid var(--boost-border, #e2e8f0)',
          background: isSelected ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'var(--boost-surface, #ffffff)',
          color: isSelected ? '#ffffff' : 'var(--boost-text-primary, #0f172a)',
          boxShadow: isSelected ? '0 4px 14px rgba(79, 70, 229, 0.3)' : 'none',
        };
    }
  };

  return (
    <div className={`boost-variant-selector ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
      <style>{`
        .boost-variant-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--boost-text-primary, #0f172a);
          letter-spacing: 0.05em;
        }
        :root[data-theme="dark"] .boost-variant-label,
        .dark .boost-variant-label {
          color: #f8fafc !important;
        }
        .boost-variant-selected-val {
          font-weight: 600;
          color: var(--boost-primary, #6366f1);
          text-transform: none;
          margin-left: 4px;
        }
        .boost-variant-chip {
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid var(--boost-border, #e2e8f0);
          background: var(--boost-surface, #ffffff);
          color: var(--boost-text-primary, #0f172a);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .boost-variant-chip:hover:not(:disabled) {
          border-color: var(--boost-primary, #6366f1);
          transform: translateY(-1px);
        }
        .boost-variant-chip.selected {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          border-color: #4f46e5;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
        }
        :root[data-theme="dark"] .boost-variant-chip,
        .dark .boost-variant-chip {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f1f5f9 !important;
        }
        :root[data-theme="dark"] .boost-variant-chip:hover:not(:disabled),
        .dark .boost-variant-chip:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
        }
        :root[data-theme="dark"] .boost-variant-chip.selected,
        .dark .boost-variant-chip.selected {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
          border-color: #6366f1 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45) !important;
        }
        .boost-color-swatch {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          cursor: pointer;
          position: relative;
          padding: 0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(0, 0, 0, 0.12);
        }
        .boost-color-swatch:hover:not(:disabled) {
          transform: scale(1.1);
        }
        .boost-color-swatch.selected {
          transform: scale(1.15);
          box-shadow: 0 0 0 2px var(--boost-surface, #ffffff), 0 0 0 4px #6366f1;
        }
        :root[data-theme="dark"] .boost-color-swatch,
        .dark .boost-color-swatch {
          border-color: rgba(255, 255, 255, 0.2);
        }
        :root[data-theme="dark"] .boost-color-swatch.selected,
        .dark .boost-color-swatch.selected {
          box-shadow: 0 0 0 2px #0f172a, 0 0 0 4px #818cf8;
        }
      `}</style>

      {groups.map((group) => {
        const selected = values[group.name];
        const isColor = group.type === 'color';

        return (
          <div key={group.name} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="boost-variant-label">
                {group.name}:
                <span className="boost-variant-selected-val">
                  {selected || 'Select option'}
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {group.options.map((opt) => {
                const optVal = opt.value || opt.label || opt.name || opt.id || '';
                const optDisplay = opt.label || opt.value || opt.name || opt.id;
                const isSelected = selected === optVal || selected === opt.id;
                const isOutOfStock = opt.inStock === false;

                if (isColor && opt.colorHex) {
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => onChange && onChange(group.name, optVal, opt)}
                      title={`${optDisplay}${isOutOfStock ? ' (Sold Out)' : ''}`}
                      className={`boost-color-swatch ${isSelected ? 'selected' : ''}`}
                      style={{
                        backgroundColor: opt.colorHex,
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        opacity: isOutOfStock ? 0.35 : 1,
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

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onChange && onChange(group.name, optVal, opt)}
                    className={`boost-variant-chip boost-variant-chip-preset-${preset} ${isSelected ? 'selected' : ''}`}
                    style={getChipStyles(isSelected, isOutOfStock)}
                  >
                    <span>{optDisplay}</span>
                    {opt.priceDelta && opt.priceDelta > 0 && (
                      <span style={{ fontSize: '11px', marginLeft: '5px', opacity: 0.85 }}>
                        (+{currencySymbol}{opt.priceDelta})
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

VariantSelector.displayName = 'VariantSelector';
