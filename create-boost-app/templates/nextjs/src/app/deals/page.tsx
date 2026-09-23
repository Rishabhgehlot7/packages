'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS, StoreProduct } from '../../data/products';
import { useStore } from '../../context/StoreContext';
import { DealsEngine, FlashDeal } from '@boostengine/deals';
import { LightningDealsBar, ProductCard, Price } from '@boostengine/ui';
import { Zap, Flame, Clock, Tag, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export default function DealsPage() {
  const { addToCart, toggleWishlist, wishlistItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = PRODUCTS.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
  const categories = ['All', ...Array.from(new Set(dealProducts.map((p) => p.category)))];

  const filteredDeals = selectedCategory === 'All'
    ? dealProducts
    : dealProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Flash Sale Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-amber-600 to-orange-500 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-md px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
              <Flame className="w-4 h-4 animate-bounce text-amber-400" /> Super Flash Sale — Up to 70% Off
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Lightning Deals of the Day
            </h1>
            <p className="text-base sm:text-lg text-white/90 font-medium">
              Limited-time discounts on our top-selling catalog. Grab yours before stock runs out!
            </p>

            {/* Countdown Badge */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs uppercase font-bold text-white/80">Ends in:</span>
              <div className="flex items-center gap-2 font-mono font-black text-lg bg-black/40 px-4 py-2 rounded-xl border border-white/20">
                <Clock className="w-5 h-5 text-amber-300 mr-1" />
                <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>
          <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10" />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDeals.map((product, idx) => {
            const discountPct = product.compareAtPrice
              ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
              : 25;
            const claimedPct = 60 + ((idx * 11) % 35);

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between group"
              >
                <div className="relative">
                  <Link href={`/products/${product.slug || product.id}`}>
                    <img
                      src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase shadow">
                    Save {discountPct}%
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                      Flash Deal
                    </span>
                    <Link
                      href={`/products/${product.slug || product.id}`}
                      className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-red-600 transition"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-black text-gray-900 dark:text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Claimed Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500">
                      <span>Claimed: {claimedPct}%</span>
                      <span className="text-red-600">Almost Gone</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full"
                        style={{ width: `${claimedPct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow hover:shadow-md transition active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
