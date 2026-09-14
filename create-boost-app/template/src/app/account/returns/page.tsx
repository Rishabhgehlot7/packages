'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
  Package,
  ArrowRight,
  Upload,
  RefreshCw,
} from 'lucide-react';

interface MockReturn {
  id: string;
  orderId: string;
  itemTitle: string;
  itemImage: string;
  quantity: number;
  reason: string;
  resolution: 'REFUND' | 'REPLACEMENT';
  status: 'REQUESTED' | 'APPROVED' | 'PICKUP_SCHEDULED' | 'QC_PASSED' | 'REFUND_COMPLETED';
  refundAmount: number;
  date: string;
  pickupAwb?: string;
}

const INITIAL_RETURNS: MockReturn[] = [
  {
    id: 'RET-2026-9812',
    orderId: 'ORD-2026-8819',
    itemTitle: 'Vintage Acid Wash Oversized Hoodie',
    itemImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    quantity: 1,
    reason: 'Size & Fit Issue (Ordered L, too loose)',
    resolution: 'REFUND',
    status: 'PICKUP_SCHEDULED',
    refundAmount: 2499,
    date: '2026-09-12',
    pickupAwb: 'SRR982147102',
  },
  {
    id: 'RET-2026-7734',
    orderId: 'ORD-2026-4412',
    itemTitle: 'Graphic Streetwear Tee - Tokyo Edition',
    itemImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    quantity: 1,
    reason: 'Defective Stitching on Collar',
    resolution: 'REPLACEMENT',
    status: 'REFUND_COMPLETED',
    refundAmount: 1199,
    date: '2026-08-28',
  },
];

const STATUS_STEPS = [
  { key: 'REQUESTED', label: 'Requested' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup' },
  { key: 'QC_PASSED', label: 'QC Passed' },
  { key: 'REFUND_COMPLETED', label: 'Completed' },
];

export default function CustomerReturnsPage() {
  const [returns, setReturns] = useState<MockReturn[]>(INITIAL_RETURNS);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    orderId: 'ORD-2026-9901',
    itemTitle: 'Minimal Heavyweight Oversized Tee',
    reason: 'SIZE_FIT_ISSUE',
    resolution: 'REFUND',
    comments: '',
  });

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return 0;
      case 'APPROVED':
        return 1;
      case 'PICKUP_SCHEDULED':
        return 2;
      case 'QC_PASSED':
        return 3;
      case 'REFUND_COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const newReturn: MockReturn = {
      id: `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: formData.orderId,
      itemTitle: formData.itemTitle,
      itemImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
      quantity: 1,
      reason: formData.reason.replace(/_/g, ' '),
      resolution: formData.resolution as any,
      status: 'REQUESTED',
      refundAmount: 1499,
      date: new Date().toISOString().split('T')[0],
    };
    setReturns([newReturn, ...returns]);
    setShowRequestModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </Link>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Request Return / Exchange
          </button>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 inline-block">
              Hassle-Free Guarantee
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Returns & Replacement Center
            </h1>
            <p className="text-sm text-gray-300">
              7-Day doorstep pickup with instant refund settlement directly to UPI / Bank Account.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
            <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold">Standard 7-Day Window</div>
              <div className="text-[11px] text-gray-300">Zero pickup charges for defective items</div>
            </div>
          </div>
        </div>

        {/* Return Requests List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-500" />
            Your Return Requests ({returns.length})
          </h2>

          {returns.map((ret) => {
            const currentStepIdx = getStepIndex(ret.status);

            return (
              <div
                key={ret.id}
                className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm space-y-4 hover:border-gray-300 transition"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-900">{ret.id}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">Order #{ret.orderId}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Submitted on {ret.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        ret.status === 'REFUND_COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {ret.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                      {ret.resolution}
                    </span>
                  </div>
                </div>

                {/* Product details */}
                <div className="flex items-center gap-4">
                  <img
                    src={ret.itemImage}
                    alt={ret.itemTitle}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{ret.itemTitle}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Reason: {ret.reason}</p>
                    {ret.pickupAwb && (
                      <p className="text-[11px] text-indigo-600 font-mono mt-1 flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Pickup AWB: {ret.pickupAwb} (Shiprocket)
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Refund Value</div>
                    <div className="text-base font-bold text-gray-900">
                      ₹{ret.refundAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Live Progress Bar */}
                <div className="pt-2">
                  <div className="grid grid-cols-5 gap-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const isPassed = idx <= currentStepIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-full h-1.5 rounded-full mb-1.5 ${
                              isPassed ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          />
                          <span
                            className={`text-[10px] font-medium truncate ${
                              isPassed ? 'text-indigo-600 font-bold' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Return Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Request Return or Exchange</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-black text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReturn} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Select Order
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  disabled
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-gray-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={formData.itemTitle}
                  disabled
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Return Reason
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-black"
                  >
                    <option value="SIZE_FIT_ISSUE">Size / Fit Issue</option>
                    <option value="DEFECTIVE_PRODUCT">Defective / Damaged</option>
                    <option value="WRONG_ITEM_DELIVERED">Wrong Item Received</option>
                    <option value="NOT_AS_PICTURED">Not As Pictured</option>
                    <option value="CHANGED_MIND">Changed My Mind</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Preferred Resolution
                  </label>
                  <select
                    value={formData.resolution}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                    className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-black"
                  >
                    <option value="REFUND">Full Refund to Source</option>
                    <option value="REPLACEMENT">Size Exchange / Replacement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Tell us what went wrong so we can resolve this faster..."
                  className="w-full text-xs bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-black placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
