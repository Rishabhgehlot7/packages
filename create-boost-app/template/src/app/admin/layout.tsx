import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-lg">⚡</span>
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight leading-none">
                Boost<span className="text-indigo-400">Admin</span>
              </h1>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                D2C Engine v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
          >
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
          >
            <span className="text-lg">📦</span>
            <span>Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
          >
            <span className="text-lg">🛒</span>
            <span>Orders</span>
          </Link>
          <Link
            href="/admin/plugins"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">🧩</span>
              <span>Plugins Hub</span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
              WP Style
            </span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </Link>
        </nav>

        {/* Storefront Link */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700/50 text-xs font-semibold transition"
          >
            <span>🌐</span>
            <span>View Live Storefront</span>
            <span>↗</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-slate-900/60 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Engine Connected
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">Admin Owner</p>
              <p className="text-[11px] text-slate-400">admin@boostengine.dev</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-400/30">
              BO
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
