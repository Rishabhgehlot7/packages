import React, { useState, useEffect } from 'react';
import { useToast } from '@boostengine/ui';
import { PACKAGES_DATA, getPackageById } from './data/packagesData';
import { UI_COMPONENTS_DATA } from './data/uiComponentsData';
import { Navbar } from './components/Navbar';
import { UISidebar } from './components/UISidebar';
import { Sidebar } from './components/Sidebar';
import { DocContent } from './components/DocContent';
import { UIComponentRenderer } from './components/UIComponentRenderer';
import { SearchModal } from './components/SearchModal';
import { Playground } from './components/Playground';
import { ExamplesView } from './components/examples';
import { TableOfContents } from './components/TableOfContents';

type DocsView = 'ui-components' | 'docs' | 'examples' | 'playground';

export const App: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('boost_docs_theme') : null;
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });
  const [currentView, setCurrentView] = useState<DocsView>('ui-components');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('boost-ui');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('Button');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('boost_docs_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync with URL Hash on Mount & HashChange
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'playground') {
        setCurrentView('playground');
      } else if (hash === 'presets') {
        setSelectedComponentId('PresetSwitcher');
        setCurrentView('ui-components');
      } else if (hash === 'examples' || hash.startsWith('examples/')) {
        setCurrentView('examples');
      } else if (hash === 'docs' || hash === 'install' || hash === 'getting-started' || hash === 'boost-ui') {
        setSelectedPackageId('boost-ui');
        setCurrentView('docs');
      } else if (hash.startsWith('docs/')) {
        const pkgId = hash.replace('docs/', '');
        if (PACKAGES_DATA.some(p => p.id === pkgId)) {
          setSelectedPackageId(pkgId);
          setCurrentView('docs');
        }
      } else if (hash.startsWith('ui/')) {
        const compId = hash.replace('ui/', '');
        const match = UI_COMPONENTS_DATA.find(c => c.id.toLowerCase() === compId.toLowerCase());
        if (match) {
          setSelectedComponentId(match.id);
        }
        setCurrentView('ui-components');
      } else {
        setCurrentView('ui-components');
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Global Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPackage = (id: string) => {
    setSelectedPackageId(id);
    setCurrentView('docs');
    window.location.hash = `docs/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectUIComponent = (id: string) => {
    setSelectedComponentId(id);
    setCurrentView('ui-components');
    window.location.hash = `ui/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectView = (view: DocsView) => {
    setCurrentView(view);
    if (view === 'docs') window.location.hash = 'docs';
    else if (view === 'ui-components') window.location.hash = `ui/${selectedComponentId}`;
    else window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  const currentPackage = getPackageById(selectedPackageId) || PACKAGES_DATA[0];
  const currentUIComponent = UI_COMPONENTS_DATA.find(c => c.id === selectedComponentId) || UI_COMPONENTS_DATA[0];
  const docTocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'install', label: 'Installation' },
    { id: 'use-case', label: 'Universal Design System' },
    { id: 'capabilities', label: 'Key Capabilities' },
    { id: 'examples', label: 'Code Examples' },
    ...(currentPackage.apiMethods && currentPackage.apiMethods.length > 0 ? [{ id: 'api-reference', label: 'API Reference' }] : []),
    ...(packageDocNotesPresent(currentPackage) ? [{ id: 'best-practices', label: 'Best Practices' }] : [])
  ];

  const uiTocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'install', label: 'Quick Install' },
    { id: 'preview', label: 'Interactive Preview' },
    { id: 'code', label: 'Code Snippet' },
    { id: 'props', label: 'Props Specification' }
  ];

  function packageDocNotesPresent(pkg: typeof currentPackage) {
    return Boolean(pkg.notes && pkg.notes.length > 0);
  }

  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        onSelectView={handleSelectView}
        onOpenSearch={() => setSearchOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <div className="main-wrapper">
        {currentView === 'docs' && (
          <Sidebar
            packages={PACKAGES_DATA}
            selectedPackageId={selectedPackageId}
            onSelectPackage={handleSelectPackage}
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}

        {currentView === 'ui-components' && (
          <UISidebar
            selectedComponentId={selectedComponentId}
            onSelectComponent={handleSelectUIComponent}
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            isDocsActive={false}
            onSelectDocs={() => handleSelectPackage('boost-ui')}
          />
        )}

        <main style={{ flex: 1, minWidth: 0 }}>
          {currentView === 'docs' && (
            <DocContent
              packageDoc={currentPackage}
              onShowToast={showToast}
              onSelectPackage={handleSelectPackage}
              allPackages={PACKAGES_DATA}
            />
          )}

          {currentView === 'ui-components' && (
            <UIComponentRenderer
              componentItem={currentUIComponent}
              onShowToast={showToast}
            />
          )}

          {currentView === 'examples' && (
            <ExamplesView onShowToast={showToast} />
          )}

          {currentView === 'playground' && (
            <Playground />
          )}
        </main>

        {currentView === 'docs' && (
          <TableOfContents
            items={docTocItems}
            pageTitle={currentPackage.name}
            onShowToast={showToast}
          />
        )}

        {currentView === 'ui-components' && (
          <TableOfContents
            items={uiTocItems}
            pageTitle={currentUIComponent.name}
            onShowToast={showToast}
          />
        )}
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        packages={PACKAGES_DATA}
        onSelectPackage={handleSelectPackage}
      />
    </div>
  );
};
