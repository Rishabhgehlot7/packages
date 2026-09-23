'use client';

import React, { useState } from 'react';
import { LoyaltyEngine } from '@boostengine/loyalty';
import {
  Coins,
  Crown,
  Sparkles,
  Gift,
  TrendingUp,
  Users,
  Settings,
  ShieldCheck,
  Plus,
  Save,
} from 'lucide-react';

export default function AdminLoyaltyPage() {
  const [earningRate, setEarningRate] = useState(5); // 5 coins per ₹100
  const [coinValueInr, setCoinValueInr] = useState(1); // 1 coin = ₹1
  const [maxRedemptionPct, setMaxRedemptionPct] = useState(20); // max 20% of cart total
  const [saved, setSaved] = useState(false);

  const [tiers, setTiers] = useState([
    { name: 'Bronze', minSpend: 0, multiplier: '1.0x', benefits: '1 SuperCoin per ₹100 spent, Birthday coins' },
    { name: 'Silver', minSpend: 5000, multiplier: '1.5x', benefits: '1.5 SuperCoins per ₹100, Early access to sales' },
    { name: 'Gold', minSpend: 15000, multiplier: '2.0x', benefits: '2.0 SuperCoins per ₹100, Free Express delivery' },
    { name: 'SuperStar', minSpend: 50000, multiplier: '3.0x', benefits: '3.0 SuperCoins per ₹100, VIP concierge & Free returns' },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Coins className="w-7 h-7 text-amber-500" /> Loyalty & SuperCoins Rewards Engine
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure Flipkart/Amazon-style customer reward coins, burn rules, and VIP loyalty tiers.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-black shadow hover:shadow-md transition active:scale-[0.98]"
        >
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Rule Config'}
        </button>
      </div>

      {/* Overview Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Coins Issued</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white">1,42,850</div>
          <p className="text-xs text-gray-400">Equivalent to ₹1,42,850 customer wallet value</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Coins Redeemed</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">88,210</div>
          <p className="text-xs text-gray-400">61.7% redemption rate at checkout</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-bold uppercase tracking-wider">Active VIP Members</span>
            <Crown className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-indigo-600">842</div>
          <p className="text-xs text-gray-400">Gold & SuperStar repeat buyers</p>
        </div>
      </div>

      {/* Rules Setting Section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-500" /> Earning & Redemption Math Rules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Earning Rate (Coins per ₹100 spent)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={earningRate}
              onChange={(e) => setEarningRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Coin INR Value (1 Coin = ₹X)
            </label>
            <input
              type="number"
              step="0.1"
              value={coinValueInr}
              onChange={(e) => setCoinValueInr(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Max Cart Redemption Cap (%)
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={maxRedemptionPct}
              onChange={(e) => setMaxRedemptionPct(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Tier Matrix */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" /> VIP Membership Tier Matrix
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 border-b border-gray-200 dark:border-zinc-800 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tier Name</th>
                <th className="py-3 px-4">Annual Spend Threshold</th>
                <th className="py-3 px-4">Coin Multiplier</th>
                <th className="py-3 px-4">Key Benefits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {tiers.map((t) => (
                <tr key={t.name} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                  <td className="py-3 px-4 font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    {t.name}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-700 dark:text-gray-300">
                    ₹{t.minSpend.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-amber-500">{t.multiplier}</td>
                  <td className="py-3 px-4 text-gray-500 font-medium">{t.benefits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
