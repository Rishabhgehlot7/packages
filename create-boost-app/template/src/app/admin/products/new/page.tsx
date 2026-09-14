'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    brand: 'Boost Aesthetic',
    category: 'Hoodies',
    sku: '',
    hsnCode: '6109',
    taxRate: '18',
    images: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    tags: 'streetwear, oversized, winter',
    inStock: true,
  });

  const [variants, setVariants] = useState<
    Array<{ size: string; color: string; price: string; stock: string }>
  >([
    { size: 'M', color: 'Black', price: '', stock: '10' },
    { size: 'L', color: 'Black', price: '', stock: '5' },
  ]);

  function handleAddVariant() {
    setVariants([...variants, { size: 'XL', color: 'Black', price: formData.price, stock: '5' }]);
  }

  function handleRemoveVariant(idx: number) {
    setVariants(variants.filter((_, i) => i !== idx));
  }

  function handleVariantChange(idx: number, field: string, val: string) {
    const updated = [...variants];
    (updated[idx] as any)[field] = val;
    setVariants(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill Title and Price.');
      return;
    }

    try {
      setSubmitting(true);
      const formattedVariants = variants.map((v, i) => ({
        id: `v_${Date.now()}_${i}`,
        title: `${v.size} / ${v.color}`,
        sku: `${formData.sku || 'SKU'}-${v.size}-${v.color.slice(0, 3).toUpperCase()}`,
        price: Number(v.price || formData.price),
        compareAtPrice: Number(formData.compareAtPrice || formData.price),
        stock: Number(v.stock || 10),
        attributes: { Size: v.size, Color: v.color },
      }));

      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice || formData.price),
        brand: formData.brand,
        category: formData.category,
        sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
        hsnCode: formData.hsnCode,
        taxRate: Number(formData.taxRate),
        images: formData.images
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        tags: formData.tags.split(',').map((s) => s.trim()),
        inStock: formData.inStock,
        variants: formattedVariants,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/products');
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/products" className="hover:text-indigo-600 transition">
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">New Product</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Create New Product</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="product-form"
            disabled={submitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            {submitting ? 'Saving Product...' : 'Publish Product'}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            General Information
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Cyberpunk Heavyweight Streetwear Hoodie"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={4}
              placeholder="Explain materials, fit, care instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              >
                <option value="Hoodies">Hoodies</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Footwear">Footwear</option>
                <option value="Jackets">Jackets</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Pricing & Indian GST
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">MRP Strike Price (₹)</label>
              <input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">HSN Code</label>
              <input
                type="text"
                value={formData.hsnCode}
                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tax Rate (%)</label>
              <select
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product Media</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Image URLs (1 per line)</label>
            <textarea
              rows={3}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Variants</h2>
              <p className="text-xs text-slate-500">Size, color, and stock limits</p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200/80 cursor-pointer transition shadow-2xs"
            >
              + Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 items-center"
              >
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Size</label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Color</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder={formData.price || 'Price'}
                    value={variant.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2 py-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
