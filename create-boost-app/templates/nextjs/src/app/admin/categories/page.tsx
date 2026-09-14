'use client';

import React, { useEffect, useState } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Layers,
  Folder,
  ChevronRight,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  Edit2,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface CategoryItem {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: {
    _id: string;
    name: string;
    slug: string;
  } | string | null;
  displayOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'main' | 'sub'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    description: '',
    parent: '',
    displayOrder: 0,
    isActive: true,
  });

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleOpenCreate() {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      image: '',
      description: '',
      parent: '',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  }

  function handleOpenEdit(cat: CategoryItem) {
    setEditingCategory(cat);
    const parentId =
      typeof cat.parent === 'object' && cat.parent ? cat.parent._id : cat.parent || '';
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      description: cat.description || '',
      parent: parentId,
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive,
    });
    setModalOpen(true);
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const method = editingCategory ? 'PATCH' : 'POST';
      const body = editingCategory
        ? { id: editingCategory.id || (editingCategory as any)._id, ...formData }
        : formData;

      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          type: 'success',
          text: editingCategory ? 'Category updated successfully!' : 'Category created successfully!',
        });
        setTimeout(() => setToast(null), 3500);
        setModalOpen(false);
        loadCategories();
      } else {
        setToast({ type: 'error', text: data.error || 'Failed to save category' });
      }
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', text: 'Network error saving category' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', text: `Category "${name}" deleted.` });
        setTimeout(() => setToast(null), 3000);
        setCategories((prev) => prev.filter((c) => (c.id || (c as any)._id) !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting category');
    }
  }

  async function handleToggleStatus(cat: CategoryItem) {
    const newStatus = !cat.isActive;
    const catId = cat.id || (cat as any)._id;
    try {
      setCategories((prev) =>
        prev.map((c) => ((c.id || (c as any)._id) === catId ? { ...c, isActive: newStatus } : c))
      );
      await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: catId, isActive: newStatus }),
      });
    } catch (err) {
      console.error(err);
      loadCategories();
    }
  }

  // Parent Categories list for dropdown selection
  const parentCandidates = categories.filter((c) => !c.parent);

  const mainCategoriesCount = categories.filter((c) => !c.parent).length;
  const subCategoriesCount = categories.filter((c) => !!c.parent).length;

  const filteredCategories = categories.filter((cat) => {
    // Type filter
    if (filterType === 'main' && cat.parent) return false;
    if (filterType === 'sub' && !cat.parent) return false;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const parentName =
      typeof cat.parent === 'object' && cat.parent ? cat.parent.name : '';
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.slug?.toLowerCase().includes(q) ||
      parentName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xs p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 uppercase tracking-widest">
              Taxonomy Management
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MongoDB Sync
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Categories & Subcategories Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl">
            Manage multi-tier product catalog hierarchy. Parent categories automatically group sub-collections on the storefront mega-menu and search filters.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10 flex-shrink-0">
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Categories
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Direct from MongoDB</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Parent Categories
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{mainCategoriesCount}</div>
            <div className="text-[11px] text-indigo-600 font-medium mt-0.5">Top-level collections</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Folder className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Nested Subcategories
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{subCategoriesCount}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Linked to parent tree</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 animate-in fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tab Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            All Items ({categories.length})
          </button>
          <button
            onClick={() => setFilterType('main')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'main'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Main Categories ({mainCategoriesCount})
          </button>
          <button
            onClick={() => setFilterType('sub')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'sub'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Subcategories ({subCategoriesCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search category, slug, or parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
          />
        </div>
      </div>

      {/* Main Table & Cards */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-slate-400">Loading categories & subcategories from MongoDB...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <FolderTree className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-slate-800">No categories found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or tab filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Hierarchy Type</th>
                    <th className="py-3.5 px-5">Parent Category</th>
                    <th className="py-3.5 px-5">Slug</th>
                    <th className="py-3.5 px-5">Order</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredCategories.map((cat, idx) => {
                    const catId = cat.id || (cat as any)._id || idx;
                    const isSub = !!cat.parent;
                    const parentName =
                      typeof cat.parent === 'object' && cat.parent ? cat.parent.name : null;

                    return (
                      <tr key={catId} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                            {cat.image ? (
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                {isSub ? <Layers className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {cat.name}
                            </div>
                            {cat.description && (
                              <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                {cat.description}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          {isSub ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              <Layers className="w-3 h-3" />
                              Subcategory
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <Folder className="w-3 h-3" />
                              Main Category
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-slate-700">
                          {parentName ? (
                            <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                              <ChevronRight className="w-3 h-3 text-indigo-600" />
                              {parentName}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">— (Top Root)</span>
                          )}
                        </td>

                        <td className="py-4 px-5 font-mono text-[11px] text-slate-500">
                          /{cat.slug}
                        </td>

                        <td className="py-4 px-5 font-mono font-bold text-slate-700">
                          {cat.displayOrder || 0}
                        </td>

                        <td className="py-4 px-5">
                          <button
                            onClick={() => handleToggleStatus(cat)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-black cursor-pointer transition ${
                              cat.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                cat.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            {cat.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        <td className="py-4 px-5 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-flex transition cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id || (cat as any)._id, cat.name)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 inline-flex transition cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredCategories.map((cat, idx) => {
                const catId = cat.id || (cat as any)._id || idx;
                const isSub = !!cat.parent;
                const parentName =
                  typeof cat.parent === 'object' && cat.parent ? cat.parent.name : null;

                return (
                  <div key={catId} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              {isSub ? <Layers className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs">{cat.name}</h3>
                          <span className="text-[10px] font-mono text-slate-500">/{cat.slug}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase font-black cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
                      <div>
                        {isSub ? (
                          <span className="text-purple-700 font-bold text-[10px] flex items-center gap-1">
                            <Layers className="w-3 h-3" /> Subcategory of {parentName || 'Parent'}
                          </span>
                        ) : (
                          <span className="text-indigo-700 font-bold text-[10px] flex items-center gap-1">
                            <Folder className="w-3 h-3" /> Root Category
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id || (cat as any)._id, cat.name)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <FolderTree className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Create Category / Subcategory'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel Bags, Hoodies, Sneakers..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Parent Category (Leave empty for Root Category)
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                >
                  <option value="">None (Top-Level Parent Category)</option>
                  {parentCandidates
                    .filter((p) => (editingCategory ? (p.id || (p as any)._id) !== (editingCategory.id || (editingCategory as any)._id) : true))
                    .map((p) => (
                      <option key={p.id || (p as any)._id} value={p.id || (p as any)._id}>
                        {p.name}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  If selected, this category will function as a subcategory grouped under the selected parent.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated from name"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or /images/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for collection preview"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                />
                <label htmlFor="catActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Visible on Storefront (Active)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
