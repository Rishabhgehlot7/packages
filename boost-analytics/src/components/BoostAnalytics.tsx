import React, { useEffect, useState } from 'react';
import { AnalyticsConfig } from '../types';
import { initAnalytics } from '../tracker';
import { InAppShield } from './InAppShield';
import { AnalyticsDebugger } from './AnalyticsDebugger';

export interface BoostAnalyticsProps extends AnalyticsConfig {
  children?: React.ReactNode;
}

/**
 * Universal Analytics Component for Next.js and Vite.
 * Injects Meta Pixel, Google Tag Manager, Microsoft Clarity, In-App WebView Shields,
 * and live testing debugger widget.
 */
export function BoostAnalytics({
  fbPixelId,
  gtmId,
  clarityId,
  currency = 'INR',
  defaultBrand = 'Brand',
  debug = false,
  enableInAppShield = true,
  showDebugger = false,
  children,
}: BoostAnalyticsProps): React.ReactElement {
  const [shouldShowDebugger, setShouldShowDebugger] = useState(showDebugger);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if debug overlay requested via props or URL (?boost_debug=1 / ?boost_debug=true)
    const isUrlDebug =
      window.location.search.includes('boost_debug=1') ||
      window.location.search.includes('boost_debug=true');

    if (showDebugger || debug || isUrlDebug) {
      setShouldShowDebugger(true);
    }

    // 1. Initialize tracker config
    initAnalytics({
      fbPixelId,
      gtmId,
      clarityId,
      currency,
      defaultBrand,
      debug,
      enableInAppShield,
      showDebugger,
    });

    // 2. Load Meta (Facebook) Pixel Script
    if (fbPixelId && !window.fbq) {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      const fbq = (window as any).fbq;
      if (typeof fbq === 'function') {
        fbq('init', fbPixelId);
        fbq('track', 'PageView');
      }
    }

    // 3. Load Google Tag Manager (GTM) Script
    if (gtmId && !document.getElementById('boost-gtm-script')) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
      const gtmScript = document.createElement('script');
      gtmScript.id = 'boost-gtm-script';
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(gtmScript);
    }

    // 4. Load Microsoft Clarity Script
    if (clarityId && !document.getElementById('boost-clarity-script')) {
      /* eslint-disable */
      (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.id = 'boost-clarity-script';
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', clarityId);
      /* eslint-enable */
    }
  }, [fbPixelId, gtmId, clarityId, currency, defaultBrand, debug, enableInAppShield, showDebugger]);

  return (
    <>
      {enableInAppShield && <InAppShield />}
      {shouldShowDebugger && <AnalyticsDebugger />}
      {fbPixelId && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
      {children}
    </>
  );
}
