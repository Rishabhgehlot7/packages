'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  DownloadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';

export default function AdminImporterPage() {
  const [sourceFormat, setSourceFormat] = useState<'auto' | 'shopify' | 'woocommerce' | 'custom'>('auto');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const handleSimulatedImport = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setImportedCount(148);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Bulk Catalog Importer & Exporter
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Sparkles className="h-3 w-3" />
              @boostengine/importer
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Migrate 10,000+ products in 1-click. Automatic schema detection for Shopify, WooCommerce, and standard CSV/XLSX formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all">
            <DownloadCloud className="h-4 w-4" />
            Export Catalog CSV
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-4">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Drop your catalog CSV or XLSX file here
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
          Drag & drop your export file from Shopify, WooCommerce, or Magento. The engine will automatically parse titles, variants, images, barcodes, and inventory.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <select
            value={sourceFormat}
            onChange={e => setSourceFormat(e.target.value as any)}
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="auto">✨ Auto-Detect Platform (Shopify / Woo / CSV)</option>
            <option value="shopify">Shopify Products Export CSV</option>
            <option value="woocommerce">WooCommerce Product CSV</option>
            <option value="custom">Standard BoostEngine Schema</option>
          </select>

          <button
            onClick={handleSimulatedImport}
            disabled={isUploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-500 transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Importing & Mapping...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                Select File & Run Import
              </>
            )}
          </button>
        </div>

        {uploadSuccess && (
          <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Catalog Imported Successfully!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                {importedCount} Products & 340 Variants synced with inventory and image galleries.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Auto-Mapping Engine Specifications */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Database className="h-4 w-4 text-teal-500" />
          Supported Schema Auto-Detectors
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Standardized column headers recognized by @boostengine/importer
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Shopify Format</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <code>Handle, Title, Body (HTML), Vendor, Type, Variant SKU, Variant Price, Image Src</code>
            </p>
            <span className="inline-block mt-3 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
              100% Native Support
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">WooCommerce Format</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <code>ID, Type, SKU, Name, Published, Regular price, Sale price, Categories, Images</code>
            </p>
            <span className="inline-block mt-3 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
              100% Native Support
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">BoostEngine JSON/CSV</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <code>productId, title, price, compareAtPrice, sku, stock, hsnCode, gstTaxRate</code>
            </p>
            <span className="inline-block mt-3 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
              Native High-Performance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
