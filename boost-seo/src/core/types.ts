// ============================================================
// @boostengine/seo — v1.1.0 — Core Type Definitions
// Schema.org v24+ compliant types for eCommerce SEO
// ============================================================

/** Product review from a customer */
export interface SEOProductReview {
  author: string;
  rating: number; // 1 to 5
  body?: string;
  datePublished?: string; // ISO 8601 string
}

/** Core product shape used across all generators */
export interface SEOProduct {
  id: string;
  title: string;
  description: string;
  url: string;
  images: string[];
  price: number;
  currency?: string; // default: 'INR'
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  sku?: string;
  gtin?: string; // Barcode / UPC / EAN
  mpn?: string;
  brand?: string;
  category?: string;
  googleProductCategory?: string; // Google tax ID
  condition?: 'new' | 'refurbished' | 'used'; // default: 'new'
  weight?: string; // e.g. "1.5 kg"
  color?: string;
  size?: string;
  material?: string;
  rating?: {
    value: number; // e.g. 4.8
    count: number; // e.g. 124
  };
  reviews?: SEOProductReview[];
  /** Merchant return policy */
  returnPolicy?: {
    applicableCountry?: string;
    returnPolicyCategory?: string; // e.g. 'https://schema.org/MerchantReturnFiniteReturnWindow'
    merchantReturnDays?: number;
    returnMethod?: string; // e.g. 'https://schema.org/ReturnByMail'
    returnFees?: string; // e.g. 'https://schema.org/FreeReturn'
  };
  /** Shipping details */
  shippingDetails?: {
    shippingRate?: ShippingRate;
    shippingDestination?: string[];
    deliveryTime?: {
      minDays: number;
      maxDays: number;
    };
  };
}

export interface ShippingRate {
  price: number;
  currency: string;
  free?: boolean;
  freeOver?: number; // free shipping over this amount
}

/** Breadcrumb item for BreadcrumbList schema */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Organization schema configuration */
export interface OrganizationConfig {
  name: string;
  url: string;
  logo: string;
  description?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed?: string;
  };
  sameAs?: string[]; // Social links (Instagram, Facebook, Twitter, LinkedIn)
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

/** LocalBusiness extends Organization */
export interface LocalBusinessConfig extends OrganizationConfig {
  priceRange?: string; // e.g. '$$'
  openingHours?: { dayOfWeek: string[]; opens: string; closes: string }[];
  servesCuisine?: string; // for Restaurant etc.
  images?: string[];
}

/** FAQ entry */
export interface FAQItem {
  question: string;
  answer: string;
}

/** HowTo step */
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

/** Article metadata */
export interface ArticleItem {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  publisherName: string;
  publisherLogo: string;
}

/** Sitemap entry */
export interface SitemapEntry {
  loc: string;
  lastmod?: string; // YYYY-MM-DD or ISO
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // 0.0 to 1.0
  images?: string[]; // URLs for <image:image> extension
}

/** Next.js metadata options */
export interface NextMetadataOptions {
  siteName?: string;
  twitterHandle?: string;
  locale?: string;
  titleTemplate?: string;
  description?: string;
  alternates?: Record<string, string>;
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
  };
}

/** SEO Audit result */
export interface SEOAuditResult {
  score: number; // 0-100
  title: { ok: boolean; length: number; message: string };
  description: { ok: boolean; length: number; message: string };
  h1: { ok: boolean; message: string };
  openGraph: { ok: boolean; message: string };
  canonical: { ok: boolean; message: string };
  recommendations: string[];
}

/** Feed store info for Merchant Center */
export interface FeedStoreInfo {
  title: string;
  link: string;
  description: string;
}

/** AI Tool definition */
export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>) => any;
}