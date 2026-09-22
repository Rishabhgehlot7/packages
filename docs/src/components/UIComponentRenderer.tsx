import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Sparkles,
  Layers,
  Palette
} from 'lucide-react';
import { PresetSwitcher } from '@boostengine/ui';
import { UIComponentItem } from '../types';
import { ComponentPreviewRenderer } from './previews';

interface UIComponentRendererProps {
  componentItem: UIComponentItem;
  onShowToast: (msg: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ComponentErrorBoundary extends React.Component<{ children: React.ReactNode; componentName: string }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode; componentName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error rendering component preview:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '28px',
          borderRadius: '16px',
          backgroundColor: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          color: 'var(--rose, #f43f5e)',
          fontSize: '13px',
          maxWidth: '520px',
          margin: '2rem auto',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 800, marginBottom: '8px', fontSize: '16px' }}>
            Preview Error in {this.props.componentName}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', opacity: 0.9 }}>
            {this.state.error?.message || 'Component failed to render'}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const UIComponentRenderer: React.FC<UIComponentRendererProps> = ({
  componentItem,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [canvasMode, setCanvasMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="component-showcase">
      {/* Component Header */}
      <div id="overview" className="component-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '6px' }}>
          <h1 className="component-title gradient-heading">{componentItem.name}</h1>
          {componentItem.badge && (
            <span className={`item-badge ${componentItem.badge.includes('India') ? 'india' : ''}`}>
              {componentItem.badge}
            </span>
          )}
        </div>
        <p className="component-desc">{componentItem.description}</p>
      </div>

      {/* CLI Quick Install Banner */}
      <div id="install" className="cli-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto' }}>
          <div className="window-dots" style={{ marginRight: '4px' }}>
            <span className="window-dot red" />
            <span className="window-dot yellow" />
            <span className="window-dot green" />
          </div>
          <Terminal size={15} color="var(--primary)" />
          <code>{componentItem.cliCommand}</code>
        </div>
        <button
          className="copy-btn"
          onClick={() => handleCopy(componentItem.cliCommand, 'cli', 'CLI Command')}
        >
          {copiedKey === 'cli' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          <span>{copiedKey === 'cli' ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* View Switcher Tabs (Preview vs Code) */}
      <div id="preview" className="tabs-header">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={15} />
            <span>Interactive Preview</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <Code size={15} />
            <span>Installation Code</span>
          </button>
        </div>

        {activeTab === 'preview' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Live Preset Switcher inside canvas toolbar */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PresetSwitcher mode="dropdown" />
            </div>

            {/* Canvas Mode Toggle */}
            <div className="canvas-mode-toggle">
              <button
                className={`mode-btn ${canvasMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setCanvasMode('desktop')}
                title="Desktop View (100%)"
              >
                <Monitor size={15} />
              </button>
              <button
                className={`mode-btn ${canvasMode === 'tablet' ? 'active' : ''}`}
                onClick={() => setCanvasMode('tablet')}
                title="Tablet View (768px)"
              >
                <Tablet size={15} />
              </button>
              <button
                className={`mode-btn ${canvasMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setCanvasMode('mobile')}
                title="Mobile View (390px)"
              >
                <Smartphone size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Body */}
      {activeTab === 'preview' ? (
        <div className={`canvas-container ${canvasMode}`}>
          <div className="canvas-content">
            <ComponentErrorBoundary key={componentItem.id} componentName={componentItem.name}>
              <ComponentPreviewRenderer componentId={componentItem.id} onShowToast={onShowToast} />
            </ComponentErrorBoundary>
          </div>
        </div>
      ) : (
        <div id="code" className="code-block-container">
          <div className="code-header">
            <div className="window-dots">
              <span className="window-dot red" />
              <span className="window-dot yellow" />
              <span className="window-dot green" />
            </div>
            <span className="code-title">{componentItem.name}.tsx</span>
            <button
              className="copy-btn"
              onClick={() => handleCopy(componentItem.codeSnippet, 'code', 'Code Snippet')}
            >
              {copiedKey === 'code' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedKey === 'code' ? 'Copied' : 'Copy Snippet'}</span>
            </button>
          </div>
          <pre className="code-content">
            <code>{componentItem.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Component API Props Table */}
      <div id="props" className="props-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              <span>Component Props & API</span>
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Configurable props and TypeScript interface specifications.
            </p>
          </div>
          <span className="item-badge core">
            {(componentItem.props || []).length} Props
          </span>
        </div>

        <div className="props-table-wrapper">
          <table className="props-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Prop</th>
                <th style={{ width: '28%' }}>Type</th>
                <th style={{ width: '18%' }}>Default</th>
                <th style={{ width: '32%' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {(componentItem.props || []).map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code className="prop-name-badge">{prop.name}</code>
                  </td>
                  <td>
                    <code className="type-badge">{prop.type}</code>
                  </td>
                  <td>
                    <span className="default-val">{prop.default || 'undefined'}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-main)', fontSize: '0.825rem', lineHeight: 1.5 }}>
                      {prop.description}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
