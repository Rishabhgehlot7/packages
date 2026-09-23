'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, StoreProduct } from '../../data/products';
import { useStore } from '../../context/StoreContext';
import { BoostSearchEngine, SearchSortOption } from '@boostengine/search';
import { ProductCard, TrustBadges } from '@boostengine/ui';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { addToCart, toggleWishlist, wishlistItems, inventory } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [liveProducts, setLiveProducts] = useState<StoreProduct[]>(PRODUCTS);
  const [liveCategories, setLiveCategories] = useState<any[]>([]);

  React.useEffect(() => {
    async function loadCatalog() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success && prodData.data && prodData.data.length > 0) {
          setLiveProducts(prodData.data);
        }
        if (catData.success && catData.data && catData.data.length > 0) {
          setLiveCategories(catData.data);
        }
      } catch (err) {
        // Fallback
      }
    }
    loadCatalog();
  }, []);

  const categories = [
    'All',
    ...(liveCategories.length > 0
      ? Array.from(new Set(liveCategories.map((c: any) => c.name))).filter(Boolean)
      : Array.from(new Set(liveProducts.map((p) => p.category))).filter(Boolean)),
  ];

  const searchResults = useMemo(() => {
    return BoostSearchEngine.search(liveProducts as any, {
      query: searchQuery || undefined,
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      sortBy,
    }) as any;
  }, [liveProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5">
      {/* Header */}
      <div className="border-b border-gray-100 pb-3 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Curated Catalog</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-gray-950 uppercase">
            All Products
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {searchResults.total} premium marketplace items.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600">
            <SlidersHorizontal className="w-3 h-3 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SearchSortOption)}
              className="bg-transparent text-[11px] font-bold text-gray-900 outline-none cursor-pointer"
            >
              <option value="relevance">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid: 2-column mobile, 4-column desktop */}
      {searchResults.products.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-sm font-bold text-gray-700">No products found</p>
          <p className="text-xs text-gray-400">Try changing your category or search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {searchResults.products.map((product: StoreProduct) => {
            const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
            const totalStock =
              product.variants && product.variants.length > 0
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
                stockUrgencyText={
                  typeof totalStock === 'number' && totalStock > 0 && totalStock <= 3
                    ? `Only ${totalStock} left!`
                    : undefined
                }
                rating={typeof product.rating === 'object' ? product.rating?.value : product.rating}
                reviewCount={typeof product.rating === 'object' ? product.rating?.count : undefined}
                onClick={() => router.push(`/products/${product.slug || product.id}`)}
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
      )}

      {/* Trust Badges Footer */}
      <div className="pt-8 border-t border-gray-100">
        <TrustBadges />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading collection...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
