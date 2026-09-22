// ============================================================
// @boostengine/seo — v1.1.0 — React Hooks Suite
// SSR-safe hooks for JSON-LD generation and meta tag management
// ============================================================

import { useMemo } from 'react';
import { generateProductJsonLd, generateBreadcrumbJsonLd } from '../core/schema';
import type { SEOProduct, BreadcrumbItem } from '../core/types';

/**
 * Reactive hook that generates Product JSON-LD from reactive product state.
 * Returns a stable reference (memoized) keyed on product.id.
 */
export function useProductJsonLd(product: SEOProduct): Record<string, any> {
  return useMemo(() => generateProductJsonLd(product), [
    product.id,
    product.title,
    product.description,
    product.price,
    product.availability,
    product.rating?.value,
    product.rating?.count,
  ]);
}

/**
 * Reactive hook that generates BreadcrumbList JSON-LD from breadcrumb items.
 */
export function useBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, any> {
  return useMemo(() => generateBreadcrumbJsonLd(items), [items]);
}

/**
 * Client-side <head> meta tag updater for SPAs.
 * Updates document.title and meta tags dynamically.
 */
export function useMetaTags(meta: {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}): void {
  useMemo(() => {
    if (typeof document === 'undefined') return;

    if (meta.title) document.title = meta.title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (meta.description) setMeta('description', meta.description);
    if (meta.ogTitle) setMeta('og:title', meta.ogTitle, true);
    if (meta.ogDescription) setMeta('og:description', meta.ogDescription, true);
    if (meta.ogImage) setMeta('og:image', meta.ogImage, true);

    if (meta.canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', meta.canonical);
    }
  }, [
    meta.title,
    meta.description,
    meta.ogTitle,
    meta.ogDescription,
    meta.ogImage,
    meta.canonical,
  ]);
}