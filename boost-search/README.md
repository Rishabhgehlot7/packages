# @boostengine/search 🔍

[![npm version](https://img.shields.io/npm/v/@boostengine/search.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/search)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/search.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/search)
[![license](https://img.shields.io/npm/l/@boostengine/search.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![AI Agent Ready](https://img.shields.io/badge/AI%20Agent-Toolkit%20Inside-purple.svg?style=flat-square)](https://github.com/boostengine/boostengine)
[![Frameworks](https://img.shields.io/badge/Frameworks-Next.js%20%7C%20React%20%7C%20React%20Native%20%7C%20Vite%20%7C%20Node-orange.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Ultra-fast headless eCommerce product search, typo-tolerant inverted indexing, dynamic multi-faceted filtering, autocomplete, synonym expansion, AI agent toolkits, and universal React/React Native hooks.**

---

## 🚀 Key Features

- **⚡ Sub-Millisecond Inverted Indexing (`BoostSearchIndex`)**: Instant catalog search over 100,000+ products with weighted multi-field ranking (`title: 3x`, `brand: 2x`, `tags: 1.5x`, `description: 0.5x`).
- **🔤 Damerau-Levenshtein & Phonetic Typo Tolerance**: Resolves mobile keyboard slip-ups, transpositions (*"hooid"* -> *"hoodie"*), and phonetic spellings (*"danim"* -> *"denim"*).
- **💡 Real-Time Autocomplete & Typeahead**: Delivers instant query completions, matching categories, matching brands, and preview products on every keystroke.
- **📖 Dynamic Synonyms Engine**: Resolves eCommerce synonyms out-of-the-box (`pants` <=> `trousers` <=> `jeans`, `tee` <=> `t-shirt`).
- **📊 Dynamic Facet Extraction**: Automatically generates real-time facet distributions for categories, brands, attributes (sizes, colors), and price ranges.
- **🔄 URL Query String Roundtrip**: Seamless state serialization and deserialization for Next.js App Router and browser URL sharing.
- **🤖 Autonomous AI Agent Toolkit**: Out-of-the-box function schemas and executors for **OpenAI, Anthropic Claude, Google Gemini, and Vercel AI SDK**.
- **⚛️ Universal React & React Native Suite**: `<SearchProvider>`, `useSearch()`, `useProductSearch()` (with debouncing & facets), and `useSearchAutocomplete()`.

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

## ⚡ 1-Minute Quick Start

### 1. Inverted Search Index
```typescript
import { BoostSearchIndex } from '@boostengine/search';

const index = new BoostSearchIndex({}, [
  {
    id: 'p1',
    title: 'Oversized Cyberpunk Hoodie',
    brand: 'NeoTokyo',
    category: 'Hoodies',
    price: 2499,
    inStock: true,
    tags: ['streetwear', 'hoodie', 'oversized'],
  },
  {
    id: 'p2',
    title: 'Vintage Denim Cargo Jeans',
    brand: 'RetroWave',
    category: 'Pants',
    price: 1899,
    inStock: true,
    tags: ['denim', 'jeans', 'casual'],
  },
]);

// 1. Typo-tolerant search ("hoddie" -> "Hoodie")
const results = index.search({ query: 'hoddie', maxPrice: 3000 });
console.log(results.products[0].title); // "Oversized Cyberpunk Hoodie"
console.log(results.facets.brands);    // [{ value: 'NeoTokyo', count: 1 }]

// 2. Real-time autocomplete suggestions
const suggestions = index.suggest('den', 3);
console.log(suggestions.completions); // ["denim"]
```

### 2. Zero-Setup Stateless Helper (Backward-Compatible)
```typescript
import { BoostSearchEngine } from '@boostengine/search';

const results = BoostSearchEngine.search(products, {
  query: 'hoodie',
  inStockOnly: true,
  sortBy: 'price_asc',
});
```

---

## 🔌 Universal Database Integration

`@boostengine/search` is completely headless and database-agnostic. You can sync from **any database or ORM** in 2 lines:

### 1. MongoDB / Mongoose
```typescript
import { BoostSearchIndex } from '@boostengine/search';
import { ProductModel } from './models/Product';

const index = new BoostSearchIndex();

// Initial sync with custom document mapping
await index.sync(await ProductModel.find().lean(), (doc) => ({
  id: doc._id.toString(),
  title: doc.name,
  price: doc.price,
  inStock: doc.stockQuantity > 0,
  category: doc.category,
  brand: doc.brand,
  tags: doc.tags,
}));

// Real-time webhook or change-stream update
ProductModel.watch().on('change', (change) => {
  if (change.operationType === 'insert' || change.operationType === 'update') {
    index.upsert(change.fullDocument);
  } else if (change.operationType === 'delete') {
    index.remove(change.documentKey._id.toString());
  }
});
```

### 2. PostgreSQL / MySQL with Prisma ORM
```typescript
import { BoostSearchIndex } from '@boostengine/search';
import { prisma } from './prisma';

const index = new BoostSearchIndex();

// Sync from Prisma
await index.sync(await prisma.product.findMany(), (p) => ({
  id: p.id,
  title: p.title,
  price: Number(p.price),
  inStock: p.inventoryCount > 0,
  category: p.categoryName,
  brand: p.brandName,
}));
```

### 3. Supabase / Firebase / Cloudflare D1 / REST APIs
```typescript
import { BoostSearchIndex } from '@boostengine/search';
import { supabase } from './supabase';

const index = new BoostSearchIndex();

const { data } = await supabase.from('products').select('*');
await index.sync(data);
```

---

## ⚛️ Universal React & React Native Suite

Import directly from `@boostengine/search/react`:

### 1. `<SearchProvider>` (App-Wide Context)
```tsx
import React from 'react';
import { SearchProvider } from '@boostengine/search/react';

export function App({ children, products }: { children: React.ReactNode; products: any[] }) {
  return (
    <SearchProvider initialProducts={products}>
      {children}
    </SearchProvider>
  );
}
```

### 2. `useProductSearch` (Search Bar + Facet Sidebar + Grid)
```tsx
import React from 'react';
import { useProductSearch } from '@boostengine/search/react';

export function SearchPage() {
  const {
    query,
    setQuery,
    products,
    facets,
    total,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setSortBy,
  } = useProductSearch({ debounceMs: 300 });

  return (
    <div className="search-container">
      {/* Search Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands, or categories..."
      />

      <div className="layout">
        {/* Facet Sidebar */}
        <aside className="facets">
          <h3>Categories</h3>
          {facets.categories.map((c) => (
            <label key={c.value}>
              <input type="checkbox" onChange={() => toggleCategory(c.value)} />
              {c.value} ({c.count})
            </label>
          ))}

          <h3>Brands</h3>
          {facets.brands.map((b) => (
            <label key={b.value}>
              <input type="checkbox" onChange={() => toggleBrand(b.value)} />
              {b.value} ({b.count})
            </label>
          ))}
        </aside>

        {/* Product Grid */}
        <main className="product-grid">
          <h4>Found {total} products</h4>
          {products.map((p) => (
            <div key={p.id} className="card">
              <h5>{p.title}</h5>
              <p>₹{p.price}</p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
```

### 3. `useSearchAutocomplete` (Dropdown Typeahead)
```tsx
import React, { useState } from 'react';
import { useSearchAutocomplete } from '@boostengine/search/react';

export function AutocompleteSearchBar() {
  const [input, setInput] = useState('');
  const { completions, previewProducts, isOpen, handleKeyDown } = useSearchAutocomplete(input);

  return (
    <div className="autocomplete-wrapper">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type to search..."
      />

      {isOpen && (
        <div className="dropdown">
          <div className="suggestions">
            {completions.map((term) => (
              <div key={term} onClick={() => setInput(term)}>🔍 {term}</div>
            ))}
          </div>

          <div className="previews">
            {previewProducts.map((p) => (
              <div key={p.id}>
                <span>{p.title}</span> - ₹{p.price}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🤖 Autonomous AI Agent Toolkit

Connect AI Agents (OpenAI, Claude, Gemini, Vercel AI SDK) directly to product catalog searches:

```typescript
import { SearchAgentToolkit } from '@boostengine/search/agent';

// 1. Tool Schemas
const openAITools = SearchAgentToolkit.getOpenAITools();
const geminiTools = SearchAgentToolkit.getGeminiTools();
const claudeTools = SearchAgentToolkit.getClaudeTools();

// 2. Autonomous Execution
const result = await SearchAgentToolkit.executeTool('search_products', {
  query: 'winter jacket under 5000',
  maxPrice: 5000,
  inStockOnly: true,
});

console.log(result.data.products);
```

### Supported Autonomous Tools:
1. `search_products`: Multi-filter, typo-tolerant search with facet breakdowns.
2. `autocomplete_suggestions`: Typeahead queries and preview recommendations.
3. `get_filter_facets`: Extract available categories, brands, and price boundaries.
4. `find_similar_products`: Product recommendations based on category, brand, and tags.
5. `did_you_mean`: Intelligent spelling correction for zero-result queries.

---

## 💻 CLI Commands

```bash
# Live interactive search demo
npx @boostengine/search demo

# Autocomplete suggestions test
npx @boostengine/search suggest hoodie

# Performance benchmark across 5,000 products
npx @boostengine/search benchmark
```

---

## 🛠️ API Reference

### `BoostSearchIndex<T>`
- `add(products: T | T[]): void`
- `remove(id: string): boolean`
- `update(product: T): void`
- `get(id: string): T | undefined`
- `getAll(): T[]`
- `clear(): void`
- `search(filters?: SearchFilters): SearchResult<T>`
- `suggest(query: string, limit?: number): AutocompleteSuggestion<T>`
- `findSimilar(productId: string, options?: SimilarProductOptions): T[]`
- `didYouMean(query: string): DidYouMeanResult`

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
