'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Calendar,
  Percent,
  Sparkles,
} from 'lucide-react';

interface AdminCoupon {
  id: string;
  code: string;
  type: 'FLAT' | 'PERCENT' | 'TIERED' | 'BOGO';
  value: number;
  minOrderValue: number;
  maxDiscountCap?: number;
  usageCount: number;
  maxUsageLimit: number;
  expiresAt: string;
  isActive: boolean;
}

const INITIAL_COUPONS: AdminCoupon[] = [
  {
    id: 'c_1',
    code: 'BOOST10',
    type: 'PERCENT',
    value: 10,
    minOrderValue: 999,
    maxDiscountCap: 500,
    usageCount: 421,
    maxUsageLimit: 1000,
    expiresAt: '2026-12-31',
    isActive: true,
  },
  {
    id: 'c_2',
    code: 'FLAT500',
    type: 'FLAT',
    value: 500,
    minOrderValue: 2499,
    usageCount: 182,
    maxUsageLimit: 500,
    expiresAt: '2026-10-31',
    isActive: true,
  },
  {
    id: 'c_3',
    code: 'BOGO2026',
    type: 'BOGO',
    value: 100, // Buy 1 Get 1
    minOrderValue: 1999,
    usageCount: 94,
    maxUsageLimit: 200,
    expiresAt: '2026-09-30',
    isActive: true,
  },
  {
    id: 'c_4',
    code: 'VIPTIER',
    type: 'TIERED',
    value: 20,
    minOrderValue: 4999,
    maxDiscountCap: 1500,
    usageCount: 38,
    maxUsageLimit: 100,
    expiresAt: '2026-11-15',
    isActive: false,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(INITIAL_COUPONS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENT',
    value: 15,
    minOrderValue: 1499,
    maxDiscountCap: 600,
    maxUsageLimit: 500,
    expiresAt: '2026-12-31',
  });

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: AdminCoupon = {
      id: `c_${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      type: formData.type as any,
      value: Number(formData.value),
      minOrderValue: Number(formData.minOrderValue),
      maxDiscountCap: formData.maxDiscountCap ? Number(formData.maxDiscountCap) : undefined,
      usageCount: 0,
      maxUsageLimit: Number(formData.maxUsageLimit),
      expiresAt: formData.expiresAt,
      isActive: true,
    };
    setCoupons([newCoupon, ...coupons]);
    setShowModal(false);
    setFormData({
      code: '',
      type: 'PERCENT',
      value: 15,
      minOrderValue: 1499,
      maxDiscountCap: 600,
      maxUsageLimit: 500,
      expiresAt: '2026-12-31',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-indigo-600" />
            Coupons & Promotional Rules
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create discount rules powered by @boostengine/coupons (Flat, %, Tiered spend ladder, BOGO).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold">
          {coupons.filter((c) => c.isActive).length} Active Coupons
        </span>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Benefit</th>
                <th className="py-3.5 px-4">Min Spend</th>
                <th className="py-3.5 px-4">Redemptions</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="text-gray-400 hover:text-black transition"
                        title="Copy code"
                      >
                        {copiedCode === c.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[10px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {c.type === 'FLAT' && `₹${c.value} OFF`}
                    {c.type === 'PERCENT' && `${c.value}% OFF`}
                    {c.type === 'BOGO' && `Buy 1 Get 1`}
                    {c.type === 'TIERED' && `Up to ${c.value}% OFF`}
                    {c.maxDiscountCap && (
                      <span className="text-[10px] text-gray-400 block font-normal">
                        Max ₹{c.maxDiscountCap}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">
                    ₹{c.minOrderValue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">
                      {c.usageCount} / {c.maxUsageLimit}
                    </div>
                    <div className="w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (c.usageCount / c.maxUsageLimit) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                    {c.expiresAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggle(c.id)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition ${
                        c.isActive
                          ? 'text-gray-600 hover:text-rose-600 border-gray-200 hover:border-rose-200'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Create New Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-gray-900 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900"
                  >
                    <option value="PERCENT">% Percentage Off</option>
                    <option value="FLAT">Flat ₹ INR Off</option>
                    <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
                    <option value="TIERED">Tiered Spend Ladder</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Discount Value (% or ₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrderValue: Number(e.target.value) })
                    }
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscountCap}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDiscountCap: Number(e.target.value) })
                    }
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
