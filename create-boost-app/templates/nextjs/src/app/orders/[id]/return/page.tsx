'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wallet,
} from 'lucide-react';

export default function OrderReturnPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState('size_mismatch');
  const [comments, setComments] = useState('');
  const [refundMode, setRefundMode] = useState<'wallet' | 'original'>('wallet');
  const [submitting, setSubmitting] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/admin/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
          // Default select all items
          const initialMap: Record<string, boolean> = {};
          (data.data.items || []).forEach((it: any, idx: number) => {
            initialMap[`${it.productId}_${idx}`] = true;
          });
          setSelectedItems(initialMap);

          // If return already requested, display it
          if (data.data.returnDetails && data.data.returnDetails.pickupAwb) {
            setReturnSuccess(data.data.returnDetails);
          }
        }
      })
      .catch((err) => console.error('Error fetching order for return:', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  const toggleItem = (key: string) => {
    setSelectedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getChosenItems = () => {
    if (!order?.items) return [];
    return order.items.filter((it: any, idx: number) => selectedItems[`${it.productId}_${idx}`]);
  };

  const chosenItems = getChosenItems();
  const returnItemsTotal = chosenItems.reduce(
    (sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1),
    0
  );
  const walletBonus = Math.round(returnItemsTotal * 0.05);
  const finalWalletTotal = returnItemsTotal + walletBonus;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chosenItems.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          comments,
          items: chosenItems,
          refundMode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReturnSuccess(data.data.returnDetails);
      } else {
        alert(data.error || 'Return request failed');
      }
    } catch (err) {
      alert('Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
        <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href={`/orders/${orderId}/track`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tracking
        </Link>

        {returnSuccess ? (
          /* Success Screen */
          <div className="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                Return Approved
              </span>
              <h1 className="text-xl sm:text-2xl font-black mt-2 text-gray-900 dark:text-white">
                Reverse Pickup Scheduled!
              </h1>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Our courier agent will visit your address in 24-48 hours to collect the return package.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Reverse Pickup AWB</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {returnSuccess.pickupAwb}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Refund Mode</span>
                <span className="font-bold text-gray-900 dark:text-white capitalize">
                  {returnSuccess.refundMode === 'wallet' ? 'Instant Store Wallet (+5% Bonus)' : 'Original Payment Source'}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-zinc-700 pt-2 text-sm font-black">
                <span>Refund Value</span>
                <span className="text-emerald-600">₹{returnSuccess.refundAmount}</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl text-xs font-black hover:bg-yellow-500 transition shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Return Request Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-xs font-black uppercase tracking-wider">
                <RotateCcw className="w-4 h-4" /> 7-Day Hassle-Free Returns
              </div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                Select Items to Return / Exchange
              </h1>
              <p className="text-xs text-gray-500">Order #{order?.orderNumber || orderId}</p>
            </div>

            {/* Selectable Items */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Choose Items</label>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                {order?.items?.map((item: any, idx: number) => {
                  const key = `${item.productId}_${idx}`;
                  const isChecked = !!selectedItems[key];

                  return (
                    <div
                      key={key}
                      onClick={() => toggleItem(key)}
                      className={`p-3 flex items-center justify-between gap-3 text-xs cursor-pointer transition ${
                        isChecked ? 'bg-yellow-400/5 dark:bg-yellow-400/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-yellow-400 focus:ring-yellow-400"
                        />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                          {item.variantName && <div className="text-[11px] text-gray-400">Variant: {item.variantName}</div>}
                          <div className="text-[11px] text-gray-400">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-black text-gray-900 dark:text-white">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Return Reason */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Reason for Return</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="size_mismatch">Size issue / Fitting not right</option>
                <option value="defective">Damaged / Defective product</option>
                <option value="wrong_item">Received wrong item</option>
                <option value="quality_issue">Quality not as expected</option>
                <option value="changed_mind">No longer needed</option>
              </select>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Additional Notes (Optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={2}
                placeholder="Describe the issue or specify replacement size..."
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Refund Preference */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Refund Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setRefundMode('wallet')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    refundMode === 'wallet'
                      ? 'border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/5'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black flex items-center gap-1.5 text-gray-900 dark:text-white">
                      <Wallet className="w-4 h-4 text-yellow-500" /> Instant Store Wallet
                    </span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      +5% Bonus
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Instant credit. Never expires.</p>
                  <div className="text-sm font-black text-emerald-600 mt-2">
                    Get ₹{finalWalletTotal}
                  </div>
                </div>

                <div
                  onClick={() => setRefundMode('original')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    refundMode === 'original'
                      ? 'border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/5'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-black text-gray-900 dark:text-white block">
                    Original Payment Source
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">Bank account / UPI refund in 3-5 days.</p>
                  <div className="text-sm font-black text-gray-700 dark:text-gray-300 mt-2">
                    Get ₹{returnItemsTotal}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || chosenItems.length === 0}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black py-3.5 rounded-xl text-xs font-black transition shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Return...' : 'Confirm Return & Schedule Pickup'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
