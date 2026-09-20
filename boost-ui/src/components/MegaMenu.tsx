import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface MegaMenuLink {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface MegaMenuSection {
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenuColumn {
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  icon?: React.ReactNode;
  columns?: MegaMenuColumn[];
  sections?: MegaMenuSection[];
}

export interface MegaMenuProps {
  trigger?: React.ReactNode | ((props: { isOpen: boolean }) => React.ReactNode);
  triggerLabel?: string;
  sections?: MegaMenuSection[];
  categories?: MegaMenuCategory[];
  featured?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onLinkClick?: (link: MegaMenuLink) => void;
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  trigger,
  triggerLabel = 'Explore Categories',
  sections,
  categories,
  featured,
  isOpen: controlledIsOpen,
  onOpenChange,
  onLinkClick,
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const [activeCategory, setActiveCategory] = React.useState<string>(categories?.[0]?.id || '');
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const effectiveSections: MegaMenuSection[] = React.useMemo(() => {
    if (sections && sections.length > 0) return sections;
    if (categories && categories.length > 0) {
      const active = categories.find((c) => c.id === activeCategory) || categories[0];
      return (active?.columns || active?.sections || []) as MegaMenuSection[];
    }
    return [];
  }, [sections, categories, activeCategory]);

  const handleLinkSelect = (link: MegaMenuLink, e: React.MouseEvent) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(link);
    }
    setOpen(false);
  };

  const defaultTrigger = (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="boost-megamenu-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '9px 16px',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        border: '1px solid var(--boost-border, #cbd5e1)',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--boost-text, #0f172a)',
        cursor: 'pointer',
        boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
        {triggerLabel}
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );

  return (
    <div
      ref={menuRef}
      className={`boost-megamenu-wrapper ${className}`}
      onMouseEnter={() => {
        // Only open on hover on devices with fine pointer (mouse)
        if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
          setOpen(false);
        }
      }}
      style={{ position: 'relative', display: 'inline-flex', fontFamily: 'inherit', ...style }}
    >
      <style>{`
        :root[data-theme="dark"] .boost-megamenu-btn {
          background-color: var(--boost-surface, #1e293b) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-megamenu-panel {
          background-color: var(--boost-surface, #1e293b) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
        }
        :root[data-theme="dark"] .megamenu-category-btn {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .megamenu-category-btn:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.06) !important;
        }
        :root[data-theme="dark"] .megamenu-category-btn.active {
          color: #818cf8 !important;
          background-color: rgba(99, 102, 241, 0.16) !important;
        }
        :root[data-theme="dark"] .megamenu-section-title {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .megamenu-link-label {
          color: #cbd5e1 !important;
        }
        :root[data-theme="dark"] .megamenu-link-row:hover .megamenu-link-label {
          color: #818cf8 !important;
        }
        :root[data-theme="dark"] .megamenu-divider {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        @container (max-width: 650px) {
          .boost-megamenu-panel {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            width: calc(100% - 16px) !important;
            max-width: 350px !important;
            min-width: 0 !important;
            flex-direction: column !important;
            gap: 16px !important;
            padding: 14px !important;
            max-height: 70vh !important;
            overflow-y: auto !important;
          }
          .boost-megamenu-categories-bar {
            flex-direction: row !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--boost-border, #e2e8f0) !important;
            padding-right: 0 !important;
            padding-bottom: 10px !important;
            width: 100% !important;
          }
        }

        @media (max-width: 768px) {
          .boost-megamenu-panel {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            width: min(440px, calc(100vw - 32px)) !important;
            min-width: 0 !important;
            flex-direction: column !important;
            gap: 16px !important;
            padding: 16px !important;
            max-height: 75vh !important;
            overflow-y: auto !important;
          }
          .boost-megamenu-categories-bar {
            flex-direction: row !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--boost-border, #e2e8f0) !important;
            padding-right: 0 !important;
            padding-bottom: 12px !important;
            width: 100% !important;
          }
        }
      `}</style>

      <div>
        {typeof trigger === 'function'
          ? trigger({ isOpen: open })
          : trigger || defaultTrigger}
      </div>

      {open && (() => {
          const getPanelStyles = (): React.CSSProperties => {
            const base: React.CSSProperties = { position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 500, padding: '24px', display: 'flex', gap: '28px', minWidth: '640px', maxWidth: 'calc(100vw - 40px)', fontFamily: 'inherit', boxSizing: 'border-box', animation: 'boost-fadeIn 0.18s ease-out' };
            switch (preset) {
              case 'neo-brutalism': return { ...base, backgroundColor: '#ffffff', border: '3px solid #000', borderRadius: '2px', boxShadow: '6px 6px 0px #000' };
              case 'glassmorphism': return { ...base, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '18px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' };
              case 'neumorphism': return { ...base, backgroundColor: '#e0e5ec', border: 'none', borderRadius: '20px', boxShadow: '8px 8px 20px #c8cdd5, -8px -8px 20px #f8fdff' };
              case 'gradient-glow': return { ...base, backgroundColor: 'var(--boost-surface,#ffffff)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', boxShadow: '0 0 40px rgba(99,102,241,0.15), 0 20px 40px -10px rgba(0,0,0,0.12)' };
              case 'material-you': return { ...base, backgroundColor: 'var(--boost-surface,#fffbfe)', border: '1px solid var(--boost-border,#e2e8f0)', borderRadius: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' };
              case 'dark-first': return { ...base, backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' };
              default: return { ...base, backgroundColor: 'var(--boost-surface,#ffffff)', border: '1px solid var(--boost-border,#e2e8f0)', borderRadius: '16px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18)' };
            }
          };
          return (
        <div
          className="boost-megamenu-panel"
          style={getPanelStyles()}
        >
          {/* Category Tabs (Sidebar on Desktop, Horizontal Bar on Mobile) */}
          {categories && categories.length > 1 && (
            <div
              className="megamenu-divider boost-megamenu-categories-bar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderRight: '1px solid var(--boost-border, #f1f5f9)',
                paddingRight: '18px',
                minWidth: '130px',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`megamenu-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: activeCategory === cat.id ? 700 : 500,
                    color: activeCategory === cat.id ? 'var(--boost-primary, #4f46e5)' : 'var(--boost-text-muted, #475569)',
                    backgroundColor: activeCategory === cat.id ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Center: Columns & Links Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '24px',
              flex: 1,
            }}
          >
            {effectiveSections.map((section, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span
                  className="megamenu-section-title"
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--boost-text, #0f172a)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {section.title}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {section.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.href}
                      onClick={(e) => handleLinkSelect(link, e)}
                      className="megamenu-link-row"
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          className="megamenu-link-label"
                          style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--boost-text, #334155)',
                            transition: 'color 0.15s ease',
                          }}
                        >
                          {link.label}
                        </span>
                        {link.badge && (
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              color: '#ef4444',
                              padding: '1px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {link.description && (
                        <span style={{ fontSize: '11px', color: 'var(--boost-text-muted, #94a3b8)', marginTop: '2px' }}>
                          {link.description}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Featured Banner Promo (if passed or default promo) */}
          {featured !== undefined ? (
            <div className="megamenu-divider" style={{ borderLeft: '1px solid var(--boost-border, #f1f5f9)', paddingLeft: '20px', minWidth: '180px' }}>
              {featured}
            </div>
          ) : (
            <div
              className="megamenu-divider"
              style={{
                borderLeft: '1px solid var(--boost-border, #f1f5f9)',
                paddingLeft: '20px',
                minWidth: '170px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--boost-primary, #4f46e5)', letterSpacing: '0.04em' }}>
                  ⚡ FESTIVE DROP
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--boost-text, #0f172a)', lineHeight: 1.3 }}>
                  Up to 50% Off New Essentials
                </span>
                <span style={{ fontSize: '11px', color: 'var(--boost-text-muted, #64748b)' }}>
                  Use code FESTIVE50 at checkout
                </span>
              </div>
            </div>
          )}
        </div>
          );
        })()}

    </div>
  );
};

MegaMenu.displayName = 'MegaMenu';
