'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { OrderTimeline } from '@boostengine/ui';
import { CheckCircle2, ArrowRight, FileText, Truck } from 'lucide-react';
import { AdminOrder } from '../../../data/db';

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      }
    }
    loadOrder();
  }, [id]);

  const orderId = order?.id || order?.orderNumber || id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-600 mb-2">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Confirmed!</h1>
        <p className="text-sm text-gray-500">
          Thank you for shopping with us. Your order #{order?.orderNumber || id} is being prepared.
        </p>
      </div>

      {/* Order Timeline */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
          Shipment Progress
        </h3>
        <OrderTimeline currentStage="confirmed" />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/orders/${orderId}/track`}
          className="px-6 py-3 bg-yellow-400 text-black text-xs font-bold rounded-full hover:bg-yellow-500 transition flex items-center gap-2"
        >
          <Truck className="w-4 h-4" /> Track Order
        </Link>
        <Link
          href={`/orders/${orderId}/invoice`}
          className="px-6 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-full hover:bg-gray-200 transition flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> GST Invoice
        </Link>
      </div>
    </div>
  );
}
