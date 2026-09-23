'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Tag,
  Percent,
  Gift,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

interface BundleCampaign {
  id: string;
  name: string;
  type: 'fixed_combo' | 'mix_and_match' | 'volume_tier' | 'gift_with_purchase';
  discountValue: string;
  minItemsRequired: number;
  productsIncluded: string[];
  status: 'active' | 'scheduled' | 'paused';
  totalBundlesSold: number;
  revenueGenerated: number;
}

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<BundleCampaign[]>([
    {
      id: 'bdl_01',
      name: 'Gym Bro Starter Combo (Whey + Creatine + Shaker)',
      type: 'fixed_combo',
      discountValue: '20% Combo Discount',
      minItemsRequired: 3,
      productsIncluded: ['Pure Whey 1kg', 'Micronized Creatine', 'Stainless Shaker'],
      status: 'active',
      totalBundlesSold: 412,
      revenueGenerated: 1442000
    },
    {
      id: 'bdl_02',
      name: 'Custom T-Shirt 3-Pack Mix & Match Builder',
      type: 'mix_and_match',
      discountValue: 'Buy 3 for ₹1,999 (Save ₹1,000)',
      minItemsRequired: 3,
      productsIncluded: ['Oversized Tee (Any Color/Size)'],
      status: 'active',
      totalBundlesSold: 650,
      revenueGenerated: 1299350
    },
    {
      id: 'bdl_03',
      name: 'Tiered Volume Quantity Discount Ladder',
      type: 'volume_tier',
      discountValue: 'Buy 2: 10% Off | Buy 3: 20% Off',
      minItemsRequired: 2,
      productsIncluded: ['All Apparel Catalog'],
      status: 'active',
      totalBundlesSold: 890,
      revenueGenerated: 2136000
    },
    {
      id: 'bdl_04',
      name: 'Free Duffel Bag on Orders above ₹3,499 (GWP)',
      type: 'gift_with_purchase',
      discountValue: 'Free Gift Item (Worth ₹999)',
      minItemsRequired: 1,
      productsIncluded: ['Storewide Cart Threshold'],
      status: 'active',
      totalBundlesSold: 280,
      revenueGenerated: 1120000
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'fixed_combo' | 'mix_and_match' | 'volume_tier' | 'gift_with_purchase'>('fixed_combo');
  const [discountValue, setDiscountValue] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newBundle: BundleCampaign = {
      id: `bdl_${Date.now()}`,
      name: name || 'New Combo Bundle Deal',
      type,
      discountValue: discountValue || '15% Off',
      minItemsRequired: 2,
      productsIncluded: ['Selected Products'],
      status: 'active',
      totalBundlesSold: 0,
      revenueGenerated: 0
    };

    setBundles([newBundle, ...bundles]);
    setIsModalOpen(false);
    setName('');
    setDiscountValue('');
  };

  const totalSold = bundles.reduce((acc, b) => acc + b.totalBundlesSold, 0);
  const totalRev = bundles.reduce((acc, b) => acc + b.revenueGenerated, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Bundles & Volume Pricing Studio
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="h-3 w-3" />
              @boostengine/bundles
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Increase Average Order Value (AOV) with mix-and-match box builders, tiered volume discounts, and gift-with-purchase triggers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-amber-500 hover:to-orange-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create New Bundle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Bundles Sold</span>
            <Boxes className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {totalSold.toLocaleString('en-IN')} Bundles
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            +38% Lift in basket size
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Bundle Revenue GMV</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            ₹{totalRev.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            Direct high-AOV revenue contribution
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Avg. Basket Expansion</span>
            <Gift className="h-5 w-5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            +2.4 Items / Order
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
            Cross-sell combo conversion
          </span>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map(b => (
          <div
            key={b.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${
                      b.type === 'fixed_combo'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : b.type === 'mix_and_match'
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : b.type === 'volume_tier'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {b.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2">{b.name}</h3>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </span>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-1">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Discount & Pricing Strategy</div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{b.discountValue}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Products Included:</div>
                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {b.productsIncluded.join(' + ')}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{b.totalBundlesSold}</span> sold
              </div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{b.revenueGenerated.toLocaleString('en-IN')} GMV
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Create Bundle Deal</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Configure combo packages, mix-and-match custom kits, or volume discount breaks.
            </p>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Bundle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Essentials 3-Piece Kit"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Bundle Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="fixed_combo">Fixed Product Combo (Bundle Set)</option>
                  <option value="mix_and_match">Mix & Match Custom Box Builder</option>
                  <option value="volume_tier">Tiered Volume Quantity Discount</option>
                  <option value="gift_with_purchase">Gift-with-Purchase (GWP Threshold)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Discount Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buy 3 for ₹1,999 or 20% Combo Discount"
                  value={discountValue}
                  onChange={e => setDiscountValue(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 shadow-sm"
                >
                  Save & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
