const assert = require('assert');
const { BoostWishlist, createBoostWishlist } = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/wishlist Test Suite...\n');

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

// Test 1: Add Item & Prevent Duplicate
test('Adding items and preventing duplicates', () => {
  const wl = createBoostWishlist();
  wl.addItem({ productId: 'p1', variantId: 'm', title: 'Anime Tee', price: 999 });
  wl.addItem({ productId: 'p1', variantId: 'm', title: 'Anime Tee', price: 999 });

  assert.strictEqual(wl.getItems().length, 1);
  assert.strictEqual(wl.hasItem('p1', 'm'), true);
  assert.strictEqual(wl.hasItem('p2'), false);
});

// Test 2: Toggle Item
test('Toggle item status', () => {
  const wl = createBoostWishlist();
  const item = { productId: 'p1', variantId: 'l', title: 'Hoodie', price: 1999 };

  // 1st toggle: adds
  const res1 = wl.toggleItem(item);
  assert.strictEqual(res1.isWishlisted, true);
  assert.strictEqual(wl.hasItem('p1', 'l'), true);

  // 2nd toggle: removes
  const res2 = wl.toggleItem(item);
  assert.strictEqual(res2.isWishlisted, false);
  assert.strictEqual(wl.hasItem('p1', 'l'), false);
});

// Test 3: Guest Wishlist Merge
test('Merge guest wishlist without duplicates', () => {
  const userItems = [
    { id: '1', productId: 'p1', title: 'Tee', price: 999, addedAt: '2026-09-01' },
  ];
  const guestItems = [
    { id: '2', productId: 'p1', title: 'Tee', price: 999, addedAt: '2026-09-02' }, // duplicate
    { id: '3', productId: 'p2', title: 'Cap', price: 499, addedAt: '2026-09-02' }, // new
  ];

  const { merged, addedCount } = BoostWishlist.mergeGuestWishlist(guestItems, userItems);
  assert.strictEqual(merged.length, 2);
  assert.strictEqual(addedCount, 1);
});

// Test 4: Price Drop Alert Detection
test('Price drop detection against catalog', () => {
  const wl = createBoostWishlist([
    { id: '1', productId: 'p1', title: 'Sneakers', price: 3499, addedAt: '2026-09-01' },
    { id: '2', productId: 'p2', title: 'Watch', price: 4999, addedAt: '2026-09-01' },
  ]);

  // Current catalog where sneakers dropped to 2799
  const currentCatalog = [
    { id: 'p1', price: 2799 }, // 700 drop! (20% off)
    { id: 'p2', price: 4999 }, // same price
  ];

  const alerts = wl.checkPriceDrops(currentCatalog);
  assert.strictEqual(alerts.length, 1);
  assert.strictEqual(alerts[0].item.productId, 'p1');
  assert.strictEqual(alerts[0].savedAmount, 700);
  assert.strictEqual(alerts[0].discountPercentage, 20);
});

// Test 5: Serialization
test('Serialization to and from JSON', () => {
  const wl1 = createBoostWishlist();
  wl1.addItem({ productId: 'p1', title: 'Belt', price: 599 });

  const json = wl1.toJSON();

  const wl2 = createBoostWishlist();
  wl2.fromJSON(json);

  assert.strictEqual(wl2.getItems().length, 1);
  assert.strictEqual(wl2.getItems()[0].productId, 'p1');
});

console.log(`\n🎉 All ${passed} tests in @boostengine/wishlist passed successfully!\n`);
