'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  PRODUCTS,
  StoreProduct,
  getProductBySlug,
  getProductById,
  getProductUrl,
} from '../../../data/products';
import { useStore, getCityFromPincode } from '../../../context/StoreContext';
import { RecommendationsEngine } from '@boostengine/recommendations';
import { generateProductJsonLd, generateBreadcrumbJsonLd } from '@boostengine/seo';
import { JsonLdScript } from '@boostengine/seo/react';
import {
  PincodeChecker,
  StarRating,
  TrustBadges,
  ProductGallery,
  ReviewBreakdownBars,
  QuantitySelector,
  AssuredBadge,
  LightningDealsBar,
  BankOffersAccordion,
  FrequentlyBoughtTogether,
  DualMobileActionBar,
  ProgressBar,
} from '@boostengine/ui';
import { Heart, ShoppingBag, ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';

export default function ProductDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const slug = (routeParams?.slug as string) || '';
  const initialProduct = getProductBySlug(slug) || getProductById(slug) || null;
  const [product, setProduct] = useState<StoreProduct | null>(initialProduct);
  const [loading, setLoading] = useState<boolean>(!initialProduct);
  const [allProducts, setAllProducts] = useState<StoreProduct[]>(PRODUCTS);

  const {
    addToCart,
    toggleWishlist,
    wishlistItems,
    inventory,
    addBundleToCart,
    deliveryLocation,
    setDeliveryLocation,
    settings,
  } = useStore();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialProduct?.variants?.[0]?.id || 'default'
  );
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    async function fetchDynamicProduct() {
      const resolved = getProductBySlug(slug) || getProductById(slug);
      try {
        const [prodRes, catalogRes] = await Promise.all([
          fetch(`/api/products?id=${encodeURIComponent(slug)}`),
          fetch('/api/products'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catalogRes.json();

        if (prodData.success && prodData.data && !Array.isArray(prodData.data)) {
          const merged = { ...(resolved || {}), ...(prodData.data as StoreProduct) };
          setProduct(merged);
          if (merged.variants && merged.variants.length > 0) {
            setSelectedVariantId(merged.variants[0].id || merged.variants[0].sku);
          }
        } else if (resolved) {
          setProduct(resolved);
        }
        if (catData.success && catData.data && catData.data.length > 0) {
          setAllProducts(catData.data);
        }
      } catch (err) {
        console.error('Error loading dynamic product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDynamicProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-4xl">🔍</div>
        <h2 className="text-lg font-black text-gray-900 uppercase">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for might have been moved or removed from our live catalog.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-black text-white text-xs font-black uppercase px-5 py-2.5 rounded-full hover:bg-gray-800 transition cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);
  const currentVariant = product.variants?.find((v) => v.id === selectedVariantId || v.sku === selectedVariantId);
  const currentPrice = Number(currentVariant ? (currentVariant.salePrice ?? currentVariant.price) : (product.salePrice ?? product.price)) || 0;
  const currentComparePrice = Number(currentVariant ? (currentVariant.compareAtPrice ?? currentVariant.price) : (product.compareAtPrice ?? product.price)) || currentPrice;
  const currentSku = currentVariant ? currentVariant.sku : (product.sku || product.id || 'default');
  const stockLevel = currentSku ? inventory.getStock(currentSku) : null;
  const stockQty = stockLevel ? stockLevel.quantity : (product.inStock ? 10 : 0);

  const galleryImages = (currentVariant?.images && currentVariant.images.length > 0)
    ? currentVariant.images
    : (product.images?.length > 0 ? product.images : (product.media?.map(m => m.url) || []));

  // Compute Frequently Bought Together combo using @boostengine/recommendations
  const catalogRecItems = allProducts.map((p) => ({
    id: p.id,
    title: p.title || (p as any).name || '',
    price: p.salePrice || p.price || 0,
    compareAtPrice: p.compareAtPrice,
    imageUrl: p.images?.[0] || (p as any).media?.[0]?.url || '',
    category: p.category || 'General',
    rating: typeof p.rating === 'object' ? (p.rating?.value ?? 4.5) : (Number(p.rating) || 4.5),
    tags: p.tags || [],
  }));

  // Reviews Breakdown calculation
  const ratingVal = typeof product.rating === 'object' ? (product.rating?.value ?? 4.5) : (Number(product.rating) || 4.5);
  const ratingCount = typeof product.rating === 'object' ? (product.rating?.count ?? 28) : 28;
  const reviewBreakdown = {
    5: Math.round(ratingCount * 0.7),
    4: Math.round(ratingCount * 0.2),
    3: Math.round(ratingCount * 0.07),
    2: Math.round(ratingCount * 0.02),
    1: Math.round(ratingCount * 0.01),
  };

  const productUrl = `${settings.storeUrl}${getProductUrl(product)}`;
  const productSchema = useMemo(
    () =>
      generateProductJsonLd({
        id: product.id,
        title: product.title,
        description: product.description,
        url: productUrl,
        images: galleryImages,
        price: currentPrice,
        currency: 'INR',
        availability: product.inStock ? 'in_stock' : 'out_of_stock',
        sku: currentSku,
        brand: product.brand,
        category: product.category,
        rating: { value: ratingVal, count: ratingCount },
        reviews:
          product.reviews?.map((r) => ({
            author: r.author,
            rating: r.rating,
            body: r.body || r.comment,
            datePublished: r.createdAt,
          })) || [],
        returnPolicy: {
          applicableCountry: 'IN',
          merchantReturnDays: 7,
          returnFees: 'https://schema.org/FreeReturn',
        },
        shippingDetails: {
          shippingRate: { price: 0, currency: 'INR', free: true, freeOver: settings.freeShippingThreshold },
          shippingDestination: ['IN'],
          deliveryTime: { minDays: 2, maxDays: 5 },
        },
      }),
    [product, currentPrice, currentSku, galleryImages, ratingVal, ratingCount, productUrl, settings.freeShippingThreshold]
  );

  const breadcrumbSchema = useMemo(
    () =>
      generateBreadcrumbJsonLd([
        { name: 'Home', url: settings.storeUrl || '/' },
        { name: product.category, url: `${settings.storeUrl}/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
        { name: product.title, url: productUrl },
      ]),
    [product, productUrl, settings.storeUrl]
  );

  const mainRecItem = {
    id: product.id,
    title: product.title || product.name || '',
    price: currentPrice || 0,
    imageUrl: galleryImages[0] || product.images?.[0] || '',
    category: product.category || 'General',
    rating: ratingVal,
    tags: product.tags || [],
  };

  const fbtBundle = RecommendationsEngine.getFrequentlyBoughtTogether(
    mainRecItem,
    catalogRecItems,
    { maxItems: 2, discountPercentage: 10 }
  );

  const handleBuyNow = () => {
    addToCart(product, selectedVariantId, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 pb-20 md:pb-12">
      <JsonLdScript schema={productSchema} id="product-jsonld" />
      <JsonLdScript schema={breadcrumbSchema} id="breadcrumb-jsonld" />

      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="truncate max-w-[280px] sm:max-w-md">Home / {product.category} / {product.title || product.name}</span>
        </Link>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Gallery (Sticky on Big Screens like Amazon/Flipkart) */}
        <div className="lg:col-span-6 space-y-3 lg:sticky lg:top-20 self-start">
          <ProductGallery images={galleryImages} />
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
          {/* Brand, Title & Assured Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {product.brand}
              </span>
              <AssuredBadge type="assured" />
              {product.warrantyYears && product.warrantyYears > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  🛡️ {product.warrantyYears >= 99 ? 'Lifetime Warranty' : `${product.warrantyYears} Year${product.warrantyYears > 1 ? 's' : ''} Warranty`}
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-950 tracking-tight">
              {product.title || product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <StarRating rating={ratingVal} size={14} />
                <span className="text-xs font-bold text-gray-800">{ratingVal.toFixed(1)}</span>
                <span className="text-[11px] text-gray-500">({ratingCount} ratings)</span>
              </div>
            )}
          </div>

          {/* Pricing & Special Deal Tag */}
          <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-gray-950">₹{(currentPrice || 0).toLocaleString('en-IN')}</span>
              {currentComparePrice && currentComparePrice > currentPrice ? (
                <>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ₹{currentComparePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)}% OFF
                  </span>
                </>
              ) : null}
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-500">
              Inclusive of all taxes • Earn {Math.floor(((currentPrice || 0) / 100) * 3)} SuperCoins
            </p>
          </div>

          {/* Lightning Deal Countdown ticker if applicable */}
          <LightningDealsBar
            dealTitle="⚡ LIMITED TIME DEAL"
            endsAt={Date.now() + 4 * 3600 * 1000 + 18 * 60 * 1000}
            percentageClaimed={81}
          />

          {/* Social Proof & Urgency Bar */}
          <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-extrabold text-rose-700 dark:text-rose-300">
              🔥 48 people ordered in the last 24h
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400 text-[11px]">
              Only {stockQty > 0 ? stockQty : 3} left in Mumbai warehouse
            </span>
          </div>

          {/* 15-Minute Checkout Urgency Meter */}
          <div className="space-y-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-amber-800 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" /> Hurry! Only {stockQty} items left
              </span>
              <span className="text-[11px] text-amber-700">4 people have this in their cart</span>
            </div>
            <ProgressBar value={Math.min(100, (stockQty / 20) * 100)} color="#f59e0b" height={6} />
            <p className="text-[10px] text-amber-700">
              High demand — complete checkout within 15 minutes to reserve your selection.
            </p>
          </div>

          {/* Volume Tiered Pricing (Buy More Save More) */}
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-2">
            <span className="text-[11px] font-black uppercase text-blue-900 dark:text-blue-300 tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-600 fill-blue-600" /> Tiered Volume Savings
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div
                onClick={() => setQuantity(1)}
                className={`p-2 rounded-lg border cursor-pointer transition ${
                  quantity === 1 ? 'border-blue-600 bg-white dark:bg-zinc-800 shadow-xs' : 'border-gray-200 bg-white/60'
                }`}
              >
                <div className="text-[10px] text-gray-500 font-bold">Standard</div>
                <div className="font-black text-gray-900 dark:text-white">Qty 1</div>
                <div className="text-[11px] font-extrabold text-gray-700 dark:text-gray-300">₹{currentPrice}</div>
              </div>

              <div
                onClick={() => setQuantity(2)}
                className={`p-2 rounded-lg border cursor-pointer transition ${
                  quantity === 2 ? 'border-blue-600 bg-white dark:bg-zinc-800 shadow-xs' : 'border-gray-200 bg-white/60'
                }`}
              >
                <div className="text-[10px] text-emerald-600 font-black">Save 10%</div>
                <div className="font-black text-gray-900 dark:text-white">Qty 2</div>
                <div className="text-[11px] font-extrabold text-emerald-600">₹{Math.round(currentPrice * 0.9)}/pc</div>
              </div>

              <div
                onClick={() => setQuantity(3)}
                className={`p-2 rounded-lg border cursor-pointer transition ${
                  quantity >= 3 ? 'border-blue-600 bg-white dark:bg-zinc-800 shadow-xs' : 'border-gray-200 bg-white/60'
                }`}
              >
                <div className="text-[10px] text-emerald-600 font-black">Save 15%</div>
                <div className="font-black text-gray-900 dark:text-white">Qty 3+</div>
                <div className="text-[11px] font-extrabold text-emerald-600">₹{Math.round(currentPrice * 0.85)}/pc</div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-gray-900 uppercase">
                Select Option / Color
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const label = v.title || v.name || v.options?.map((o) => o.value).join(' / ') || v.sku;
                  const isSelected = selectedVariantId === v.id || selectedVariantId === v.sku;
                  return (
                    <button
                      key={v.id || v.sku}
                      onClick={() => setSelectedVariantId(v.id || v.sku)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-gray-200 hover:border-gray-400 text-gray-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Key Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Desktop Dual Action Buttons (Amazon / Flipkart colors) */}
          <div className="space-y-4 pt-2 hidden md:block">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-900 uppercase">Quantity</span>
              <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={5} />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => addToCart(product, selectedVariantId, quantity)}
                className="flex-1 bg-[#ff9f00] hover:bg-[#f39700] text-black font-extrabold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-[#fb641b] hover:bg-[#e85c17] text-white font-extrabold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-gray-200 hover:border-gray-400 text-gray-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Flipkart / Amazon Bank Offers Accordion */}
          <BankOffersAccordion />

          {/* Pincode & Delivery check */}
          <div className="border-t border-gray-100 pt-4">
            <PincodeChecker
              defaultPincode={deliveryLocation.pincode}
              onCheck={(pin) => {
                const detected = getCityFromPincode(pin);
                setDeliveryLocation({ city: detected.city, pincode: pin });
                const num = parseInt(pin, 10);
                if (num >= 400001 && num <= 400099) {
                  return {
                    isServiceable: true,
                    estimatedDeliveryDate: `Tomorrow, by 11 PM to ${detected.city} (Prime 1-Day)`,
                    isCodAvailable: true,
                  };
                }
                return {
                  isServiceable: true,
                  estimatedDeliveryDate: `2-3 business days to ${detected.city}`,
                  isCodAvailable: true,
                };
              }}
            />
          </div>

          <TrustBadges />
        </div>
      </div>

      {/* Frequently Bought Together (Amazon combo widget) */}
      {fbtBundle && fbtBundle.bundleItems && fbtBundle.bundleItems.length > 0 && (
        <section className="pt-4">
          <FrequentlyBoughtTogether
            mainProduct={{
              id: product.id,
              title: product.title || product.name || '',
              price: currentPrice,
              imageUrl: galleryImages[0] || (product.images && product.images[0]) || '',
            }}
            suggestedItems={fbtBundle.bundleItems.map((b: any) => ({
              id: b.id,
              title: b.title,
              price: b.price,
              imageUrl: b.imageUrl,
            }))}
            bundleDiscountPercentage={10}
            onAddBundleToCart={(items) => {
              addBundleToCart(items);
            }}
          />
        </section>
      )}

      {/* Feature Banners Showcase */}
      {product.featureBanners && product.featureBanners.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <div className="space-y-4">
            {product.featureBanners.map((banner, idx) => (
              <div key={idx} className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
                <img src={banner.image} alt={`Feature ${idx + 1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ratings & Customer Reviews Breakdown */}
      <section className="space-y-6 pt-4 border-t border-gray-100">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          Customer Ratings & Reviews
        </h2>

        <ReviewBreakdownBars
          averageRating={ratingVal}
          totalReviews={ratingCount}
          breakdown={reviewBreakdown}
        />

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="space-y-4 pt-2">
            {product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{rev.author}</span>
                    {rev.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.createdAt}</span>
                </div>
                <StarRating rating={rev.rating} size={12} />
                <p className="text-xs text-gray-700 leading-relaxed">{rev.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mobile-Only Sticky Bottom Action Bar (Hidden on Big Screens/Desktop >= 768px) */}
      <div className="block md:hidden">
        <DualMobileActionBar
          price={currentPrice}
          compareAtPrice={currentComparePrice}
          isWishlisted={isWishlisted}
          onAddToCart={() => addToCart(product, selectedVariantId, quantity)}
          onBuyNow={handleBuyNow}
          onToggleWishlist={() => toggleWishlist(product)}
        />
      </div>
    </div>
  );
}
