import React, { useEffect } from 'react';

/**
 * Suppresses common non-fatal In-App WebView and Java bridge exceptions
 * from polluting analytics and crash reports (e.g. Clarity, Sentry).
 */
export function InAppShield(): React.ReactElement | null {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const errorHandler = (e: ErrorEvent) => {
      const msg = e && e.message ? String(e.message) : '';
      if (
        msg.includes('Java object') ||
        msg.includes('in-app') ||
        msg.includes('WebView') ||
        msg.includes('webkit')
      ) {
        e.stopImmediatePropagation();
        return true;
      }
    };

    const rejectionHandler = (e: PromiseRejectionEvent) => {
      const reason = e && e.reason ? String(e.reason) : '';
      if (
        reason.includes('Java object') ||
        reason.includes('in-app') ||
        reason.includes('WebView')
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', rejectionHandler, true);

    return () => {
      window.removeEventListener('error', errorHandler, true);
      window.removeEventListener('unhandledrejection', rejectionHandler, true);
    };
  }, []);

  return null;
}
