'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Blocks,
  Settings,
  ExternalLink,
  Menu,
  X,
  Database,
  ChevronRight,
  ShieldCheck,
  FolderTree,
  Megaphone,
} from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        {
          href: '/admin',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
          exact: true,
        },
      ],
    },
    {
      group: 'COMMERCE',
      items: [
        {
          href: '/admin/products',
          label: 'Products Catalog',
          icon: Package,
          badge: null,
          exact: false,
        },
        {
          href: '/admin/categories',
          label: 'Categories & Subs',
          icon: FolderTree,
          badge: 'Tree',
          exact: false,
        },
        {
          href: '/admin/orders',
          label: 'Orders & Dispatch',
          icon: ShoppingCart,
          badge: null,
          exact: false,
        },
        {
          href: '/admin/banners',
          label: 'Banners & Ads',
          icon: Megaphone,
          badge: 'Live',
          exact: false,
        },
      ],
    },
    {
      group: 'EXTENSIONS',
      items: [
        {
          href: '/admin/plugins',
          label: 'Plugins Hub',
          icon: Blocks,
          badge: 'Modular',
          exact: false,
        },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        {
          href: '/admin/settings',
          label: 'Store Settings',
          icon: Settings,
          badge: null,
          exact: false,
        },
      ],
    },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname?.startsWith('/admin/products')) return 'Product Catalog';
    if (pathname?.startsWith('/admin/orders')) return 'Order Management';
    if (pathname?.startsWith('/admin/plugins')) return 'Plugins Hub';
    if (pathname?.startsWith('/admin/settings')) return 'Store Settings';
    return 'Admin Control';
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col lg:flex-row antialiased font-sans">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Fixed on Desktop (>=1024px), Slide-over on Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10 group-hover:scale-105 transition duration-200">
              <span className="text-white font-black text-lg select-none">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-white tracking-tight leading-tight">
                  Boost<span className="text-indigo-400">Admin</span>
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Enterprise Commerce
              </p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 lg:hidden transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Engine Status Badge */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/30">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>MongoDB Connected</span>
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-400/80" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar text-xs font-semibold">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase select-none">
                {group.group}
              </span>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = mounted
                    ? item.exact
                      ? pathname === item.href
                      : pathname?.startsWith(item.href)
                    : false;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition duration-150 ${
                        isActive
                          ? 'bg-indigo-600/90 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition duration-150 ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="tracking-wide">{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Storefront Link Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold transition shadow-xs group"
          >
            <span>🌐</span>
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition ml-0.5" />
          </Link>

          {/* User Profile Mini Card */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center ring-1 ring-white/20 flex-shrink-0">
                RG
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">Rishabh Gehlot</p>
                <p className="text-[10px] text-slate-500 truncate">Store Owner • Admin</p>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Hamburger + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 lg:hidden transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold">
              <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition hidden sm:inline">
                Admin
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
              <span className="text-slate-100 font-extrabold text-sm sm:text-base tracking-tight">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right: Actions & Live Indicators */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center ring-2 ring-indigo-500/20 shadow-xs">
                RG
              </div>
              <div className="hidden md:block text-left leading-tight">
                <span className="text-xs font-bold text-slate-200 block">Rishabh Gehlot</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">Online • SuperAdmin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
