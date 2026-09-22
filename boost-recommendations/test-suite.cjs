const assert = require('assert');

console.log('\x1b[36m%s\x1b[0m', '🧪 Running @boostengine/recommendations v1.1.0 Verification Test Suite...\n');

let RecommendationsEngine, BoostRecommendationsManager, recommendations, RecommendationsAgentToolkit;

try {
  const pkg = require('./dist/index.js');
  RecommendationsEngine = pkg.RecommendationsEngine;
  BoostRecommendationsManager = pkg.BoostRecommendationsManager;
  recommendations = pkg.recommendations;
  RecommendationsAgentToolkit = pkg.RecommendationsAgentToolkit;
} catch (e) {
  console.error('\x1b[31m%s\x1b[0m', 'Failed to load dist/index.js. Ensure "npm run build" ran first.');
  console.error(e);
  process.exit(1);
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.error(`  \x1b[31m✗\x1b[0m ${name}`);
    console.error(err);
    failed++;
  }
}

const sampleCatalog = [
  {
    id: 'prod_phone',
    title: 'Flagship Smartphone Pro',
    price: 60000,
    category: 'Electronics',
    tags: ['mobile', 'smartphone', 'gadgets'],
    rating: 4.8,
    stock: 50,
  },
  {
    id: 'prod_phone_max',
    title: 'Flagship Smartphone Ultra Max',
    price: 85000,
    category: 'Electronics',
    tags: ['mobile', 'smartphone', 'gadgets', 'premium'],
    rating: 4.9,
    stock: 20,
  },
  {
    id: 'prod_case',
    title: 'Shockproof Armor Case',
    price: 999,
    category: 'Electronics',
    tags: ['mobile', 'accessories', 'protection'],
    rating: 4.5,
    stock: 100,
  },
  {
    id: 'prod_screen',
    title: 'Tempered Glass Screen Protector',
    price: 499,
    category: 'Electronics',
    tags: ['mobile', 'accessories', 'screen-guard'],
    rating: 4.6,
    stock: 200,
  },
  {
    id: 'prod_shirt',
    title: 'Cotton Slim Fit Shirt',
    price: 1499,
    category: 'Fashion',
    tags: ['apparel', 'cotton'],
    rating: 4.2,
    stock: 15,
  },
  {
    id: 'prod_outofstock',
    title: 'Rare Vintage Case',
    price: 799,
    category: 'Electronics',
    stock: 0,
  }
];

// 1. Backward Compatibility: getFrequentlyBoughtTogether
test('RecommendationsEngine.getFrequentlyBoughtTogether creates combo bundle with discount', () => {
  const bundle = RecommendationsEngine.getFrequentlyBoughtTogether(sampleCatalog[0], sampleCatalog, {
    maxItems: 2,
    discountPercentage: 10,
  });

  assert.strictEqual(bundle.bundleItems.length, 2);
  const expectedTotal = 60000 + 999 + 499;
  assert.strictEqual(bundle.totalRegularPrice, expectedTotal);
  assert.strictEqual(bundle.bundleDiscountPercentage, 10);
  assert.strictEqual(bundle.bundlePrice < bundle.totalRegularPrice, true);
  assert.strictEqual(bundle.savingsAmount, Math.round(expectedTotal * 0.1));
});

// 2. Backward Compatibility: getSimilarProducts
test('RecommendationsEngine.getSimilarProducts filters and ranks alternatives', () => {
  const similar = RecommendationsEngine.getSimilarProducts(sampleCatalog[2], sampleCatalog, 2);
  assert.strictEqual(similar.length > 0, true);
  assert.strictEqual(similar.some(p => p.id === 'prod_case'), false);
});

// 3. Backward Compatibility: getPersonalizedPicks
test('RecommendationsEngine.getPersonalizedPicks handles history and fallbacks', () => {
  // Empty history fallback to top rated
  const topRated = RecommendationsEngine.getPersonalizedPicks([], sampleCatalog, 2);
  assert.strictEqual(topRated.length, 2);
  assert.strictEqual(topRated[0].rating >= topRated[1].rating, true);

  // History-aware picks
  const personalized = RecommendationsEngine.getPersonalizedPicks(['prod_shirt'], sampleCatalog, 2);
  assert.strictEqual(personalized.length > 0, true);
  assert.strictEqual(personalized.some(p => p.id === 'prod_shirt'), false);
});

