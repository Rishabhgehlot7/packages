// ============================================================
// @boostengine/seo — v1.1.0 — Next.js Metadata Generator
// App Router compatible Metadata helper with OpenGraph, Twitter,
// Canonical, Robots, and Alternates/hreflang support
// ============================================================

import type { SEOProduct, NextMetadataOptions } from './types';

/**
 * Generates a full Next.js App Router Metadata object for a product page.
 * Supports title templates, OpenGraph, Twitter cards, canonical URL,
 * robots directives, and alternates/hreflang.
 */
export function generateNextMetadata(
  product: SEOProduct,
  options: NextMetadataOptions = {}
): Record<string, any> {
  const siteName = options.siteName || product.brand || 'Store';
  const currency = product.currency || 'INR';

  const meta: Record<string, any> = {
    title: options.titleTemplate
      ? options.titleTemplate.replace('%s', product.title)
      : `${product.title} | ${siteName}`,
    description: product.description,
    alternates: {
      canonical: product.url,
      ...(options.alternates ? options.alternates : {}),
    },
    openGraph: {
      title: product.title,
      description: product.description,
      url: product.url,
      siteName,
      images: product.images.map((img) => ({ url: img, alt: product.title })),
      locale: options.locale || 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: product.images.slice(0, 1),
      ...(options.twitterHandle ? { creator: options.twitterHandle } : {}),
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': currency,
      'product:availability': product.availability || 'in_stock',
      ...(product.brand ? { 'product:brand': product.brand } : {}),
    },
  };

  if (options.robots) {
    const { index, follow, noarchive } = options.robots;
    meta.robots = {};
    if (index !== undefined) meta.robots.index = index;
    if (follow !== undefined) meta.robots.follow = follow;
    if (noarchive !== undefined) meta.robots.noarchive = noarchive;
  }

  return meta;
}

/** Backward-compatible NextSeoHelper class */
export class NextSeoHelper {
  static generateProductMetadata = generateNextMetadata;
}