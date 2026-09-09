'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoreProduct } from '../../../data/products';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Catalog</h1>
          <p className="text-sm text-slate-400">
            Manage your store inventory, pricing, SKU codes, and variant levels.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
        >
          <span>+</span>
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search title, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">Loading product catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">No products matched your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">SKU / HSN</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-lg bg-slate-800 overflow-hidden relative flex-shrink-0 border border-slate-700/60">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            🏷️
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <div className="font-semibold text-white truncate">{product.title}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{product.brand}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{product.category}</td>
                    <td className="py-3.5 px-4 text-white font-bold">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      <div>{product.sku}</div>
                      <div className="text-[10px] text-slate-500">HSN: {product.hsnCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {product.variants && product.variants.length > 0 ? (
                        <span className="text-indigo-400 font-semibold">
                          {product.variants.length} options
                        </span>
                      ) : (
                        <span className="text-slate-600">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          product.inStock
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="text-slate-400 hover:text-white transition"
                        title="Preview on Store"
                      >
                        👁️
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="text-rose-400 hover:text-rose-300 transition"
                        title="Delete Product"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
