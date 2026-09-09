'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <span className="text-xl font-black text-white tracking-tighter">BOOST.STORE</span>
          <p className="mt-3 text-xs text-gray-500 leading-relaxed">
            The next-generation modular D2C eCommerce template powered by BoostEngine micro-packages.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Shop</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-white transition">All Products</Link></li>
            <li><Link href="/?category=Hoodies" className="hover:text-white transition">Hoodies</Link></li>
            <li><Link href="/?category=T-Shirts" className="hover:text-white transition">T-Shirts</Link></li>
            <li><Link href="/?category=Footwear" className="hover:text-white transition">Footwear</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Admin & Control</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin" className="hover:text-white transition">Dashboard Overview</Link></li>
            <li><Link href="/admin/products" className="hover:text-white transition">Product Manager</Link></li>
            <li><Link href="/admin/orders" className="hover:text-white transition">Orders & Shipping</Link></li>
            <li><Link href="/admin/plugins" className="hover:text-white transition">WordPress Plugins Hub</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Policies</h4>
          <ul className="space-y-2 text-xs">
            <li><span>Free Express Delivery above ₹999</span></li>
            <li><span>7-Day No-Questions Return Policy</span></li>
            <li><span>GST Tax Invoice with SVG Barcode</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600">
        <p>© {new Date().getFullYear()} Boost D2C Store. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[11px]">Powered by @boostengine/core</p>
      </div>
    </footer>
  );
};
