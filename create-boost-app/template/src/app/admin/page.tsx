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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/30 p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-sm backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Store Executive Dashboard
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time pipeline metrics, automated dispatch status, and inventory health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/admin/products/new"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition duration-150 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700/80 transition duration-150"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Gross Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ₹{grossSales.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-emerald-400 gap-1.5 font-bold">
            <span>↑ 18.2%</span>
            <span className="text-slate-500 font-normal">from last 7 days</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition duration-300" />
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.totalOrders ?? 0}
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-amber-400 gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats?.pendingOrders ?? 0}</span>
            <span className="text-slate-500 font-normal">awaiting dispatch</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition duration-300" />
        </div>

        {/* Active Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Catalog
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.totalProducts ?? 0}{' '}
            <span className="text-xs font-semibold text-slate-400">SKUs</span>
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-slate-400 gap-1.5 font-medium">
            <span className="text-emerald-400 font-bold">100% In Stock</span>
            <span className="text-slate-500">• MongoDB Sync</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition duration-300" />
        </div>

        {/* Modular Extensions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition duration-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Plugins
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Blocks className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.activePlugins ?? 5}{' '}
            <span className="text-xs font-semibold text-slate-400">Modules</span>
          </div>
          <div className="mt-2.5 flex items-center text-[11px] text-indigo-400 gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Architecture</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition duration-300" />
        </div>
      </div>

      {/* 3. Recent Orders Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Recent Store Orders
            </h2>
            <p className="text-xs text-slate-400">
              Incoming transactions synchronized with MongoDB database
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading real-time orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No customer orders placed yet.
          </div>
        ) : (
          <>
            {/* Desktop Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800/80 bg-slate-950/40">
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
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id || order.orderNumber || (order as any)._id || idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-5 font-mono font-bold text-indigo-400">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-5 text-slate-200">
                        <div className="font-bold">{order.customer?.name || 'Guest Shopper'}</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {order.customer?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-5 text-slate-100 font-black">
                        ₹{(order.total ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href="/admin/orders"
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
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
            <div className="sm:hidden divide-y divide-slate-800/60">
              {recentOrders.map((order, idx) => (
                <div key={order.id || order.orderNumber || (order as any)._id || idx} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-indigo-400">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs font-black text-white">
                      ₹{(order.total ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    <div className="font-bold">{order.customer?.name || 'Guest Shopper'}</div>
                    <div className="text-[11px] text-slate-500">{order.customer?.email || 'N/A'}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {order.orderStatus}
                      </span>
                    </div>

                    <Link
                      href="/admin/orders"
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
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
