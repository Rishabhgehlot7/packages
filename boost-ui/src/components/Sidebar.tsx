import * as React from 'react';

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
  groups: SidebarGroup[];
  activeId?: string;
  onSelect?: (id: string) => void;
  collapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  groups,
  activeId,
  onSelect,
  collapsed = false,
  header,
  footer,
  className = '',
}) => {
  return (
    <aside
      className={`boost-sidebar ${className}`}
      style={{
        width: collapsed ? '68px' : '260px',
        height: '100%',
        backgroundColor: 'var(--boost-surface, #ffffff)',
        borderRight: '1px solid var(--boost-border, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'inherit',
        transition: 'width 0.2s ease',
        boxSizing: 'border-box',
      }}
    >
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
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    if (onSelect) onSelect(item.id);
                  }}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '10px' : '10px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                    color: isActive ? 'var(--boost-primary, #3b82f6)' : 'var(--boost-text, #475569)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
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
