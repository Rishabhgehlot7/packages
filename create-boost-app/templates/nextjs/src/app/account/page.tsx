'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import {
  User,
  Package,
  Truck,
  FileText,
  RotateCcw,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Coins,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';

export default function AccountPage() {
  const { superCoins, customerTier } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrders(data.data);
        }
      })
      .catch((err) => console.error('Failed to load customer orders:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('https://boostengine.store/ref/AARAV200');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer Account
          </span>
        </div>

        {/* Profile & Loyalty Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black flex items-center justify-center font-black text-2xl shadow-md">
                AM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">Aarav Mehta</h1>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-md">
                    {customerTier} Member
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" /> +91 98765 43210
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" /> aarav@example.com
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Primary Location
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> Bandra West, Mumbai 400050
              </span>
            </div>
          </div>

          {/* SuperCoins Loyalty Card */}
          <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black rounded-3xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 fill-black" /> SuperCoins Wallet
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-black/15 px-2 py-0.5 rounded-full">
                5% Cashback Active
              </span>
            </div>

            <div>
              <div className="text-3xl font-black tracking-tight">{superCoins} Coins</div>
              <p className="text-xs font-bold text-amber-950/80 mt-0.5">₹{superCoins} Instant Savings value</p>
            </div>

            <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-bold">
              <span>Lifetime Earned: 740 Coins</span>
              <Link href="/checkout" className="underline hover:opacity-80">
                Redeem at Checkout
              </Link>
            </div>
          </div>
        </div>

        {/* Referral Program Banner */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
              🎁
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white">
                Refer a Friend & Earn ₹200 SuperCoins
              </p>
              <p className="text-[11px] text-gray-500">
                Your friend gets flat ₹200 off on their first order, and you get 200 SuperCoins when it delivers!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyReferral}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5"
          >
            {copiedReferral ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Referral Link</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Action Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/account/orders"
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white rounded-2xl p-4 transition shadow-xs flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 dark:text-white block">Orders</span>
              <span className="text-[10px] text-gray-400">Track & Reorder</span>
            </div>
          </Link>

          <Link
            href="/account/returns"
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white rounded-2xl p-4 transition shadow-xs flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 dark:text-white block">Returns</span>
              <span className="text-[10px] text-gray-400">Track & Exchange</span>
            </div>
          </Link>

          <Link
            href="/account/referrals"
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white rounded-2xl p-4 transition shadow-xs flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 dark:text-white block">Refer & Earn</span>
              <span className="text-[10px] text-gray-400">Get ₹200 / Invite</span>
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white rounded-2xl p-4 transition shadow-xs flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
              ❤️
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 dark:text-white block">Wishlist</span>
              <span className="text-[10px] text-gray-400">Saved Favorites</span>
            </div>
          </Link>

          <Link
            href="/account/loyalty"
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white rounded-2xl p-4 transition shadow-xs flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 dark:text-white block">SuperCoins</span>
              <span className="text-[10px] text-gray-400">Rewards & Tiers</span>
            </div>
          </Link>

          <Link
            href="/checkout"
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white rounded-2xl p-4 transition shadow-xs flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-gray-900 dark:text-white block">Checkout</span>
              <span className="text-[10px] text-gray-400">Fast 1-Click</span>
            </div>
          </Link>
        </div>

        {/* Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-yellow-500" />
              Order History & Deliveries ({orders.length})
            </h2>
            <span className="text-xs font-bold text-gray-500">Latest orders shown first</span>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-zinc-800">
              <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">Fetching your order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-zinc-800 space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-black text-gray-800 dark:text-gray-200">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our trending products and place your first order with 1-click checkout.
              </p>
              <Link
                href="/"
                className="inline-block bg-yellow-400 text-black px-6 py-2.5 rounded-xl text-xs font-black hover:bg-yellow-500 transition shadow-sm"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const orderId = order.orderNumber || order.id;
                const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                const isCod = order.paymentMethod === 'cod';
                const isCodVerified = order.metadata?.codVerified || order.paymentStatus === 'paid';

                return (
                  <div
                    key={order.id || order.orderNumber}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 transition hover:border-yellow-400/50"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-sm sm:text-base text-gray-950 dark:text-white">
                            #{orderId}
                          </span>
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                            {order.orderStatus || 'Processing'}
                          </span>
                          {isCod && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                              {isCodVerified ? 'COD Verified ✓' : 'Cash on Delivery'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Placed on {dateStr}</p>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-xs font-black text-gray-900 dark:text-white block">
                          Total: ₹{order.total?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {order.items?.length || 1} Item{(order.items?.length || 1) > 1 ? 's' : ''} • Free Delivery
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-100 dark:border-zinc-800"
                            />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                              <p className="text-[11px] text-gray-400">
                                Qty: {item.quantity} {item.variantName && `• ${item.variantName}`}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar (Live Tracking, GST Invoice, Easy Returns) */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                      <Link
                        href={`/orders/${orderId}/track`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black transition shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Track Order Live
                      </Link>

                      <Link
                        href={`/orders/${orderId}/invoice`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-black transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        GST Tax Invoice
                      </Link>

                      <Link
                        href={`/orders/${orderId}/return`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-black transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-yellow-600" />
                        Return / Exchange
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
