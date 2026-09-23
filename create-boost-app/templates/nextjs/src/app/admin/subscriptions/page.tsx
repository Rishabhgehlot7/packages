'use client';

import React, { useState } from 'react';
import {
  Repeat,
  DollarSign,
  TrendingUp,
  UserCheck,
  PauseCircle,
  PlayCircle,
  SkipForward,
  XCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  ArrowUpRight
} from 'lucide-react';

interface SubscriptionRow {
  id: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  productTitle: string;
  frequency: string;
  totalAmount: number;
  nextBillingDate: string;
  status: 'active' | 'paused' | 'skipped' | 'cancelled';
  cyclesCompleted: number;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([
    {
      id: 'sub_8921_ax',
      customerName: 'Aman Sharma',
      customerEmail: 'aman@example.com',
      planName: 'Monthly Auto-Delivery (15% Off)',
      productTitle: 'Pure Whey Isolate 1kg - Chocolate',
      frequency: 'Every 30 Days',
      totalAmount: 2124,
      nextBillingDate: '2026-10-15',
      status: 'active',
      cyclesCompleted: 4
    },
    {
      id: 'sub_4190_bz',
      customerName: 'Sneha Patel',
      customerEmail: 'sneha@example.com',
      planName: 'Biweekly Fresh Roast (10% Off)',
      productTitle: 'Arabica Espresso Beans 500g',
      frequency: 'Every 14 Days',
      totalAmount: 720,
      nextBillingDate: '2026-09-30',
      status: 'active',
      cyclesCompleted: 7
    },
    {
      id: 'sub_3312_ck',
      customerName: 'Vikram Mehta',
      customerEmail: 'vikram@example.com',
      planName: 'Monthly Care Pack (15% Off)',
      productTitle: 'Daily Multivitamin & Omega-3 Pack',
      frequency: 'Every 30 Days',
      totalAmount: 1499,
      nextBillingDate: '2026-10-02',
      status: 'paused',
      cyclesCompleted: 2
    },
    {
      id: 'sub_1120_df',
      customerName: 'Kavita Rao',
      customerEmail: 'kavita@example.com',
      planName: 'Quarterly Bulk Save (20% Off)',
      productTitle: 'Organic Green Tea Tin (Pack of 3)',
      frequency: 'Every 90 Days',
      totalAmount: 2399,
      nextBillingDate: '2026-11-20',
      status: 'active',
      cyclesCompleted: 1
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleStatus = (id: string, newStatus: 'active' | 'paused') => {
    setSubscriptions(
      subscriptions.map(s => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleSkipNext = (id: string) => {
    setSubscriptions(
      subscriptions.map(s => {
        if (s.id === id) {
          const d = new Date(s.nextBillingDate);
          d.setDate(d.getDate() + 30);
          return { ...s, nextBillingDate: d.toISOString().split('T')[0], status: 'skipped' };
        }
        return s;
      })
    );
  };

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const mrr = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + s.totalAmount, 0);
  const arr = mrr * 12;

  const filtered = subscriptions.filter(
    s =>
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Subscribe & Save Command Center
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-3 w-3" />
              @boostengine/subscriptions
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Automate recurring deliveries, track Monthly Recurring Revenue (MRR), and empower customer self-serve controls.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Monthly Recurring (MRR)</span>
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            ₹{mrr.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Predictable auto-billed revenue
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Annual Run-Rate (ARR)</span>
            <TrendingUp className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            ₹{arr.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            12x Annualised subscription value
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Subscribers</span>
            <UserCheck className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {activeCount} Subscribers
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
            96.2% Retention rate
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Customer Churn Rate</span>
            <ArrowUpRight className="h-5 w-5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            2.1%
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Industry benchmark &lt; 5%
          </span>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Live Active Subscriptions</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search subscriber or product..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 pl-9 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/40 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Subscription / Customer</th>
                <th className="px-5 py-3.5">Product & Plan</th>
                <th className="px-5 py-3.5">Frequency</th>
                <th className="px-5 py-3.5">Recurring Amount</th>
                <th className="px-5 py-3.5">Next Billing Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filtered.map(sub => (
                <tr key={sub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{sub.customerName}</div>
                    <div className="text-xs text-zinc-400">{sub.customerEmail}</div>
                    <span className="text-[10px] text-zinc-500 font-mono">{sub.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{sub.productTitle}</div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400">{sub.planName}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{sub.cyclesCompleted} Orders delivered</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      {sub.frequency}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">₹{sub.totalAmount}</div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Save 15% applied</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      {sub.nextBillingDate}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        sub.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : sub.status === 'paused'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : sub.status === 'skipped'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {sub.status === 'active' ? (
                        <button
                          onClick={() => handleToggleStatus(sub.id, 'paused')}
                          title="Pause Subscription"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors"
                        >
                          <PauseCircle className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(sub.id, 'active')}
                          title="Resume Subscription"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600 transition-colors"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSkipNext(sub.id)}
                        title="Skip Next Delivery"
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-600 transition-colors"
                      >
                        <SkipForward className="h-4 w-4" />
                      </button>
                    </div>
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
