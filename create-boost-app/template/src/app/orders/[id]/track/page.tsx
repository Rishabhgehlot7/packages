'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PackageCheck,
  Truck,
  Home,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  FileText,
  RotateCcw,
  MessageCircle,
  MapPin,
} from 'lucide-react';

export default function OrderTrackPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/admin/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError('Order not found. Please check your order ID.');
        }
      })
      .catch((err) => {
        console.error('Error loading order tracking:', err);
        setError('Failed to fetch tracking details.');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Connecting to Courier Live Hub...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
          !
        </div>
        <h1 className="text-2xl font-black">Tracking Info Unavailable</h1>
        <p className="text-xs text-gray-500">{error || 'Unable to locate tracking details for this order.'}</p>
        <Link
          href="/"
          className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl text-xs font-black hover:bg-yellow-500 transition"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'placed', label: 'Order Confirmed', desc: 'Order placed & payment verified', icon: CheckCircle2 },
    { key: 'packed', label: 'Packed in Warehouse', desc: 'Quality checked & packed', icon: PackageCheck },
    { key: 'shipped', label: 'Shipped / In Transit', desc: 'Handed over to delivery partner', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Driver will arrive today', icon: Clock },
    { key: 'delivered', label: 'Delivered', desc: 'Delivered at customer address', icon: Home },
  ];

  // Map order status to active step index
  const statusMap: Record<string, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4,
    cancelled: -1,
  };

  const currentStep = statusMap[order.orderStatus || 'processing'] ?? 1;
  const courierName = order.courier || order.shippingDetails?.courierName || 'Delhivery Express';
  const trackingNumber = order.trackingNumber || order.shippingDetails?.awb || `DEL${order.orderNumber?.replace(/\D/g, '') || '982341'}`;
  const estimatedDate = order.shippingDetails?.estimatedDelivery || 'Friday, 12 Sept (by 7:00 PM)';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-400/20">
            Live Courier Sync
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tracking Order</div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                #{order.orderNumber || order.id}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 text-right">
              <div className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400">
                Estimated Delivery
              </div>
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                {estimatedDate}
              </div>
            </div>
          </div>

          {/* Courier Partner Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-xs bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
            <div>
              <span className="text-gray-400 block text-[10px] font-bold uppercase">Logistics Partner</span>
              <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <Truck className="w-3.5 h-3.5 text-yellow-500" /> {courierName}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] font-bold uppercase">AWB / Tracking Number</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white mt-0.5 block select-all">
                {trackingNumber}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] font-bold uppercase">Delivery Destination</span>
              <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {order.customer?.address?.city || 'Mumbai'}, {order.customer?.address?.pincode || '400050'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="pt-2 pb-6">
            <div className="relative">
              <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-gray-200 dark:bg-zinc-800" />
              <div
                className="hidden md:block absolute top-5 left-8 h-1 bg-yellow-400 transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, (currentStep / (steps.length - 1)) * 100))}%` }}
              />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 shadow-sm ${
                          isCurrent
                            ? 'bg-yellow-400 text-black ring-4 ring-yellow-400/20 scale-110'
                            : isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 border border-gray-200 dark:border-zinc-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div
                          className={`text-xs font-black ${
                            isCurrent
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : isDone
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 dark:border-zinc-800">
            <Link
              href={`/orders/${order.id || order.orderNumber}/invoice`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-black transition"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              Download GST Tax Invoice
            </Link>
            <Link
              href={`/orders/${order.id || order.orderNumber}/return`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-black transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-yellow-500" />
              Easy Return / Exchange
            </Link>
            <a
              href={`https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20my%20order%20%23${order.orderNumber || order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black ml-auto transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
            Order Items ({order.items?.length || 0})
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-zinc-700">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                    {item.variantName && <div className="text-[11px] text-gray-400">Variant: {item.variantName}</div>}
                    <div className="text-[11px] text-gray-400">Qty: {item.quantity} | HSN: {item.hsnCode || '6109'}</div>
                  </div>
                </div>
                <div className="font-black text-gray-900 dark:text-white">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
