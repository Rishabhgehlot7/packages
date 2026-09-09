'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AssuredBadge } from '@boostengine/ui';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCartFromWishlist } = useStore();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-xs">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black text-gray-950">Your Wishlist is Empty</h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Explore our curated catalog and tap the heart icon to save products you love for later.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-xs font-black shadow-md transition"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950">
              My Wishlist
            </h1>
            <span className="text-xs font-extrabold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
        <AssuredBadge type="assured" />
      </div>

      {/* Wishlist 2-col Mobile / 4-col Desktop Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col group"
          >
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <Link href={`/products/${item.productId}`} className="block w-full h-full">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </Link>
              <button
                type="button"
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm text-gray-400 hover:text-rose-600 hover:bg-white transition"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content & Actions */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <Link
                  href={`/products/${item.productId}`}
                  className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition"
                >
                  {item.title}
                </Link>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-black text-gray-950">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => moveToCartFromWishlist(item)}
                className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
