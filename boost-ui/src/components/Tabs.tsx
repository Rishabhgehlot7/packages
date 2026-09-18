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
      {/* Tab bar header */}
      <div
        role="tablist"
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          gap: '8px',
          overflowX: 'auto',
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563eb' : '#64748b',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
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
                  style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#dbeafe' : '#f1f5f9',
                    color: isActive ? '#1d4ed8' : '#64748b',
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
      <div role="tabpanel" style={{ padding: '16px 0' }}>
        {currentTab ? currentTab.content : null}
      </div>
    </div>
  );
};


Tabs.displayName = 'Tabs';