// 4. BoostRecommendationsManager order transaction recording
test('BoostRecommendationsManager records orders and builds co-occurrence', () => {
  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);

  mgr.recordOrder(['prod_phone', 'prod_case', 'prod_screen']);
  mgr.recordOrder(['prod_phone', 'prod_case']);

  const alsoBought = mgr.getCustomersAlsoBought('prod_phone', sampleCatalog, 2);
  assert.strictEqual(alsoBought.length, 2);
  // prod_case occurred twice, prod_screen once -> prod_case should be #1
  assert.strictEqual(alsoBought[0].id, 'prod_case');
  assert.strictEqual(alsoBought[1].id, 'prod_screen');
});

// 5. Collaborative Filtering FBT
test('BoostRecommendationsManager FBT leverages transaction co-occurrence', () => {
  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);

  mgr.recordOrders([
    { productIds: ['prod_phone', 'prod_case'] },
    { productIds: ['prod_phone', 'prod_screen'] },
    { productIds: ['prod_phone', 'prod_case'] },
  ]);

  const bundle = mgr.getFrequentlyBoughtTogether(sampleCatalog[0], sampleCatalog, { maxItems: 2 });
  assert.strictEqual(bundle.bundleItems.length, 2);
  assert.strictEqual(bundle.bundleItems[0].id, 'prod_case');
});

// 6. FBT Fallback to tag/category when no transactions exist
test('BoostRecommendationsManager FBT falls back gracefully when no orders exist', () => {
  const mgr = new BoostRecommendationsManager();
  const bundle = mgr.getFrequentlyBoughtTogether(sampleCatalog[0], sampleCatalog, { maxItems: 2 });
  assert.strictEqual(bundle.bundleItems.length, 2);
  assert.strictEqual(bundle.allProducts.length, 3);
});

// 7. Cart Cross-Sells
test('getCartCrossSells suggests complementary impulse add-ons', () => {
  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);
  mgr.recordOrder(['prod_phone', 'prod_case']);

  const cart = [{ id: 'prod_phone', category: 'Electronics', price: 60000 }];
  const crossSells = mgr.getCartCrossSells(cart, sampleCatalog, { limit: 2 });

  assert.strictEqual(crossSells.length, 2);
  assert.strictEqual(crossSells.some(c => c.item.id === 'prod_phone'), false);
  assert.strictEqual(crossSells[0].item.id, 'prod_case');
});

// 8. Cart Cross-Sells excludes items already in cart
test('getCartCrossSells excludes items already in cart', () => {
  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);

  const cart = [
    { id: 'prod_phone', category: 'Electronics', price: 60000 },
    { id: 'prod_case', category: 'Electronics', price: 999 }
  ];

  const crossSells = mgr.getCartCrossSells(cart, sampleCatalog);
  assert.strictEqual(crossSells.some(c => c.item.id === 'prod_case'), false);
  assert.strictEqual(crossSells.some(c => c.item.id === 'prod_phone'), false);
});

// 9. Product Upgrades (Upsell)
test('getUpgrades finds higher-spec alternatives in same category', () => {
  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);

  const upgrades = mgr.getUpgrades(sampleCatalog[0], sampleCatalog, { maxPriceMultiplier: 2.0 });
  assert.strictEqual(upgrades.length, 1);
  assert.strictEqual(upgrades[0].upgradedProduct.id, 'prod_phone_max');
  assert.strictEqual(upgrades[0].priceDifference, 25000);
  assert.strictEqual(upgrades[0].percentagePriceIncrease, Math.round((25000 / 60000) * 100));
});

// 10. Product Upgrades respects price multiplier cap
test('getUpgrades ignores products exceeding maxPriceMultiplier', () => {
  const mgr = new BoostRecommendationsManager();
  // Multiplier 1.2 means max price 60000 * 1.2 = 72000. Ultra max is 85000 so should be excluded.
  const upgrades = mgr.getUpgrades(sampleCatalog[0], sampleCatalog, { maxPriceMultiplier: 1.2 });
  assert.strictEqual(upgrades.length, 0);
});

// 11. Post-Purchase Upsells
test('getPostPurchaseUpsells returns high-affinity items', () => {
  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);
  mgr.recordOrder(['prod_phone', 'prod_case']);

  const postUpsells = mgr.getPostPurchaseUpsells(['prod_phone'], sampleCatalog, 2);
  assert.strictEqual(postUpsells.length, 2);
  assert.strictEqual(postUpsells.some(p => p.id === 'prod_phone'), false);
});

