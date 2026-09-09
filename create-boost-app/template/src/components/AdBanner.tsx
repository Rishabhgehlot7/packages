'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Sparkles, ChevronRight } from 'lucide-react';

interface AdBannerData {
  text: string;
  backgroundColor: string;
  textColor: string;
  link: string;
  isActive: boolean;
  showCloseButton: boolean;
}

export function AdBanner() {
  const pathname = usePathname();
  const [ad, setAd] = useState<AdBannerData | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    async function fetchAdBanner() {
      try {
        const res = await fetch('/api/ad-banner');
        const data = await res.json();
        if (data.success && data.data) {
          setAd(data.data);
        }
      } catch (err) {
        // Silent fallback
      }
    }
    fetchAdBanner();
  }, []);

  // Hide on admin routes or if closed/inactive
  if (pathname?.startsWith('/admin') || !ad || !ad.isActive || closed) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: ad.backgroundColor || '#4f46e5',
        color: ad.textColor || '#ffffff',
      }}
      className="relative z-40 text-[11px] md:text-xs font-bold py-2 px-4 shadow-sm transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center truncate pr-2">
          {ad.link ? (
            <Link
              href={ad.link}
              className="inline-flex items-center gap-1.5 hover:underline transition group"
            >
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
              <span>{ad.text}</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
              <span>{ad.text}</span>
            </span>
          )}
        </div>

        {ad.showCloseButton && (
          <button
            onClick={() => setClosed(true)}
            className="p-1 hover:opacity-75 transition rounded"
            aria-label="Close announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
