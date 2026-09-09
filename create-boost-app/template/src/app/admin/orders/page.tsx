'use client';

import React, { useEffect, useState } from 'react';
import { AdminOrder } from '../../../data/db';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
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
    if (activeTab === 'all') return true;
    return o.orderStatus === activeTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Order Management</h1>
        <p className="text-sm text-slate-400">
          Process customer orders, update tracking numbers, and generate GST tax invoices.
        </p>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {tabs.map((tab) => {
          const count =
            tab.id === 'all'
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">Loading orders pipeline...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">No orders in this status category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Courier / Tracking</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      <div>{order.orderNumber}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <div className="font-semibold">{order.customer.name}</div>
                      <div className="text-[11px] text-slate-400">{order.customer.phone}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">
                        {order.customer.address.city}, {order.customer.address.state}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-semibold text-white">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-bold">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold w-fit ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {order.trackingNumber ? (
                        <div>
                          <div className="font-semibold text-[11px] text-slate-200">{order.courier}</div>
                          <div className="font-mono text-[10px] text-indigo-400">
                            {order.trackingNumber}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                      >
                        <span>{order.orderStatus}</span>
                        <span className="text-[9px]">✎</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => alert(`Printing Tax Invoice for ${order.orderNumber}`)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium border border-slate-700"
                      >
                        🧾 Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Update Order Status</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Courier</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg"
              >
                {updating ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
