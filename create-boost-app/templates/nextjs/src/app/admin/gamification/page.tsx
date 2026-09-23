'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Users,
  Percent,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldAlert,
  Flame,
  MousePointerClick,
  Gift
} from 'lucide-react';

interface WheelSlice {
  id: string;
  label: string;
  couponCode: string;
  discount: string;
  probabilityWeight: number; // e.g. 30 for 30%
  color: string;
}

export default function AdminGamificationPage() {
  const [slices, setSlices] = useState<WheelSlice[]>([
    {
      id: 'sl_1',
      label: '15% Off Everything',
      couponCode: 'SPIN15',
      discount: '15% OFF',
      probabilityWeight: 40,
      color: '#ec4899'
    },
    {
      id: 'sl_2',
      label: 'Flat ₹200 Cash Voucher',
      couponCode: 'LUCKY200',
      discount: '₹200 OFF',
      probabilityWeight: 25,
      color: '#8b5cf6'
    },
    {
      id: 'sl_3',
      label: 'Free Express Shipping',
      couponCode: 'FREESHIPSPIN',
      discount: 'FREE SHIP',
      probabilityWeight: 20,
      color: '#3b82f6'
    },
    {
      id: 'sl_4',
      label: 'Jackpot 25% Off (VIP)',
      couponCode: 'JACKPOT25',
      discount: '25% OFF',
      probabilityWeight: 10,
      color: '#10b981'
    },
    {
      id: 'sl_5',
      label: 'Better Luck Next Time',
      couponCode: 'TRYAGAIN',
      discount: 'NO PRIZE',
      probabilityWeight: 5,
      color: '#6b7280'
    }
  ]);

  const [exitIntentEnabled, setExitIntentEnabled] = useState(true);
  const [cooldownDays, setCooldownDays] = useState(7);
  const [requirePhone, setRequirePhone] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Spin Wheel & Gamification Center
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Sparkles className="h-3 w-3" />
              @boostengine/gamification
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Capture high-intent leads and reduce cart abandonment with Spin-to-Win lucky wheels, scratch cards, and exit-intent triggers.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Leads Captured</span>
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            3,480 Leads
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Phone numbers & emails
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Wheel Spin Engagement</span>
            <MousePointerClick className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            18.4%
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            Visitor interaction rate
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Coupon Claimed Orders</span>
            <Award className="h-5 w-5 text-pink-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            814 Orders
          </div>
          <span className="text-xs text-pink-600 dark:text-pink-400 mt-1 font-medium">
            23.4% Checkout redemption
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Exit-Intent Recovered GMV</span>
            <Flame className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            ₹12,45,000
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Saved bouncing visitors
          </span>
        </div>
      </div>

      {/* Wheel Config & Anti-Abuse Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slices Table */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Lucky Wheel Slices & Probabilities</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure wheel segment prizes, coupon codes, and winning probability weights.
          </p>

          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {slices.map((slice, idx) => (
              <div key={slice.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: slice.color }}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{slice.label}</div>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                      Code: {slice.couponCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {slice.probabilityWeight}% Weight
                    </span>
                    <div className="text-[10px] text-zinc-400">Odds of landing</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Triggers & Anti-Abuse Shield */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-purple-500" />
            Lead Capture & Triggers
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Exit-Intent Trigger</label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Pop wheel when cursor leaves viewport</p>
              </div>
              <input
                type="checkbox"
                checked={exitIntentEnabled}
                onChange={e => setExitIntentEnabled(e.target.checked)}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Mandatory Phone OTP / Lead</label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Require phone/email before spinning</p>
              </div>
              <input
                type="checkbox"
                checked={requirePhone}
                onChange={e => setRequirePhone(e.target.checked)}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">User Cooldown Days</label>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Limit 1 spin per customer every X days</p>
              <input
                type="number"
                value={cooldownDays}
                onChange={e => setCooldownDays(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
              <span className="text-xs font-semibold text-purple-800 dark:text-purple-300 block">
                🛡️ Fraud Prevention Active
              </span>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5">
                Fingerprint hash + IP rate limiter prevents coupon abuse and script bots.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
