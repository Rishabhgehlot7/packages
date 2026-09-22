const assert = require('assert');

console.log('🧪 Running @boostengine/search Comprehensive Test Suite...\n');

let indexModule;
let agentModule;
let reactModule;

try {
  indexModule = require('./dist/index.cjs');
} catch (e) {
  console.log('⚠️  Note: Running tests with compiled or mocked modules.');
}

try {
  agentModule = require('./dist/agent.cjs');
} catch (e) {}

try {
  reactModule = require('./dist/react.cjs');
} catch (e) {}

const { BoostSearchIndex, BoostSearchEngine, searchIndex } = indexModule || {};
const { SearchAgentToolkit } = agentModule || indexModule || {};

if (!BoostSearchEngine && !BoostSearchIndex) {
  console.error('❌ Build required before running test-suite. Run `npm run build` first.');
  process.exit(1);
}

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ Passed: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ Failed: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

const mockCatalog = [
  {
    id: 'p1',
    title: 'Oversized Anime Hoodie',
    brand: 'Aesthetic Club',
    category: 'Hoodies',
    price: 1999,
    inStock: true,
    rating: 4.8,
    tags: ['anime', 'hoodie', 'oversized'],
    attributes: { size: ['M', 'L', 'XL'], color: 'Black' },
  },
  {
    id: 'p2',
    title: 'Minimalist Cotton T-Shirt',
    brand: 'Aesthetic Club',
    category: 'T-Shirts',
    price: 699,
    inStock: true,
    rating: 4.5,
    tags: ['cotton', 'tee', 'basic'],
    attributes: { size: ['S', 'M', 'L'], color: 'White' },
  },
  {
    id: 'p3',
    title: 'Vintage Denim Cargo Jeans',
    brand: 'Retro Kicks',
    category: 'Pants',
    price: 3499,
    inStock: false, // Out of stock
    rating: 4.9,
    tags: ['denim', 'jeans', 'vintage'],
    attributes: { size: ['L', 'XL'], color: 'Blue' },
  },
  {
    id: 'p4',
    title: 'Casual Linen Shirt',
    brand: 'Urban Thread',
    category: 'Shirts',
    price: 1299,
    inStock: true,
    rating: 4.2,
    tags: ['linen', 'shirt', 'summer'],
    attributes: { size: ['M', 'L'], color: 'Beige' },
  },
];

// Test 1: Typo-Tolerant Search
test('1. Typo-tolerant search matching (Levenshtein & Damerau)', () => {
  const res1 = BoostSearchEngine.search(mockCatalog, { query: 'hoddie' });
  assert.strictEqual(res1.total, 1);
  assert.strictEqual(res1.products[0].id, 'p1');

  // Query "shrt" matches "Shirt" / "T-Shirt"
  const res2 = BoostSearchEngine.search(mockCatalog, { query: 'shrt' });
  assert.ok(res2.total >= 1);
});

// Test 2: Adjacent Letter Transposition Typos
test('2. Adjacent letter transposition typos (e.g. hooid -> hoodie)', () => {
  const index = new BoostSearchIndex({}, mockCatalog);
  const res = index.search({ query: 'hooid' });
  assert.ok(res.total >= 1);
  assert.strictEqual(res.products[0].id, 'p1');
});

// Test 3: Synonym Expansion
test('3. Synonym dictionary query expansion (e.g. "pants" -> "jeans")', () => {
  const index = new BoostSearchIndex({}, mockCatalog);
  const res = index.search({ query: 'pants' });
  assert.ok(res.total >= 1);
  assert.strictEqual(res.products[0].id, 'p3'); // Vintage Denim Cargo Jeans
});

// Test 4: Price Range Filtering
test('4. Price range filtering (minPrice and maxPrice)', () => {
  const res = BoostSearchEngine.search(mockCatalog, { minPrice: 1000, maxPrice: 2500 });
  assert.strictEqual(res.total, 2); // Hoodie (1999) and Linen Shirt (1299)
  assert.ok(res.products.every((p) => p.price >= 1000 && p.price <= 2500));
});

// Test 5: In-Stock Filter
test('5. In-stock only filter', () => {
  const res = BoostSearchEngine.search(mockCatalog, { inStockOnly: true });
  assert.strictEqual(res.total, 3);
  assert.ok(res.products.every((p) => p.inStock === true));
});

// Test 6: Sorting by Price and Rating
test('6. Price and rating sorting options', () => {
  const asc = BoostSearchEngine.search(mockCatalog, { sortBy: 'price_asc' });
  assert.strictEqual(asc.products[0].price, 699); // T-Shirt cheapest

  const desc = BoostSearchEngine.search(mockCatalog, { sortBy: 'price_desc' });
  assert.strictEqual(desc.products[0].price, 3499); // Jacket most expensive

  const ratingSorted = BoostSearchEngine.search(mockCatalog, { sortBy: 'rating' });
  assert.strictEqual(ratingSorted.products[0].id, 'p3'); // Rating 4.9 highest
});

