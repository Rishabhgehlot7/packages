'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS, StoreProduct } from '../../../data/products';
import { useStore } from '../../../context/StoreContext';
import { BoostSearchEngine, SearchSortOption } from '@boostengine/search';
import { ProductCard, SearchInput, Filter, Sort } from '@boostengine/ui';
import { SlidersHorizontal, X, Sparkles, ArrowLeft } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating' },
];

function formatSort(value: string, direction: 'asc' | 'desc'): SearchSortOption {
  if (value === 'relevance') return 'relevance';
  if (value === 'price_asc' || (value === 'price' && direction === 'asc')) return 'price_asc';
  if (value === 'price_desc' || (value === 'price' && direction === 'desc')) return 'price_desc';
  if (value === 'newest') return 'newest';
  if (value === 'rating') return 'rating';
  return 'relevance';
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const { addToCart, toggleWishlist, wishlistItems, inventory } = useStore();
  const [query, setQuery] = useState('');
  const [sortValue, setSortValue] = useState('relevance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState<StoreProduct[]>(PRODUCTS);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveProducts(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const categoryProducts = useMemo(
    () => liveProducts.filter((p) => p.category.toLowerCase().replace(/\s+/g, '-') === slug),
    [liveProducts, slug]
  );

  const allSizes = useMemo(() => Array.from(new Set(categoryProducts.flatMap((p) => p.variants?.map((v) => v.attributes?.Size).filter(Boolean) as string[] || []))), [categoryProducts]);
  const allColors = useMemo(() => Array.from(new Set(categoryProducts.flatMap((p) => p.variants?.map((v) => v.attributes?.Color).filter(Boolean) as string[] || []))), [categoryProducts]);

  const searchResults = useMemo(() => {
    return BoostSearchEngine.search(categoryProducts as any, {
      query: query.trim(),
      sortBy: formatSort(sortValue, sortDirection),
    }) as { products: StoreProduct[]; total: number };
  }, [categoryProducts, query, sortValue, sortDirection]);

  const filteredProducts = useMemo(() => {
    return searchResults.products.filter((product) => {
      const price = product.salePrice ?? product.price;
      if (price < minPrice || price > maxPrice) return false;
      if (inStockOnly && !product.inStock) return false;
      const rating = typeof product.rating === 'object' ? product.rating.value : Number(product.rating) || 0;
      if (rating < minRating) return false;
      if (selectedSizes.length > 0) {
        const sizes = product.variants?.map((v) => v.attributes?.Size) || [];
        if (!selectedSizes.some((s) => sizes.includes(s))) return false;
      }
      if (selectedColors.length > 0) {
        const colors = product.variants?.map((v) => v.attributes?.Color) || [];
        if (!selectedColors.some((c) => colors.includes(c))) return false;
      }
      return true;
    });
  }, [searchResults.products, minPrice, maxPrice, inStockOnly, minRating, selectedSizes, selectedColors]);

  const activeFilterCount = selectedSizes.length + selectedColors.length +
    (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0) + (minPrice > 0 || maxPrice < 10000 ? 1 : 0);

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setInStockOnly(false);
    setMinRating(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Link href="/collections" className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-black">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Collections
          </Link>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">{categoryName}</h1>
          <p className="text-xs text-gray-500">{filteredProducts.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={(q) => setQuery(q)}
            placeholder={`Search in ${categoryName}...`}
            className="w-48 sm:w-72"
          />
          <Sort
            options={SORT_OPTIONS}
            currentValue={sortValue}
            currentDirection={sortDirection}
            onChange={(val, dir) => {
              setSortValue(val);
              setSortDirection(dir);
            }}
          />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="sm:hidden relative p-2.5 bg-gray-100 rounded-xl text-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <aside className={`${mobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-4 overflow-auto' : 'hidden'} sm:block sm:static sm:w-64 sm:bg-transparent sm:p-0 flex-shrink-0 space-y-5`}>
          <div className="flex items-center justify-between sm:hidden mb-4">
            <h2 className="text-sm font-black">Filters</h2>
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-[11px] font-black text-gray-500 hover:text-black underline flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all filters
            </button>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-900">Price Range</label>
            <div className="flex items-center gap-2">
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2" placeholder="Min" />
              <span className="text-gray-400">-</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full text-xs border border-gray-200 rounded-lg px-2 py-2" placeholder="Max" />
            </div>
          </div>

          <Filter label="Size" options={allSizes.map((s) => ({ label: s, value: s }))} selectedValues={selectedSizes} onChange={setSelectedSizes} />
          <Filter label="Color" options={allColors.map((c) => ({ label: c, value: c }))} selectedValues={selectedColors} onChange={setSelectedColors} />

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-900">Minimum Rating</label>
            <div className="flex flex-wrap gap-2">
              {[4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(minRating === star ? 0 : star)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                    minRating === star ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {star}★ & above
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-black" />
            In-stock only
          </label>

          <button onClick={() => setMobileFiltersOpen(false)} className="sm:hidden w-full py-3 bg-black text-white text-xs font-black rounded-xl">
            Show {filteredProducts.length} Products
          </button>
        </aside>

        <section className="flex-1">
          {filteredProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Sparkles className="w-10 h-10 text-gray-300 mx-auto" />
                <h2 className="text-base font-black text-gray-900">No products found</h2>
                <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-black">
                  <X className="w-3.5 h-3.5" /> Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
                  const totalStock = product.variants && product.variants.length > 0
                    ? product.variants.reduce((acc, v) => {
                        const s = inventory.getStock(v.sku);
                        return acc + (s ? s.quantity : v.stock);
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
                      onClick={() => router.push(`/products/${product.slug}`)}
                      onAddToCart={() => addToCart(product)}
                      onToggleWishlist={() => toggleWishlist(product)}
                    />
                  );
                })}
              </div>
            )}
        </section>
      </div>
    </div>
  );
}