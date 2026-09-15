'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function WarrantyClaimPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    manualOrderId: '',
    manualProductName: '',
    issueType: 'Defective Product',
    description: '',
    images: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/warranty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: formData.images ? [formData.images] : [],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit warranty claim');
      }
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-600" /> Fast Replacement & Repair
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950">
          File a Warranty Claim
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Experience an issue with your product? Submit your claim details and our inspection team will review it.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted!</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Your claim has been logged under review. A support representative will follow up with inspection and reverse-pickup instructions within 48 hours.
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition"
            >
              Return Home
            </Link>
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
                  placeholder="Rahul Mehra"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Order ID / Invoice # (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BST-10492"
                  value={formData.manualOrderId}
                  onChange={(e) => setFormData({ ...formData, manualOrderId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk Hoodie"
                  value={formData.manualProductName}
                  onChange={(e) => setFormData({ ...formData, manualProductName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Issue Type *
                </label>
                <select
                  value={formData.issueType}
                  onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Defective Product">Defective Product / Manufacturing Defect</option>
                  <option value="Damaged on Arrival">Damaged on Arrival</option>
                  <option value="Hardware Failure">Hardware / Zipper / Material Failure</option>
                  <option value="Other">Other Functional Issue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Description of the Issue *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what happened, where the defect is, and any relevant circumstances..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Photo Proof Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://imgur.com/... or Google Drive link"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
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
              {status === 'loading' ? 'Submitting Claim...' : 'Submit Warranty Claim'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
