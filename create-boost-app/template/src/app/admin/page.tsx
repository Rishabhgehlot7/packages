'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatsData {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  activePlugins: number;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/orders'),
        ]);
        const statsJson = await statsRes.json();
        const ordersJson = await ordersRes.json();

        if (statsJson.success) setStats(statsJson.data);
        if (ordersJson.success) setRecentOrders(ordersJson.data.slice(0, 5));
      } catch (err) {
        console.error('Failed loading admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Store Overview</h1>
          <p className="text-sm text-slate-400">
            Realtime performance metrics, orders pipeline, and modular extensions status.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/plugins"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>🧩</span>
            <span>Manage Plugins</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Revenue</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm">💰</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{stats?.totalSales?.toLocaleString('en-IN') ?? '0'}
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-400 gap-1 font-medium">
            <span>↑ 18.2%</span>
            <span className="text-slate-500 font-normal">from last week</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm">📦</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.totalOrders ?? 0}
          </div>
          <div className="mt-2 flex items-center text-xs text-amber-400 gap-1 font-medium">
            <span>{stats?.pendingOrders ?? 0}</span>
            <span className="text-slate-500 font-normal">pending dispatch</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Catalog Inventory</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm">🏷️</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.totalProducts ?? 0} <span className="text-xs font-normal text-slate-400">items</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-rose-400 gap-1 font-medium">
            <span>{stats?.lowStockProducts ?? 0}</span>
            <span className="text-slate-500 font-normal">low stock alerts</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Plugins</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 text-sm">🧩</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.activePlugins ?? 0} <span className="text-xs font-normal text-slate-400">running</span>
          </div>
          <div className="mt-2 flex items-center text-xs text-indigo-400 gap-1 font-medium">
            <span>WP Modular System</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Orders</h2>
            <p className="text-xs text-slate-400">Incoming purchases from customer storefront</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
          >
            <span>View All Orders</span>
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-950/40">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <div>{order.customer.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{order.customer.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-100 font-bold">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-400">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs text-slate-300 hover:text-white underline font-semibold"
                      >
                        Manage
                      </Link>
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
