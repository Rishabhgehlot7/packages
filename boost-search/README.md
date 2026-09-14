# @boostengine/search 🔎

[![npm version](https://img.shields.io/npm/v/@boostengine/search.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/search)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/search.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/search)
[![license](https://img.shields.io/npm/l/@boostengine/search.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Typo Tolerant](https://img.shields.io/badge/Search-Typo%20Tolerant%20Fuzzy-blue.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Lightning-fast, typo-tolerant eCommerce product search and multi-faceted filter engine. Handles fuzzy keyword matching (Levenshtein distance), category facets, price ranges, stock filters, and instant URL query syncing.**

Zero heavy search server dependencies like Elasticsearch or Meilisearch required for small to mid-scale catalogs. Operates 100% in-memory in Node.js, Next.js, and client-side browsers.

---

## 📸 Visual Search & Faceted Filtering UI Preview

```text
  [ Search Input: "hoddie" (Fuzzy typo matches "hoodie") ]
  ─────────────────────────────────────────────────────────────────────────────
  Faceted Filters (Auto-Aggregated):    Products Found: 18 Results
  
  Stock Status:                         ┌───────────────────┐ ┌───────────────────┐
  [✓] In Stock Only (16)                │ [Product Image]   │ │ [Product Image]   │
  [ ] Pre-Order (2)                     │ Cyberpunk Hoodie  │ │ Minimalist Hoodie │
                                        │ ₹1,499  ~~₹2,499~~│ │ ₹1,299            │
  Category:                             │ ⭐⭐⭐⭐⭐ (4.8)    │ │ ⭐⭐⭐⭐☆ (4.4)    │
  • Streetwear Apparel (14)             └───────────────────┘ └───────────────────┘
  • Accessories (4)
                                        ┌───────────────────┐ ┌───────────────────┐
  Color Swatches:                       │ [Product Image]   │ │ [Product Image]   │
  (● Black: 12) (○ White: 4) (● Olive: 2│ Heavy Zip Jacket  │ │ Graphic Pullover  │
                                        │ ₹1,899            │ │ ₹1,399            │
  Price Range:                          │ ⭐⭐⭐⭐⭐ (4.9)    │ │ ⭐⭐⭐⭐☆ (4.2)    │
  [ ₹500 ─────────────○─── ₹2,500 ]     └───────────────────┘ └───────────────────┘
```

---

## 🌟 Key Features

- **🎯 Typo Tolerance & Fuzzy Search**: Handles customer typos (e.g. searching *"hoddie"* or *"tshrt"* accurately returns *"hoodie"* and *"t-shirt"*).
- **📊 Facet Aggregations**: Automatically computes dynamic filter counts (e.g. `Apparel (18)`, `Accessories (4)`) for sidebar filters.
- **🏷️ Multi-Field Querying**: Searches across product `title`, `description`, `tags`, `category`, and `sku`.
- **⚡ In-Memory Execution**: Evaluates 10,000+ catalog items in under 2 milliseconds without any network latency.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/search

# pnpm
pnpm add @boostengine/search

# yarn
yarn add @boostengine/search
```

---

## 🚀 Quickstart Guide

```typescript
import { createSearchEngine, type SearchableProduct } from '@boostengine/search';

const catalog: SearchableProduct[] = [
  {
    id: 'prod_1',
    title: 'Cyberpunk Heavyweight Hoodie',
    description: 'Black oversized fleece hoodie',
    category: 'Apparel',
    tags: ['streetwear', 'winter', 'cotton'],
    price: 1499,
    inStock: true,
  },
  {
    id: 'prod_2',
    title: 'Minimalist Graphic Tee',
    description: 'White organic cotton t-shirt',
    category: 'Apparel',
    tags: ['summer', 'casual'],
    price: 699,
    inStock: true,
  },
];

// 1. Initialize engine with catalog
const searchEngine = createSearchEngine(catalog);

// 2. Perform fuzzy search with filters
const results = searchEngine.search({
  query: 'hoddie', // Typo intended
  filters: {
    category: ['Apparel'],
    minPrice: 1000,
    maxPrice: 2000,
    inStockOnly: true,
  },
  sortBy: 'popularity',
});

console.log(`Found ${results.totalHits} matching products:`);
console.log(results.hits[0].title); // "Cyberpunk Heavyweight Hoodie"
console.log(results.facets);        // Dynamic category & attribute counts
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
