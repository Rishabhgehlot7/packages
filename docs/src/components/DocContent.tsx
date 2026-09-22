import React, { useState } from 'react';
import { PackageDoc, PackageManager } from '../types';
import { 
  Copy, 
  Check, 
  Terminal, 
  CheckCircle2, 
  Code, 
  Info, 
  Lightbulb, 
  Layers, 
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Shield,
  Zap,
  Package
} from 'lucide-react';

interface DocContentProps {
  packageDoc: PackageDoc;
  onShowToast: (msg: string) => void;
  onSelectPackage?: (id: string) => void;
  allPackages?: PackageDoc[];
}

export const DocContent: React.FC<DocContentProps> = ({
  packageDoc,
  onShowToast,
  onSelectPackage,
  allPackages = [],
}) => {
  const [activePkgManager, setActivePkgManager] = useState<PackageManager>('npm');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const getInstallCommand = (pkg: PackageDoc, manager: PackageManager): string => {
    if (pkg.id === 'create-boost-app' || pkg.id === 'getting-started') {
      switch (manager) {
        case 'npm': return 'npx create-boost-app my-store';
        case 'pnpm': return 'pnpm dlx create-boost-app my-store';
        case 'yarn': return 'yarn create boost-app my-store';
        case 'bun': return 'bunx create-boost-app my-store';
      }
    }

    const pkgName = pkg.name;
    switch (manager) {
      case 'npm': return `npm i ${pkgName}`;
      case 'pnpm': return `pnpm add ${pkgName}`;
      case 'yarn': return `yarn add ${pkgName}`;
      case 'bun': return `bun add ${pkgName}`;
    }
  };

  const installCmd = getInstallCommand(packageDoc, activePkgManager);

  // Determine previous and next packages for seamless pagination
  const currentIndex = allPackages.findIndex(p => p.id === packageDoc.id);
  const prevPackage = currentIndex > 0 ? allPackages[currentIndex - 1] : null;
  const nextPackage = currentIndex >= 0 && currentIndex < allPackages.length - 1 ? allPackages[currentIndex + 1] : null;

  return (
    <div className="content-area">
      {/* Header */}
      <div id="overview" className="doc-header">
        <div className="doc-category-badge">
          <Layers size={13} />
          <span>{packageDoc.categoryId.toUpperCase().replace('-', ' ')}</span>
        </div>

        <h1 className="doc-title">
          <span className="gradient-heading">{packageDoc.name}</span>
          {packageDoc.badge && (
            <span className="brand-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
              {packageDoc.badge}
            </span>
          )}
        </h1>

        <p className="doc-description">{packageDoc.description}</p>

        <div className="meta-badges-bar">
          <div className="meta-chip version">
            <span className="version-dot">●</span>
            <span>v{packageDoc.version}</span>
          </div>
          <div className="meta-chip size">
            <Zap size={12} color="var(--primary)" />
            <span>{packageDoc.bundleSize}</span>
          </div>
          <div className="meta-chip">
            <Shield size={12} color="#10b981" />
            <span>License: MIT</span>
          </div>
          <div className="meta-chip">
            <span>100% TypeScript</span>
          </div>
          <div className="meta-chip">
            <span>Dual ESM/CJS</span>
          </div>
          {packageDoc.id !== 'getting-started' && (
            <a 
              href={`https://www.npmjs.com/package/${packageDoc.name}`}
              target="_blank"
              rel="noreferrer"
              className="meta-chip"
              style={{ textDecoration: 'none' }}
            >
              <span>View on NPM</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      {/* Quick Install Terminal Box */}
      <div id="install" className="install-box">
        <div className="install-header">
          {/* Traffic Light Window Dots */}
          <div className="window-dots">
            <span className="window-dot red" />
            <span className="window-dot yellow" />
            <span className="window-dot green" />
          </div>

          <div className="install-tabs">
            {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((mgr) => (
              <button
                key={mgr}
                className={`install-tab-btn ${activePkgManager === mgr ? 'active' : ''}`}
                onClick={() => setActivePkgManager(mgr)}
              >
                {mgr}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>
            terminal
          </div>
        </div>

        <div className="install-cmd-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800, userSelect: 'none' }}>$</span>
            <code>{installCmd}</code>
          </div>
          <button
            className={`copy-btn ${copiedKey === 'install' ? 'copied' : ''}`}
            onClick={() => handleCopy(installCmd, 'install', 'Command')}
          >
            {copiedKey === 'install' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedKey === 'install' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* D2C Problem & Use-Case Card */}
      <div id="use-case" className="callout" style={{ borderLeftColor: 'var(--cyan)', background: 'var(--cyan-light)' }}>
        <div className="callout-title" style={{ color: 'var(--cyan)' }}>
          <Lightbulb size={17} />
          <span>Real-World D2C Problem Solved</span>
        </div>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{packageDoc.useCase}</p>
      </div>

      {/* Key Capabilities */}
      <div id="capabilities" className="doc-section">
        <h2 className="section-title">
          <CheckCircle2 size={20} style={{ color: 'var(--emerald)' }} />
          <span>Key Capabilities & Features</span>
        </h2>
        <div className="feature-grid">
          {packageDoc.features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span className="feature-check">✓</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <div id="examples" className="doc-section">
        <h2 className="section-title">
          <Code size={20} style={{ color: 'var(--primary)' }} />
          <span>Usage Examples</span>
        </h2>

        {packageDoc.examples.map((example, idx) => (
          <div key={idx} className="code-container">
            <div className="code-header">
              <div className="window-dots">
                <span className="window-dot red" />
                <span className="window-dot yellow" />
                <span className="window-dot green" />
              </div>
              <span className="code-title">{example.title}</span>
              <button
                className={`copy-btn ${copiedKey === `code-${idx}` ? 'copied' : ''}`}
                onClick={() => handleCopy(example.code, `code-${idx}`, example.title)}
              >
                {copiedKey === `code-${idx}` ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedKey === `code-${idx}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="code-pre">
              <code>{example.code}</code>
            </pre>
          </div>
        ))}
      </div>

      {/* API Reference */}
      {packageDoc.apiMethods.length > 0 && (
        <div id="api-reference" className="doc-section">
          <h2 className="section-title">
            <Terminal size={20} style={{ color: 'var(--amber)' }} />
            <span>API Methods & TypeScript Signatures</span>
          </h2>

          <div className="api-table-wrapper">
            <table className="api-table">
              <thead>
                <tr>
                  <th style={{ width: '24%' }}>Method</th>
                  <th style={{ width: '42%' }}>Description & Signature</th>
                  <th style={{ width: '34%' }}>Returns</th>
                </tr>
              </thead>
              <tbody>
                {packageDoc.apiMethods.map((method, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="type-pill" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {method.name}
                      </span>
                    </td>
                    <td>
                      <div style={{ marginBottom: '0.4rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                        {method.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                          {method.signature}
                        </code>
                      </div>
                      {method.params.length > 0 && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>Parameters:</span>
                          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.2rem' }}>
                            {method.params.map((param, pIdx) => (
                              <li key={pIdx} style={{ marginBottom: '2px' }}>
                                <code>{param.name}</code>: <span className="type-pill">{param.type}</span>
                                {param.required && <span className="req-badge">Req</span>}
                                {' '}- {param.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="type-pill" style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                        {method.returns}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Production Notes / Best Practices */}
      {packageDoc.notes && packageDoc.notes.length > 0 && (
        <div id="best-practices" className="callout tip">
          <div className="callout-title" style={{ color: 'var(--emerald)' }}>
            <Info size={17} />
            <span>Production Best Practices</span>
          </div>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.875rem' }}>
            {packageDoc.notes.map((note, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Next / Previous Package Footer Pagination */}
      {onSelectPackage && (prevPackage || nextPackage) && (
        <div className="pagination-footer">
          {prevPackage ? (
            <button
              className="page-nav-card prev"
              onClick={() => onSelectPackage(prevPackage.id)}
            >
              <div className="page-nav-dir">
                <ArrowLeft size={13} />
                <span>PREVIOUS PACKAGE</span>
              </div>
              <div className="page-nav-title">{prevPackage.name}</div>
            </button>
          ) : <div />}

          {nextPackage ? (
            <button
              className="page-nav-card next"
              onClick={() => onSelectPackage(nextPackage.id)}
            >
              <div className="page-nav-dir">
                <span>NEXT PACKAGE</span>
                <ArrowRight size={13} />
              </div>
              <div className="page-nav-title">{nextPackage.name}</div>
            </button>
          ) : <div />}
        </div>
      )}
    </div>
  );
};
