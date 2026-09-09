const { RecommendationsEngine } = require('./dist/index.js');

console.log('🧪 Testing @boostengine/recommendations...');

const catalog = [
  {
    id: 'prod-phone',
    title: 'Flagship Smartphone Pro',
    price: 60000,
    category: 'Electronics',
    tags: ['mobile', 'smartphone', 'gadgets'],
    rating: 4.8,
  },
  {
    id: 'prod-case',
    title: 'Shockproof Armor Case',
    price: 999,
    category: 'Electronics',
    tags: ['mobile', 'accessories', 'protection'],
    rating: 4.5,
  },
  {
    id: 'prod-screen',
    title: 'Tempered Glass Screen Protector (2-Pack)',
    price: 499,
    category: 'Electronics',
    tags: ['mobile', 'accessories', 'screen-guard'],
    rating: 4.6,
  },
  {
    id: 'prod-shirt',
    title: 'Pure Cotton Slim Fit Shirt',
    price: 1499,
    category: 'Fashion',
    tags: ['apparel', 'cotton'],
    rating: 4.2,
  },
];

// Test 1: Frequently bought together
const bundle = RecommendationsEngine.getFrequentlyBoughtTogether(catalog[0], catalog, {
  maxItems: 2,
  discountPercentage: 10,
});

if (bundle.bundleItems.length !== 2) {
  console.error('❌ Failed FBT bundle items count', bundle);
  process.exit(1);
}

const expectedTotal = 60000 + 999 + 499;
if (bundle.totalRegularPrice !== expectedTotal) {
  console.error('❌ Failed regular price calculation', bundle.totalRegularPrice, expectedTotal);
  process.exit(1);
}

if (bundle.bundlePrice >= bundle.totalRegularPrice) {
  console.error('❌ Failed bundle discount calculation', bundle);
  process.exit(1);
}
console.log('  ✅ Passed: getFrequentlyBoughtTogether created valid combo with bundle discount');

// Test 2: Similar products
const similar = RecommendationsEngine.getSimilarProducts(catalog[1], catalog, 2);
if (similar.length === 0 || similar.some((p) => p.id === 'prod-case')) {
  console.error('❌ Failed getSimilarProducts', similar);
  process.exit(1);
}
console.log('  ✅ Passed: getSimilarProducts returns filtered similar items');

console.log('🎉 All tests passed for @boostengine/recommendations!');
