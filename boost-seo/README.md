# @boostengine/seo 🔍

[![npm version](https://img.shields.io/npm/v/@boostengine/seo.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/seo)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/seo.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/seo)
[![license](https://img.shields.io/npm/l/@boostengine/seo.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Google Shopping](https://img.shields.io/badge/Google%20Merchant-XML%20Feed%20Ready-34a853.svg?style=flat-square)](https://merchants.google.com/)
[![AI Agent](https://img.shields.io/badge/AI%20Agent-Function%20Calling-7c3aed.svg?style=flat-square)](https://sdk.vercel.ai)
[![React](https://img.shields.io/badge/React-18%20|%2019-61dafb.svg?style=flat-square)](https://react.dev)

> **Industry-King eCommerce SEO & AI Agent Engine.** Schema.org v24+ JSON-LD Rich Snippets (Product, Breadcrumbs, FAQ, HowTo, Article, Organization, LocalBusiness), Google Merchant Center XML shopping feeds, Next.js App Router Metadata, Dynamic Sitemaps & Robots.txt, SEO Audit scoring, AI function-calling toolkit, and SSR-safe React hooks & components.
Zero third-party runtime dependencies. Built for eCommerce stores, marketplaces, and AI-driven content optimization.

---

## 📸 Google Search Result Preview

```text
  Google Search: "buy heavyweight cyberpunk hoodie india"
  ------------------------------------------------------------------------
  Cyberpunk Heavyweight Hoodie | BoostStore India
  https://booststore.in/products/cyberpunk-hoodie
  ⭐⭐⭐⭐⭐ Rating: 4.8 · 142 reviews · ₹1,499.00 · In stock
  Sitelinks: » Size Guide » Customer Reviews » Shipping Policy
  ------------------------------------------------------------------------
```

---

## 🌟 Features

### 🏗️ Core Engine
- **JSON-LD Schema Generators** (Schema.org v24+): `Product` (with Offer, AggregateRating, Review, MerchantReturnPolicy, ShippingDetails), `BreadcrumbList`, `FAQPage`, `HowTo`, `Article`, `Organization`, `LocalBusiness`, `ItemList`
- **Google Merchant Center XML Feed**: RSS 2.0 with `g:id`, `g:title`, `g:description`, `g:link`, `g:image_link`, `g:price`, `g:availability`, `g:brand`, `g:condition`, `g:google_product_category`, `g:shipping`
- **Next.js Metadata Generator**: Full App Router `Metadata` object with title templates, OpenGraph, Twitter card, Canonical, Robots, Alternates/hreflang
- **Dynamic Sitemap & Robots.txt Builder**: `<url>`, `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`, `<image:image>` support
- **SEO Audit & Scoring**: Title/description length analysis, H1 presence, OpenGraph tags, canonical integrity, score 0-100

### 🤖 AI Agent Toolkit
5 function-calling tools compatible with OpenAI, Anthropic Claude, Google Gemini, and Vercel AI SDK

### 🪝 React Hooks & Components
- `<SEOProvider>` & `useSEO()` — Global SEO configuration context
- `<JsonLdScript schema={...} />` — SSR-safe JSON-LD injector
- `useProductJsonLd()`, `useBreadcrumbJsonLd()`, `useMetaTags()`

---

## 📦 Installation

```bash
npm install @boostengine/seo
pnpm add @boostengine/seo
yarn add @boostengine/seo
```

---

## 🚀 Quickstart Guide

### 1. Next.js App Router Product Page
```tsx
import { generateNextMetadata, JsonLdGenerator } from '@boostengine/seo';
import { JsonLdScript } from '@boostengine/seo/react';

const product = { id: 'prod_01', title: 'Cyberpunk Hoodie', description: '450 GSM cotton hoodie.', url: 'https://myshop.com/p/1', images: ['https://myshop.com/img.jpg'], price: 1499, currency: 'INR', brand: 'BoostStore', availability: 'in_stock', rating: { value: 4.8, count: 142 } };

export async function generateMetadata() {
  return generateNextMetadata(product, { siteName: 'BoostStore' });
}

export default function Page() {
  return <JsonLdScript schema={JsonLdGenerator.product(product)} id="product-jsonld" />;
}
```

### 2. Google Merchant Feed API Route
```typescript
import { generateMerchantFeed } from '@boostengine/seo';

export async function GET() {
  const xml = generateMerchantFeed({ title: 'Store', link: 'https://myshop.com', description: 'Products' }, products);
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
```

### 3. AI Agent Integration
```typescript
import { executeToolCall } from '@boostengine/seo';
const jsonld = executeToolCall('generate_jsonld_schema', { type: 'Product', data: { ... } });
```

---

## 🛠️ CLI Utilities

```bash
npx @boostengine/seo demo                              # Interactive demo
npx @boostengine/seo audit --url <url>                 # SEO audit
npx @boostengine/seo generate-jsonld --type product    # Generate JSON-LD
npx @boostengine/seo merchant-feed --input file.json   # Generate feed
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)