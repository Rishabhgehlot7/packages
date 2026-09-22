import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

/**
 * AccordionItem — A single expandable panel within an Accordion.
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

/**
 * AccordionProps — Properties for the Accordion component.
 *
 * @example
 * ```tsx
 * <Accordion items={[{ title: 'FAQ 1', content: 'Answer' }]} />
 * ```
 */
export interface AccordionProps {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  variant?: 'default' | 'bordered' | 'separated';
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const Accordion: React.FC<AccordionProps> = ({
  items = [],
  allowMultiple = false,
  defaultExpanded = [],
  variant = 'default',
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const [expanded, setExpanded] = React.useState<string[]>(defaultExpanded);

  const toggleItem = (id: string) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((item) => item !== id));
    } else {
      setExpanded(allowMultiple ? [...expanded, id] : [id]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    if (!(e.target instanceof HTMLButtonElement) || !e.target.classList.contains('boost-accordion-header')) return;
    const focusableItems = items.filter(i => !i.disabled);
    if (focusableItems.length === 0) return;
    const currentId = e.target.getAttribute('data-id');
    const currentIndex = focusableItems.findIndex(i => i.id === currentId);
    if (currentIndex === -1) return;
    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown') { e.preventDefault(); nextIndex = (currentIndex + 1) % focusableItems.length; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); nextIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length; }
    else if (e.key === 'Home') { e.preventDefault(); nextIndex = 0; }
    else if (e.key === 'End') { e.preventDefault(); nextIndex = focusableItems.length - 1; }
    if (nextIndex !== currentIndex) {
      const btn = document.getElementById(`boost-accordion-header-${focusableItems[nextIndex].id}`);
      if (btn) btn.focus();
    }
  };

  const isSeparated = variant === 'separated';

  const getWrapperStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: isSeparated ? '10px' : '0px',
      fontFamily: 'inherit',
      overflow: 'hidden',
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, border: isSeparated ? 'none' : '3px solid #000', borderRadius: '2px', boxShadow: isSeparated ? 'none' : '4px 4px 0px #000' };
      case 'glassmorphism':
        return { ...base, border: isSeparated ? 'none' : '1px solid rgba(255,255,255,0.3)', borderRadius: '14px', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };
      case 'neumorphism':
        return { ...base, border: 'none', borderRadius: '18px', boxShadow: isSeparated ? 'none' : '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff', backgroundColor: '#e0e5ec' };
      case 'gradient-glow':
        return { ...base, border: isSeparated ? 'none' : '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', boxShadow: '0 0 20px rgba(99,102,241,0.12)' };
      case 'material-you':
        return { ...base, border: isSeparated ? 'none' : '1px solid var(--boost-border, #e2e8f0)', borderRadius: '24px', overflow: 'hidden' };
      case 'dark-first':
        return { ...base, border: isSeparated ? 'none' : '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', backgroundColor: 'var(--boost-surface, #0f172a)' };
      default:
        return { ...base, border: isSeparated ? 'none' : '1px solid var(--boost-border, #e2e8f0)', borderRadius: 'var(--boost-radius, 12px)' };
    }
  };

  const getHeaderStyles = (isOpen: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px', border: 'none', textAlign: 'left', cursor: 'pointer',
      fontFamily: 'inherit', fontWeight: 600, fontSize: '14px', transition: 'background-color 0.18s ease',
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, backgroundColor: isOpen ? '#fbbf24' : '#ffffff', color: '#000', borderBottom: isOpen ? '2px solid #000' : 'none' };
      case 'glassmorphism':
        return { ...base, backgroundColor: isOpen ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.6)', color: 'var(--boost-text, #0f172a)' };
      case 'neumorphism':
        return { ...base, backgroundColor: '#e0e5ec', color: '#0f172a' };
      case 'gradient-glow':
        return { ...base, backgroundColor: isOpen ? 'rgba(99,102,241,0.06)' : 'transparent', color: 'var(--boost-text, #0f172a)' };
      case 'material-you':
        return { ...base, backgroundColor: isOpen ? 'var(--boost-surface, #e8def8)' : 'var(--boost-surface, #fffbfe)', color: 'var(--boost-text, #1c1b1f)' };
      case 'dark-first':
        return { ...base, backgroundColor: isOpen ? '#1e293b' : '#0f172a', color: '#f8fafc' };
      default:
        return { ...base, backgroundColor: isOpen ? 'var(--boost-surface-secondary, #f8fafc)' : 'var(--boost-surface, #ffffff)', color: 'var(--boost-text, #0f172a)' };
    }
  };

  const getItemBorder = (isLast: boolean): React.CSSProperties => {
    if (isSeparated) {
      switch (preset) {
        case 'neo-brutalism': return { border: '3px solid #000', borderRadius: '2px', boxShadow: '3px 3px 0px #000', overflow: 'hidden' };
        case 'glassmorphism': return { border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', overflow: 'hidden' };
        case 'neumorphism': return { border: 'none', borderRadius: '14px', boxShadow: '4px 4px 10px #d1d9e6, -4px -4px 10px #ffffff', overflow: 'hidden' };
        default: return { border: '1px solid var(--boost-border, #e2e8f0)', borderRadius: '10px', overflow: 'hidden' };
      }
    }
    return { borderBottom: !isLast ? '1px solid var(--boost-border, #e2e8f0)' : 'none', overflow: 'hidden' };
  };

  return (
    <div
      className={`boost-accordion boost-accordion-${variant} boost-accordion-preset-${preset} ${className}`}
      onKeyDown={handleKeyDown}
      style={{ ...getWrapperStyles(), ...style }}
    >
      <style>{`
        .boost-accordion-preset-${preset} .boost-accordion-content {
          background-color: ${preset === 'neo-brutalism' ? '#fffbeb' : preset === 'dark-first' ? '#0f172a' : preset === 'neumorphism' ? '#e0e5ec' : 'var(--boost-surface, #ffffff)'};
          color: ${preset === 'dark-first' ? '#94a3b8' : 'var(--boost-text-muted, #475569)'};
          border-top: 1px solid ${preset === 'neo-brutalism' ? '#000' : preset === 'dark-first' ? 'rgba(255,255,255,0.06)' : 'var(--boost-border, #f1f5f9)'};
        }
        :root[data-theme="dark"] .boost-accordion-preset-${preset} .boost-accordion-header {
          background-color: var(--boost-surface, #1e293b);
          color: var(--boost-text, #f8fafc);
        }
        :root[data-theme="dark"] .boost-accordion-preset-${preset} .boost-accordion-content {
          background-color: var(--boost-surface, #1e293b);
          color: var(--boost-text-muted, #94a3b8);
          border-top-color: rgba(255,255,255,0.08);
        }
      `}</style>

      {items.map((item, idx) => {
        const isOpen = expanded.includes(item.id);
        const isLast = idx === items.length - 1;
        return (
          <div key={item.id} style={getItemBorder(isLast)}>
            <button
              type="button"
              id={`boost-accordion-header-${item.id}`}
              data-id={item.id}
              disabled={item.disabled}
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={isOpen ? `boost-accordion-content-${item.id}` : undefined}
              data-expanded={isOpen}
              className="boost-accordion-header"
              style={{
                ...getHeaderStyles(isOpen),
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
              }}
            >
              <span>{item.title}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)', color: preset === 'neo-brutalism' ? '#000' : 'var(--boost-text-muted, #64748b)', flexShrink: 0, marginLeft: '8px' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && (
              <div
                id={`boost-accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`boost-accordion-header-${item.id}`}
                className="boost-accordion-content"
                style={{ padding: '14px 18px', fontSize: '13.5px', lineHeight: 1.6 }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = 'Accordion';
