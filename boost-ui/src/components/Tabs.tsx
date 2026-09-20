import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

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
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
  preset: UIStylePreset;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);
export const useTabsContext = () => React.useContext(TabsContext);

interface TabsComponent extends React.FC<TabsProps> {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
}

export const Tabs: TabsComponent = (({
  tabs, items, defaultTab, activeTab: controlledTab, activeId: controlledId,
  value: controlledValue, defaultValue, onValueChange, onChange,
  children, stylePreset: stylePresetProp, className = '', style,
}: TabsProps) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const tabList = items || tabs || [];
  const currentActive = controlledValue !== undefined ? controlledValue : (controlledId !== undefined ? controlledId : controlledTab);
  const [internalTab, setInternalTab] = React.useState<string>(
    currentActive || defaultValue || defaultTab || (tabList[0] ? tabList[0].id : '')
  );
  const active = currentActive !== undefined ? currentActive : internalTab;

  const handleTabClick = (id: string) => {
    if (currentActive === undefined) setInternalTab(id);
    if (onValueChange) onValueChange(id);
    if (onChange) onChange(id);
  };

  const currentTab = tabList.find((t) => t.id === active) || tabList[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusableTabs = tabList.filter(t => !t.disabled);
    if (focusableTabs.length === 0) return;
    const currentIndex = focusableTabs.findIndex(t => t.id === active);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nextIndex = (currentIndex + 1) % focusableTabs.length; }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); nextIndex = (currentIndex - 1 + focusableTabs.length) % focusableTabs.length; }
    else if (e.key === 'Home') { e.preventDefault(); nextIndex = 0; }
    else if (e.key === 'End') { e.preventDefault(); nextIndex = focusableTabs.length - 1; }
    if (nextIndex !== currentIndex) {
      const nextTabId = focusableTabs[nextIndex].id;
      handleTabClick(nextTabId);
      const btn = document.getElementById(`boost-tab-${nextTabId}`);
      if (btn) btn.focus();
    }
  };

  const getHeaderStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = { display: 'flex', gap: '4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' };
    switch (preset) {
      case 'neo-brutalism': return { ...base, borderBottom: '3px solid #000', gap: '2px' };
      case 'glassmorphism': return { ...base, borderBottom: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '12px 12px 0 0', padding: '4px 4px 0' };
      case 'neumorphism': return { ...base, borderBottom: 'none', backgroundColor: '#e0e5ec', padding: '8px', borderRadius: '14px', gap: '8px' };
      case 'gradient-glow': return { ...base, borderBottom: '1px solid rgba(99,102,241,0.2)' };
      case 'material-you': return { ...base, borderBottom: '1px solid var(--boost-border,#e2e8f0)', gap: '0' };
      case 'dark-first': return { ...base, borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0f172a' };
      default: return { ...base, borderBottom: '1px solid var(--boost-border,#e2e8f0)', gap: '8px' };
    }
  };

  const getTabItemStyles = (isActive: boolean, disabled?: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '10px 16px', fontSize: '14px', fontFamily: 'inherit',
      fontWeight: isActive ? 600 : 500, border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
      transition: 'all 0.15s ease', backgroundColor: 'transparent',
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, color: '#000', fontWeight: isActive ? 800 : 500, borderBottom: isActive ? '3px solid #000' : '3px solid transparent', backgroundColor: isActive ? '#fbbf24' : 'transparent', borderRadius: '2px 2px 0 0' };
      case 'glassmorphism':
        return { ...base, color: isActive ? 'var(--boost-primary,#6366f1)' : 'var(--boost-text-muted,#64748b)', backgroundColor: isActive ? 'rgba(99,102,241,0.12)' : 'transparent', borderRadius: '8px', borderBottom: isActive ? '2px solid rgba(99,102,241,0.7)' : '2px solid transparent' };
      case 'neumorphism':
        return { ...base, color: isActive ? 'var(--boost-primary,#2563eb)' : '#64748b', backgroundColor: isActive ? '#e0e5ec' : 'transparent', borderRadius: '10px', boxShadow: isActive ? 'inset 3px 3px 7px #c8cdd5, inset -3px -3px 7px #f8fdff' : 'none', border: 'none' };
      case 'gradient-glow':
        return { ...base, color: isActive ? 'var(--boost-primary,#6366f1)' : 'var(--boost-text-muted,#64748b)', borderBottom: isActive ? '2px solid var(--boost-primary,#6366f1)' : '2px solid transparent', textShadow: isActive ? '0 0 12px rgba(99,102,241,0.5)' : 'none' };
      case 'material-you':
        return { ...base, color: isActive ? 'var(--boost-primary,#6750a4)' : 'var(--boost-text-muted,#49454f)', borderBottom: isActive ? '3px solid var(--boost-primary,#6750a4)' : '3px solid transparent', borderRadius: '0', padding: '12px 20px' };
      case 'dark-first':
        return { ...base, color: isActive ? '#60a5fa' : '#64748b', borderBottom: isActive ? '2px solid #60a5fa' : '2px solid transparent', backgroundColor: 'transparent' };
      default:
        return { ...base, color: isActive ? 'var(--boost-primary,#2563eb)' : 'var(--boost-text-muted,#64748b)', borderBottom: isActive ? '2px solid var(--boost-primary,#2563eb)' : '2px solid transparent' };
    }
  };

  return (
    <TabsContext.Provider value={{ active, setActive: handleTabClick, preset }}>
      <div className={`boost-tabs boost-tabs-preset-${preset} ${className}`} style={{ fontFamily: 'inherit', width: '100%', ...style }}>
        <style>{`
          :root[data-theme="dark"] .boost-tabs-preset-${preset} .boost-tab-panel { color: #cbd5e1 !important; }
          :root[data-theme="dark"] .boost-tabs-preset-${preset} .boost-tab-header { border-bottom-color: rgba(255,255,255,0.1) !important; }
        `}</style>

        <div role="tablist" aria-orientation="horizontal" className="boost-tab-header" onKeyDown={handleKeyDown} style={getHeaderStyles()}>
          {tabList.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button key={tab.id} id={`boost-tab-${tab.id}`} role="tab" aria-selected={isActive}
                aria-controls={`boost-tabpanel-${tab.id}`} tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled} onClick={() => handleTabClick(tab.id)}
                className={`boost-tab-item ${isActive ? 'active' : ''}`}
                style={getTabItemStyles(isActive, tab.disabled)}
              >
                {tab.icon && <span style={{ display: 'inline-flex' }}>{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: preset === 'neo-brutalism' ? '2px' : '9999px', backgroundColor: isActive ? 'rgba(37,99,235,0.1)' : 'var(--boost-surface-secondary,#f1f5f9)', color: isActive ? 'var(--boost-primary,#1d4ed8)' : 'var(--boost-text-muted,#64748b)', fontWeight: 600, border: preset === 'neo-brutalism' ? '1px solid #000' : 'none' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {children ? children : (
          <div role="tabpanel" id={currentTab ? `boost-tabpanel-${currentTab.id}` : undefined}
            aria-labelledby={currentTab ? `boost-tab-${currentTab.id}` : undefined} tabIndex={0}
            className="boost-tab-panel"
            style={{ padding: preset === 'neumorphism' ? '16px 8px 0' : '16px 0', color: preset === 'dark-first' ? '#cbd5e1' : 'var(--boost-text,#334155)', fontSize: '14px', lineHeight: 1.6 }}
          >
            {currentTab ? currentTab.content : null}
          </div>
        )}
      </div>
    </TabsContext.Provider>
  );
}) as unknown as TabsComponent;

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '', style, ...props }) => {
  const ctx = useTabsContext();
  const preset = ctx?.preset ?? 'minimal';
  const getHeaderStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = { display: 'flex', gap: '4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' };
    switch (preset) {
      case 'neo-brutalism': return { ...base, borderBottom: '3px solid #000' };
      case 'glassmorphism': return { ...base, borderBottom: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '12px 12px 0 0', padding: '4px 4px 0' };
      case 'neumorphism': return { ...base, borderBottom: 'none', backgroundColor: '#e0e5ec', padding: '8px', borderRadius: '14px', gap: '8px' };
      case 'dark-first': return { ...base, borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0f172a' };
      default: return { ...base, borderBottom: '1px solid var(--boost-border,#e2e8f0)', gap: '8px' };
    }
  };
  return (
    <div role="tablist" aria-orientation="horizontal" className={`boost-tab-header ${className}`} style={{ ...getHeaderStyles(), ...style }} {...props}>
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

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, icon, badge, disabled, className = '', style, ...props }) => {
  const ctx = useTabsContext();
  const isActive = ctx ? ctx.active === value : false;
  const preset = ctx?.preset ?? 'minimal';

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '14px', fontFamily: 'inherit', fontWeight: isActive ? 600 : 500, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap', transition: 'all 0.15s ease', backgroundColor: 'transparent' };
    switch (preset) {
      case 'neo-brutalism': return { ...base, color: '#000', fontWeight: isActive ? 800 : 500, borderBottom: isActive ? '3px solid #000' : '3px solid transparent', backgroundColor: isActive ? '#fbbf24' : 'transparent', borderRadius: '2px 2px 0 0' };
      case 'glassmorphism': return { ...base, color: isActive ? 'var(--boost-primary,#6366f1)' : 'var(--boost-text-muted,#64748b)', backgroundColor: isActive ? 'rgba(99,102,241,0.12)' : 'transparent', borderRadius: '8px', borderBottom: isActive ? '2px solid rgba(99,102,241,0.7)' : '2px solid transparent' };
      case 'neumorphism': return { ...base, color: isActive ? 'var(--boost-primary,#2563eb)' : '#64748b', backgroundColor: '#e0e5ec', borderRadius: '10px', boxShadow: isActive ? 'inset 3px 3px 7px #c8cdd5, inset -3px -3px 7px #f8fdff' : 'none', border: 'none' };
      case 'dark-first': return { ...base, color: isActive ? '#60a5fa' : '#64748b', borderBottom: isActive ? '2px solid #60a5fa' : '2px solid transparent' };
      case 'material-you': return { ...base, color: isActive ? 'var(--boost-primary,#6750a4)' : 'var(--boost-text-muted,#49454f)', borderBottom: isActive ? '3px solid var(--boost-primary,#6750a4)' : '3px solid transparent', padding: '12px 20px' };
      default: return { ...base, color: isActive ? 'var(--boost-primary,#2563eb)' : 'var(--boost-text-muted,#64748b)', borderBottom: isActive ? '2px solid var(--boost-primary,#2563eb)' : '2px solid transparent' };
    }
  };

  return (
    <button type="button" id={`boost-tab-${value}`} role="tab" aria-selected={isActive} aria-controls={`boost-tabpanel-${value}`} tabIndex={isActive ? 0 : -1} disabled={disabled} onClick={() => ctx?.setActive(value)} className={`boost-tab-item ${isActive ? 'active' : ''} ${className}`} style={{ ...getStyles(), ...style }} {...props}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: preset === 'neo-brutalism' ? '2px' : '9999px', backgroundColor: isActive ? 'rgba(37,99,235,0.1)' : 'var(--boost-surface-secondary,#f1f5f9)', color: isActive ? 'var(--boost-primary,#1d4ed8)' : 'var(--boost-text-muted,#64748b)', fontWeight: 600, border: preset === 'neo-brutalism' ? '1px solid #000' : 'none' }}>
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

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '', style, ...props }) => {
  const ctx = useTabsContext();
  if (ctx && ctx.active !== value) return null;
  const preset = ctx?.preset ?? 'minimal';
  return (
    <div role="tabpanel" id={`boost-tabpanel-${value}`} aria-labelledby={`boost-tab-${value}`} tabIndex={0} className={`boost-tab-panel ${className}`}
      style={{ padding: preset === 'neumorphism' ? '16px 8px 0' : '16px 0', color: preset === 'dark-first' ? '#cbd5e1' : 'var(--boost-text,#334155)', fontSize: '14px', lineHeight: 1.6, ...style }}
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
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';
