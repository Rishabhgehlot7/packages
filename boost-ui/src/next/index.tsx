'use client';

import * as React from 'react';
import { BoostProvider, injectBoostGlobalStyles, type BoostProviderProps } from '../components/BoostProvider';

/**
 * BoostNextProvider — Next.js-optimized wrapper around BoostProvider.
 * Handles RSC, SSR CSS injection, and theme-color meta sync.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { BoostNextProvider } from '@boostengine/ui/next';
 * ```
 */
export interface BoostNextProviderProps extends BoostProviderProps {
  syncThemeColor?: boolean;
}

export const BoostNextProvider: React.FC<BoostNextProviderProps> = ({
  children,
  syncThemeColor = true,
  ...props
}) => {
  React.useEffect(() => {
    injectBoostGlobalStyles();
  }, []);

  React.useEffect(() => {
    if (!syncThemeColor || typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue('--boost-bg').trim();
      if (bg) {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', 'theme-color');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', bg);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });
    return () => observer.disconnect();
  }, [syncThemeColor]);

  return <BoostProvider {...props}>{children}</BoostProvider>;
};

BoostNextProvider.displayName = 'BoostNextProvider';