// 12. Out-of-Stock Protection
test('Recommendations engine excludes out-of-stock items (stock: 0)', () => {
  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);

  const similar = RecommendationsEngine.getSimilarProducts(sampleCatalog[0], sampleCatalog, 5);
  assert.strictEqual(similar.some(p => p.id === 'prod_outofstock'), false);

  const fbt = mgr.getFrequentlyBoughtTogether(sampleCatalog[0], sampleCatalog);
  assert.strictEqual(fbt.bundleItems.some(p => p.id === 'prod_outofstock'), false);
});

// 13. Universal Database Sync
test('Universal sync ingests catalog and order transactions from raw DB formats', () => {
  const mgr = new BoostRecommendationsManager();

  const mongoProducts = [
    { _id: 'm_p1', name: 'Coffee Beans 1kg', cost: 1200, dept: 'Grocery' },
    { _id: 'm_p2', name: 'French Press', cost: 1800, dept: 'Kitchen' }
  ];

  const mongoOrders = [
    { orderId: 'ord_1', items: ['m_p1', 'm_p2'] }
  ];

  const syncRes = mgr.sync(mongoProducts, mongoOrders, {
    catalogMapper: p => ({ id: p._id, title: p.name, price: p.cost, category: p.dept, imageUrl: '' }),
    orderMapper: o => ({ productIds: o.items })
  });

  assert.strictEqual(syncRes.syncedProducts, 2);
  assert.strictEqual(syncRes.syncedOrders, 1);

  const alsoBought = mgr.getCustomersAlsoBought('m_p1');
  assert.strictEqual(alsoBought.length, 1);
  assert.strictEqual(alsoBought[0].id, 'm_p2');
});

// 14. Autonomous AI Agent Toolkit Tool Definitions
test('RecommendationsAgentToolkit generates 5 valid tool declarations', () => {
  const mgr = new BoostRecommendationsManager();
  const toolkit = new RecommendationsAgentToolkit(mgr);

  const tools = toolkit.getTools();
  assert.strictEqual(tools.length, 5);

  const names = tools.map(t => t.name);
  assert.strictEqual(names.includes('get_frequently_bought_together'), true);
  assert.strictEqual(names.includes('get_cart_cross_sells'), true);
  assert.strictEqual(names.includes('get_similar_products'), true);
  assert.strictEqual(names.includes('get_personalized_picks'), true);
  assert.strictEqual(names.includes('get_product_upgrades'), true);
});

// 15. Autonomous AI Agent Toolkit Execution - FBT
test('RecommendationsAgentToolkit executes get_frequently_bought_together', async () => {
  const mgr = new BoostRecommendationsManager();
  const toolkit = new RecommendationsAgentToolkit(mgr);

  const res = await toolkit.executeTool('get_frequently_bought_together', {
    mainProduct: sampleCatalog[0],
    catalog: sampleCatalog,
    maxItems: 2,
    discountPercentage: 15
  });

  assert.ok(res.bundlePrice);
  assert.strictEqual(res.bundleDiscountPercentage, 15);
  assert.strictEqual(res.bundleItems.length, 2);
});

// 16. Autonomous AI Agent Toolkit Execution - Cross-sells & Upgrades
test('RecommendationsAgentToolkit executes get_cart_cross_sells & get_product_upgrades', async () => {
  const mgr = new BoostRecommendationsManager();
  const toolkit = new RecommendationsAgentToolkit(mgr);

  const crossRes = await toolkit.executeTool('get_cart_cross_sells', {
    cartItems: [{ id: 'prod_phone', category: 'Electronics', price: 60000 }],
    catalog: sampleCatalog,
    limit: 2
  });
  assert.strictEqual(Array.isArray(crossRes), true);
  assert.strictEqual(crossRes.length, 2);

  const upRes = await toolkit.executeTool('get_product_upgrades', {
    product: sampleCatalog[0],
    catalog: sampleCatalog,
    limit: 1
  });
  assert.strictEqual(Array.isArray(upRes), true);
  assert.strictEqual(upRes.length, 1);
  assert.strictEqual(upRes[0].upgradedProduct.id, 'prod_phone_max');
});

console.log(`\n\x1b[36mSummary:\x1b[0m ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '🎉 All 16 verification test assertions passed successfully!');
}
