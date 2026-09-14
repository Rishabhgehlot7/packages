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
  RotateCcw,
  Tag,
  Users,
  Star,
  BarChart3,
  Code2,
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
        {
          href: '/admin/reports',
          label: 'Analytics & Reports',
          icon: BarChart3,
          badge: 'Metrics',
          exact: false,
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
          href: '/admin/returns',
          label: 'Returns & Reverse Logistics',
          icon: RotateCcw,
          badge: 'Reverse',
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
      group: 'GROWTH & MARKETING',
      items: [
        {
          href: '/admin/coupons',
          label: 'Coupons & Discounts',
          icon: Tag,
          badge: null,
          exact: false,
        },
        {
          href: '/admin/customers',
          label: 'Customers & Loyalty',
          icon: Users,
          badge: 'VIP',
          exact: false,
        },
        {
          href: '/admin/reviews',
          label: 'Reviews Moderation',
          icon: Star,
          badge: null,
          exact: false,
        },
      ],
    },
    {
      group: 'EXTENSIONS & DEV',
      items: [
        {
          href: '/admin/plugins',
          label: 'Plugins Hub',
          icon: Blocks,
          badge: 'Modular',
          exact: false,
        },
        {
          href: '/admin/dev',
          label: 'Dev Cheat-Sheet',
          icon: Code2,
          badge: 'SDK',
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
    if (pathname === '/admin/reports') return 'Analytics & Reports';
    if (pathname === '/admin/products/new') return 'New Product';
    if (pathname?.startsWith('/admin/products')) return 'Product Catalog';
    if (pathname?.startsWith('/admin/categories')) return 'Categories & Taxonomy';
    if (pathname?.startsWith('/admin/orders')) return 'Order Management';
    if (pathname?.startsWith('/admin/returns')) return 'Returns & Reverse Logistics';
    if (pathname?.startsWith('/admin/coupons')) return 'Coupons & Promotions';
    if (pathname?.startsWith('/admin/customers')) return 'Customers & Loyalty';
    if (pathname?.startsWith('/admin/reviews')) return 'Reviews Moderation';
    if (pathname?.startsWith('/admin/banners')) return 'Banners & Media';
    if (pathname?.startsWith('/admin/plugins')) return 'Plugins Hub';
    if (pathname?.startsWith('/admin/dev')) return 'Developer Engine Cheat-Sheet';
    if (pathname?.startsWith('/admin/settings')) return 'Store Settings';
    return 'Admin Control';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col lg:flex-row antialiased font-sans">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Fixed on Desktop (>=1024px), Slide-over on Mobile & Tablet */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-lg lg:shadow-none ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition duration-200">
              <span className="text-white font-black text-lg select-none">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-slate-900 tracking-tight leading-tight">
                  Boost<span className="text-indigo-600">Admin</span>
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                Enterprise Commerce
              </p>
            </div>
          </Link>

          {/* Close button on mobile & tablet drawer */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Engine Status Badge */}
        <div className="px-4 py-3 border-b border-slate-200/60 bg-slate-50/60">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>MongoDB Connected</span>
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar text-xs font-semibold">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase select-none">
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
                          ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs border border-indigo-200/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition duration-150 ${
                            isActive
                              ? 'text-indigo-600'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="tracking-tight">{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Storefront Link Footer */}
        <div className="p-3 border-t border-slate-200/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition shadow-xs group"
          >
            <span>🌐</span>
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition ml-0.5" />
          </Link>

          {/* User Profile Mini Card */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                RG
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Rishabh Gehlot</p>
                <p className="text-[10px] font-medium text-slate-500 truncate">Store Owner • Admin</p>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile/Tablet Hamburger + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 lg:hidden transition cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold">
              <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition hidden sm:inline">
                Admin
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <span className="text-slate-900 font-black text-sm sm:text-base tracking-tight">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right: Actions & Live Indicators */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 transition"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                RG
              </div>
              <div className="hidden md:block text-left leading-tight">
                <span className="text-xs font-bold text-slate-800 block">Rishabh Gehlot</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Online • SuperAdmin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile & Tablet Floating App Dock Bar */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg safe-area-pb"
      >
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/admin'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${pathname === '/admin' ? 'bg-indigo-50 ring-1 ring-indigo-200 text-indigo-600' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Overview</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            pathname?.startsWith('/admin/products')
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${pathname?.startsWith('/admin/products') ? 'bg-indigo-50 ring-1 ring-indigo-200 text-indigo-600' : ''}`}>
            <Package className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Products</span>
        </Link>

        <Link
          href="/admin/orders"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            pathname?.startsWith('/admin/orders')
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${pathname?.startsWith('/admin/orders') ? 'bg-indigo-50 ring-1 ring-indigo-200 text-indigo-600' : ''}`}>
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Orders</span>
        </Link>

        <Link
          href="/admin/plugins"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            pathname?.startsWith('/admin/plugins')
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${pathname?.startsWith('/admin/plugins') ? 'bg-indigo-50 ring-1 ring-indigo-200 text-indigo-600' : ''}`}>
            <Blocks className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Plugins</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer"
          aria-label="More navigation options"
        >
          <div className="p-1.5 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>
    </div>
  );
}
