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
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className = '',
}) => {
  const [expanded, setExpanded] = React.useState<string[]>(defaultExpanded);

  const toggleItem = (id: string) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((item) => item !== id));
    } else {
      setExpanded(allowMultiple ? [...expanded, id] : [id]);
    }
  };

  return (
    <div
      className={`boost-accordion ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      {items.map((item, idx) => {
        const isOpen = expanded.includes(item.id);
        const isLast = idx === items.length - 1;

        return (
          <div
            key={item.id}
            style={{
              borderBottom: isLast ? 'none' : '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                border: 'none',
                textAlign: 'left',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '14px',
                color: '#0f172a',
                transition: 'background-color 0.15s ease',
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
                  transition: 'transform 0.2s ease',
                  color: '#64748b',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  color: '#334155',
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
