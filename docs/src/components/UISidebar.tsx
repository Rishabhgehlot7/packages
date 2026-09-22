import React, { useState } from 'react';
import { UI_CATEGORIES, UI_COMPONENTS_DATA } from '../data/uiComponentsData';
import {
  Filter as FilterIcon,
  ShoppingCart,
  Navigation,
  MousePointer,
  CheckSquare,
  Bell,
  Layout,
  Layers,
  BarChart2,
  Lock,
  Boxes,
  Sparkles,
  Activity,
  BookOpen,
} from 'lucide-react';

interface UISidebarProps {
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isDocsActive?: boolean;
  onSelectDocs?: () => void;
}

export const UISidebar: React.FC<UISidebarProps> = ({
  selectedComponentId,
  onSelectComponent,
  isOpen,
  onClose,
  isDocsActive,
  onSelectDocs,
}) => {
  const [filterText, setFilterText] = useState('');

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'buttons':
        return <MousePointer size={15} />;
      case 'forms':
        return <CheckSquare size={15} />;
      case 'feedback':
        return <Bell size={15} />;
      case 'content':
        return <Layout size={15} />;
      case 'overlays':
        return <Layers size={15} />;
      case 'primitives':
        return <Boxes size={15} />;
      case 'navigation':
        return <Navigation size={15} />;
      case 'data':
        return <BarChart2 size={15} />;
      case 'auth':
        return <Lock size={15} />;
      case 'ecommerce':
        return <ShoppingCart size={15} />;
      case 'marketing':
        return <Sparkles size={15} />;
      case 'saas':
        return <Activity size={15} />;
      default:
        return <Layout size={15} />;
    }
  };

  const filteredComponents = UI_COMPONENTS_DATA.filter((comp) =>
    comp.name.toLowerCase().includes(filterText.toLowerCase()) ||
    comp.description.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="sidebar-search-input"
          placeholder={`Filter ${UI_COMPONENTS_DATA.length}+ UI components...`}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <FilterIcon
          size={14}
          style={{ position: 'absolute', right: '10px', top: '10px', color: 'var(--text-dim)' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Getting Started & Installation Link */}
        <div className="category-group" style={{ marginBottom: '0.25rem' }}>
          <div className="category-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BookOpen size={15} />
              <span>Overview</span>
            </div>
          </div>
          <div
            className={`nav-item ${isDocsActive ? 'active' : ''}`}
            onClick={() => {
              if (onSelectDocs) onSelectDocs();
              onClose();
            }}
          >
            <span>Installation & Theming</span>
            <span className="item-badge core">v2.1.1</span>
          </div>
        </div>

        {UI_CATEGORIES.map((category) => {
          const categoryItems = filteredComponents.filter(
            (item) => item.category === category.id
          );

          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="category-group">
              <div className="category-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {getCategoryIcon(category.id)}
                  <span>{category.name}</span>
                </div>
                <span className="item-badge">{categoryItems.length}</span>
              </div>

              {categoryItems.map((item) => {
                const isActive = item.id === selectedComponentId;
                return (
                  <div
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onSelectComponent(item.id);
                      onClose();
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={`item-badge ${item.badge.includes('India') ? 'india' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
          <span>{UI_COMPONENTS_DATA.length}+ Components</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>7 Presets Ready</span>
        </div>
      </div>
    </aside>
  );
};
