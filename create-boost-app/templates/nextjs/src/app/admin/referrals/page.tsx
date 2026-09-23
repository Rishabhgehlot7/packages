'use client';

import React, { useState } from 'react';
import {
  Users,
  Gift,
  Share2,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle2,
  Copy,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, Badge } from '@boostengine/ui';

interface ReferralCampaign {
  id: string;
  name: string;
  referrerReward: string;
  friendReward: string;
  minOrderValue: number;
  status: 'active' | 'paused';
  totalRefers: number;
  totalRevenue: number;
  conversionRate: string;
}

interface TopReferrer {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  successfulInvites: number;
  totalEarnings: number;
  status: 'verified' | 'flagged';
}

export default function AdminReferralsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([
    {
      id: 'ref-camp-1',
      name: 'Standard Give ₹200 / Get ₹200 Loop',
      referrerReward: '₹200 Store Credit',
      friendReward: '₹200 Instant Discount',
      minOrderValue: 999,
      status: 'active',
      totalRefers: 438,
      totalRevenue: 547500,
      conversionRate: '18.4%',
    },
    {
      id: 'ref-camp-2',
      name: 'Festival Double Viral Booster',
      referrerReward: '₹500 Store Credit + VIP Coin',
      friendReward: '20% Off Max ₹500',
      minOrderValue: 1499,
      status: 'paused',
      totalRefers: 124,
      totalRevenue: 248000,
      conversionRate: '24.1%',
    },
  ]);

  const [topReferrers] = useState<TopReferrer[]>([
    {
      id: 'ref-usr-1',
      name: 'Aakash Verma',
      email: 'aakash.v@gmail.com',
      referralCode: 'AAKASH200',
      successfulInvites: 32,
      totalEarnings: 6400,
      status: 'verified',
    },
    {
      id: 'ref-usr-2',
      name: 'Pooja Sharma',
      email: 'pooja.s@outlook.com',
      referralCode: 'POOJA200',
      successfulInvites: 28,
      totalEarnings: 5600,
      status: 'verified',
    },
    {
      id: 'ref-usr-3',
      name: 'Vikram Singh',
      email: 'vikram.singh99@gmail.com',
      referralCode: 'VIKRAM99',
      successfulInvites: 19,
      totalEarnings: 3800,
      status: 'flagged',
    },
  ]);

  const [antiFraudSettings, setAntiFraudSettings] = useState({
    ipFingerprintCheck: true,
    deviceCookieMatching: true,
    blockSelfReferrals: true,
    minDaysOldAccount: 0,
    maxRefersPerDay: 5,
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Referrals & Viral Loop</h1>
            <Badge variant="primary" size="sm">Powered by @boostengine/referrals</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage double-sided customer referral campaigns, top advocates, and anti-fraud abuse shields.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Sync Metrics
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            New Referral Campaign
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Referral Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹7,95,500</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +28.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Attributed organic D2C sales</p>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Successful Invites</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">562</span>
            <span className="text-xs font-bold text-indigo-600">Conversions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">New buyers acquired via friend links</p>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Viral Multiplier (K-Factor)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1.34x</span>
            <span className="text-xs font-bold text-purple-600">Organic</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Each customer brings 1.34 friends</p>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CAC Savings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹1,12,400</span>
            <span className="text-xs font-bold text-amber-600">Saved Ads</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs Paid Meta/Google Ad acquisition</p>
        </Card>
      </div>

      {/* Main Campaign Management & Anti Fraud Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Referral Campaigns</h2>
            <span className="text-xs text-slate-500">2 campaigns configured</span>
          </div>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <Card key={camp.id} className="p-5 border-slate-200 hover:border-indigo-200 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{camp.name}</h3>
                      <Badge variant={camp.status === 'active' ? 'success' : 'default'} size="sm">
                        {camp.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Min Order Value: <span className="font-semibold text-slate-700">₹{camp.minOrderValue}</span>
                    </p>
                  </div>

                  <Button
                    variant={camp.status === 'active' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => {
                      setCampaigns(prev =>
                        prev.map(c => c.id === camp.id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c)
                      );
                    }}
                  >
                    {camp.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Referrer Bonus</span>
                    <span className="font-bold text-slate-800">{camp.referrerReward}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Friend Bonus</span>
                    <span className="font-bold text-indigo-600">{camp.friendReward}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Refers</span>
                    <span className="font-bold text-slate-800">{camp.totalRefers} Orders</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Sales</span>
                    <span className="font-bold text-emerald-600">₹{camp.totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Top Referrers Leaderboard */}
          <div className="pt-4">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top Brand Advocates Leaderboard</span>
            </h2>

            <Card className="border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Advocate</th>
                      <th className="px-4 py-3">Referral Code</th>
                      <th className="px-4 py-3">Successful Invites</th>
                      <th className="px-4 py-3">Store Credit Earned</th>
                      <th className="px-4 py-3">Fraud Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topReferrers.map((ref) => (
                      <tr key={ref.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{ref.name}</div>
                          <div className="text-[10px] text-slate-400">{ref.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleCopy(ref.referralCode)}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 font-mono font-bold rounded border border-indigo-200 hover:bg-indigo-100 transition"
                          >
                            <span>{ref.referralCode}</span>
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedCode === ref.referralCode && (
                            <span className="text-[10px] text-emerald-600 ml-1.5 font-bold">Copied!</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {ref.successfulInvites} friends
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          ₹{ref.totalEarnings.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          {ref.status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Safe
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" /> Flagged IP
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Anti-Fraud & Policy Configuration */}
        <div className="space-y-4">
          <Card className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Anti-Fraud Shield</h3>
                <p className="text-[11px] text-slate-400">Powered by @boostengine/referrals</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={antiFraudSettings.ipFingerprintCheck}
                  onChange={(e) => setAntiFraudSettings(prev => ({ ...prev, ipFingerprintCheck: e.target.checked }))}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">IP Subnet & Geolocation Matching</span>
                  <span className="text-[11px] text-slate-500">Block referral claims generated from the identical IP address or local network.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={antiFraudSettings.deviceCookieMatching}
                  onChange={(e) => setAntiFraudSettings(prev => ({ ...prev, deviceCookieMatching: e.target.checked }))}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Device Fingerprint & Cookie Match</span>
                  <span className="text-[11px] text-slate-500">Prevent same browser session self-referrals in incognito windows.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={antiFraudSettings.blockSelfReferrals}
                  onChange={(e) => setAntiFraudSettings(prev => ({ ...prev, blockSelfReferrals: e.target.checked }))}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Phone & Billing Name Collision</span>
                  <span className="text-[11px] text-slate-500">Disallow same phone number or payment card hashes between friend & referrer.</span>
                </div>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Max Allowed Successful Refers Per Day:
                </label>
                <input
                  type="number"
                  value={antiFraudSettings.maxRefersPerDay}
                  onChange={(e) => setAntiFraudSettings(prev => ({ ...prev, maxRefersPerDay: Number(e.target.value) }))}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <Button variant="primary" size="sm" className="w-full">
                Save Anti-Fraud Security Rules
              </Button>
            </div>
          </Card>

          {/* Quick Info Box */}
          <Card className="p-4 border-indigo-100 bg-indigo-50/50">
            <div className="flex gap-2.5">
              <Gift className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-900 leading-relaxed">
                <span className="font-bold block">Automatic Payout Workflow:</span>
                Referral store credits are deposited into customer accounts only after the friend's order return window (7 days) expires safely.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
