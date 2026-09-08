export interface SEOProductReview {
  author: string;
  rating: number; // 1 to 5
  body?: string;
  datePublished?: string; // ISO string
}

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
  condition?: 'new' | 'refurbished' | 'used'; // default: 'new'
  rating?: {
    value: number; // e.g. 4.8
    count: number; // e.g. 124
  };
  reviews?: SEOProductReview[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface OrganizationConfig {
  name: string;
  url: string;
  logo: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed?: string;
  };
  sameAs?: string[]; // Social links (Instagram, Facebook, Twitter, LinkedIn)
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string; // YYYY-MM-DD or ISO
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // 0.0 to 1.0
}
