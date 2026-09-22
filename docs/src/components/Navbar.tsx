import React from 'react';
import { ThemeToggle, PresetSwitcher } from '@boostengine/ui';
import { UI_COMPONENTS_DATA } from '../data/uiComponentsData';
import { 
  Zap, 
  Search, 
  BookOpen, 
  PlayCircle, 
  GitBranch, 
  ExternalLink,
  Menu,
  X,
  Component,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentView: 'docs' | 'ui-components' | 'examples' | 'playground';
  onSelectView: (view: 'docs' | 'ui-components' | 'examples' | 'playground') => void;
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenSearch,
  mobileMenuOpen,
  onToggleMobileMenu,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="nav-tab-btn" 
          style={{ padding: '0.4rem', border: '1px solid var(--border)' }}
          onClick={onToggleMobileMenu}
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="nav-brand" onClick={() => onSelectView('ui-components')}>
          <div className="brand-icon">
            <Zap size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Boost UI</span>
            <span className="brand-badge">v2.1.1</span>
          </div>
        </div>
      </div>

      <button className="nav-search-btn" onClick={onOpenSearch}>
        <Search size={14} />
        <span>Search components...</span>
        <span className="kbd-shortcut">⌘K</span>
      </button>

      <nav className="nav-links">
        <button 
          className={`nav-tab-btn ${currentView === 'ui-components' ? 'active' : ''}`}
          onClick={() => onSelectView('ui-components')}
        >
          <Component size={14} />
          <span>Components</span>
        </button>


        <button 
          className={`nav-tab-btn ${currentView === 'docs' ? 'active' : ''}`}
          onClick={() => onSelectView('docs')}
        >
          <BookOpen size={14} />
          <span>Setup</span>
        </button>

        <button 
          className={`nav-tab-btn ${currentView === 'examples' ? 'active' : ''}`}
          onClick={() => onSelectView('examples')}
        >
          <Sparkles size={14} />
          <span>Templates</span>
        </button>

        <button 
          className={`nav-tab-btn ${currentView === 'playground' ? 'active' : ''}`}
          onClick={() => onSelectView('playground')}
        >
          <PlayCircle size={14} />
          <span>Playground</span>
        </button>

        <a 
          href="https://www.npmjs.com/package/@boostengine/ui" 
          target="_blank" 
          rel="noreferrer"
          className="nav-ext-link"
        >
          <span>NPM</span>
          <ExternalLink size={13} />
        </a>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PresetSwitcher mode="dropdown" />
        </div>

        <div onClick={onToggleTheme}>
          <ThemeToggle variant="icon" />
        </div>
      </nav>
    </header>
  );
};
