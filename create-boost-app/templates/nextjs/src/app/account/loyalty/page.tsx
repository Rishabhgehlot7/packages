'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../../../context/StoreContext';
import { LoyaltyEngine } from '@boostengine/loyalty';
import { ProgressBar } from '@boostengine/ui';
import { Coins, Sparkles, Gift, ArrowLeft, Crown, Star } from 'lucide-react';

const TIER_BENEFITS: Record<string, string[]> = {
  Bronze: ['1 SuperCoin per ₹100 spent', 'Birthday 50 coins', 'Free delivery over ₹999'],
  Silver: ['1.5 SuperCoins per ₹100 spent', 'Early access to sales', 'Priority support'],
  Gold: ['2 SuperCoins per ₹100 spent', 'Free express delivery', 'Exclusive member drops'],
  SuperStar: ['3 SuperCoins per ₹100 spent', 'Personal stylist concierge', 'Free returns pickup'],
};

const TIERS = ['Bronze', 'Silver', 'Gold', 'SuperStar'];

export default function LoyaltyPage() {
  const { superCoins, customerTier } = useStore();
  const nextTierIndex = TIERS.indexOf(customerTier) + 1;
  const nextTier = TIERS[nextTierIndex] || null;
  const progress = ((superCoins % 500) / 500) * 100;

  const quote = LoyaltyEngine.calculateRedemption(2499, superCoins);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/account" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition">
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
        </div>

        <div className="bg-gradient-to-r from-amber-400 to-yellow-300 rounded-3xl p-6 sm:p-10 text-black shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-black/10 w-fit px-3 py-1 rounded-full">
              <Crown className="w-3.5 h-3.5" /> {customerTier} Member
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">SuperCoins Rewards</h1>
            <p className="text-sm font-medium text-black/80">
              You have <span className="font-black text-black text-xl">{superCoins}</span> coins worth{' '}
              <span className="font-black text-black text-xl">₹{superCoins}</span>
            </p>
            {nextTier && (
              <div className="space-y-1">
                <p className="text-xs font-bold text-black/70">{500 - (superCoins % 500)} coins away from {nextTier}</p>
                <ProgressBar value={progress} color="#000000" height={8} />
              </div>
            )}
          </div>
          <Coins className="absolute -bottom-6 -right-6 w-40 h-40 text-black/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 space-y-3">
            <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> How to Earn
            </h2>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-amber-500" /> Shop products — earn coins on every order</li>
              <li className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-amber-500" /> Write verified reviews for bonus coins</li>
              <li className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-amber-500" /> Refer friends and get ₹200 wallet cashback</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 space-y-3">
            <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-500" /> How to Redeem
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              At checkout, toggle &quot;Use SuperCoins&quot; to pay up to 100% of your cart with coins.
              Example: on a ₹2,499 cart you can redeem up to ₹{quote.rupeeDiscount} using {quote.coinsUsed} coins.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-zinc-800 space-y-4">
          <h2 className="text-sm font-black text-gray-900 dark:text-white">Tier Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIERS.map((tier) => (
              <div
                key={tier}
                className={`p-4 rounded-xl border transition space-y-2 ${
                  tier === customerTier ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/20' : 'border-gray-100 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 dark:text-white">{tier}</span>
                  {tier === customerTier && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <ul className="space-y-1 text-[10px] text-gray-600 dark:text-gray-300">
                  {TIER_BENEFITS[tier].map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
