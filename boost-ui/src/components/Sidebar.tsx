import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  href?: string;
  onClick?: () => void;
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  groups?: SidebarGroup[];
  activeId?: string;
  onSelect?: (id: string) => void;
  collapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  stylePreset?: UIStylePreset;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  groups = [],
  activeId,
  onSelect,
  collapsed = false,
  header,
  footer,
  stylePreset: stylePresetProp,
  className = '',
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const getSidebarStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = { width: collapsed ? '68px' : '260px', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', transition: 'width 0.2s ease', boxSizing: 'border-box' };
    switch (preset) {
      case 'neo-brutalism': return { ...base, backgroundColor: '#ffffff', borderRight: '3px solid #000' };
      case 'glassmorphism': return { ...base, backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.3)', boxShadow: '2px 0 20px rgba(0,0,0,0.06)' };
      case 'neumorphism': return { ...base, backgroundColor: '#e0e5ec', borderRight: 'none', boxShadow: '4px 0 14px #d1d9e6' };
      case 'gradient-glow': return { ...base, backgroundColor: 'var(--boost-surface,#ffffff)', borderRight: '1px solid rgba(99,102,241,0.2)', boxShadow: '2px 0 16px rgba(99,102,241,0.08)' };
      case 'material-you': return { ...base, backgroundColor: 'var(--boost-surface,#fffbfe)', borderRight: '1px solid var(--boost-border,#e2e8f0)' };
      case 'dark-first': return { ...base, backgroundColor: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.06)' };
      default: return { ...base, backgroundColor: 'var(--boost-surface,#ffffff)', borderRight: '1px solid var(--boost-border,#e2e8f0)' };
    }
  };

  const getItemStyles = (isActive: boolean): React.CSSProperties => {
    const base: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: collapsed ? '10px' : '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start', fontWeight: isActive ? 600 : 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s ease', borderRadius: '8px' };
    switch (preset) {
      case 'neo-brutalism': return { ...base, backgroundColor: isActive ? '#fbbf24' : 'transparent', color: '#000', border: isActive ? '2px solid #000' : '2px solid transparent', borderRadius: '2px', fontWeight: isActive ? 800 : 500 };
      case 'glassmorphism': return { ...base, backgroundColor: isActive ? 'rgba(99,102,241,0.14)' : 'transparent', color: isActive ? 'var(--boost-primary,#6366f1)' : 'var(--boost-text,#475569)', borderRadius: '10px' };
      case 'neumorphism': return { ...base, backgroundColor: '#e0e5ec', color: isActive ? 'var(--boost-primary,#2563eb)' : '#475569', borderRadius: '10px', boxShadow: isActive ? 'inset 3px 3px 7px #c8cdd5, inset -3px -3px 7px #f8fdff' : 'none' };
      case 'gradient-glow': return { ...base, backgroundColor: isActive ? 'rgba(99,102,241,0.1)' : 'transparent', color: isActive ? 'var(--boost-primary,#6366f1)' : 'var(--boost-text,#475569)', borderRadius: '8px' };
      case 'material-you': return { ...base, backgroundColor: isActive ? 'var(--boost-surface-secondary,#e8def8)' : 'transparent', color: isActive ? 'var(--boost-primary,#6750a4)' : 'var(--boost-text,#49454f)', borderRadius: '9999px' };
      case 'dark-first': return { ...base, backgroundColor: isActive ? '#1e293b' : 'transparent', color: isActive ? '#60a5fa' : '#94a3b8', borderRadius: '8px' };
      default: return { ...base, backgroundColor: isActive ? 'rgba(37,99,235,0.12)' : 'transparent', color: isActive ? 'var(--boost-primary,#3b82f6)' : 'var(--boost-text,#475569)' };
    }
  };
  return (
    <aside
      className={`boost-sidebar boost-sidebar-preset-${preset} ${className}`}
      style={getSidebarStyles()}
    >
      <style>{`
        :root[data-theme="dark"] .boost-sidebar-preset-${preset} { background-color: var(--boost-surface,#1e293b) !important; border-right-color: rgba(255,255,255,0.1) !important; }
        :root[data-theme="dark"] .boost-sidebar-preset-${preset} .sidebar-nav-item { color: #cbd5e1 !important; }
        :root[data-theme="dark"] .boost-sidebar-preset-${preset} .sidebar-nav-item:hover { background-color: rgba(255,255,255,0.05) !important; color: #ffffff !important; }
        :root[data-theme="dark"] .boost-sidebar-preset-${preset} .sidebar-nav-item.active { background-color: rgba(99,102,241,0.15) !important; color: #818cf8 !important; }
      `}</style>
      {header && (
        <div style={{ padding: '16px', borderBottom: '1px solid var(--boost-border, #f1f5f9)' }}>
          {header}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {groups.map((grp, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {grp.title && !collapsed && (
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--boost-text-muted, #94a3b8)', textTransform: 'uppercase', padding: '4px 12px', letterSpacing: '0.05em' }}>
                {grp.title}
              </span>
            )}

            {grp.items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <div
                  key={item.id}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    if (onSelect) onSelect(item.id);
                  }}
                  title={collapsed ? item.label : undefined}
                  style={getItemStyles(isActive)}
                >
                  {item.icon && <span style={{ display: 'inline-flex', color: isActive ? 'var(--boost-primary, #3b82f6)' : 'var(--boost-text-muted, #64748b)' }}>{item.icon}</span>}
                  {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '9999px', backgroundColor: isActive ? 'var(--boost-primary, #3b82f6)' : 'var(--boost-border, #e2e8f0)', color: isActive ? '#ffffff' : 'var(--boost-text, #64748b)' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {footer && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--boost-border, #f1f5f9)' }}>
          {footer}
        </div>
      )}
    </aside>
  );
};


Sidebar.displayName = 'Sidebar';
