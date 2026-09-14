'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gift,
  ArrowLeft,
  Copy,
  Check,
  Share2,
  Users,
  Coins,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

interface ReferralHistory {
  id: string;
  refereeName: string;
  date: string;
  orderTotal: number;
  rewardEarned: number;
  status: 'PENDING_DELIVERY' | 'REWARD_CREDITED';
}

const MOCK_REFERRALS: ReferralHistory[] = [
  {
    id: 'ref_1',
    refereeName: 'Vikram Mehta',
    date: '2026-09-10',
    orderTotal: 1899,
    rewardEarned: 200,
    status: 'REWARD_CREDITED',
  },
  {
    id: 'ref_2',
    refereeName: 'Pooja Verma',
    date: '2026-09-13',
    orderTotal: 2499,
    rewardEarned: 200,
    status: 'PENDING_DELIVERY',
  },
];

export default function CustomerReferralsPage() {
  const { superCoins } = useStore();
  const [copied, setCopied] = useState(false);
  const referralCode = 'REF-AARAV-200';
  const referralLink = `https://boostengine.store/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Hey! Use my referral code ${referralCode} on Boost Store to get flat ₹200 OFF on your first streetwear order: ${referralLink}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-black text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-extrabold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Double-Sided Viral Rewards
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Give ₹200, Get ₹200!
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Invite your friends to shop our luxury streetwear. They get{' '}
              <span className="text-white font-bold">₹200 instant off</span> on their first order,
              and you get <span className="text-amber-300 font-bold">₹200 wallet cashback</span>{' '}
              once their package is delivered.
            </p>

            {/* Share Code Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 px-4 flex items-center justify-between flex-1">
                <span className="font-mono text-sm font-bold tracking-wider text-amber-300">
                  {referralCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">2</div>
              <div className="text-xs text-gray-500 font-medium">Friends Invited</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">₹400</div>
              <div className="text-xs text-gray-500 font-medium">Total Rewards Earned</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{superCoins}</div>
              <div className="text-xs text-gray-500 font-medium">Available Wallet Coins</div>
            </div>
          </div>
        </div>

        {/* 3 Step Visual Guide */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-gray-900">How the Referral Program Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900">Send Invite Link</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Copy your exclusive link or tap WhatsApp share to send it to your friends & family.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900">Friend Gets ₹200 OFF</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                When they place their first order over ₹999, ₹200 discount is automatically applied.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900">You Get ₹200 Cashback</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Once their order is delivered, ₹200 is instantly credited to your store wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Invited Friends Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900">Referral Activity History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                  <th className="pb-3">Friend Name</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Order Total</th>
                  <th className="pb-3">Reward</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_REFERRALS.map((ref) => (
                  <tr key={ref.id} className="text-gray-700">
                    <td className="py-3 font-semibold text-gray-900">{ref.refereeName}</td>
                    <td className="py-3 text-gray-500">{ref.date}</td>
                    <td className="py-3">₹{ref.orderTotal.toLocaleString('en-IN')}</td>
                    <td className="py-3 font-bold text-emerald-600">+₹{ref.rewardEarned}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          ref.status === 'REWARD_CREDITED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ref.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
