'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Truck,
  ShieldAlert,
  Search,
  Filter,
  DollarSign,
  Clock,
  ArrowRight,
  Package,
} from 'lucide-react';

interface AdminReturnItem {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  reason: string;
  resolution: 'REFUND' | 'REPLACEMENT';
  amount: number;
  status:
    | 'REQUESTED'
    | 'APPROVED'
    | 'REJECTED'
    | 'PICKUP_SCHEDULED'
    | 'QC_PASSED'
    | 'QC_FAILED'
    | 'REFUND_COMPLETED';
  date: string;
  reverseAwb?: string;
}

const INITIAL_DATA: AdminReturnItem[] = [
  {
    id: 'RET-2026-9812',
    orderId: 'ORD-2026-8819',
    customerName: 'Rohit Sharma',
    customerPhone: '+91 98765 43210',
    productTitle: 'Vintage Acid Wash Oversized Hoodie',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    quantity: 1,
    reason: 'Size & Fit Issue (Too Loose)',
    resolution: 'REFUND',
    amount: 2499,
    status: 'REQUESTED',
    date: '2026-09-14',
  },
  {
    id: 'RET-2026-9730',
    orderId: 'ORD-2026-8102',
    customerName: 'Ananya Roy',
    customerPhone: '+91 91234 56789',
    productTitle: 'Heavyweight Streetwear Tee - Onyx',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    quantity: 1,
    reason: 'Defective print on chest',
    resolution: 'REPLACEMENT',
    amount: 1299,
    status: 'APPROVED',
    date: '2026-09-13',
    reverseAwb: 'SRR982341209',
  },
  {
    id: 'RET-2026-9654',
    orderId: 'ORD-2026-7781',
    customerName: 'Kunal Patel',
    customerPhone: '+91 99887 76655',
    productTitle: 'Techwear Cargo Joggers',
    productImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&q=80',
    quantity: 1,
    reason: 'Wrong Color Received',
    resolution: 'REFUND',
    amount: 2999,
    status: 'QC_PASSED',
    date: '2026-09-11',
    reverseAwb: 'DELR551299014',
  },
  {
    id: 'RET-2026-9501',
    orderId: 'ORD-2026-6643',
    customerName: 'Sneha Rao',
    customerPhone: '+91 97766 55443',
    productTitle: 'Distressed Denim Jacket',
    productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    quantity: 1,
    reason: 'Changed Mind',
    resolution: 'REFUND',
    amount: 3499,
    status: 'REFUND_COMPLETED',
    date: '2026-09-08',
  },
];

export default function AdminReturnsPage() {
  const [items, setItems] = useState<AdminReturnItem[]>(INITIAL_DATA);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((it) => {
    if (filterStatus !== 'ALL' && it.status !== filterStatus) return false;
    if (
      searchQuery &&
      !it.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !it.orderId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !it.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              status: 'APPROVED',
              reverseAwb: `SRR${Math.floor(100000000 + Math.random() * 900000000)}`,
            }
          : it
      )
    );
  };

  const handleReject = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'REJECTED' } : it))
    );
  };

  const handlePassQc = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'QC_PASSED' } : it))
    );
  };

  const handleTriggerRefund = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'REFUND_COMPLETED' } : it))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-indigo-600" />
            Returns & Reverse Logistics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer return requests, Shiprocket reverse pickups, QC inspections, and instant refunds.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Pending Approval</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {items.filter((i) => i.status === 'REQUESTED').length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Action Required</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Reverse In-Transit</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {items.filter((i) => i.status === 'APPROVED' || i.status === 'PICKUP_SCHEDULED').length}
          </div>
          <span className="text-[10px] text-blue-600 font-medium">Shiprocket / Delhivery</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Ready for Refund</span>
            <ShieldAlert className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {items.filter((i) => i.status === 'QC_PASSED').length}
          </div>
          <span className="text-[10px] text-purple-600 font-medium">QC Verified</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-1">
            <span>Total Refunded Value</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            ₹
            {items
              .filter((i) => i.status === 'REFUND_COMPLETED')
              .reduce((sum, i) => sum + i.amount, 0)
              .toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Settled to Source</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Return ID, Order #, Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'REQUESTED', 'APPROVED', 'QC_PASSED', 'REFUND_COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Return ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((ret) => (
                <tr key={ret.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-gray-900">{ret.id}</div>
                    <div className="text-[11px] text-gray-400">Order #{ret.orderId}</div>
                    {ret.reverseAwb && (
                      <div className="text-[10px] text-indigo-600 font-mono mt-0.5 flex items-center gap-1">
                        <Truck className="w-3 h-3" /> AWB: {ret.reverseAwb}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">{ret.customerName}</div>
                    <div className="text-[11px] text-gray-400">{ret.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 max-w-xs">
                      <img
                        src={ret.productImage}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                      />
                      <span className="font-medium text-gray-800 truncate">{ret.productTitle}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-gray-700 block max-w-xs truncate">{ret.reason}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Resolution: {ret.resolution}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    ₹{ret.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        ret.status === 'REFUND_COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ret.status === 'REQUESTED'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : ret.status === 'APPROVED'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : ret.status === 'QC_PASSED'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {ret.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ret.status === 'REQUESTED' && (
                        <>
                          <button
                            onClick={() => handleApprove(ret.id)}
                            className="bg-black hover:bg-gray-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-xs transition"
                          >
                            Approve & Pickup
                          </button>
                          <button
                            onClick={() => handleReject(ret.id)}
                            className="bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {ret.status === 'APPROVED' && (
                        <button
                          onClick={() => handlePassQc(ret.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-xs transition"
                        >
                          Pass QC Check
                        </button>
                      )}

                      {ret.status === 'QC_PASSED' && (
                        <button
                          onClick={() => handleTriggerRefund(ret.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-xs transition"
                        >
                          Trigger Instant Refund
                        </button>
                      )}

                      {ret.status === 'REFUND_COMPLETED' && (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Refund Settled
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
