'use client';

import React, { useEffect, useState } from 'react';
import { AdminOrder } from '../../../data/db';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updating, setUpdating] = useState(false);

  const [newStatus, setNewStatus] = useState<string>('');
  const [courier, setCourier] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function handleOpenStatusModal(order: AdminOrder) {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setCourier(order.courier || 'Delhivery Express');
    setTrackingNumber(order.trackingNumber || '');
  }

  async function handleUpdateStatus() {
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          courier,
          trackingNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? data.data : o))
        );
        setSelectedOrder(null);
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating order status');
    } finally {
      setUpdating(false);
    }
  }

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'all' || o.orderStatus === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Order Fulfillment Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Dispatch items, update tracking AWB numbers, and manage customer orders in real-time.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order #, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
          />
        </div>
      </div>

      {/* Tabs Filter Ribbon */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const count =
            tab.id === 'all'
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab.id).length;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading orders from MongoDB...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs space-y-2">
            <Package className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-slate-600">No orders found in this category.</p>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="py-3.5 px-5">Order Details</th>
                    <th className="py-3.5 px-5">Customer & Shipping</th>
                    <th className="py-3.5 px-5">Items</th>
                    <th className="py-3.5 px-5">Total</th>
                    <th className="py-3.5 px-5">Payment</th>
                    <th className="py-3.5 px-5">Courier & AWB</th>
                    <th className="py-3.5 px-5">Fulfillment</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredOrders.map((order, idx) => (
                    <tr key={order.id || order.orderNumber || (order as any)._id || idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-5">
                        <span className="font-mono font-black text-indigo-600 text-xs block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-800">
                        <div className="font-bold text-slate-900">{order.customer?.name || 'Guest Shopper'}</div>
                        <div className="text-[11px] text-slate-500">{order.customer?.phone || 'No phone'}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {order.customer?.address?.city || 'India'}, {order.customer?.address?.state || ''}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-600">
                        <div className="font-bold text-slate-800">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-900 font-black">
                        ₹{(order.total ?? 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase font-black w-fit ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-mono">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-600">
                        {order.trackingNumber ? (
                          <div>
                            <div className="font-bold text-[11px] text-slate-800">{order.courier}</div>
                            <div className="font-mono text-[10px] text-indigo-600">
                              {order.trackingNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Unassigned</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${
                            order.orderStatus === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.orderStatus === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(order)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold transition border border-slate-200 shadow-2xs cursor-pointer"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredOrders.map((order, idx) => (
                <div key={order.id || order.orderNumber || (order as any)._id || idx} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-black text-indigo-600 block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      ₹{(order.total ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{order.customer?.name || 'Guest Shopper'}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {order.customer?.phone || ''}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {order.customer?.address?.city || 'India'}, {order.customer?.address?.state || ''} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </div>
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

                    <button
                      type="button"
                      onClick={() => handleOpenStatusModal(order)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Dispatch / Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Update Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Update dispatch status and assign courier tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. Delhivery, Bluedart, DTDC"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  AWB Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DEL123456789IN"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={handleUpdateStatus}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
