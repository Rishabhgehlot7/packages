const assert = require('assert');
const { BoostSearchEngine } = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/search Test Suite...\n');

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
    attributes: { size: ['S', 'M', 'L'], color: 'White' },
  },
  {
    id: 'p3',
    title: 'Vintage Denim Jacket',
    brand: 'Retro Kicks',
    category: 'Jackets',
    price: 3499,
    inStock: false, // Out of stock
    rating: 4.9,
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
    attributes: { size: ['M', 'L'], color: 'Beige' },
  },
];

// Test 1: Typo-Tolerant Search
test('Typo-tolerant search matching', () => {
  // Query with typo "hoddie" instead of "Hoodie"
  const res1 = BoostSearchEngine.search(mockCatalog, { query: 'hoddie' });
  assert.strictEqual(res1.total, 1);
  assert.strictEqual(res1.products[0].id, 'p1');

  // Query "shrt" matches "Shirt" / "T-Shirt"
  const res2 = BoostSearchEngine.search(mockCatalog, { query: 'shrt' });
  assert.ok(res2.total >= 1);
});

// Test 2: Price Range Filtering
test('Price range filtering (minPrice and maxPrice)', () => {
  const res = BoostSearchEngine.search(mockCatalog, { minPrice: 1000, maxPrice: 2500 });
  assert.strictEqual(res.total, 2); // Hoodie (1999) and Linen Shirt (1299)
  assert.ok(res.products.every(p => p.price >= 1000 && p.price <= 2500));
});

// Test 3: In-Stock Filter
test('In-stock only filter', () => {
  const res = BoostSearchEngine.search(mockCatalog, { inStockOnly: true });
  assert.strictEqual(res.total, 3);
  assert.ok(res.products.every(p => p.inStock === true));
});

// Test 4: Sorting by Price
test('Price sorting (Low to High and High to Low)', () => {
  const asc = BoostSearchEngine.search(mockCatalog, { sortBy: 'price_asc' });
  assert.strictEqual(asc.products[0].price, 699); // T-Shirt cheapest

  const desc = BoostSearchEngine.search(mockCatalog, { sortBy: 'price_desc' });
  assert.strictEqual(desc.products[0].price, 3499); // Jacket most expensive
});

// Test 5: Facet Extraction
test('Facet aggregation counts', () => {
  const res = BoostSearchEngine.search(mockCatalog);
  assert.strictEqual(res.facets.priceRange.min, 699);
  assert.strictEqual(res.facets.priceRange.max, 3499);

  const brandAesthetic = res.facets.brands.find(b => b.value === 'Aesthetic Club');
  assert.strictEqual(brandAesthetic.count, 2);
});

// Test 6: URL Query Roundtrip
test('URL Query string serialize and parse', () => {
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

console.log(`\n🎉 All ${passed} tests in @boostengine/search passed successfully!\n`);
