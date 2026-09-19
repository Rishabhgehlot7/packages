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
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  onChange?: (tabId: string) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export const useTabsContext = () => React.useContext(TabsContext);

interface TabsComponent extends React.FC<TabsProps> {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
}

export const Tabs: TabsComponent = (({
  tabs,
  items,
  defaultTab,
  activeTab: controlledTab,
  activeId: controlledId,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onChange,
  children,
  className = '',
  style,
}: TabsProps) => {
  const tabList = items || tabs || [];
  const currentActive = controlledValue !== undefined ? controlledValue : (controlledId !== undefined ? controlledId : controlledTab);
  const [internalTab, setInternalTab] = React.useState<string>(
    currentActive || defaultValue || defaultTab || (tabList[0] ? tabList[0].id : '')
  );

  const active = currentActive !== undefined ? currentActive : internalTab;

  const handleTabClick = (id: string) => {
    if (currentActive === undefined) {
      setInternalTab(id);
    }
    if (onValueChange) onValueChange(id);
    if (onChange) onChange(id);
  };

  const currentTab = tabList.find((t) => t.id === active) || tabList[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusableTabs = tabList.filter(t => !t.disabled);
    if (focusableTabs.length === 0) return;
    
    const currentIndex = focusableTabs.findIndex(t => t.id === active);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % focusableTabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + focusableTabs.length) % focusableTabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = focusableTabs.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextTabId = focusableTabs[nextIndex].id;
      handleTabClick(nextTabId);
      const btn = document.getElementById(`boost-tab-${nextTabId}`);
      if (btn) btn.focus();
    }
  };

  return (
    <TabsContext.Provider value={{ active, setActive: handleTabClick }}>
      <div className={`boost-tabs ${className}`} style={{ fontFamily: 'inherit', width: '100%', ...style }}>
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
        aria-orientation="horizontal"
        className="boost-tab-header"
        onKeyDown={handleKeyDown}
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
              id={`boost-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`boost-tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
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

      {children ? (
        children
      ) : (
        <>
          {/* Tab panel content */}
          <div
            role="tabpanel"
            id={currentTab ? `boost-tabpanel-${currentTab.id}` : undefined}
            aria-labelledby={currentTab ? `boost-tab-${currentTab.id}` : undefined}
            tabIndex={0}
            className="boost-tab-panel"
            style={{ padding: '16px 0', color: 'var(--boost-text, #334155)', fontSize: '14px', lineHeight: 1.6 }}
          >
            {currentTab ? currentTab.content : null}
          </div>
        </>
      )}
    </div>
  </TabsContext.Provider>
  );
}) as unknown as TabsComponent;

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '', style, ...props }) => {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`boost-tab-header ${className}`}
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--boost-border, #e2e8f0)',
        gap: '8px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  icon,
  badge,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const ctx = useTabsContext();
  const isActive = ctx ? ctx.active === value : false;

  return (
    <button
      type="button"
      id={`boost-tab-${value}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`boost-tabpanel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx?.setActive(value)}
      className={`boost-tab-item ${isActive ? 'active' : ''} ${className}`}
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
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
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
          {badge}
        </span>
      )}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
  style,
  ...props
}) => {
  const ctx = useTabsContext();
  if (ctx && ctx.active !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`boost-tabpanel-${value}`}
      aria-labelledby={`boost-tab-${value}`}
      tabIndex={0}
      className={`boost-tab-panel ${className}`}
      style={{
        padding: '16px 0',
        color: 'var(--boost-text, #334155)',
        fontSize: '14px',
        lineHeight: 1.6,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
Tabs.displayName = 'Tabs';
