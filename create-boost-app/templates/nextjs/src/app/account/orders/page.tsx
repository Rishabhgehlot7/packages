'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../../context/StoreContext';
import { Package, Truck, FileText, RotateCcw, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AccountOrdersPage() {
  const { customerTier } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setOrders(data.data);
      })
      .catch((err) => console.error('Failed to load orders', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/account" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition">
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified {customerTier} Member
          </span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center border border-gray-200 dark:border-zinc-800">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">No orders yet.</p>
            <Link href="/collections" className="inline-block mt-3 text-xs font-black bg-black text-white px-4 py-2 rounded-full">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((order: any) => {
              const orderId = order.id || order.orderNumber;
              return (
                <div key={orderId} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-gray-900 dark:text-white">#{order.orderNumber || orderId}</p>
                      <p className="text-[11px] text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.image || ''} alt={item.title} className="w-12 h-12 object-cover rounded-xl border border-gray-100 dark:border-zinc-800" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-[11px] text-gray-400">Qty: {item.quantity} {item.variantName && `• ${item.variantName}`}</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                    <span className="text-xs font-black text-gray-900 dark:text-white">Total: ₹{order.total?.toLocaleString('en-IN')}</span>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/orders/${orderId}/track`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black transition">
                        <Truck className="w-3.5 h-3.5" /> Track
                      </Link>
                      <Link href={`/orders/${orderId}/invoice`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-black transition">
                        <FileText className="w-3.5 h-3.5 text-blue-500" /> Invoice
                      </Link>
                      <Link href={`/orders/${orderId}/return`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-black transition">
                        <RotateCcw className="w-3.5 h-3.5 text-yellow-600" /> Return
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
