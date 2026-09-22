// ============================================================
// @boostengine/seo — v1.1.0 — SEO React Context Provider
// Global SEO configuration context for SSR-safe React 18/19
// ============================================================

import React, { createContext, useContext, type ReactNode } from 'react';

export interface SEOContextValue {
  siteName?: string;
  twitterHandle?: string;
  locale?: string;
  defaultTitleTemplate?: string;
}

const SEOContext = createContext<SEOContextValue>({});

export interface SEOProviderProps {
  value: SEOContextValue;
  children: ReactNode;
}

/**
 * Global SEO configuration provider.
 * Wraps your app to provide default SEO settings to hooks and components.
 */
export function SEOProvider({ value, children }: SEOProviderProps): React.JSX.Element {
  return React.createElement(SEOContext.Provider, { value }, children);
}

/**
 * Hook to access the current SEO configuration context
 */
export function useSEO(): SEOContextValue {
  return useContext(SEOContext);
}