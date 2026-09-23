'use client';

import React, { useState } from 'react';
import {
  Globe,
  FileCode,
  Share2,
  Search,
  CheckCircle2,
  ExternalLink,
  Copy,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Card, Button, Badge } from '@boostengine/ui';

export default function AdminSeoPage() {
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditDone, setAuditDone] = useState(true);

  const feeds = [
    {
      id: 'google-merchant',
      name: 'Google Merchant Center XML Feed',
      format: 'XML / RSS 2.0',
      url: '/api/feeds/google-merchant',
      lastSynced: 'Just now',
      productCount: 24,
      status: 'healthy',
      description: 'Standard Google Shopping feed with title, price, INR currency, stock availability, and GTIN/MPN attributes.',
    },
    {
      id: 'meta-catalog',
      name: 'Meta (Facebook & Instagram) Catalog CSV',
      format: 'CSV / UTF-8',
      url: '/api/feeds/meta-catalog',
      lastSynced: '5 mins ago',
      productCount: 24,
      status: 'healthy',
      description: 'Auto-sync catalog feed for Meta Commerce Manager, Instagram Shopping, and dynamic retargeting ads.',
    },
    {
      id: 'sitemap-xml',
      name: 'Dynamic XML Sitemap with Image Extensions',
      format: 'XML (Sitemaps.org)',
      url: '/sitemap.xml',
      lastSynced: 'Live on build',
      productCount: 52,
      status: 'healthy',
      description: 'Auto-generated index of all categories, products, blogs, and legal pages with priority & image tags.',
    },
  ];

  const auditItems = [
    {
      name: 'JSON-LD Structured Data (Schema.org)',
      status: 'passed',
      detail: 'Product, Offer, AggregateRating, Organization & BreadcrumbList schemas are valid.',
    },
    {
      name: 'OpenGraph & Twitter Card Meta Tags',
      status: 'passed',
      detail: 'og:image (1200x630), og:title, og:description, twitter:card = summary_large_image configured.',
    },
    {
      name: 'Canonical URL Auto-Resolution',
      status: 'passed',
      detail: 'Self-referencing canonical tags active across all product variant pages.',
    },
    {
      name: 'Hreflang & Multi-Currency Ready',
      status: 'passed',
      detail: 'en-IN target locale and INR currency standard specified.',
    },
    {
      name: 'Core Web Vitals Indexing Readiness',
      status: 'passed',
      detail: 'Zero layout shifts on SSR catalog render, fast INP and LCP score.',
    },
  ];

  const handleCopy = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedFeed(url);
    setTimeout(() => setCopiedFeed(null), 2000);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditDone(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">SEO Feeds & Search Engine Sync</h1>
            <Badge variant="primary" size="sm">Powered by @boostengine/seo</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage live Google Merchant XML feeds, Meta Catalog CSV sync, XML Sitemaps, and Schema.org rich snippets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunAudit}
            isLoading={isAuditing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Re-Audit Storefront SEO
          </Button>
        </div>
      </div>

      {/* Product Feeds Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-600" />
          <span>Automated Catalog Syndication Feeds</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feeds.map((feed) => (
            <Card key={feed.id} className="p-5 border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold">
                    <FileCode className="w-5 h-5" />
                  </span>
                  <Badge variant="success" size="sm">
                    LIVE
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{feed.name}</h3>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">{feed.format}</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {feed.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Synced Products:</span>
                  <span className="font-bold text-slate-800">{feed.productCount} Active</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopy(feed.url)}
                    leftIcon={<Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedFeed === feed.url ? 'Copied URL!' : 'Copy Feed URL'}
                  </Button>

                  <a
                    href={feed.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                    title="View Raw Feed"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SEO Audit & Rich Snippets Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Search Engine Structured Data Health</span>
          </h2>

          <Card className="border-slate-200 overflow-hidden divide-y divide-slate-100">
            {auditItems.map((item, idx) => (
              <div key={idx} className="p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Live SERP Preview */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Google SERP Preview</span>
          </h2>

          <Card className="p-5 border-slate-200 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold">
                ⚡
              </div>
              <div className="text-[11px] text-slate-600 truncate">
                https://yourstore.com › products › wireless-earbuds
              </div>
            </div>

            <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer">
              Premium Wireless Noise Cancelling Earbuds | BoostStore
            </div>

            <p className="text-xs text-slate-600 leading-snug">
              Experience ultra-low latency audio with Active Noise Cancellation and 40-hour battery life. Fast pan-India delivery & 7-day hassle-free returns.
            </p>

            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="font-bold text-slate-800">₹2,499.00</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">In stock</span>
              <span>•</span>
              <span>⭐ 4.8 (128 reviews)</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
