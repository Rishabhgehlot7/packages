import * as React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs?: TabItem[];
  items?: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  activeId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  items,
  defaultTab,
  activeTab: controlledTab,
  activeId: controlledId,
  onChange,
  className = '',
}) => {
  const tabList = items || tabs || [];
  const currentActive = controlledId !== undefined ? controlledId : controlledTab;
  const [internalTab, setInternalTab] = React.useState<string>(
    currentActive || defaultTab || (tabList[0] ? tabList[0].id : '')
  );

  const active = currentActive !== undefined ? currentActive : internalTab;

  const handleTabClick = (id: string) => {
    if (currentActive === undefined) {
      setInternalTab(id);
    }
    if (onChange) onChange(id);
  };

  const currentTab = tabList.find((t) => t.id === active) || tabList[0];

  return (
    <div className={`boost-tabs ${className}`} style={{ fontFamily: 'inherit', width: '100%' }}>
      <style>
        {`
          :root[data-theme="dark"] .boost-tabs .boost-tab-header,
          .dark .boost-tabs .boost-tab-header {
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-item,
          .dark .boost-tabs .boost-tab-item {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-item:hover:not(:disabled),
          .dark .boost-tabs .boost-tab-item:hover:not(:disabled) {
            color: #ffffff !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-item.active,
          .dark .boost-tabs .boost-tab-item.active {
            color: #818cf8 !important;
            border-bottom-color: #6366f1 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-badge,
          .dark .boost-tabs .boost-tab-badge {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-badge.active,
          .dark .boost-tabs .boost-tab-badge.active {
            background-color: rgba(99, 102, 241, 0.2) !important;
            color: #818cf8 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-panel,
          .dark .boost-tabs .boost-tab-panel {
            color: #cbd5e1 !important;
          }
        `}
      </style>
      {/* Tab bar header */}
      <div
        role="tablist"
        className="boost-tab-header"
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--boost-border, #e2e8f0)',
          gap: '8px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {tabList.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id)}
              className={`boost-tab-item ${isActive ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--boost-primary, #2563eb)' : 'var(--boost-text-muted, #64748b)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--boost-primary, #2563eb)' : '2px solid transparent',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.5 : 1,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon && <span style={{ display: 'inline-flex' }}>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`boost-tab-badge ${isActive ? 'active' : ''}`}
                  style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'var(--boost-bg-subtle, #f1f5f9)',
                    color: isActive ? 'var(--boost-primary, #1d4ed8)' : 'var(--boost-text-muted, #64748b)',
                    fontWeight: 600,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panel content */}
      <div role="tabpanel" className="boost-tab-panel" style={{ padding: '16px 0', color: 'var(--boost-text, #334155)', fontSize: '14px', lineHeight: 1.6 }}>
        {currentTab ? currentTab.content : null}
      </div>
    </div>
  );
};


Tabs.displayName = 'Tabs';
