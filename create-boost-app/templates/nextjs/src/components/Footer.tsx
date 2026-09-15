'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { settings } = useStore();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.data) {
          setCategories(data.data.slice(0, 5));
        }
      } catch (e) {
        // Fallback
      }
    }
    loadCategories();
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const storeName = settings.storeName || 'BOOST.STORE';
  const shippingThreshold = settings.freeShippingThreshold || 999;

  return (
    <footer className="bg-white text-slate-600 py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        {/* Brand Column */}
        <div className="sm:col-span-2 md:col-span-1">
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">{storeName}</span>
          <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
            India's favorite next-generation eCommerce store with instant checkout, live order tracking, and COD available.
          </p>
          {(settings.supportEmail || settings.supportPhone) && (
            <div className="mt-3 text-xs text-slate-600 space-y-1">
              {settings.supportEmail && (
                <div>Email: <a href={`mailto:${settings.supportEmail}`} className="font-medium text-blue-600 hover:underline">{settings.supportEmail}</a></div>
              )}
              {settings.supportPhone && (
                <div>Phone: <span className="font-medium text-slate-800">{settings.supportPhone}</span></div>
              )}
            </div>
          )}
        </div>

        {/* Shop Categories */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Shop Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-blue-600 transition font-medium">All Collections</Link></li>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat._id || cat.id}>
                  <Link href={`/?category=${encodeURIComponent(cat.name)}`} className="hover:text-blue-600 transition">
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/?category=Hoodies" className="hover:text-blue-600 transition">Hoodies</Link></li>
                <li><Link href="/?category=T-Shirts" className="hover:text-blue-600 transition">T-Shirts</Link></li>
                <li><Link href="/?category=Footwear" className="hover:text-blue-600 transition">Footwear</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Customer Care & Warranty */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Customer Support</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
            <li><Link href="/warranty-registration" className="hover:text-blue-600 transition">Warranty Registration</Link></li>
            <li><Link href="/warranty-claim" className="hover:text-blue-600 transition">File Warranty Claim</Link></li>
            <li><Link href="/orders" className="hover:text-blue-600 transition">Track Order</Link></li>
          </ul>
        </div>

        {/* Store Policies */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Policies & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/privacy-policy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
            <li><Link href="/terms-conditions" className="hover:text-blue-600 transition">Terms & Conditions</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-blue-600 transition">Shipping Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-blue-600 transition">Return & Refund Policy</Link></li>
          </ul>
        </div>

        {/* Admin & Trust */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Store Guarantees</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-700 font-medium">Free Express Delivery above ₹{shippingThreshold}</span></li>
            <li><span className="text-slate-600">{settings.enableCod !== false ? 'COD Available Across India' : '100% Secure Online Payment'}</span></li>
            <li><span className="text-slate-600">7-Day No-Questions Return</span></li>
            <li className="pt-2"><Link href="/admin" className="font-semibold text-blue-600 hover:underline">Staff / Admin Portal →</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-400">Powered by BoostEngine Enterprise D2C Architecture</p>
      </div>
    </footer>
  );
};
