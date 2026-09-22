import React, { useState } from 'react';
import { CATEGORIES } from '../data/packagesData';
import { PackageDoc } from '../types';
import { 
  Rocket, 
  Cpu, 
  CreditCard, 
  Truck, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Wrench,
  ChevronRight,
  Filter
} from 'lucide-react';

interface SidebarProps {
  packages: PackageDoc[];
  selectedPackageId: string;
  onSelectPackage: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  isOpen,
  onClose
}) => {
  const [filterText, setFilterText] = useState('');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return <Rocket size={15} />;
      case 'Cpu': return <Cpu size={15} />;
      case 'CreditCard': return <CreditCard size={15} />;
      case 'Truck': return <Truck size={15} />;
      case 'TrendingUp': return <TrendingUp size={15} />;
      case 'ShieldCheck': return <ShieldCheck size={15} />;
      case 'Search': return <Search size={15} />;
      case 'Wrench': return <Wrench size={15} />;
      default: return <ChevronRight size={15} />;
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(filterText.toLowerCase()) ||
    pkg.description.toLowerCase().includes(filterText.toLowerCase()) ||
    pkg.id.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text"
          className="sidebar-search-input"
          placeholder="Filter packages..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <Filter 
          size={14} 
          style={{ position: 'absolute', right: '10px', top: '10px', color: 'var(--text-dim)' }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {CATEGORIES.map(category => {
          const categoryPackages = filteredPackages.filter(
            pkg => pkg.categoryId === category.id
          );

          if (categoryPackages.length === 0) return null;

          return (
            <div key={category.id} className="category-group">
              <div className="category-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {getCategoryIcon(category.icon)}
                  <span>{category.name}</span>
                </div>
                {category.badge && (
                  <span className="item-badge">{category.badge}</span>
                )}
              </div>

              {categoryPackages.map(pkg => {
                const isActive = pkg.id === selectedPackageId;
                return (
                  <div
                    key={pkg.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onSelectPackage(pkg.id);
                      onClose();
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pkg.name.replace('@boostengine/', '')}
                    </span>
                    {pkg.badge && (
                      <span className={`item-badge ${pkg.badge.includes('GST') ? 'india' : ''}`}>
                        {pkg.badge}
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
          <span>Ecosystem v2.1.1 · 24 Packages</span>
          <span style={{ color: '#10b981', fontWeight: 600 }}>● All Systems Go</span>
        </div>
      </div>
    </aside>
  );
};
