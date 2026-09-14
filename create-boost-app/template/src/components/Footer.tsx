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
    <footer className="bg-white text-slate-600 py-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
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

        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Admin & Control</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin" className="hover:text-blue-600 transition">Dashboard Overview</Link></li>
            <li><Link href="/admin/products" className="hover:text-blue-600 transition">Product Manager</Link></li>
            <li><Link href="/admin/orders" className="hover:text-blue-600 transition">Orders & Shipping</Link></li>
            <li><Link href="/admin/plugins" className="hover:text-blue-600 transition">WordPress Plugins Hub</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">Store Policies</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-700 font-medium">Free Express Delivery above ₹{shippingThreshold}</span></li>
            <li><span className="text-slate-600">{settings.enableCod !== false ? 'Cash on Delivery (COD) Available' : '100% Secure Online Payment'}</span></li>
            <li><span className="text-slate-600">7-Day No-Questions Return Policy</span></li>
            {settings.gstin && (
              <li><span className="text-slate-500 font-mono text-[11px]">GSTIN: {settings.gstin}</span></li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-400">Powered by BoostEngine Dynamic Architecture</p>
      </div>
    </footer>
  );
};
