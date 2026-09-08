# @boostengine/search 🔍

> **Lightning-Fast Typo-Tolerant Product Search & Multi-Faceted Filter Engine with Facet Aggregations & URL Query Sync for Modern eCommerce.**

Zero external dependencies, sub-millisecond execution, and works seamlessly in Node.js, Next.js server/client components, and React Native.

---

## 🌟 Key Features

- **⚡ Typo-Tolerant Levenshtein Search**: Automatically matches products even if customers misspell terms (*"hoddie"* &rarr; *"Hoodie"*, *"shrt"* &rarr; *"Shirt"*).
- **🎯 Multi-Faceted Filtering**: Price slider ranges, category selection, brand multi-select, variant attributes (Size, Color), in-stock only, and minimum star rating.
- **📊 Real-Time Facet Aggregations**: Extracts live counts for brands, categories, and min/max price range from the current matched catalog.
- **🔄 URL Query String Sync**: Built-in `serializeToQuery` and `parseFromQuery` for 1-line Next.js URL param synchronization (`?q=hoodie&category=Apparel&minPrice=500`).
- **🚀 Zero Dependencies**: No heavy ElasticSearch or Algolia client needed for up to 50,000 in-memory items.

---

## 📦 Installation

```bash
npm install @boostengine/search
```

---

## 🚀 Quickstart

```typescript
import { BoostSearchEngine, SearchableProduct } from '@boostengine/search';

const catalog: SearchableProduct[] = [
  { id: '1', title: 'Oversized Cyberpunk Hoodie', brand: 'Aesthetic Club', category: 'Hoodies', price: 2499, inStock: true, rating: 4.8 },
  { id: '2', title: 'Minimalist Graphic Tee', brand: 'Aesthetic Club', category: 'T-Shirts', price: 799, inStock: true, rating: 4.5 },
  { id: '3', title: 'Vintage Leather Jacket', brand: 'Retro Club', category: 'Jackets', price: 4999, inStock: false, rating: 4.9 },
];

// 1. Perform Search with Filters
const results = BoostSearchEngine.search(catalog, {
  query: 'hoddie', // Typo handled automatically!
  minPrice: 1000,
  maxPrice: 3000,
  inStockOnly: true,
  sortBy: 'price_asc',
});

console.log(results.total); // 1
console.log(results.products[0].title); // 'Oversized Cyberpunk Hoodie'

// 2. Access Aggregated Facets
console.log(results.facets.categories); // [{ value: 'Hoodies', count: 1 }]
console.log(results.facets.priceRange); // { min: 2499, max: 2499 }
```

---

## 🛠️ CLI Utilities

```bash
# Run interactive search demo
npx @boostengine/search demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
