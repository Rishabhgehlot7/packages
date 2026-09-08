# @boostengine/seo 🔍

> **Complete eCommerce SEO & Rich Snippets Engine: JSON-LD Structured Data, Google Merchant Center XML Feed Generator, Next.js OpenGraph Metadata & Sitemaps.**

Zero external dependencies, lightning fast, and designed to dominate Google Search & Shopping rankings for modern eCommerce stores.

---

## 🌟 Key Features

- **🏆 Schema.org JSON-LD Rich Snippets**:
  - `Product` with Offers, InStock status, AggregateRating & Reviews.
  - `BreadcrumbList` hierarchy for search result sitelinks.
  - `Organization` & Store knowledge graph.
  - `FAQPage` accordion rich snippets.
- **🛍️ Google Merchant Center XML Feed**: Generate 100% compliant RSS 2.0 Shopping feeds (`<g:id>`, `<g:price>`, `<g:availability>`, `<g:image_link>`, etc.) in milliseconds.
- **👥 Meta / Facebook Catalog CSV**: Automatically output product catalogs for Instagram Shop and Facebook Dynamic Product Ads (DPA).
- **⚡ Next.js App Router Native**: 1-line dynamic `Metadata` generation with OpenGraph and Twitter Card tags.
- **🗺️ XML Sitemap Generator**: Full support for `<urlset>` with priority, changefreq, and lastmod tags.

---

## 📦 Installation

```bash
npm install @boostengine/seo
```

---

## 🚀 Quickstart

### 1. Rich Snippet in Next.js Product Page

```tsx
// app/products/[slug]/page.tsx
import { JsonLdGenerator, NextSeoHelper, SEOProduct } from '@boostengine/seo';

const product: SEOProduct = {
  id: 'prod_99',
  title: 'Heavyweight Oversized Hoodie',
  description: 'Pure 450 GSM French Terry cotton hoodie.',
  url: 'https://myshop.com/products/oversized-hoodie',
  images: ['https://myshop.com/images/hoodie-1.jpg'],
  price: 2499,
  currency: 'INR',
  brand: 'Aesthetic Club',
  availability: 'in_stock',
  rating: { value: 4.9, count: 48 },
};

// Generate Next.js App Router OpenGraph & Twitter tags
export async function generateMetadata() {
  return NextSeoHelper.generateProductMetadata(product, {
    siteName: 'Aesthetic Club',
    twitterHandle: '@aestheticclub',
  });
}

export default function ProductPage() {
  const jsonLd = JsonLdGenerator.product(product);

  return (
    <div>
      {/* Inject Google Rich Snippet JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1>{product.title}</h1>
      {/* Rest of your product page UI */}
    </div>
  );
}
```

---

### 2. Google Shopping Merchant Center Feed API Route

Serve a dynamic, up-to-date Google Merchant XML feed to connect Google Shopping Ads & Free Listings:

```typescript
// app/api/feeds/google-merchant/route.ts
import { ProductFeedGenerator } from '@boostengine/seo';

export async function GET() {
  // Fetch your live catalog from database
  const products = await getProductsFromDatabase();

  const xml = ProductFeedGenerator.googleMerchantXml(
    {
      title: 'My D2C Store India',
      link: 'https://myshop.com',
      description: 'Official online shopping store',
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

### 3. XML Sitemap Route

```typescript
// app/sitemap.xml/route.ts
import { SitemapGenerator } from '@boostengine/seo';

export async function GET() {
  const sitemapXml = SitemapGenerator.generateXml([
    { loc: 'https://myshop.com', priority: 1.0, changefreq: 'daily' },
    { loc: 'https://myshop.com/collections/all', priority: 0.8, changefreq: 'daily' },
    { loc: 'https://myshop.com/products/hoodie', priority: 0.9, changefreq: 'weekly' },
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
# Run interactive live JSON-LD and feed demo
npx @boostengine/seo demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
