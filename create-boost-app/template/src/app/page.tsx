'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS, StoreProduct } from '../data/products';
import { useStore } from '../context/StoreContext';
import { BoostSearchEngine, SearchSortOption } from '@boostengine/search';
import {
  StarRating,
  TrustBadges,
  ProductCard,
  LightningDealsBar,
  AssuredBadge,
} from '@boostengine/ui';
import { Flame, Sparkles, Zap, ArrowRight, ShieldCheck, Tag, Gift } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlistItems, inventory, superCoins } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');

  const searchResults = BoostSearchEngine.search(PRODUCTS as any, {
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    sortBy,
  }) as any;

  // Visual Category Circles like Amazon / Flipkart
  const visualCategories = [
    { name: 'All', icon: '🛍️', bg: '#eff6ff' },
    { name: 'Hoodies', icon: '🧥', bg: '#fef3c7' },
    { name: 'T-Shirts', icon: '👕', bg: '#fce7f3' },
    { name: 'Electronics', icon: '🎧', bg: '#e0e7ff' },
    { name: 'Footwear', icon: '👟', bg: '#ecfdf5' },
    { name: 'Accessories', icon: '🎒', bg: '#f3e8ff' },
  ];

  // Lightning Deals end timestamp (6 hours from now)
  const [dealEndTimestamp] = useState<number>(() => Date.now() + 6 * 3600 * 1000 + 42 * 60 * 1000);

  // Lightning Deals Products
  const dealProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Category Quick Ribbon (Amazon / Flipkart circular pill bar) */}
      <section className="bg-white border-b border-gray-100 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-1">
            {visualCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="flex flex-col items-center gap-1 flex-shrink-0 group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-600 shadow-md scale-105'
                        : 'group-hover:scale-105 border border-gray-100 shadow-xs'
                    }`}
                    style={{ backgroundColor: cat.bg }}
                  >
                    <span>{cat.icon}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      isSelected ? 'text-blue-600' : 'text-gray-700 group-hover:text-black'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Hero Marketplace Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 text-white py-12 sm:py-16 px-6 sm:px-12 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="max-w-2xl space-y-5 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-black" />
                BIG SAVINGS DAY
              </span>
              <AssuredBadge type="assured" />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
              India's Favorite <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-rose-300">
                Premium Marketplace
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
              Explore 100% genuine luxury fashion, noise-cancelling tech, and streetwear.
              Same-day dispatch, No-Cost EMI & instant SuperCoins cashback!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#lightning-deals"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs px-6 py-3 rounded-full transition shadow-lg flex items-center gap-2"
              >
                <span>Shop Lightning Deals</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/products"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-full border border-white/20 transition"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ⚡ Amazon / Flipkart Lightning Deals Section */}
      <section id="lightning-deals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 scroll-mt-24">
        {/* Deals Countdown Banner */}
        <LightningDealsBar
          dealTitle="⚡ TODAY'S DEALS OF THE DAY"
          endsAt={dealEndTimestamp}
          percentageClaimed={84}
        />

        {/* Deals Product Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealProducts.map((product) => {
            const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
            const discountPercent = Math.round(
              ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
              >
                {/* Deal Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    {discountPercent}% OFF DEAL
                  </span>
                  <AssuredBadge type="assured" />
                </div>

                <div
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="cursor-pointer space-y-3"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center gap-1.5 pt-1">
                      <StarRating rating={product.rating.value} size={14} />
                      <span className="text-xs text-gray-500 font-medium">({product.rating.count})</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-gray-950">₹{product.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{product.compareAtPrice}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold py-2.5 rounded-xl transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product);
                      router.push('/checkout');
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 rounded-xl transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SuperCoins Rewards Card & Bank Offers Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: SuperCoins Program */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
            <div className="space-y-2 max-w-xs">
              <div className="inline-flex items-center gap-1.5 bg-black/20 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                <span>🪙</span>
                <span>SuperCoins Reward Club</span>
              </div>
              <h3 className="text-lg font-black">You have {superCoins} SuperCoins</h3>
              <p className="text-xs text-amber-100">
                Redeem 1 Coin = ₹1 upfront at checkout. Earn 4 coins per ₹100 on all orders!
              </p>
            </div>
            <div className="text-5xl select-none">🪙</div>
          </div>

          {/* Card B: Bank Partner Offers */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
            <div className="space-y-2 max-w-xs">
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                <Tag className="w-3 h-3" />
                <span>Bank Discounts</span>
              </div>
              <h3 className="text-lg font-black">10% Instant Card Discount</h3>
              <p className="text-xs text-blue-100">
                Instant ₹1,500 off on HDFC & SBI Credit Cards + No Cost EMI on orders ₹3,000+.
              </p>
            </div>
            <div className="text-5xl select-none">💳</div>
          </div>
        </div>
      </section>

      {/* 5. Main Catalog & Filter Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center gap-2">
              <span>All Trending Items</span>
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </h2>
            <p className="text-xs text-gray-500">Showing {searchResults.total} premium products</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Hoodies', 'T-Shirts', 'Electronics', 'Footwear', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.products.map((product: StoreProduct) => {
            const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
            const totalStock = product.variants && product.variants.length > 0
              ? product.variants.reduce((acc: number, v: any) => {
                  const s = inventory.getStock(v.sku);
                  return acc + (s ? s.quantity : (v.stock ?? 0));
                }, 0)
              : (() => {
                  const s = inventory.getStock(product.sku);
                  return s ? s.quantity : (product.inStock ? 10 : 0);
                })();

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                images={product.images || []}
                brand={product.brand}
                isWishlisted={isWishlisted}
                stockUrgencyText={typeof totalStock === 'number' && totalStock > 0 && totalStock <= 3 ? `Only ${totalStock} left!` : undefined}
                rating={typeof product.rating === 'object' ? product.rating?.value : product.rating}
                reviewCount={typeof product.rating === 'object' ? product.rating?.count : undefined}
                onClick={() => router.push(`/products/${product.id}`)}
                onAddToCart={() => {
                  addToCart(product);
                }}
                onToggleWishlist={() => {
                  toggleWishlist(product);
                }}
              />
            );
          })}
        </div>
      </section>

      {/* 6. Marketplace Trust & Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustBadges />
      </section>
    </div>
  );
}
