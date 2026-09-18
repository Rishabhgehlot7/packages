import * as React from 'react';

export interface FAQItem {
  id?: string;
  question: string;
  answer: React.ReactNode;
}

export interface FAQSectionProps {
  items: FAQItem[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  items,
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about our product and billing.',
  searchable = true,
  searchPlaceholder = 'Search questions...',
  className = '',
  style,
  ...props
}) => {
  const [openIds, setOpenIds] = React.useState<number[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const toggleItem = (idx: number) => {
    setOpenIds((prev) =>
      prev.includes(idx) ? prev.filter((id) => id !== idx) : [...prev, idx]
    );
  };

  const filteredItems = items.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' &&
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div
      className={`boost-faq-section ${className}`}
      style={{
        maxWidth: '850px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 800,
            margin: '0 0 12px 0',
            color: 'var(--boost-text, #0f172a)',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: '16px',
              color: 'var(--boost-text-muted, #64748b)',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {searchable && (
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--boost-surface, #f8fafc)',
              border: '1px solid var(--boost-border, #e2e8f0)',
              borderRadius: 'var(--boost-radius, 8px)',
              padding: '10px 16px',
              gap: '10px',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '14px',
                color: 'var(--boost-text, #0f172a)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredItems.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--boost-text-muted, #64748b)',
              fontSize: '15px',
            }}
          >
            No matching questions found.
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isOpen = openIds.includes(idx);
            return (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--boost-radius, 14px)',
                  border: isOpen ? '1px solid var(--boost-primary, #2563eb)' : '1px solid var(--boost-border, #e2e8f0)',
                  backgroundColor: 'var(--boost-surface, #f8fafc)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isOpen ? '0 4px 16px rgba(37, 99, 235, 0.08)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  style={{
                    width: '100%',
                    padding: 'clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 24px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isOpen ? 'var(--boost-primary, #2563eb)' : 'var(--boost-text, #0f172a)',
                    fontSize: 'clamp(14px, 1.6vw, 16px)',
                    fontWeight: 600,
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span>{item.question}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '9999px',
                      backgroundColor: isOpen ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      color: isOpen ? 'var(--boost-primary, #2563eb)' : 'var(--boost-text-muted, #64748b)',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 clamp(16px, 3vw, 24px) clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 24px)',
                      color: 'var(--boost-text-muted, #64748b)',
                      fontSize: '14px',
                      lineHeight: 1.65,
                      borderTop: '1px solid var(--boost-border, #e2e8f0)',
                      paddingTop: '14px',
                      animation: 'boost-fadeIn 0.2s ease',
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


FAQSection.displayName = 'FAQSection';
