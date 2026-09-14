# @boostengine/seo 🔍

[![npm version](https://img.shields.io/npm/v/@boostengine/seo.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/seo)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/seo.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/seo)
[![license](https://img.shields.io/npm/l/@boostengine/seo.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Google Shopping](https://img.shields.io/badge/Google%20Merchant-XML%20Feed%20Ready-34a853.svg?style=flat-square)](https://merchants.google.com/)

> **High-converting eCommerce SEO and rich snippets engine. Generates Google-validated JSON-LD structured data (Product, Reviews, Breadcrumb, FAQ), Google Merchant Center XML shopping feeds, Meta / Facebook catalog feeds, and Next.js dynamic metadata.**

Zero third-party dependencies. Built specifically to help eCommerce stores achieve top search positions and Google Shopping listings.

---

## 📸 Google Search Result Rich Snippet Preview

When you use `@boostengine/seo`, Google displays enhanced search results with ratings, prices, and stock status:

```text
  Google Search: "buy heavyweight cyberpunk hoodie india"
  ------------------------------------------------------------------------
  Cyberpunk Heavyweight Hoodie | BoostStore India
  https://booststore.in/products/cyberpunk-hoodie
  ⭐⭐⭐⭐⭐ Rating: 4.8 · ‎142 reviews · ‎₹1,499.00 · ‎In stock
  Pure 450 GSM French Terry cotton hoodie with cyber prints. Free delivery
  over ₹999. 7-Day easy returns. Cash on Delivery available.

  Sitelinks:
  » Size Guide     » Customer Reviews     » Shipping Policy
  ------------------------------------------------------------------------
```

---

## 🌟 Key Features

- **🏆 Google Schema.org JSON-LD**:
  - `Product`: Rich snippets with price, currency, availability, SKU, brand, and reviews.
  - `AggregateRating`: Dynamic 5-star rating display directly in Google SERP.
  - `BreadcrumbList`: Clean hierarchical URL sitelinks in Google search results.
  - `FAQPage`: Interactive accordion rich snippets directly under search titles.
- **🛍️ Google Merchant Center XML Feed**: Fast generation of 100% compliant RSS 2.0 XML feeds (`<g:id>`, `<g:price>`, `<g:availability>`, `<g:image_link>`, `<g:shipping>`) for Google Shopping Ads and free listings.
- **👥 Meta / Facebook Catalog CSV**: Automatically output product catalog formats for Instagram Shopping and Facebook Dynamic Product Ads (DPA).
- **⚡ Next.js App Router Native**: 1-line dynamic `generateMetadata()` helper with OpenGraph and Twitter Card tags.
- **🗺️ XML Sitemap Generator**: Full support for `<urlset>` with automatic priority and changefreq calculation.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/seo

# pnpm
pnpm add @boostengine/seo

# yarn
yarn add @boostengine/seo
```

---

## 🚀 Quickstart Guide

### 1. Next.js App Router Product Page (`app/products/[slug]/page.tsx`)

Inject Google Rich Snippets in just a few lines:

```tsx
import { JsonLdGenerator, NextSeoHelper, type SEOProduct } from '@boostengine/seo';

const product: SEOProduct = {
  id: 'prod_hoodie_01',
  title: 'Cyberpunk Heavyweight Hoodie',
  description: 'Pure 450 GSM French Terry cotton hoodie with premium print.',
  url: 'https://booststore.in/products/cyberpunk-hoodie',
  images: ['https://booststore.in/images/hoodie-front.jpg'],
  price: 1499,
  currency: 'INR',
  brand: 'BoostStore',
  availability: 'in_stock',
  rating: { value: 4.8, count: 142 },
};

// 1. Next.js OpenGraph & Twitter metadata
export async function generateMetadata() {
  return NextSeoHelper.generateProductMetadata(product, {
    siteName: 'BoostStore',
    twitterHandle: '@boostengine',
  });
}

// 2. Page component with injected Google JSON-LD
export default function ProductPage() {
  const jsonLd = JsonLdGenerator.product(product);

  return (
    <div>
      {/* Inject Google Rich Snippet JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <h1>{product.title}</h1>
        <p>₹{product.price}</p>
        {/* Product UI Components */}
      </main>
    </div>
  );
}
```

---

### 2. Google Shopping Merchant Feed (`app/api/feeds/google-merchant/route.ts`)

Serve an automated XML feed for Google Merchant Center:

```typescript
import { ProductFeedGenerator } from '@boostengine/seo';

export async function GET() {
  // Fetch products from your database or CMS
  const products = [
    {
      id: 'prod_hoodie_01',
      title: 'Cyberpunk Heavyweight Hoodie',
      description: '450 GSM pure cotton hoodie',
      link: 'https://booststore.in/products/cyberpunk-hoodie',
      imageLink: 'https://booststore.in/images/hoodie-front.jpg',
      price: '1499.00 INR',
      availability: 'in_stock',
      brand: 'BoostStore',
    },
  ];

  const xml = ProductFeedGenerator.googleMerchantXml(
    {
      title: 'BoostStore India Official Catalog',
      link: 'https://booststore.in',
      description: 'D2C apparel and street fashion',
    },
    products
  );

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
```

---

### 3. XML Sitemap Generator (`app/sitemap.xml/route.ts`)

```typescript
import { SitemapGenerator } from '@boostengine/seo';

export async function GET() {
  const sitemapXml = SitemapGenerator.generateXml([
    { loc: 'https://booststore.in', priority: 1.0, changefreq: 'daily' },
    { loc: 'https://booststore.in/collections/all', priority: 0.8, changefreq: 'daily' },
    { loc: 'https://booststore.in/products/cyberpunk-hoodie', priority: 0.9, changefreq: 'weekly' },
  ]);

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
```

---

## 🛠️ CLI Utilities

```bash
# Run interactive SEO simulation & validate test feeds
npx @boostengine/seo demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
