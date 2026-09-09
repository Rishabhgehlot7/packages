'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoreProduct } from '../../../data/products';
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Package,
  Layers,
  Tag,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  }

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Product Inventory & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage SKUs, dynamic pricing tiers, HSN tax classifications, and product variants.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition active:scale-95 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-900/90 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search title, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Container */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading live products from MongoDB...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs space-y-2">
            <Package className="w-8 h-8 mx-auto text-slate-600" />
            <p className="font-semibold">No products matched your search or filter.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800/80 bg-slate-950/60">
                  <tr>
                    <th className="py-3.5 px-5">Product Info</th>
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Price</th>
                    <th className="py-3.5 px-5">SKU & HSN</th>
                    <th className="py-3.5 px-5">Variants</th>
                    <th className="py-3.5 px-5">Stock Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filtered.map((product, idx) => (
                    <tr key={product.id || (product as any)._id || (product as any).slug || product.sku || idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 px-5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden relative flex-shrink-0 border border-slate-700/60">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-white truncate text-xs">
                            {product.title}
                          </div>
                          <div className="text-[11px] text-indigo-400 font-semibold">
                            {product.brand}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-300 font-semibold">
                        {product.category}
                      </td>

                      <td className="py-4 px-5">
                        <span className="text-white font-black text-xs block">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price ? (
                          <span className="text-[10px] text-slate-500 line-through">
                            ₹{product.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        ) : null}
                      </td>

                      <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                        <div className="font-bold text-slate-200">{product.sku}</div>
                        <div className="text-[10px] text-slate-500">HSN: {product.hsnCode}</div>
                      </td>

                      <td className="py-4 px-5 text-slate-400">
                        {product.variants && product.variants.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[11px] font-bold border border-indigo-500/20">
                            <Layers className="w-3 h-3" />
                            {product.variants.length} options
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Single SKU</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                            product.inStock
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.inStock ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right space-x-1.5">
                        <Link
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 inline-flex transition"
                          title="Preview on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 inline-flex transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (< 768px) */}
            <div className="md:hidden divide-y divide-slate-800/60">
              {filtered.map((product, idx) => (
                <div key={product.id || (product as any)._id || (product as any).slug || product.sku || idx} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden relative flex-shrink-0 border border-slate-700/60">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs line-clamp-1">
                        {product.title}
                      </div>
                      <div className="text-[11px] text-indigo-400 font-semibold">
                        {product.brand} • {product.category}
                      </div>
                      <div className="flex items-baseline gap-1.5 pt-0.5">
                        <span className="text-white font-black text-xs">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price ? (
                          <span className="text-[10px] text-slate-500 line-through">
                            ₹{product.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        product.inStock
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-white"
                        title="Preview on Storefront"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
