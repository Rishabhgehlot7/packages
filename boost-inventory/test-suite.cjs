const assert = require('assert');
const { BoostInventory, createBoostInventory } = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/inventory Test Suite...\n');

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
test('Low stock urgency levels and marketing text', () => {
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
test('Checkout stock reservation and release flow', () => {
  const inv = createBoostInventory([
    { sku: 'SKU_SNEAKERS', productId: 'p4', quantity: 5 },
  ]);

  // Reserve 2 pairs
  const res = inv.reserveStock([{ sku: 'SKU_SNEAKERS', quantity: 2 }]);
  assert.strictEqual(res.success, true);
  assert.ok(res.reservationId);

  // Available should now be 3
  const urg = inv.getUrgency('SKU_SNEAKERS');
  assert.strictEqual(urg.availableQuantity, 3);

  // Release reservation (cart abandoned)
  inv.releaseReservation(res.reservationId);
  const urgAfterRelease = inv.getUrgency('SKU_SNEAKERS');
  assert.strictEqual(urgAfterRelease.availableQuantity, 5);
});

// Test 3: Confirm Deduction
test('Confirm deduction permanently reduces stock', () => {
  const inv = createBoostInventory([
    { sku: 'SKU_WATCH', productId: 'p5', quantity: 10 },
  ]);

  const res = inv.reserveStock([{ sku: 'SKU_WATCH', quantity: 3 }]);
  inv.confirmDeduction(res.reservationId);

  const stock = inv.getStock('SKU_WATCH');
  assert.strictEqual(stock.quantity, 7);
  assert.strictEqual(stock.reserved, 0);
});

// Test 4: Multi-Warehouse Allocation
test('Multi-warehouse allocation selects warehouse with stock', () => {
  const inv = createBoostInventory([
    { sku: 'ITEM_A', productId: 'p1', quantity: 0, warehouseId: 'WH_DELHI' },
    { sku: 'ITEM_A', productId: 'p1', quantity: 15, warehouseId: 'WH_MUMBAI' },
  ]);

  const warehouses = [
    { id: 'WH_DELHI', name: 'Delhi Hub', pincode: '110001', state: 'Delhi' },
    { id: 'WH_MUMBAI', name: 'Mumbai Hub', pincode: '400001', state: 'Maharashtra' },
  ];

  const alloc = inv.allocateWarehouse([{ sku: 'ITEM_A', quantity: 5 }], warehouses);
  assert.strictEqual(alloc.canFulfill, true);
  assert.strictEqual(alloc.allocatedWarehouseId, 'WH_MUMBAI');
});

console.log(`\n🎉 All ${passed} tests in @boostengine/inventory passed successfully!\n`);