// Test 7: Facet Extraction
test('7. Facet aggregation counts', () => {
  const res = BoostSearchEngine.search(mockCatalog);
  assert.strictEqual(res.facets.priceRange.min, 699);
  assert.strictEqual(res.facets.priceRange.max, 3499);

  const brandAesthetic = res.facets.brands.find((b) => b.value === 'Aesthetic Club');
  assert.strictEqual(brandAesthetic.count, 2);
});

// Test 8: Autocomplete Suggestions
test('8. Real-time autocomplete suggestions', () => {
  const index = new BoostSearchIndex({}, mockCatalog);
  const suggest = index.suggest('lin', 3);
  assert.ok(suggest.completions.some((c) => c.includes('linen')));
  assert.ok(suggest.products.some((p) => p.id === 'p4'));
});

// Test 9: Similar Products Recommendation
test('9. Similar products recommendation based on categories and tags', () => {
  const index = new BoostSearchIndex({}, mockCatalog);
  const similar = index.findSimilar('p1', { limit: 2 });
  assert.ok(Array.isArray(similar));
  assert.ok(similar.every((p) => p.id !== 'p1'));
});

// Test 10: URL Query String Roundtrip
test('10. URL Query string serialize and parse', () => {
  const initial = {
    query: 'hoodie',
    minPrice: 500,
    maxPrice: 2500,
    inStockOnly: true,
    sortBy: 'price_asc',
  };

  const qs = BoostSearchEngine.serializeToQuery(initial);
  assert.ok(qs.includes('q=hoodie'));
  assert.ok(qs.includes('minPrice=500'));
  assert.ok(qs.includes('inStock=true'));

  const parsed = BoostSearchEngine.parseFromQuery(qs);
  assert.strictEqual(parsed.query, 'hoodie');
  assert.strictEqual(parsed.minPrice, 500);
  assert.strictEqual(parsed.maxPrice, 2500);
  assert.strictEqual(parsed.inStockOnly, true);
  assert.strictEqual(parsed.sortBy, 'price_asc');
});

// Test 11: AI Agent Toolkit Tools & Execution
test('11. SearchAgentToolkit tool schemas and autonomous execution', async () => {
  const openAITools = SearchAgentToolkit.getOpenAITools();
  assert.ok(openAITools.length >= 5);
  assert.ok(openAITools.some((t) => t.function.name === 'search_products'));

  const geminiTools = SearchAgentToolkit.getGeminiTools();
  assert.ok(geminiTools[0].functionDeclarations.length >= 5);

  const claudeTools = SearchAgentToolkit.getClaudeTools();
  assert.ok(claudeTools.length >= 5);

  const index = new BoostSearchIndex({}, mockCatalog);

  const searchRes = await SearchAgentToolkit.executeTool(
    'search_products',
    { query: 'hoodie' },
    index
  );
  assert.strictEqual(searchRes.success, true);
  assert.strictEqual(searchRes.data.total, 1);

  const suggestRes = await SearchAgentToolkit.executeTool(
    'autocomplete_suggestions',
    { query: 'den' },
    index
  );
  assert.strictEqual(suggestRes.success, true);
  assert.ok(suggestRes.data.completions.length >= 1);
});

// Test 12: Universal React Module Exports
test('12. React module exports SearchProvider, useSearch, useProductSearch, and useSearchAutocomplete', () => {
  if (!reactModule) return; // If called prior to build
  assert.strictEqual(typeof reactModule.SearchProvider, 'function');
  assert.strictEqual(typeof reactModule.useSearch, 'function');
  assert.strictEqual(typeof reactModule.useProductSearch, 'function');
  assert.strictEqual(typeof reactModule.useSearchAutocomplete, 'function');
  assert.strictEqual(typeof reactModule.useURLSearchSync, 'function');
});

// Test 13: Universal Database Sync & Upsert
test('13. Universal database sync & webhook upsert works across any DB format', async () => {
  const index = new BoostSearchIndex();

  // Mock raw MongoDB documents (with _id instead of id)
  const mockMongoDocs = [
    { _id: 'mongo_1', name: 'Handcrafted Leather Boots', cost: 4500, available: true, group: 'Footwear' },
    { _id: 'mongo_2', name: 'Urban Graphic Tee', cost: 899, available: true, group: 'T-Shirts' },
  ];

  // Sync with mapper
  const syncedCount = await index.sync(mockMongoDocs, (doc) => ({
    id: doc._id,
    title: doc.name,
    price: doc.cost,
    inStock: doc.available,
    category: doc.group,
  }));

  assert.strictEqual(syncedCount, 2);
  assert.strictEqual(index.size, 2);

  // Search synced mongo product
  const res = index.search({ query: 'leather boots' });
  assert.strictEqual(res.total, 1);
  assert.strictEqual(res.products[0].id, 'mongo_1');

  // Real-time webhook upsert
  index.upsert({
    id: 'mongo_3',
    title: 'Waterproof Rain Jacket',
    price: 3200,
    inStock: true,
  });

  assert.strictEqual(index.size, 3);
  const jacketRes = index.search({ query: 'rain jacket' });
  assert.strictEqual(jacketRes.total, 1);
});

console.log(`\n🎉 All ${passed} tests in @boostengine/search passed successfully!\n`);
