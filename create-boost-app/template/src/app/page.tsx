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
import { Flame, Sparkles, Zap, ArrowRight, Tag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlistItems, inventory, superCoins, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');

  // Dynamic Products & Banners & Categories from MongoDB
  const [liveProducts, setLiveProducts] = useState<StoreProduct[]>(PRODUCTS);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [apiCategories, setApiCategories] = useState<any[]>([]);

  React.useEffect(() => {
    async function fetchHomeData() {
      try {
        const [bannersRes, catRes, prodRes] = await Promise.all([
          fetch('/api/banners'),
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);
        const bannersData = await bannersRes.json();
        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (bannersData.success && bannersData.hero && bannersData.hero.length > 0) {
          setHeroBanners(bannersData.hero);
        } else if (bannersData.success && bannersData.data && bannersData.data.length > 0) {
          setHeroBanners(bannersData.data.slice(0, 5));
        }

        if (catData.success && catData.data && catData.data.length > 0) {
          setApiCategories(catData.data);
        }

        if (prodData.success && prodData.data && prodData.data.length > 0) {
          setLiveProducts(prodData.data);
        }
      } catch (err) {
        // Fallback
      }
    }
    fetchHomeData();
  }, []);

  // Auto-slide hero banner
  React.useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const searchResults = BoostSearchEngine.search(liveProducts as any, {
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    sortBy,
  }) as any;

  // Dynamic Category Ribbon from MongoDB
  const visualCategories = [
    { name: 'All', icon: '🛍️' },
    ...(apiCategories.length > 0
      ? apiCategories.map((c, i) => ({
          name: c.name,
          icon: ['🧥', '👕', '🎒', '🎧', '👟', '🕶️', '⌚', '📦'][i % 8],
        }))
      : [
          { name: 'Hoodies', icon: '🧥' },
          { name: 'T-Shirts', icon: '👕' },
          { name: 'Footwear', icon: '👟' },
          { name: 'Electronics', icon: '🎧' },
          { name: 'Accessories', icon: '🎒' },
        ]),
  ];

  const categoryFilterList = [
    'All',
    ...Array.from(new Set(apiCategories.map((c) => c.name))).filter(Boolean),
  ];

  const [dealEndTimestamp] = useState<number>(() => Date.now() + 6 * 3600 * 1000 + 42 * 60 * 1000);

  // Dynamic Deals: products with largest discount from live MongoDB catalog
  const dealProducts = [...liveProducts]
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .sort((a, b) => {
      const discA = (a.compareAtPrice - a.price) / a.compareAtPrice;
      const discB = (b.compareAtPrice - b.price) / b.compareAtPrice;
      return discB - discA;
    })
    .slice(0, 4);

  return (
    <div className="space-y-3.5 sm:space-y-5 pb-16">
      {/* 1. Category Quick Ribbon (Ultra-Compact Amazon/Flipkart/Myntra Pill Strip) */}
      <section className="bg-white border-b border-gray-100 py-1.5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
            {visualCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs scale-102'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-[11px] sm:text-xs">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Space-Optimized Marketplace Hero Banner & Carousel */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {heroBanners.length > 0 ? (
          <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[16/9] sm:aspect-[24/8] md:aspect-[28/8] bg-slate-950 group">
            {/* Carousel Slides */}
            {heroBanners.map((banner, idx) => {
              const isActive = idx === activeBannerIdx;
              const imgSrc = banner.desktopImage || banner.mobileImage || banner.image;
              const mobileSrc = banner.mobileImage || banner.desktopImage || banner.image;

              return (
                <div
                  key={banner.id || (banner as any)._id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <picture>
                    <source media="(max-width: 640px)" srcSet={mobileSrc} />
                    <img
                      src={imgSrc}
                      alt={banner.title || 'Boost Hero Banner'}
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>

                  {/* Gradient Overlay & Text Content */}
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/35 to-transparent flex items-end sm:items-center p-4 sm:p-7 md:p-10">
                    <div className="max-w-lg space-y-1.5 sm:space-y-2.5">
                      {banner.title && (
                        <h2 className="text-base sm:text-2xl md:text-3xl font-black tracking-tight text-white uppercase drop-shadow-md line-clamp-2">
                          {banner.title}
                        </h2>
                      )}
                      <Link
                        href={banner.link || '/products'}
                        className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition shadow-md cursor-pointer"
                      >
                        <span>{banner.buttonText || 'Explore Collection'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Slider Arrow Controls */}
            {heroBanners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveBannerIdx((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)
                  }
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20 backdrop-blur cursor-pointer"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBannerIdx((prev) => (prev + 1) % heroBanners.length)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20 backdrop-blur cursor-pointer"
                  aria-label="Next banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-2.5 right-4 sm:right-6 flex items-center gap-1.5 z-20">
                  {heroBanners.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveBannerIdx(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === activeBannerIdx ? 'w-5 bg-yellow-400' : 'w-1.5 bg-white/60'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 text-white py-5 sm:py-7 px-4 sm:px-8 overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

            <div className="max-w-xl space-y-2 sm:space-y-2.5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-yellow-400 text-black text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Zap className="w-3 h-3 fill-black" />
                  BIG SAVINGS DAY
                </span>
                <AssuredBadge type="assured" />
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight uppercase">
                India's Favorite <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-rose-300">
                  Premium Marketplace
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 font-normal line-clamp-2 max-w-lg">
                100% genuine fashion & electronics. Same-day dispatch, No-Cost EMI & SuperCoins cashback!
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                <a
                  href="#lightning-deals"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs px-3.5 py-1.5 rounded-full transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Shop Deals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <Link
                  href="/products"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-1.5 rounded-full border border-white/20 transition"
                >
                  All Products
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. High-Conversion Trust & Value Propositions Strip (Big Player Standard) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs">
          <div className="flex items-center gap-2 px-1.5 sm:px-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">
              ⚡
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-bold text-slate-900">Fast Express Delivery</div>
              <div className="text-[9px] text-slate-500">{settings.freeShippingThreshold ? `Free Above ₹${settings.freeShippingThreshold}` : 'Orders before 2 PM'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1.5 sm:px-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
              🛡️
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-bold text-slate-900">100% Genuine</div>
              <div className="text-[9px] text-slate-500">Direct from Brands</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1.5 sm:px-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm flex-shrink-0">
              🔄
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-bold text-slate-900">7-Day Easy Returns</div>
              <div className="text-[9px] text-slate-500">No Questions Asked</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1.5 sm:px-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm flex-shrink-0">
              💵
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-bold text-slate-900">{settings.enableCod !== false ? 'Pay on Delivery' : 'Secure Payments'}</div>
              <div className="text-[9px] text-slate-500">{settings.enableCod !== false ? 'Cash & UPI at Doorstep' : '100% Buyer Protection'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ⚡ Amazon / Flipkart Lightning Deals (Compact Grid) */}
      <section id="lightning-deals" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-2.5 scroll-mt-20">
        <LightningDealsBar
          dealTitle="⚡ DEALS OF THE DAY"
          endsAt={dealEndTimestamp}
          percentageClaimed={84}
        />

        {/* 2-col mobile, 4-col tablet & desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3">
          {dealProducts.map((product) => {
            const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
            const discountPercent = Math.round(
              ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white border border-amber-200/90 rounded-xl p-2 sm:p-2.5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 hidden sm:inline">Assured</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={14}
                          className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="cursor-pointer space-y-1"
                  >
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover rounded hover:scale-105 transition duration-200"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-blue-600 uppercase">
                        {product.brand}
                      </span>
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1 pt-0.5">
                        <StarRating rating={product.rating.value} size={10} />
                        <span className="text-[9px] text-gray-500">({product.rating.count})</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-xs sm:text-sm font-black text-gray-950">
                        ₹{product.price}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        ₹{product.compareAtPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-gray-100 flex gap-1.5">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] sm:text-[11px] font-bold py-1 sm:py-1.5 rounded-lg transition"
                  >
                    + Cart
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product);
                      router.push('/checkout');
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] sm:text-[11px] font-bold py-1 sm:py-1.5 rounded-lg transition"
                  >
                    Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SuperCoins & Bank Offers Promo Strip (Compact) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-3 sm:p-3.5 shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5 max-w-xs">
              <span className="text-[9px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                🪙 SuperCoins Club
              </span>
              <h3 className="text-xs sm:text-sm font-black">Balance: {superCoins} Coins</h3>
              <p className="text-[10px] sm:text-[11px] text-amber-100 leading-tight">
                1 Coin = ₹1 discount at checkout. Earn 4 coins per ₹100!
              </p>
            </div>
            <div className="text-2xl sm:text-3xl select-none">🪙</div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-xl p-3 sm:p-3.5 shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5 max-w-xs">
              <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                <Tag className="w-2.5 h-2.5" />
                Bank Offers
              </span>
              <h3 className="text-xs sm:text-sm font-black">10% Instant Card Discount</h3>
              <p className="text-[10px] sm:text-[11px] text-blue-100 leading-tight">
                Up to ₹1,500 off on HDFC & SBI cards + No Cost EMI above ₹3,000.
              </p>
            </div>
            <div className="text-2xl sm:text-3xl select-none">💳</div>
          </div>
        </div>
      </section>

      {/* 6. Main Catalog Grid (Compact 2-col mobile, 3-col tablet, 4-col laptop, 5-col wide desktop) */}
      <section id="catalog" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-black tracking-tight uppercase flex items-center gap-1.5">
              <span>Trending Catalog</span>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </h2>
            <span className="text-[10px] sm:text-[11px] text-gray-500">({searchResults.total} items)</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
            {categoryFilterList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
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

        {/* Responsive High-Density Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
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
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2">
        <TrustBadges />
      </section>
    </div>
  );
}
