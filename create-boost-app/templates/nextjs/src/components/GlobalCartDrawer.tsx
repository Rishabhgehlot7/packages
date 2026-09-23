'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import { LoyaltyEngine } from '@boostengine/loyalty';
import { CouponInput, ProgressBar } from '@boostengine/ui';
import { getProductById, getProductUrl } from '../data/products';
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const GlobalCartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    cartSummary,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    superCoins,
    customerTier,
    settings,
  } = useStore();

  const [useCoins, setUseCoins] = useState(true);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isCartOpen, setIsCartOpen]);

  const items = cart.getItems();
  const threshold = settings.freeShippingThreshold;
  const progress = Math.min(100, (cartSummary.subtotal / threshold) * 100);
  const remaining = Math.max(0, threshold - cartSummary.subtotal);

  const loyaltyQuote = useMemo(() => {
    return LoyaltyEngine.calculateRedemption(
      cartSummary.finalTotal || cartSummary.subtotal,
      superCoins
    );
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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={() => setIsCartOpen(false)} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <h2 className="text-sm font-black text-gray-900">Your Bag ({items.length})</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-6 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
            <p className="text-sm font-bold text-gray-500">Your bag is empty</p>
            <Link
              href="/collections"
              onClick={() => setIsCartOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-black bg-black text-white px-4 py-2 rounded-full"
            >
              Shop Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900">
                  <Truck className="w-3.5 h-3.5" />
                  {remaining === 0 ? 'FREE delivery unlocked!' : `Add ₹${remaining.toLocaleString('en-IN')} more for FREE Delivery`}
                </div>
                <ProgressBar value={progress} color="#2563eb" height={5} />
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const matched = getProductById(item.productId);
                  const itemUrl = matched ? getProductUrl(matched) : `/products/${item.productId}`;
                  return (
                    <div key={item.id} className="flex gap-3 p-2 bg-gray-50 rounded-xl">
                      <Link href={itemUrl} onClick={() => setIsCartOpen(false)}>
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-white" />
                      </Link>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={itemUrl}
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs font-bold text-gray-900 line-clamp-2 hover:text-blue-600"
                          >
                            {item.title}
                          </Link>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.variantTitle && <p className="text-[10px] text-gray-500">{item.variantTitle}</p>}
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-1.5 bg-white rounded-lg p-0.5 border border-gray-200">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-gray-100 rounded">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[11px] font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

              <CouponInput
                onApply={handleApplyCoupon}
                onRemove={removeCoupon}
                appliedCode={cartSummary.discount?.code}
                discountText={cartSummary.discount ? `Saved ₹${cartSummary.discount.amount}` : undefined}
                loading={couponLoading}
                error={couponError}
                placeholder="Enter coupon code"
              />

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-black text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  SuperCoins: {superCoins} • {customerTier}
                </div>
                <label className="flex items-center justify-between text-[11px] font-bold text-gray-700 cursor-pointer">
                  <span>Use {coinsUsed} coins & save ₹{coinDiscount}</span>
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartSummary.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartSummary.discount?.amount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({cartSummary.discount.code})</span>
                    <span>-₹{cartSummary.discount.amount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {useCoins && coinDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 font-bold">
                    <span>SuperCoins</span>
                    <span>-₹{coinDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (incl)</span>
                  <span>₹{(cartSummary.gst?.totalTax || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full py-3 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Proceed to Checkout
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-[11px] font-bold text-gray-500 hover:text-black"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
