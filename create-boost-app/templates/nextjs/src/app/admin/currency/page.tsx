'use client';

import React, { useState } from 'react';
import {
  Globe,
  DollarSign,
  Coins,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface CurrencyRow {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  rounding: string;
  enabled: boolean;
}

export default function AdminCurrencyPage() {
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [autoGeoDetect, setAutoGeoDetect] = useState(true);
  const [fxBuffer, setFxBuffer] = useState(2.0); // 2% buffer

  const [currencies, setCurrencies] = useState<CurrencyRow[]>([
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1.0, rounding: 'round_integer', enabled: true },
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.012, rounding: 'round_up_99', enabled: true },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.011, rounding: 'round_up_99', enabled: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0095, rounding: 'round_up_99', enabled: true },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rate: 0.044, rounding: 'round_up_99', enabled: true },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', rate: 0.045, rounding: 'round_up_99', enabled: true },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 0.016, rounding: 'round_up_99', enabled: true },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rate: 0.018, rounding: 'round_up_99', enabled: true },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$', rate: 0.016, rounding: 'round_up_99', enabled: true },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 1.85, rounding: 'round_integer', enabled: true }
  ]);

  const handleToggle = (code: string) => {
    setCurrencies(
      currencies.map(c => (c.code === code ? { ...c, enabled: !c.enabled } : c))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Multi-Currency & Global Markets
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Sparkles className="h-3 w-3" />
              @boostengine/currency
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Sell worldwide with real-time FX exchange rates, zero-latency Geo-IP country auto-detection, and charm price rounding (.99).
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 transition-all">
          <RefreshCw className="h-4 w-4" />
          Sync Live FX Rates
        </button>
      </div>

      {/* Global Markets Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Store Base Currency</span>
            <DollarSign className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {baseCurrency} (INR - ₹)
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">
            Catalog & payouts ledger base
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Geo-IP Auto Detection</span>
            <Globe className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
            Active
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium block">
            Auto-converts by visitor location
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">FX Safety Buffer</span>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            +{fxBuffer}% Buffer
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium block">
            Protects against FX volatility
          </span>
        </div>
      </div>

      {/* Currencies & FX Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Configured Global Currencies & Exchange Rates</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Rates are calculated relative to 1 {baseCurrency}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/40 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Currency</th>
                <th className="px-5 py-3.5">Symbol</th>
                <th className="px-5 py-3.5">Exchange Rate (1 INR =)</th>
                <th className="px-5 py-3.5">Sample Price (₹2,499)</th>
                <th className="px-5 py-3.5">Rounding Rule</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {currencies.map(c => {
                const samplePrice = c.code === 'INR' ? 2499 : Math.floor(2499 * c.rate) + 0.99;
                return (
                  <tr key={c.code} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">{c.code}</div>
                      <div className="text-xs text-zinc-400">{c.name}</div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-zinc-800 dark:text-zinc-200">{c.symbol}</td>
                    <td className="px-5 py-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {c.rate} {c.code}
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {c.symbol} {samplePrice.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                        {c.rounding}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggle(c.code)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.enabled
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {c.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
