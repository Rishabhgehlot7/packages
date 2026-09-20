import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface FAQItem {
  id?: string;
  question: string;
  answer: React.ReactNode;
}

export interface FAQSectionProps {
  items?: FAQItem[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  items = [],
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about our product and billing.',
  searchable = true,
  searchPlaceholder = 'Search questions...',
  className = '',
  style,
  stylePreset: stylePresetProp,
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
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

  const getSearchBoxPresetStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '3px solid #000000',
          borderRadius: '0px',
          boxShadow: '4px 4px 0px #000000',
          backgroundColor: '#ffffff',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '16px',
        };
      case 'neumorphism':
        return {
          boxShadow: 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff',
          border: 'none',
          backgroundColor: 'var(--boost-surface, #e6ecf5)',
          borderRadius: '16px',
        };
      case 'gradient-glow':
        return {
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)',
          borderRadius: '16px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
        };
      case 'material-you':
        return {
          borderRadius: '28px',
          backgroundColor: 'var(--boost-surface-variant, #f3edf7)',
          border: 'none',
        };
      case 'dark-first':
        return {
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '14px',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '14px',
        };
    }
  };

  const getItemPresetStyles = (isOpen: boolean): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '3px solid #000000',
          borderRadius: '0px',
          boxShadow: isOpen ? '5px 5px 0px #000000' : '3px 3px 0px #000000',
          backgroundColor: '#ffffff',
        };
      case 'glassmorphism':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isOpen ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '16px',
          boxShadow: isOpen ? '0 8px 32px 0 rgba(31, 38, 135, 0.12)' : 'none',
        };
      case 'neumorphism':
        return {
          border: 'none',
          backgroundColor: 'var(--boost-surface, #e6ecf5)',
          borderRadius: '16px',
          boxShadow: isOpen ? 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff' : '5px 5px 12px #d1d9e6, -5px -5px 12px #ffffff',
        };
      case 'gradient-glow':
        return {
          border: isOpen ? '1px solid #818cf8' : '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: isOpen ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none',
          borderRadius: '16px',
          backgroundColor: 'var(--boost-surface, #ffffff)',
        };
      case 'material-you':
        return {
          borderRadius: '24px',
          backgroundColor: isOpen ? 'var(--boost-surface-container-high, #ede7f6)' : 'var(--boost-surface-variant, #f3edf7)',
          border: 'none',
        };
      case 'dark-first':
        return {
          border: isOpen ? '1px solid #38bdf8' : '1px solid #334155',
          backgroundColor: '#1e293b',
          borderRadius: '14px',
        };
      case 'minimal':
      default:
        return {
          backgroundColor: 'var(--boost-surface, #ffffff)',
          border: isOpen ? '1px solid var(--boost-primary, #6366f1)' : '1px solid var(--boost-border, #e2e8f0)',
          borderRadius: '14px',
          boxShadow: isOpen ? '0 4px 20px rgba(99, 102, 241, 0.12)' : 'none',
        };
    }
  };

  return (
    <div
      className={`boost-faq-section boost-faq-preset-${preset} ${className}`}
      style={{
        maxWidth: '850px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <style>
        {`
          .boost-faq-item {
            overflow: hidden;
            transition: all 0.2s ease;
          }
          :root[data-theme="dark"] .boost-faq-item,
          .dark .boost-faq-item {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          .boost-faq-search-box {
            display: flex;
            align-items: center;
            padding: 10px 16px;
            gap: 10px;
          }
          :root[data-theme="dark"] .boost-faq-search-box,
          .dark .boost-faq-search-box {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
          }
        `}
      </style>
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
          <div className="boost-faq-search-box" style={getSearchBoxPresetStyles()}>
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
                className={`boost-faq-item ${isOpen ? 'is-open' : ''}`}
                style={getItemPresetStyles(isOpen)}
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
                      borderTop: preset === 'neo-brutalism' ? '2px solid #000' : '1px solid var(--boost-border, #e2e8f0)',
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
