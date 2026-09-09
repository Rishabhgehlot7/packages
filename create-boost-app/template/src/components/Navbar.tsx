'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore, getCityFromPincode } from '../context/StoreContext';
import { BoostSearchEngine } from '@boostengine/search';
import { PRODUCTS } from '../data/products';
import { Search, ShoppingBag, Heart, MapPin, Sparkles, X } from 'lucide-react';
import { AnnouncementBar, AssuredBadge } from '@boostengine/ui';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    cartSummary,
    setIsCartOpen,
    wishlistItems,
    superCoins,
    customerTier,
    deliveryLocation,
    setDeliveryLocation,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof PRODUCTS>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [newPincode, setNewPincode] = useState(deliveryLocation.pincode);
  const [newCity, setNewCity] = useState(deliveryLocation.city);

  React.useEffect(() => {
    setNewPincode(deliveryLocation.pincode);
    setNewCity(deliveryLocation.city);
  }, [deliveryLocation]);

  const handlePincodeChange = (pin: string) => {
    const clean = pin.replace(/\D/g, '').slice(0, 6);
    setNewPincode(clean);
    if (clean.length === 6) {
      const detected = getCityFromPincode(clean);
      setNewCity(detected.city);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    const res = BoostSearchEngine.search(PRODUCTS as any, { query: val });
    setSearchResults(res.products.slice(0, 5) as any);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPincode.trim()) {
      const cityToSave = newCity.trim() || getCityFromPincode(newPincode.trim()).city;
      setDeliveryLocation({ city: cityToSave, pincode: newPincode.trim() });
      setIsLocationModalOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <AnnouncementBar
        messages={[
          '⚡ MEGA SAVINGS: Up to 50% OFF + Extra 10% Instant Bank Discount',
          '🔥 FREE Express 1-Day Delivery on orders above ₹999'
        ]}
        couponCode="BOOST200"
        closable={false}
      />

      {/* Main Bar */}
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-13 sm:h-14 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Logo & Assured Badge */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-black uppercase">
              BOOST<span className="text-blue-600">.</span>MARKET
            </span>
          </Link>
          <div className="hidden lg:block">
            <AssuredBadge type="assured" />
          </div>
        </div>

        {/* Location Picker (Amazon style) */}
        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition text-xs group"
          title="Change Delivery Location"
        >
          <MapPin className="w-4 h-4 text-blue-600 group-hover:animate-bounce flex-shrink-0" />
          <div className="leading-tight">
            <span className="text-[10px] text-gray-400 block font-medium">Deliver to</span>
            <span className="font-bold text-gray-800 text-xs truncate max-w-[120px] block">
              {deliveryLocation.city} {deliveryLocation.pincode}
            </span>
          </div>
        </button>

        {/* Desktop Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search 10,000+ products, electronics, sneakers..."
              className="w-full bg-gray-50 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          {isSearchFocused && searchResults.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-50 divide-y divide-gray-50"
              onMouseDown={(e) => e.preventDefault()}
            >
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => setIsSearchFocused(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded-md border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs font-bold text-gray-900">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Catalog Link */}
          <Link
            href="/products"
            className="hidden sm:inline-flex text-xs font-bold text-gray-700 hover:text-blue-600 px-2 py-1 transition"
          >
            All Products
          </Link>

          {/* SuperCoins Pill (Flipkart style) */}
          <div
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1.5 rounded-full cursor-default"
            title={`You have ${superCoins} SuperCoins (${customerTier} Tier)`}
          >
            <span className="text-sm">🪙</span>
            <span className="hidden xs:inline">{superCoins}</span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded uppercase font-extrabold hidden md:inline">
              {customerTier}
            </span>
          </div>

          {/* Wishlist Button */}
          <Link
            href="/wishlist"
            className="p-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-full relative transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black px-3.5 sm:px-4 py-2 rounded-full transition shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-black text-white px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">
              {cartSummary.totalQuantity}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar (Always visible on mobile) */}
      <div className="sm:hidden px-3 pb-2">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search products, brands, deals..."
            className="w-full bg-gray-100 text-xs pl-8 pr-3 py-1.5 rounded-full border border-gray-200 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {isSearchFocused && searchResults.length > 0 && (
          <div
            className="absolute top-full left-4 right-4 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden z-50 divide-y divide-gray-100"
            onMouseDown={(e) => e.preventDefault()}
          >
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={() => setIsSearchFocused(false)}
                className="flex items-center gap-3 p-2.5 hover:bg-gray-50"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-9 h-9 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{product.title}</p>
                  <p className="text-xs font-bold text-gray-900">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Location Ribbon (Amazon / Flipkart style: "Deliver to Mumbai 400050 ⌵") */}
      <div className="sm:hidden px-3 py-1.5 bg-blue-50/70 border-t border-b border-blue-100 flex items-center justify-between text-[11px]">
        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1.5 text-blue-950 font-bold truncate max-w-[280px]"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>
            Deliver to{' '}
            <span className="underline decoration-blue-400 font-extrabold">
              {deliveryLocation.city} {deliveryLocation.pincode}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="text-[10px] text-blue-600 font-extrabold uppercase hover:underline"
        >
          Change
        </button>
      </div>

      {/* Delivery Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Choose Delivery Location</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Enter your pincode to check instant product availability and 1-day delivery.
            </p>
            <form onSubmit={handleSaveLocation} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  6-Digit Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={newPincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:border-blue-600 focus:outline-none"
                  placeholder="e.g. 400050, 110001, 560001"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  City / Area (Auto-detected)
                </label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:border-blue-600 focus:outline-none bg-gray-50"
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
              >
                Apply Location
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
