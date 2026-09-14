'use client';

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Terminal,
  Truck,
  CreditCard,
  FileText,
  Tag,
  Key,
  Smartphone,
  ExternalLink,
  Search,
  Sparkles,
} from 'lucide-react';

interface Snippet {
  id: string;
  title: string;
  pkg: string;
  category: 'core' | 'payments' | 'shipping' | 'growth' | 'backend';
  description: string;
  language: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    id: 'cart-calc',
    title: 'Calculate Cart with GST & Shipping',
    pkg: '@boostengine/cart',
    category: 'core',
    description: 'Computes line-item totals, applicable tax brackets (CGST/SGST/IGST), free-shipping thresholds, and final payable amount.',
    language: 'typescript',
    code: `import { calculateCartTotals } from '@boostengine/cart';

const result = calculateCartTotals({
  items: [
    { id: 'prod_oversized_tee', price: 999, quantity: 2 },
    { id: 'prod_cargo_pants', price: 1799, quantity: 1 }
  ],
  couponDiscount: 200,
  pincode: '560001',
  freeShippingThreshold: 999
});

console.log(result);
// => { subtotal: 3797, discount: 200, shippingFee: 0, tax: 431, total: 4028 }`,
  },
  {
    id: 'pincode-lookup',
    title: 'Indian Pincode to City/State Auto-Lookup',
    pkg: '@boostengine/shipping',
    category: 'shipping',
    description: 'Instant local offline lookup for tier-1/tier-2 Indian pincodes with COD eligibility and estimated delivery SLA.',
    language: 'typescript',
    code: `// Built-in Boost Pincode Directory (Zero API Key needed)
const response = await fetch('/api/shipping/pincode/110001');
const data = await response.json();

console.log(data);
// => {
//   pincode: "110001",
//   city: "New Delhi",
//   state: "Delhi",
//   codAvailable: true,
//   slaDays: 2,
//   courierPartner: "Delhivery Surface"
// }`,
  },
  {
    id: 'mock-order',
    title: 'Create Order (Razorpay + Zero-Config Mock Fallback)',
    pkg: '@boostengine/payments',
    category: 'payments',
    description: 'Creates a real Razorpay order if API keys exist, or gracefully produces a simulated order for test checkouts.',
    language: 'typescript',
    code: `const res = await fetch('/api/payments/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1499,
    currency: 'INR',
    receipt: 'rcpt_boost_' + Date.now(),
    customer: { name: 'Aarav Sharma', phone: '9876543210' }
  })
});
const order = await res.json();
// In Mock Mode: returns { orderId: "order_mock_...", mock: true, amount: 1499 }`,
  },
  {
    id: 'gst-invoice',
    title: 'Generate GST-Compliant Tax Invoice',
    pkg: '@boostengine/invoicing',
    category: 'core',
    description: 'Generates standardized D2C invoice JSON or PDF buffer with HSN codes, buyer GSTIN, and reverse charge markers.',
    language: 'typescript',
    code: `import { generateGSTInvoice } from '@boostengine/invoicing';

const invoice = generateGSTInvoice({
  orderId: 'ORD-98214',
  seller: {
    legalName: 'Boost Commerce India Pvt Ltd',
    gstin: '07AAAAA0000A1Z5',
    stateCode: '07' // Delhi
  },
  buyer: {
    name: 'Rohit Verma',
    shippingStateCode: '27' // Maharashtra => Triggers IGST automatically
  },
  items: [
    { title: 'Heavyweight Hoodie', hsn: '6101', price: 2499, qty: 1, gstRate: 12 }
  ]
});`,
  },
  {
    id: 'otp-auth',
    title: 'Phone OTP Authentication (Mock OTP: 1234)',
    pkg: '@boostengine/auth',
    category: 'growth',
    description: 'Send and verify 4-digit SMS OTPs. In development / mock mode, any number accepts OTP 1234 instantly.',
    language: 'typescript',
    code: `// 1. Send OTP
await fetch('/api/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify({ phone: '9876543210' })
});

// 2. Verify OTP (Pass 1234 in Mock Mode)
const res = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  body: JSON.stringify({ phone: '9876543210', otp: '1234' })
});
const { token, user } = await res.json();`,
  },
  {
    id: 'express-server',
    title: '1-Line Microservice Mount',
    pkg: '@boostengine/server',
    category: 'backend',
    description: 'Embed the entire Boost Commerce API suite into any existing Express, Fastify, or Node.js backend with 1 function call.',
    language: 'typescript',
    code: `import express from 'express';
import { createBoostServer } from '@boostengine/server';

const app = express();

// Mount all /api/shipping, /api/payments, /api/auth routes
app.use('/api', createBoostServer({
  mockMode: process.env.NODE_ENV !== 'production',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  shiprocket: {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  }
}));

app.listen(5000, () => console.log('🚀 Boost Server running on :5000'));`,
  },
];

