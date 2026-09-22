import React, { useState, useEffect } from 'react';
import { 
  AlignLeft, 
  Link as LinkIcon, 
  ExternalLink, 
  Bug, 
  Check, 
  Sparkles 
} from 'lucide-react';

const GithubIcon: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  pageTitle?: string;
  onShowToast: (msg: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  pageTitle,
  onShowToast,
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0.1 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 84;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    onShowToast('Page link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!items || items.length === 0) return null;

  return (
    <aside className="toc-sidebar">
      <div className="toc-header">
        <AlignLeft size={14} color="var(--primary)" />
        <span>ON THIS PAGE</span>
      </div>

      <nav className="toc-nav">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`toc-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="toc-divider" />

      {/* Community & Quick Actions */}
      <div className="toc-actions">
        <button className="toc-action-btn" onClick={handleCopyLink}>
          {copiedLink ? <Check size={13} color="#10b981" /> : <LinkIcon size={13} />}
          <span>{copiedLink ? 'Link Copied' : 'Copy Page URL'}</span>
        </button>

        <a
          href="https://github.com/Rishabhgehlot7/packages"
          target="_blank"
          rel="noreferrer"
          className="toc-action-btn"
        >
          <GithubIcon size={13} />
          <span>Edit on GitHub</span>
          <ExternalLink size={10} style={{ marginLeft: 'auto', opacity: 0.5 }} />
        </a>

        <a
          href="https://github.com/Rishabhgehlot7/packages/issues/new"
          target="_blank"
          rel="noreferrer"
          className="toc-action-btn"
        >
          <Bug size={13} />
          <span>Report an Issue</span>
          <ExternalLink size={10} style={{ marginLeft: 'auto', opacity: 0.5 }} />
        </a>
      </div>

      {/* Ecosystem Badge */}
      <div className="toc-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Sparkles size={13} color="var(--primary)" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Boost UI v2.0</span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          121+ universal React components with 7 multi-theme design presets.
        </p>
      </div>
    </aside>
  );
};
