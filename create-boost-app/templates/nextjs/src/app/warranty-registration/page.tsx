'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WarrantyRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    productName: '',
    ean: '',
    purchaseDate: '',
    purchaseLocation: 'Official Website',
    proofOfPurchase: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/warranty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register warranty');
      }
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" /> 1-Year Official Warranty
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950">
          Register Your Product Warranty
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Activate your authentic warranty protection and priority customer support.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Warranty Registered!</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Your details have been submitted for verification. We have sent a confirmation email to your registered address.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition"
              >
                Return to Store
              </Link>
              <Link
                href="/warranty-claim"
                className="px-6 py-2.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                File a Claim
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Aakash Verma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="aakash@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product Name / Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk 450 GSM Hoodie"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  EAN / Barcode (Optional)
                </label>
                <input
                  type="text"
                  placeholder="8901234567890"
                  value={formData.ean}
                  onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Date of Purchase *
                </label>
                <input
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Purchase Location *
                </label>
                <select
                  value={formData.purchaseLocation}
                  onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Official Website">Official Website</option>
                  <option value="Amazon India">Amazon India</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Myntra">Myntra</option>
                  <option value="Offline Store">Authorized Offline Retailer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Proof of Purchase (Invoice Link or Image URL)
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/... or image URL"
                value={formData.proofOfPurchase}
                onChange={(e) => setFormData({ ...formData, proofOfPurchase: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-50 mt-4"
            >
              {status === 'loading' ? 'Activating Warranty...' : 'Activate Warranty Now'}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/warranty-claim" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black">
          Need to file an existing warranty claim instead? Click here <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
