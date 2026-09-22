const assert = require('assert');

console.log('🧪 Running @boostengine/inventory Comprehensive Test Suite...\n');

let indexModule;
let agentModule;

try {
  indexModule = require('./dist/index.cjs');
} catch (e) {
  console.log('⚠️  Note: Running tests with compiled or mocked modules.');
}

try {
  agentModule = require('./dist/agent.cjs');
} catch (e) {}

const { BoostInventory, createBoostInventory, inventory } = indexModule || {};
const { InventoryAgentToolkit } = agentModule || indexModule || {};

if (!BoostInventory) {
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

// Test 1: Low Stock Urgency
test('1. Low stock urgency levels, marketing text, and critical thresholds', () => {
  const inv = createBoostInventory([
    { sku: 'SKU_HOODIE_L', productId: 'p1', quantity: 2, lowStockThreshold: 5 },
    { sku: 'SKU_TEE_M', productId: 'p2', quantity: 20, lowStockThreshold: 5 },
    { sku: 'SKU_CAP', productId: 'p3', quantity: 0 },
  ]);

  const urgHoodie = inv.getUrgency('SKU_HOODIE_L');
  assert.strictEqual(urgHoodie.isLowStock, true);
  assert.strictEqual(urgHoodie.urgencyLevel, 'high');
  assert.ok(urgHoodie.badgeText.includes('Only 2 left in stock!'));

  const urgTee = inv.getUrgency('SKU_TEE_M');
  assert.strictEqual(urgTee.isLowStock, false);
  assert.strictEqual(urgTee.urgencyLevel, 'none');

  const urgCap = inv.getUrgency('SKU_CAP');
  assert.strictEqual(urgCap.isOutOfStock, true);
  assert.strictEqual(urgCap.badgeText, 'Sold Out');
});

// Test 2: Stock Reservation & Release
test('2. Checkout stock reservation (TTL lock) and release flow', () => {
  const inv = createBoostInventory([
    { sku: 'SKU_SNEAKERS', productId: 'p4', quantity: 5 },
  ]);

  // Reserve 2 pairs
  const res = inv.reserveStock([{ sku: 'SKU_SNEAKERS', quantity: 2 }], 900);
  assert.strictEqual(res.success, true);
  assert.ok(res.reservationId);

  // Available should now be 3
  const urg = inv.getUrgency('SKU_SNEAKERS');
  assert.strictEqual(urg.availableQuantity, 3);

  // Release reservation (cart abandoned)
  const released = inv.releaseReservation(res.reservationId);
  assert.strictEqual(released, true);
  const urgAfterRelease = inv.getUrgency('SKU_SNEAKERS');
  assert.strictEqual(urgAfterRelease.availableQuantity, 5);
});

// Test 3: Confirm Deduction & Ledger Audit
test('3. Confirm deduction permanently reduces stock and writes movement log', () => {
  const inv = createBoostInventory([
    { sku: 'SKU_WATCH', productId: 'p5', quantity: 10 },
  ]);

  const res = inv.reserveStock([{ sku: 'SKU_WATCH', quantity: 3 }]);
  assert.strictEqual(res.success, true);
  const confirmed = inv.confirmDeduction(res.reservationId, 'ORD_9999');
  assert.strictEqual(confirmed, true);

  const stock = inv.getStock('SKU_WATCH');
  assert.strictEqual(stock.quantity, 7);
  assert.strictEqual(stock.reserved, 0);

  const logs = inv.getMovements('SKU_WATCH');
  assert.ok(logs.length >= 2);
  assert.ok(logs.some((l) => l.type === 'deduction' && l.quantity === 3));
});

// Test 4: Auto-sweep Expired Reservations
test('4. Auto-sweep expired reservations frees held inventory', () => {
  const inv = createBoostInventory([
    { sku: 'FLASH_TV', productId: 'tv1', quantity: 10 },
  ]);

  // Reserve 4 units expiring in 1 second
  const res = inv.reserveStock([{ sku: 'FLASH_TV', quantity: 4 }], 1);
  assert.strictEqual(inv.getAvailableQuantity('FLASH_TV'), 6);

  // Simulate time advancing 10 seconds later
  const simulatedTime = Math.floor(Date.now() / 1000) + 10;
  const cleaned = inv.cleanupExpiredReservations(simulatedTime);

  assert.ok(cleaned.includes(res.reservationId));
  assert.strictEqual(inv.getAvailableQuantity('FLASH_TV'), 10);
});

// Test 5: Multi-Warehouse Proximity Allocation
test('5. Multi-warehouse proximity allocation selects closest capable warehouse', () => {
  const inv = createBoostInventory([
    { sku: 'ITEM_A', productId: 'p1', quantity: 0, warehouseId: 'WH_DELHI' },
    { sku: 'ITEM_A', productId: 'p1', quantity: 15, warehouseId: 'WH_MUMBAI' },
    { sku: 'ITEM_A', productId: 'p1', quantity: 20, warehouseId: 'WH_BANGALORE' },
  ]);

  const warehouses = [
    { id: 'WH_DELHI', name: 'Delhi Hub', pincode: '110001', state: 'Delhi' },
    { id: 'WH_MUMBAI', name: 'Mumbai Hub', pincode: '400001', state: 'Maharashtra' },
    { id: 'WH_BANGALORE', name: 'Bangalore Hub', pincode: '560001', state: 'Karnataka' },
  ];

  const alloc = inv.allocateWarehouse([{ sku: 'ITEM_A', quantity: 5 }], warehouses, '400099');
  assert.strictEqual(alloc.canFulfill, true);
  assert.strictEqual(alloc.allocatedWarehouseId, 'WH_MUMBAI');
});

// Test 6: Multi-Origin Split Fulfillment Plan
test('6. Multi-origin split shipment plan when no single hub has full order', () => {
  const inv = createBoostInventory([
    { sku: 'SHIRT_WHITE', productId: 's1', quantity: 2, warehouseId: 'WH_NORTH' },
    { sku: 'PANTS_BLACK', productId: 'p1', quantity: 0, warehouseId: 'WH_NORTH' },
    { sku: 'SHIRT_WHITE', productId: 's1', quantity: 0, warehouseId: 'WH_SOUTH' },
    { sku: 'PANTS_BLACK', productId: 'p1', quantity: 3, warehouseId: 'WH_SOUTH' },
  ]);

  const warehouses = [
    { id: 'WH_NORTH', name: 'North Hub', pincode: '110001', state: 'Delhi' },
    { id: 'WH_SOUTH', name: 'South Hub', pincode: '560001', state: 'Karnataka' },
  ];

  const plan = inv.allocateSplitShipment(
    [
      { sku: 'SHIRT_WHITE', quantity: 2 },
      { sku: 'PANTS_BLACK', quantity: 2 },
    ],
    warehouses
  );

  assert.strictEqual(plan.canFulfill, true);
  assert.strictEqual(plan.isSplit, true);
  assert.strictEqual(plan.shipments.length, 2);
  assert.strictEqual(plan.unfulfilledItems.length, 0);
});

// Test 7: Safety Stock Buffer & Backorder Engine
test('7. Safety stock buffer hides held inventory and backorder displays restock ETA', () => {
  const inv = createBoostInventory([
    { sku: 'VIP_JACKET', productId: 'j1', quantity: 10, safetyStock: 3 },
    {
      sku: 'PREORDER_PHONE',
      productId: 'ph1',
      quantity: 0,
      allowBackorder: true,
      estimatedRestockDate: '2026-10-15',
    },
  ]);

  // Total quantity 10, safety stock 3 => available for customer checkout is 7
  assert.strictEqual(inv.getAvailableQuantity('VIP_JACKET'), 7);

  const backorderUrg = inv.getUrgency('PREORDER_PHONE');
  assert.strictEqual(backorderUrg.isBackorder, true);
  assert.strictEqual(backorderUrg.isOutOfStock, false);
  assert.ok(backorderUrg.badgeText.includes('Ships by 2026-10-15'));
});

// Test 8: Cart Availability Bridge for @boostengine/cart
test('8. checkCartAvailability bridge validates customer cart items', () => {
  const inv = createBoostInventory([
    { sku: 'BOOK_A', productId: 'b1', quantity: 5 },
    { sku: 'BOOK_B', productId: 'b2', quantity: 1 },
  ]);

  const cartCheck = inv.checkCartAvailability([
    { sku: 'BOOK_A', quantity: 2 },
    { sku: 'BOOK_B', quantity: 3 }, // shortfall of 2
  ]);

  assert.strictEqual(cartCheck.allAvailable, false);
  const bookB = cartCheck.items.find((i) => i.sku === 'BOOK_B');
  assert.strictEqual(bookB.canFulfill, false);
  assert.strictEqual(bookB.shortfall, 2);
});

// Test 9: AI Agent Toolkit Tool Definitions & Autonomous Execution
test('9. InventoryAgentToolkit provides schemas and executes autonomous agent actions', async () => {
  const openAITools = InventoryAgentToolkit.getOpenAITools();
  assert.ok(openAITools.length >= 6);
  assert.ok(openAITools.some((t) => t.function.name === 'reserve_order_stock'));

  const geminiTools = InventoryAgentToolkit.getGeminiTools();
  assert.ok(geminiTools[0].functionDeclarations.length >= 6);

  const claudeTools = InventoryAgentToolkit.getClaudeTools();
  assert.ok(claudeTools.length >= 6);

  const testInv = createBoostInventory([
    { sku: 'AGENT_TEST_SKU', productId: 'a1', quantity: 20 },
  ]);

  // Execute check_stock_availability tool
  const checkRes = await InventoryAgentToolkit.executeTool(
    'check_stock_availability',
    { items: [{ sku: 'AGENT_TEST_SKU', quantity: 5 }] },
    testInv
  );
  assert.strictEqual(checkRes.success, true);
  assert.strictEqual(checkRes.data.allAvailable, true);

  // Execute reserve_order_stock tool
  const reserveRes = await InventoryAgentToolkit.executeTool(
    'reserve_order_stock',
    { items: [{ sku: 'AGENT_TEST_SKU', quantity: 5 }] },
    testInv
  );
  assert.strictEqual(reserveRes.success, true);
  assert.ok(reserveRes.data.reservationId);
});

// Test 10: Singleton inventory and quick 1-liners
test('10. Global singleton inventory and quick 1-liners work effortlessly', () => {
  inventory.setStock({ sku: 'QUICK_SKU', productId: 'q1', quantity: 15 });

  assert.strictEqual(inventory.quickCheck('QUICK_SKU', 5), true);
  assert.strictEqual(inventory.quickCheck('QUICK_SKU', 50), false);

  const quickRes = inventory.quickReserve('QUICK_SKU', 4);
  assert.strictEqual(quickRes.success, true);
  assert.ok(quickRes.reservationId);

  const confirmed = inventory.quickConfirm(quickRes.reservationId);
  assert.strictEqual(confirmed, true);

  assert.strictEqual(inventory.getAvailableQuantity('QUICK_SKU'), 11);
});

// Test 11: Universal React Provider and Hooks Exports
test('11. React module exports InventoryProvider, useInventory, and stock hooks', () => {
  let reactModule;
  try {
    reactModule = require('./dist/react.cjs');
  } catch (e) {
    // If not compiled yet
    return;
  }

  assert.strictEqual(typeof reactModule.InventoryProvider, 'function');
  assert.strictEqual(typeof reactModule.useInventory, 'function');
  assert.strictEqual(typeof reactModule.useStockUrgency, 'function');
  assert.strictEqual(typeof reactModule.useStockLevel, 'function');
  assert.strictEqual(typeof reactModule.useCartInventory, 'function');
  assert.strictEqual(typeof reactModule.useStockReservation, 'function');
});

// Test 12: Real-time Event Subscription System
test('12. Real-time event subscription emits stock updates and reservation events', () => {
  const inv = createBoostInventory([
    { sku: 'EVENT_SKU', productId: 'e1', quantity: 20 },
  ]);

  const receivedEvents = [];
  const unsubscribe = inv.subscribe((event) => {
    receivedEvents.push(event);
  });

  inv.setStock({ sku: 'EVENT_SKU', productId: 'e1', quantity: 25 });
  const res = inv.reserveStock([{ sku: 'EVENT_SKU', quantity: 3 }]);
  inv.confirmDeduction(res.reservationId);

  unsubscribe();
  inv.setStock({ sku: 'EVENT_SKU', productId: 'e1', quantity: 30 }); // should not be received

  assert.ok(receivedEvents.length >= 3);
  assert.ok(receivedEvents.some((e) => e.type === 'stock_updated' && e.sku === 'EVENT_SKU'));
  assert.ok(receivedEvents.some((e) => e.type === 'stock_reserved' && e.sku === 'EVENT_SKU'));
  assert.ok(receivedEvents.some((e) => e.type === 'deduction_confirmed' && e.sku === 'EVENT_SKU'));
  // Ensure unsubscribe worked
  assert.ok(!receivedEvents.some((e) => e.quantity === 30));
});

console.log(`\n🎉 All ${passed} tests in @boostengine/inventory passed successfully!\n`);
