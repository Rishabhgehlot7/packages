'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Coins,
  ShieldCheck,
  Star,
  ShoppingBag,
  ExternalLink,
  Crown,
} from 'lucide-react';

interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'SuperStar';
  totalOrders: number;
  lifetimeSpend: number;
  superCoins: number;
  joinedDate: string;
  lastOrderDate: string;
}

const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'CUST-001',
    name: 'Aarav Mehta',
    phone: '+91 98765 43210',
    email: 'aarav@example.com',
    city: 'Mumbai, Maharashtra',
    tier: 'SuperStar',
    totalOrders: 14,
    lifetimeSpend: 42800,
    superCoins: 650,
    joinedDate: '2026-01-15',
    lastOrderDate: '2026-09-12',
  },
  {
    id: 'CUST-002',
    name: 'Pooja Verma',
    phone: '+91 98123 45678',
    email: 'pooja.v@gmail.com',
    city: 'Bengaluru, Karnataka',
    tier: 'Gold',
    totalOrders: 8,
    lifetimeSpend: 21500,
    superCoins: 310,
    joinedDate: '2026-03-20',
    lastOrderDate: '2026-09-10',
  },
  {
    id: 'CUST-003',
    name: 'Vikram Singhania',
    phone: '+91 97654 32109',
    email: 'vikram.s@outlook.com',
    city: 'New Delhi, Delhi',
    tier: 'Silver',
    totalOrders: 4,
    lifetimeSpend: 8900,
    superCoins: 120,
    joinedDate: '2026-06-05',
    lastOrderDate: '2026-08-29',
  },
  {
    id: 'CUST-004',
    name: 'Rohan Deshmukh',
    phone: '+91 95432 10987',
    email: 'rohan.d@yahoo.com',
    city: 'Pune, Maharashtra',
    tier: 'Bronze',
    totalOrders: 1,
    lifetimeSpend: 1999,
    superCoins: 40,
    joinedDate: '2026-09-02',
    lastOrderDate: '2026-09-02',
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const filtered = customers.filter((c) => {
    if (tierFilter !== 'ALL' && c.tier !== tierFilter) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.phone.includes(search) &&
      !c.email.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'SuperStar':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Gold':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Silver':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            Customers & Loyalty Tiers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            CRM database powered by @boostengine/loyalty with SuperCoins rewards & spend history.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">Total Registered</div>
          <div className="text-2xl font-black text-gray-900">{customers.length}</div>
          <span className="text-[10px] text-emerald-600 font-medium">+100% phone verified</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">SuperStar VIPs</div>
          <div className="text-2xl font-black text-purple-600 flex items-center gap-1.5">
            <Crown className="w-5 h-5" />
            {customers.filter((c) => c.tier === 'SuperStar').length}
          </div>
          <span className="text-[10px] text-purple-600 font-medium">Lifetime Spend &gt; ₹30k</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">Total Customer GMV</div>
          <div className="text-2xl font-black text-gray-900">
            ₹
            {customers
              .reduce((sum, c) => sum + c.lifetimeSpend, 0)
              .toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Avg ₹18,799 / user</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">Outstanding SuperCoins</div>
          <div className="text-2xl font-black text-amber-600 flex items-center gap-1.5">
            <Coins className="w-5 h-5" />
            {customers.reduce((sum, c) => sum + c.superCoins, 0)}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Available for redemption</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'SuperStar', 'Gold', 'Silver', 'Bronze'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                tierFilter === tier
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Loyalty Tier</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">SuperCoins Balance</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{c.name}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>{c.phone}</span>
                      <span>•</span>
                      <span>{c.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTierColor(
                        c.tier
                      )}`}
                    >
                      ★ {c.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {c.totalOrders} orders
                  </td>
                  <td className="py-3.5 px-4 font-black text-gray-900">
                    ₹{c.lifetimeSpend.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                      <Coins className="w-3 h-3" /> {c.superCoins} Coins
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{c.city}</td>
                  <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                    {c.lastOrderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
