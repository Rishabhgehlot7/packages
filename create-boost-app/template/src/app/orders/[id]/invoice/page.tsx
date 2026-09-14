'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, Download, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function OrderInvoicePage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [invoiceHtml, setInvoiceHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}/invoice?format=html`)
      .then((res) => res.text())
      .then((html) => {
        setInvoiceHtml(html);
      })
      .catch((err) => {
        console.error('Invoice load failed:', err);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => {
    const iframe = document.getElementById('invoice-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
          <Link
            href={`/orders/${orderId}/track`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tracking
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" /> GST Compliant
            </span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-xs font-black transition shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Invoice Frame Preview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">Generating Official Tax Invoice...</p>
            </div>
          ) : (
            <iframe
              id="invoice-iframe"
              srcDoc={invoiceHtml}
              className="w-full h-[900px] border-0"
              title="GST Tax Invoice"
            />
          )}
        </div>
      </div>
    </div>
  );
}
