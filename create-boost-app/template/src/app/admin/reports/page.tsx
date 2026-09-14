'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  RotateCcw,
  CreditCard,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState('LAST_30_DAYS');

  const summary = {
    grossSales: 1845920,
    netRevenue: 1612400,
    totalOrders: 942,
    aov: 1959,
    returnRate: 4.2,
    codPercentage: 38,
    onlinePrepaidPercentage: 62,
  };

  const topProducts = [
    { name: 'Vintage Acid Wash Oversized Hoodie', units: 312, gmv: 779688, stock: 45 },
    { name: 'Minimal Heavyweight Oversized Tee', units: 284, gmv: 368916, stock: 82 },
    { name: 'Graphic Streetwear Tee - Tokyo Edition', units: 190, gmv: 227810, stock: 12 },
    { name: 'Techwear Cargo Joggers', units: 156, gmv: 467844, stock: 29 },
  ];

  const paymentBreakdown = [
    { method: 'UPI / PhonePe / GPay', percentage: 48, amount: 886041, color: 'bg-emerald-500' },
    { method: 'Cash on Delivery (COD)', percentage: 38, amount: 701449, color: 'bg-amber-500' },
    { method: 'Credit / Debit Cards', percentage: 11, amount: 203051, color: 'bg-indigo-500' },
    { method: 'SuperCoins / Store Credit', percentage: 3, amount: 55377, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Analytics & Executive Reports
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Store performance metrics powered by @boostengine/analytics & financial reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['LAST_7_DAYS', 'LAST_30_DAYS', 'THIS_QUARTER', 'ALL_TIME'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                timeRange === t
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Gross Sales (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            ₹{summary.grossSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs last month
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Total Orders Placed</span>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {summary.totalOrders}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.2% conversion rate
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Average Order Value (AOV)</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            ₹{summary.aov.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Boosted via FBT bundles
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Return & RTO Rate</span>
            <RotateCcw className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {summary.returnRate}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowDownRight className="w-3.5 h-3.5" /> -1.4% industry benchmark 8%
          </div>
        </div>
      </div>

      {/* Grid: Payment Method Distribution & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Channels */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Payment Gateway Distribution
            </h2>
            <span className="text-xs text-gray-400 font-mono">62% Prepaid</span>
          </div>

          <div className="space-y-4 pt-1">
            {paymentBreakdown.map((pm, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-800">{pm.method}</span>
                  <span className="text-gray-900 font-bold">
                    ₹{pm.amount.toLocaleString('en-IN')} ({pm.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`${pm.color} h-full rounded-full`} style={{ width: `${pm.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Streetwear Products */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              Top Selling Products
            </h2>
            <span className="text-xs text-indigo-600 font-bold">By GMV</span>
          </div>

          <div className="divide-y divide-gray-100">
            {topProducts.map((prod, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-gray-900 block truncate">{prod.name}</span>
                  <span className="text-gray-400">{prod.units} units sold • Stock: {prod.stock} left</span>
                </div>
                <div className="text-right font-black text-gray-900">
                  ₹{prod.gmv.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