export default function AdminDevPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testPincode, setTestPincode] = useState('110001');
  const [pincodeResult, setPincodeResult] = useState<any>(null);
  const [testingPincode, setTestingPincode] = useState(false);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestPincode = async () => {
    try {
      setTestingPincode(true);
      // Simulated client-side directory check matching @boostengine/server
      const directory: Record<string, { city: string; state: string; cod: boolean; sla: number }> = {
        '110001': { city: 'New Delhi (Connaught Place)', state: 'Delhi', cod: true, sla: 2 },
        '400001': { city: 'Mumbai (Fort / South Mumbai)', state: 'Maharashtra', cod: true, sla: 2 },
        '560001': { city: 'Bengaluru (MG Road / Central)', state: 'Karnataka', cod: true, sla: 2 },
        '700001': { city: 'Kolkata (BBD Bagh)', state: 'West Bengal', cod: true, sla: 3 },
        '600001': { city: 'Chennai (George Town)', state: 'Tamil Nadu', cod: true, sla: 3 },
        '500001': { city: 'Hyderabad (Abids)', state: 'Telangana', cod: true, sla: 2 },
        '380001': { city: 'Ahmedabad', state: 'Gujarat', cod: true, sla: 3 },
        '302001': { city: 'Jaipur', state: 'Rajasthan', cod: true, sla: 2 },
      };

      const match = directory[testPincode.trim()];
      if (match) {
        setPincodeResult({
          pincode: testPincode.trim(),
          ...match,
          courier: 'Blue Dart / Delhivery Express',
          mockMode: true,
          status: 'SERVICEABLE',
        });
      } else {
        setPincodeResult({
          pincode: testPincode.trim(),
          city: 'Standard India Destination',
          state: 'India',
          cod: true,
          sla: 4,
          courier: 'India Post / Surface Express',
          mockMode: true,
          status: 'SERVICEABLE',
        });
      }
    } finally {
      setTestingPincode(false);
    }
  };

  const filteredSnippets = SNIPPETS.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pkg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Zero-Config Mock Mode Active
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Developer Engine & SDK Cheat-Sheet
          </h1>
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
            Ready-to-use micro-package snippets for your Next.js storefront, mobile app, and backend. Test OTPs with <code className="bg-indigo-900/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">1234</code> and checkouts with simulated Razorpay orders without providing external API keys.
          </p>
        </div>
      </div>

      {/* Quick Pincode Sandbox Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Live Indian Pincode Directory Tester</h3>
            <p className="text-xs text-slate-500">Test the built-in offline serviceability engine (Try: 110001, 400001, 560001, 302001)</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testPincode}
            onChange={(e) => setTestPincode(e.target.value)}
            placeholder="Enter 6-digit Indian Pincode"
            maxLength={6}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-64 font-mono"
          />
          <button
            onClick={handleTestPincode}
            disabled={testingPincode || testPincode.length !== 6}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Lookup Pincode
          </button>
        </div>

        {pincodeResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
            <div className="flex items-center justify-between text-emerald-600 font-semibold mb-2">
              <span>● Status: {pincodeResult.status}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">SLA: {pincodeResult.sla} Days</span>
            </div>
            <div><strong>Location:</strong> {pincodeResult.city}, {pincodeResult.state}</div>
            <div><strong>COD Available:</strong> {pincodeResult.cod ? 'YES (Verified Tier-1/2 Route)' : 'NO'}</div>
            <div><strong>Default Courier:</strong> {pincodeResult.courier}</div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Packages' },
            { id: 'core', label: 'Core & Cart' },
            { id: 'payments', label: 'Payments & COD' },
            { id: 'shipping', label: 'Shipping & Logistics' },
            { id: 'growth', label: 'Growth & Auth' },
            { id: 'backend', label: 'Backend Server' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets or packages..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Code Snippets Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-300"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {snippet.pkg}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    {snippet.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{snippet.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{snippet.description}</p>
              </div>

              <button
                onClick={() => copyToClipboard(snippet.id, snippet.code)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  copiedId === snippet.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {copiedId === snippet.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Snippet
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 bg-slate-900 text-slate-100 overflow-x-auto text-xs font-mono leading-relaxed">
              <pre>
                <code>{snippet.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Environment Config Quick Reference */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Environment Variables Cheat-Sheet</h2>
        </div>
        <p className="text-xs text-slate-500">
          When you're ready to go live from Mock Mode to Production, add these keys to your <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.env.local</code>:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 pr-4">Variable</th>
                <th className="py-2.5 px-4">Default (Mock)</th>
                <th className="py-2.5 pl-4">Production Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-indigo-600">MOCK_MODE</td>
                <td className="py-2.5 px-4 text-emerald-600">true</td>
                <td className="py-2.5 pl-4 font-sans text-slate-500">Set to "false" when deploying to production</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-indigo-600">RAZORPAY_KEY_ID</td>
                <td className="py-2.5 px-4 text-slate-400">rzp_test_mock</td>
                <td className="py-2.5 pl-4 font-sans text-slate-500">Razorpay Dashboard &gt; Settings &gt; API Keys</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-indigo-600">RAZORPAY_KEY_SECRET</td>
                <td className="py-2.5 px-4 text-slate-400">rzp_secret_mock</td>
                <td className="py-2.5 pl-4 font-sans text-slate-500">Razorpay Secret Key</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-indigo-600">SHIPROCKET_EMAIL</td>
                <td className="py-2.5 px-4 text-slate-400">demo@boostengine.dev</td>
                <td className="py-2.5 pl-4 font-sans text-slate-500">Shiprocket API user credentials</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-indigo-600">MONGODB_URI</td>
                <td className="py-2.5 px-4 text-slate-400">Local Mock In-Memory</td>
                <td className="py-2.5 pl-4 font-sans text-slate-500">MongoDB Atlas Connection String</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
