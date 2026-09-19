import * as React from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
  style?: React.CSSProperties;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  variant = 'default',
  className = '',
  style,
}) => {
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
    
    // Only intercept if focus is on an accordion header
    if (!(e.target instanceof HTMLButtonElement) || !e.target.classList.contains('boost-accordion-header')) {
      return;
    }

    const focusableItems = items.filter(i => !i.disabled);
    if (focusableItems.length === 0) return;

    const currentId = e.target.getAttribute('data-id');
    const currentIndex = focusableItems.findIndex(i => i.id === currentId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % focusableItems.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = focusableItems.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextId = focusableItems[nextIndex].id;
      const btn = document.getElementById(`boost-accordion-header-${nextId}`);
      if (btn) btn.focus();
    }
  };

  const isSeparated = variant === 'separated';

  return (
    <div
      className={`boost-accordion boost-accordion-${variant} ${className}`}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isSeparated ? '10px' : '0px',
        border: isSeparated ? 'none' : '1px solid var(--boost-border, #e2e8f0)',
        borderRadius: 'var(--boost-radius, 12px)',
        overflow: 'hidden',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      <style>{`
        .boost-accordion-header {
          background-color: var(--boost-surface, #ffffff);
          color: var(--boost-text, #0f172a);
          transition: background-color 0.18s ease, color 0.18s ease;
        }
        .boost-accordion-header[data-expanded="true"] {
          background-color: var(--boost-surface-hover, #f8fafc);
        }
        .boost-accordion-content {
          background-color: var(--boost-surface, #ffffff);
          color: var(--boost-text-muted, #475569);
          border-top: 1px solid var(--boost-border, #f1f5f9);
        }
        :root[data-theme="dark"] .boost-accordion-header {
          background-color: #1e293b;
          color: #f8fafc;
        }
        :root[data-theme="dark"] .boost-accordion-header[data-expanded="true"] {
          background-color: #243247;
        }
        :root[data-theme="dark"] .boost-accordion-content {
          background-color: #1e293b;
          color: #94a3b8;
          border-top-color: rgba(255, 255, 255, 0.08);
        }
        :root[data-theme="dark"] .boost-accordion {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>

      {items.map((item, idx) => {
        const isOpen = expanded.includes(item.id);
        const isLast = idx === items.length - 1;

        return (
          <div
            key={item.id}
            style={{
              borderBottom: !isSeparated && !isLast ? '1px solid var(--boost-border, #e2e8f0)' : 'none',
              borderRadius: isSeparated ? '10px' : undefined,
              border: isSeparated ? '1px solid var(--boost-border, #e2e8f0)' : undefined,
              overflow: 'hidden',
            }}
          >
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
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                border: 'none',
                textAlign: 'left',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              <span>{item.title}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  color: 'var(--boost-text-muted, #64748b)',
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
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
                style={{
                  padding: '14px 18px',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                }}
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
