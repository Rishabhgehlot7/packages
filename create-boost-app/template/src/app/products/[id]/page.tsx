'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { PRODUCTS, StoreProduct } from '../../../data/products';
import { useStore, getCityFromPincode } from '../../../context/StoreContext';
import { RecommendationsEngine } from '@boostengine/recommendations';
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
} from '@boostengine/ui';
import { Heart, ShoppingBag, ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const {
    addToCart,
    toggleWishlist,
    wishlistItems,
    inventory,
    addBundleToCart,
    deliveryLocation,
    setDeliveryLocation,
  } = useStore();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants ? product.variants[0].id : 'default'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);

  const currentVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentComparePrice = currentVariant ? currentVariant.compareAtPrice : product.compareAtPrice;
  const currentSku = currentVariant ? currentVariant.sku : product.sku;
  const stockLevel = inventory.getStock(currentSku);
  const stockQty = stockLevel ? stockLevel.quantity : (product.inStock ? 10 : 0);

  // Compute Frequently Bought Together combo using @boostengine/recommendations
  const catalogRecItems = PRODUCTS.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    imageUrl: p.images[0],
    category: p.category,
    rating: p.rating?.value || 4.5,
    tags: p.tags,
  }));

  const mainRecItem = {
    id: product.id,
    title: product.title,
    price: currentPrice,
    imageUrl: product.images[0],
    category: product.category,
    rating: product.rating?.value || 4.5,
    tags: product.tags,
  };

  const fbtBundle = RecommendationsEngine.getFrequentlyBoughtTogether(
    mainRecItem,
    catalogRecItems,
    { maxItems: 2, discountPercentage: 10 }
  );

  // Reviews Breakdown calculation
  const reviewBreakdown = {
    5: Math.round((product.rating?.count || 20) * 0.7),
    4: Math.round((product.rating?.count || 20) * 0.2),
    3: Math.round((product.rating?.count || 20) * 0.07),
    2: Math.round((product.rating?.count || 20) * 0.02),
    1: Math.round((product.rating?.count || 20) * 0.01),
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariantId, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 pb-20 md:pb-12">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="truncate max-w-[280px] sm:max-w-md">Home / {product.category} / {product.title}</span>
        </Link>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Gallery (Sticky on Big Screens like Amazon/Flipkart) */}
        <div className="lg:col-span-6 space-y-3 lg:sticky lg:top-20 self-start">
          <ProductGallery images={product.images} />
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
          {/* Brand, Title & Assured Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {product.brand}
              </span>
              <AssuredBadge type="assured" />
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-950 tracking-tight">
              {product.title}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <StarRating rating={product.rating.value} size={14} />
                <span className="text-xs font-bold text-gray-800">{product.rating.value.toFixed(1)}</span>
                <span className="text-[11px] text-gray-500">({product.rating.count} ratings)</span>
              </div>
            )}
          </div>

          {/* Pricing & Special Deal Tag */}
          <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-gray-950">₹{currentPrice.toLocaleString('en-IN')}</span>
              {currentComparePrice && currentComparePrice > currentPrice && (
                <>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ₹{currentComparePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-500">
              Inclusive of all taxes • Earn {Math.floor((currentPrice / 100) * 3)} SuperCoins
            </p>
          </div>

          {/* Lightning Deal Countdown ticker if applicable */}
          <LightningDealsBar
            dealTitle="⚡ LIMITED TIME DEAL"
            endsAt={Date.now() + 4 * 3600 * 1000 + 18 * 60 * 1000}
            percentageClaimed={81}
          />

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
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition ${
                      selectedVariantId === v.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-gray-200 hover:border-gray-400 text-gray-800'
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
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
      <section className="pt-4">
        <FrequentlyBoughtTogether
          mainProduct={{
            id: product.id,
            title: product.title,
            price: currentPrice,
            imageUrl: product.images[0],
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

      {/* Ratings & Customer Reviews Breakdown */}
      <section className="space-y-6 pt-4 border-t border-gray-100">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          Customer Ratings & Reviews
        </h2>

        <ReviewBreakdownBars
          averageRating={product.rating?.value || 4.7}
          totalReviews={product.rating?.count || 32}
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
