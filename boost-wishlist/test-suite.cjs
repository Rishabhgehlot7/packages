const assert = require('assert');

console.log('\x1b[35m%s\x1b[0m', '🧪 Running @boostengine/wishlist v1.1.0 Verification Test Suite...\n');

let BoostWishlist, createBoostWishlist, wishlist, WishlistAgentToolkit;

try {
  const pkg = require('./dist/index.cjs');
  BoostWishlist = pkg.BoostWishlist;
  createBoostWishlist = pkg.createBoostWishlist;
  wishlist = pkg.wishlist;
  WishlistAgentToolkit = pkg.WishlistAgentToolkit;
} catch (e) {
  console.error('\x1b[31m%s\x1b[0m', 'Failed to load dist/index.cjs. Ensure "npm run build" ran first.');
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

// 1. Backward Compatibility: Add Item & Prevent Duplicate
test('Adding items and preventing duplicates', () => {
  const wl = createBoostWishlist();
  wl.addItem({ productId: 'p1', variantId: 'm', title: 'Anime Tee', price: 999 });
  wl.addItem({ productId: 'p1', variantId: 'm', title: 'Anime Tee', price: 999 });

  assert.strictEqual(wl.getItems().length, 1);
  assert.strictEqual(wl.hasItem('p1', 'm'), true);
  assert.strictEqual(wl.hasItem('p2'), false);
});

// 2. Backward Compatibility: Toggle Item
test('Toggle item status (add if absent, remove if present)', () => {
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

// 3. Backward Compatibility: Guest Wishlist Merge
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

// 4. Backward Compatibility: Price Drop Alert Detection
test('Price drop detection against live catalog', () => {
  const wl = createBoostWishlist([
    { id: '1', productId: 'p1', title: 'Sneakers', price: 3499, addedAt: '2026-09-01' },
    { id: '2', productId: 'p2', title: 'Watch', price: 4999, addedAt: '2026-09-01' },
  ]);

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

// 5. Backward Compatibility: Serialization
test('Serialization to and from JSON', () => {
  const wl1 = createBoostWishlist();
  wl1.addItem({ productId: 'p1', title: 'Belt', price: 599 });

  const json = wl1.toJSON();
  const wl2 = createBoostWishlist();
  wl2.fromJSON(json);

  assert.strictEqual(wl2.getItems().length, 1);
  assert.strictEqual(wl2.getItems()[0].productId, 'p1');
});

// 6. Multi-Board Management & Filtering
test('Multi-board creation and item filtering by boardId', () => {
  const wl = createBoostWishlist();
  const giftBoard = wl.createBoard('Gifts for Mom', { description: 'Birthday Ideas' });

  wl.addItem({ productId: 'prod_perfume', title: 'Luxury Perfume', price: 5999, boardId: giftBoard.id });
  wl.addItem({ productId: 'prod_phone', title: 'Smart Phone', price: 69999 }); // default board

  assert.strictEqual(wl.getBoards().length, 2); // default + giftBoard
  assert.strictEqual(wl.getItems(giftBoard.id).length, 1);
  assert.strictEqual(wl.getItems('default').length, 1);
  assert.strictEqual(wl.getSummary().totalCount, 2);
});

// 7. Move Item Between Boards
test('Moving items between custom boards', () => {
  const wl = createBoostWishlist();
  const b1 = wl.createBoard('Board 1');
  const b2 = wl.createBoard('Board 2');

  wl.addItem({ productId: 'prod_lamp', title: 'Desk Lamp', price: 1299, boardId: b1.id });
  assert.strictEqual(wl.getItems(b1.id).length, 1);

  const moved = wl.moveToBoard('prod_lamp', b2.id);
  assert.strictEqual(moved, true);
  assert.strictEqual(wl.getItems(b1.id).length, 0);
  assert.strictEqual(wl.getItems(b2.id).length, 1);
});

// 8. Delete Board and Auto-Reassign to Default
test('Deleting a custom board reassigns items to default board', () => {
  const wl = createBoostWishlist();
  const b = wl.createBoard('Temporary Board');
  wl.addItem({ productId: 'prod_chair', title: 'Gaming Chair', price: 14999, boardId: b.id });

  assert.strictEqual(wl.getItems(b.id).length, 1);
  wl.deleteBoard(b.id);

  assert.strictEqual(wl.getBoards().length, 1); // only default left
  assert.strictEqual(wl.getItems('default').length, 1);
  assert.strictEqual(wl.getItems('default')[0].productId, 'prod_chair');
});

// 9. Move to Cart with Auto-Removal
test('moveToCart converts to cart item format and removes from wishlist', () => {
  const wl = createBoostWishlist();
  wl.addItem({ productId: 'prod_hoodie', variantId: 'xl', title: 'Cozy Hoodie', price: 2499 });

  assert.strictEqual(wl.getItems().length, 1);

  const res = wl.moveToCart('prod_hoodie', 'xl', { autoRemove: true, quantity: 2 });
  assert.ok(res);
  assert.strictEqual(res.cartItem.productId, 'prod_hoodie');
  assert.strictEqual(res.cartItem.variantId, 'xl');
  assert.strictEqual(res.cartItem.quantity, 2);
  assert.strictEqual(res.remainingWishlistCount, 0);
  assert.strictEqual(wl.hasItem('prod_hoodie', 'xl'), false);
});

// 10. Move to Cart without Auto-Removal
test('moveToCart keeps item in wishlist when autoRemove is false', () => {
  const wl = createBoostWishlist();
  wl.addItem({ productId: 'prod_book', title: 'TypeScript Guide', price: 499 });

  const res = wl.moveToCart('prod_book', undefined, { autoRemove: false });
  assert.ok(res);
  assert.strictEqual(wl.hasItem('prod_book'), true);
});

// 11. Back-in-Stock Alert Detection
test('checkRestockAlerts flags items that came back into stock', () => {
  const wl = createBoostWishlist([
    { id: '1', productId: 'prod_soldout', title: 'Limited Vinyl', price: 1999, inStock: false, addedAt: '' }
  ]);

  const catalog = [
    { id: 'prod_soldout', inStock: true }
  ];

  const alerts = wl.checkRestockAlerts(catalog);
  assert.strictEqual(alerts.length, 1);
  assert.strictEqual(alerts[0].item.productId, 'prod_soldout');
  assert.strictEqual(alerts[0].currentStock, true);
});

// 12. Target Price Reached Alert
test('checkTargetPriceAlerts flags items that hit customer threshold', () => {
  const wl = createBoostWishlist([
    { id: '1', productId: 'prod_gpu', title: 'Graphics Card', price: 50000, targetPrice: 42000, addedAt: '' }
  ]);

  const catalog = [
    { id: 'prod_gpu', price: 41999 } // Under target 42000!
  ];

  const alerts = wl.checkTargetPriceAlerts(catalog);
  assert.strictEqual(alerts.length, 1);
  assert.strictEqual(alerts[0].targetPrice, 42000);
  assert.strictEqual(alerts[0].currentPrice, 41999);
});

// 13. Shareable Link & Token Generation
test('generateShareLink produces public link with token', () => {
  const wl = createBoostWishlist();
  const share = wl.generateShareLink('default', 'https://shop.com/w/');

  assert.ok(share.shareToken);
  assert.strictEqual(share.shareUrl.includes(share.shareToken), true);
  assert.strictEqual(share.board.privacy, 'public');
});

// 14. Real-time Event Emitter
test('BoostWishlist emits real-time events for item addition and price drop', () => {
  const wl = createBoostWishlist();
  let itemAddedEvent = false;
  let priceDropEvent = false;

  wl.on('item:added', (payload) => {
    itemAddedEvent = payload.item.productId === 'p_ev';
  });

  wl.on('price_drop', (payload) => {
    priceDropEvent = payload.item.productId === 'p_ev';
  });

  wl.addItem({ productId: 'p_ev', title: 'Event Tee', price: 1000 });
  wl.checkPriceDrops([{ id: 'p_ev', price: 800 }]);

  assert.strictEqual(itemAddedEvent, true);
  assert.strictEqual(priceDropEvent, true);
});

// 15. Universal Database Sync
test('Universal sync ingests records from database formats', () => {
  const wl = createBoostWishlist();
  const mongoDocs = [
    { _id: 'm1', pId: 'prod_mug', name: 'Ceramic Mug', cost: 350 },
    { _id: 'm2', pId: 'prod_coaster', name: 'Wood Coaster', cost: 150 }
  ];

  const count = wl.sync(mongoDocs, doc => ({
    id: doc._id,
    productId: doc.pId,
    title: doc.name,
    price: doc.cost,
    addedAt: '2026-01-01'
  }));

  assert.strictEqual(count, 2);
  assert.strictEqual(wl.hasItem('prod_mug'), true);
  assert.strictEqual(wl.hasItem('prod_coaster'), true);
});

// 16. Autonomous AI Agent Toolkit
test('WishlistAgentToolkit generates schemas and executes tools', async () => {
  const wl = createBoostWishlist();
  const toolkit = new WishlistAgentToolkit(wl);

  const tools = toolkit.getTools();
  assert.strictEqual(tools.length, 5);

  // 1. Execute toggle_wishlist_item
  const toggleRes = await toolkit.executeTool('toggle_wishlist_item', {
    productId: 'ai_prod_1',
    title: 'Smart Watch',
    price: 9999
  });
  assert.strictEqual(toggleRes.success, true);
  assert.strictEqual(toggleRes.isWishlisted, true);

  // 2. Execute get_wishlist_items
  const listRes = await toolkit.executeTool('get_wishlist_items', {});
  assert.strictEqual(listRes.totalCount, 1);
  assert.strictEqual(listRes.items[0].productId, 'ai_prod_1');

  // 3. Execute move_item_to_cart
  const moveRes = await toolkit.executeTool('move_item_to_cart', {
    productId: 'ai_prod_1',
    quantity: 1
  });
  assert.strictEqual(moveRes.success, true);
  assert.strictEqual(moveRes.cartItem.productId, 'ai_prod_1');
  assert.strictEqual(moveRes.remainingWishlistCount, 0);
});

console.log(`\n\x1b[35mSummary:\x1b[0m ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '🎉 All 16 verification test assertions passed successfully!');
}
