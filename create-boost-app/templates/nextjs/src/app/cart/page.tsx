'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { LoyaltyEngine } from '@boostengine/loyalty';
import { ProgressBar, CouponInput, BankOffersAccordion, TrustBadges } from '@boostengine/ui';
import { getProductById, getProductUrl } from '../../data/products';
import { Trash2, Minus, Plus, ArrowLeft, ArrowRight, ShoppingBag, Truck, Sparkles, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, cartSummary, updateQuantity, removeFromCart, applyCoupon, removeCoupon, superCoins, customerTier, settings } = useStore();
  const [useCoins, setUseCoins] = useState(true);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const items = cart.getItems();
  const threshold = settings.freeShippingThreshold;
  const progress = Math.min(100, (cartSummary.subtotal / threshold) * 100);
  const remaining = Math.max(0, threshold - cartSummary.subtotal);

  const loyaltyQuote = useMemo(() => {
    return LoyaltyEngine.calculateRedemption(cartSummary.finalTotal || cartSummary.subtotal, superCoins);
  }, [cartSummary, superCoins]);

  const coinDiscount = useCoins ? loyaltyQuote.rupeeDiscount : 0;
  const coinsUsed = useCoins ? loyaltyQuote.coinsToRedeem : 0;
  const finalTotal = Math.max(0, (cartSummary.finalTotal || cartSummary.subtotal) - coinDiscount);

  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    setCouponLoading(true);
    const res = applyCoupon(code);
    setCouponLoading(false);
    if (!res.success) setCouponError(res.message);
  };

  const gst = cartSummary.gst;
  const isInterState = gst?.taxType === 'INTER_STATE';
  const gstRows = [
    { label: 'MRP Total', value: `₹${(cartSummary.totalMRP || cartSummary.subtotal).toLocaleString('en-IN')}` },
    ...(cartSummary.totalSavings > 0
      ? [{ label: 'Discount on MRP', value: `-₹${cartSummary.totalSavings.toLocaleString('en-IN')}`, isDiscount: true }]
      : []),
    {
      label: 'Delivery Fee',
      value: cartSummary.shippingFee === 0 ? 'FREE' : `₹${cartSummary.shippingFee.toLocaleString('en-IN')}`,
    },
    ...(cartSummary.codFee > 0 ? [{ label: 'COD Charge', value: `₹${cartSummary.codFee.toLocaleString('en-IN')}` }] : []),
    ...(isInterState
      ? [{ label: 'IGST (incl.)', value: `₹${(gst?.igst || 0).toLocaleString('en-IN')}` }]
      : [
          { label: 'CGST (incl.)', value: `₹${(gst?.cgst || 0).toLocaleString('en-IN')}` },
          { label: 'SGST (incl.)', value: `₹${(gst?.sgst || 0).toLocaleString('en-IN')}` },
        ]),
  ];

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-black text-gray-950">Your Bag is Empty</h1>
        <p className="text-sm text-gray-500">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/collections" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-black hover:bg-gray-800 transition">
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">Shopping Bag ({items.length})</h1>
        <Link href="/collections" className="text-[11px] font-black text-gray-500 hover:text-black flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <Truck className="w-4 h-4" />
              {remaining === 0 ? '🎉 You unlocked FREE delivery!' : `Add ₹${remaining.toLocaleString('en-IN')} more for FREE Delivery`}
            </div>
            <ProgressBar value={progress} color="#2563eb" height={8} />
          </div>

          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl bg-white overflow-hidden">
            {items.map((item) => {
              const matched = getProductById(item.productId);
              const itemUrl = matched ? getProductUrl(matched) : `/products/${item.productId}`;
              return (
                <div key={item.id} className="p-4 flex gap-4">
                  <Link href={itemUrl} className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={itemUrl} className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-blue-600">
                        {item.title}
                      </Link>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-rose-600 p-1" aria-label="Remove item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variantTitle && <p className="text-[11px] text-gray-500">{item.variantTitle}</p>}
                    <p className="text-[11px] text-gray-400">HSN: {item.hsnCode || '6109'}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-white rounded-md transition">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-md transition">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-gray-900">Price Details</h2>

            <CouponInput
              onApply={handleApplyCoupon}
              onRemove={removeCoupon}
              appliedCode={cartSummary.discount?.code}
              discountText={cartSummary.discount ? `Saved ₹${cartSummary.discount.amount}` : undefined}
              loading={couponLoading}
              error={couponError}
              placeholder="Enter coupon code"
            />

            <div className="space-y-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                SuperCoins Balance: {superCoins}
                <span className="ml-auto text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{customerTier}</span>
              </div>
              <label className="flex items-center justify-between text-xs font-bold text-gray-700 cursor-pointer">
                <span>Use {coinsUsed} coins & save ₹{coinDiscount}</span>
                <input type="checkbox" checked={useCoins} onChange={(e) => setUseCoins(e.target.checked)} className="w-5 h-5 accent-amber-500" />
              </label>
            </div>

            <div className="space-y-2 text-xs">
              {gstRows.map((row, idx) => (
                <div key={idx} className={`flex justify-between ${row.isDiscount ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
              {useCoins && coinDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-bold">
                  <span>SuperCoins Discount</span>
                  <span>-₹{coinDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Payable</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={() => router.push('/checkout')} className="w-full py-3.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Proceed to Checkout
            </button>
          </div>

          <BankOffersAccordion
            offers={[
              { id: 'card10', type: 'instant', title: '10% Instant Discount up to ₹1,500 on HDFC Credit Cards', code: 'HDFC10', terms: 'Min. order value ₹4,999' },
              { id: 'upi5', type: 'cashback', title: '5% Cashback up to ₹250 on UPI & Wallets', code: 'UPI5' },
              { id: 'emi', type: 'emi', title: 'No Cost EMI starting from ₹499/month', terms: 'On orders above ₹3,000' },
            ]}
          />

          <TrustBadges layout="grid" showCodBadge showReturnsBadge showSecureBadge showGenuineBadge />

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-gray-500">Need help?</p>
            <p className="text-xs text-gray-600">Call us 9 AM – 9 PM, all days. 100% secure payments with 7-day easy returns.</p>
            <Link href="/collections" className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800">
              Browse more products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}