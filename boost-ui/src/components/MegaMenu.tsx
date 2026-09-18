import * as React from 'react';

export interface MegaMenuSection {
  title: string;
  links: Array<{ label: string; href: string; description?: string }>;
}

export interface MegaMenuColumn {
  title: string;
  links: Array<{ label: string; href: string; description?: string }>;
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  columns?: MegaMenuColumn[];
  sections?: MegaMenuSection[];
}

export interface MegaMenuProps {
  trigger?: React.ReactNode;
  sections?: MegaMenuSection[];
  categories?: MegaMenuCategory[];
  featured?: React.ReactNode;
  className?: string;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  trigger,
  sections,
  categories,
  featured,
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string>(categories?.[0]?.id || '');
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
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

  const defaultTrigger = (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 600,
        color: '#0f172a',
        cursor: 'pointer',
      }}
    >
      <span>Browse Categories</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );

  return (
    <div
      ref={menuRef}
      className={`boost-megamenu-wrapper ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', display: 'inline-flex', fontFamily: 'inherit' }}
    >
      <div>{trigger || defaultTrigger}</div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 500,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '20px 24px',
            display: 'flex',
            gap: '28px',
            minWidth: '580px',
            fontFamily: 'inherit',
          }}
        >
          {categories && categories.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderRight: '1px solid #f1f5f9', paddingRight: '16px', minWidth: '120px' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: activeCategory === cat.id ? 700 : 500,
                    color: activeCategory === cat.id ? '#2563eb' : '#475569',
                    backgroundColor: activeCategory === cat.id ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
            {effectiveSections.map((section, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '140px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {section.title}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {section.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.href}
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                        {link.label}
                      </span>
                      {link.description && (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {link.description}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {featured && (
            <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '24px', minWidth: '180px' }}>
              {featured}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


MegaMenu.displayName = 'MegaMenu';
