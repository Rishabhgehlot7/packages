'use client';

import React, { useState } from 'react';
import { PRODUCTS, StoreProduct } from '../../../data/products';
import { DealsEngine, FlashDeal } from '@boostengine/deals';
import {
  Flame,
  Clock,
  Plus,
  Zap,
  Calendar,
  Percent,
  Tag,
  CheckCircle2,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface DealItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  quotaUnits: number;
  claimedUnits: number;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';
}

const INITIAL_DEALS: DealItem[] = [
  {
    id: 'DEAL-901',
    productId: 'prod-1',
    productTitle: 'Vintage Acid Wash Oversized Hoodie',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    originalPrice: 2499,
    dealPrice: 1499,
    discountPercentage: 40,
    quotaUnits: 100,
    claimedUnits: 82,
    startTime: '2026-09-23T00:00:00Z',
    endTime: '2026-09-23T23:59:59Z',
    status: 'ACTIVE',
  },
  {
    id: 'DEAL-902',
    productId: 'prod-2',
    productTitle: 'Heavyweight Graphic Streetwear Tee',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    originalPrice: 1199,
    dealPrice: 799,
    discountPercentage: 33,
    quotaUnits: 150,
    claimedUnits: 112,
    startTime: '2026-09-23T00:00:00Z',
    endTime: '2026-09-23T23:59:59Z',
    status: 'ACTIVE',
  },
  {
    id: 'DEAL-903',
    productId: 'prod-3',
    productTitle: 'Cargo Utility Pants with Keyring',
    productImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&q=80',
    originalPrice: 2999,
    dealPrice: 1999,
    discountPercentage: 33,
    quotaUnits: 50,
    claimedUnits: 0,
    startTime: '2026-09-24T00:00:00Z',
    endTime: '2026-09-24T23:59:59Z',
    status: 'SCHEDULED',
  },
];

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<DealItem[]>(INITIAL_DEALS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    productId: PRODUCTS[0]?.id || '',
    dealPrice: 999,
    quotaUnits: 100,
    durationHours: 24,
  });

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const product = PRODUCTS.find((p) => p.id === newDeal.productId) || PRODUCTS[0];
    const discount = Math.round(((product.price - newDeal.dealPrice) / product.price) * 100);

    const deal: DealItem = {
      id: `DEAL-${Date.now().toString().slice(-4)}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image || product.images?.[0] || '',
      originalPrice: product.price,
      dealPrice: Number(newDeal.dealPrice),
      discountPercentage: discount,
      quotaUnits: Number(newDeal.quotaUnits),
      claimedUnits: 0,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + newDeal.durationHours * 3600 * 1000).toISOString(),
      status: 'ACTIVE',
    };

    setDeals([deal, ...deals]);
    setShowCreateModal(false);
  };

  const handleDeleteDeal = (id: string) => {
    setDeals(deals.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="w-7 h-7 text-red-600" /> Lightning Flash Deals Manager
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Schedule high-converting countdown flash sales, set inventory claim caps, and trigger homepage deals bar.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow hover:shadow-md transition active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Create Flash Deal
        </button>
      </div>

      {/* Deals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const claimedPct = Math.min(100, Math.round((deal.claimedUnits / deal.quotaUnits) * 100));

          return (
            <div
              key={deal.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative">
                <img
                  src={deal.productImage || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80'}
                  alt={deal.productTitle}
                  className="w-full h-48 object-cover"
                />
                <span
                  className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow ${
                    deal.status === 'ACTIVE'
                      ? 'bg-red-600 text-white'
                      : deal.status === 'SCHEDULED'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {deal.status}
                </span>
                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-300 text-xs font-black px-2.5 py-1 rounded-full">
                  Save {deal.discountPercentage}%
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 font-bold">{deal.id}</div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mt-0.5">
                    {deal.productTitle}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-black text-gray-900 dark:text-white">₹{deal.dealPrice}</span>
                    <span className="text-xs text-gray-400 line-through">₹{deal.originalPrice}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-500">
                    <span>Claimed: {claimedPct}%</span>
                    <span>
                      {deal.claimedUnits} / {deal.quotaUnits} units
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${claimedPct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Expires Today</span>
                  </div>
                  <button
                    onClick={() => handleDeleteDeal(deal.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-600" /> Create Lightning Flash Deal
            </h2>
            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Select Product</label>
                <select
                  value={newDeal.productId}
                  onChange={(e) => setNewDeal({ ...newDeal, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-bold"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Deal Price (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={newDeal.dealPrice}
                  onChange={(e) => setNewDeal({ ...newDeal, dealPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Stock Cap (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={newDeal.quotaUnits}
                    onChange={(e) => setNewDeal({ ...newDeal, quotaUnits: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={newDeal.durationHours}
                    onChange={(e) => setNewDeal({ ...newDeal, durationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-red-600 text-white font-black hover:bg-red-700"
                >
                  Launch Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
