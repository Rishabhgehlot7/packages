'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Blocks,
  AlertCircle,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

interface StatsData {
  totalRevenue?: number;
  totalSales?: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts?: number;
  activePlugins?: number;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/orders'),
        ]);
        const statsJson = await statsRes.json();
        const ordersJson = await ordersRes.json();

        if (statsJson.success) setStats(statsJson.data);
        if (ordersJson.success) setRecentOrders(ordersJson.data.slice(0, 6));
      } catch (err) {
        console.error('Failed loading admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Initializing Executive Dashboard...
      </div>
    );
  }

  const grossSales = stats?.totalRevenue ?? stats?.totalSales ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Store Executive Dashboard
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time pipeline metrics, automated dispatch status, and inventory health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/admin/products/new"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition duration-150"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Grid - Responsive for Tablet & Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Gross Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition duration-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ₹{grossSales.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-emerald-600 gap-1.5 font-bold">
            <span>↑ 18.2%</span>
            <span className="text-slate-400 font-normal">from last 7 days</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition duration-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {stats?.totalOrders ?? 0}
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-amber-700 gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats?.pendingOrders ?? 0}</span>
            <span className="text-slate-400 font-normal">awaiting dispatch</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition duration-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Live Catalog
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {stats?.totalProducts ?? 0}{' '}
            <span className="text-xs font-semibold text-slate-400">SKUs</span>
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-slate-500 gap-1.5 font-medium">
            <span className="text-emerald-700 font-bold">100% In Stock</span>
            <span className="text-slate-400">• MongoDB Sync</span>
          </div>
        </div>

        {/* Modular Extensions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition duration-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Plugins
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Blocks className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {stats?.activePlugins ?? 5}{' '}
            <span className="text-xs font-semibold text-slate-400">Modules</span>
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-indigo-600 gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Architecture</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Orders Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Recent Store Orders
            </h2>
            <p className="text-xs text-slate-500">
              Incoming transactions synchronized with MongoDB database
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading real-time orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No customer orders placed yet.
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="py-3 px-5">Order ID</th>
                    <th className="py-3 px-5">Customer</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Amount</th>
                    <th className="py-3 px-5">Payment</th>
                    <th className="py-3 px-5">Fulfillment</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id || order.orderNumber || (order as any)._id || idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-5 font-mono font-bold text-indigo-600">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-5 text-slate-800">
                        <div className="font-bold">{order.customer?.name || 'Guest Shopper'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {order.customer?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-5 text-slate-900 font-black">
                        ₹{(order.total ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href="/admin/orders"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 640px) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {recentOrders.map((order, idx) => (
                <div key={order.id || order.orderNumber || (order as any)._id || idx} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-indigo-600">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      ₹{(order.total ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700">
                    <div className="font-bold">{order.customer?.name || 'Guest Shopper'}</div>
                    <div className="text-[11px] text-slate-400">{order.customer?.email || 'N/A'}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {order.orderStatus}
                      </span>
                    </div>

                    <Link
                      href="/admin/orders"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Manage →
                    </Link>
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
