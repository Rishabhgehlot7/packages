#!/usr/bin/env node

console.log('\n📦 @boostengine/inventory - High-Performance Headless eCommerce Stock Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

let indexModule;
try {
  indexModule = require('../dist/index.cjs');
} catch (e) {
  try {
    indexModule = require('./dist/index.cjs');
  } catch (err) {
    // fallback if called before build
  }
}

const { createBoostInventory, inventory } = indexModule || {};

if (command === 'demo' || command === 'mock') {
  if (!createBoostInventory) {
    console.log('❌ Please run `npm run build` before running the demo.');
    process.exit(1);
  }

  const inv = createBoostInventory([
    { sku: 'HOODIE_L', productId: 'p1', quantity: 2, lowStockThreshold: 5, safetyStock: 0 },
    { sku: 'SNEAKER_42', productId: 'p2', quantity: 20, lowStockThreshold: 5, safetyStock: 2 },
    { sku: 'IPHONE_PRO', productId: 'p3', quantity: 0, allowBackorder: true, estimatedRestockDate: '2026-10-05' },
    { sku: 'CAP_VINTAGE', productId: 'p4', quantity: 0 },
  ]);

  console.log('🔍 [1/3] Real-Time Stock Urgency Badges:');
  const items = ['HOODIE_L', 'SNEAKER_42', 'IPHONE_PRO', 'CAP_VINTAGE'];
  for (const sku of items) {
    const urg = inv.getUrgency(sku);
    console.log(`  • SKU: ${sku.padEnd(12)} | Available: ${urg.availableQuantity} | Urgency: ${urg.urgencyLevel.padEnd(8)} | Badge: "${urg.badgeText}"`);
  }

  console.log('\n⚡ [2/3] Flash Sale 15-Minute Reservation Lock:');
  const res = inv.reserveStock([{ sku: 'HOODIE_L', quantity: 1 }], 900);
  console.log(`  • Reservation ID: ${res.reservationId} (Locked 1 unit of HOODIE_L)`);
  const urgAfter = inv.getUrgency('HOODIE_L');
  console.log(`  • Available After Hold: ${urgAfter.availableQuantity} left! Badge: "${urgAfter.badgeText}"`);

  console.log('\n🏭 [3/3] Intelligent Multi-Warehouse Proximity Routing:');
  const whInv = createBoostInventory([
    { sku: 'TEE_BLACK', productId: 'p5', quantity: 50, warehouseId: 'WH_DELHI' },
    { sku: 'TEE_BLACK', productId: 'p5', quantity: 100, warehouseId: 'WH_MUMBAI' },
    { sku: 'JEANS_BLUE', productId: 'p6', quantity: 30, warehouseId: 'WH_MUMBAI' },
  ]);

  const warehouses = [
    { id: 'WH_DELHI', name: 'North Delhi Hub', pincode: '110001', state: 'Delhi' },
    { id: 'WH_MUMBAI', name: 'West Mumbai Central', pincode: '400001', state: 'Maharashtra' },
  ];

  const plan = whInv.allocateSplitShipment(
    [
      { sku: 'TEE_BLACK', quantity: 2 },
      { sku: 'JEANS_BLUE', quantity: 1 },
    ],
    warehouses,
    '400050' // Mumbai customer
  );

  console.log(`  • Customer Pincode: 400050 (Mumbai)`);
  console.log(`  • Can Fulfill: ${plan.canFulfill ? 'YES ✅' : 'NO ❌'} | Split Shipments: ${plan.isSplit ? 'YES' : 'NO (Single Hub)'}`);
  for (const ship of plan.shipments) {
    console.log(`    -> Dispatching from: ${ship.warehouseName} (${ship.warehouseId}) [${ship.items.map((i) => `${i.sku} x${i.quantity}`).join(', ')}]`);
  }

  console.log('\n✨ Demo completed successfully! Everything running ultra-fast.\n');
} else if (command === 'alerts') {
  if (!createBoostInventory) {
    console.log('❌ Please run `npm run build` before running alerts.');
    process.exit(1);
  }

  const inv = createBoostInventory([
    { sku: 'WATCH_CHRONO', productId: 'p1', quantity: 2, lowStockThreshold: 5 },
    { sku: 'EARBUDS_PRO', productId: 'p2', quantity: 0, lowStockThreshold: 10 },
  ]);

  const alerts = inv.getLowStockAlerts();
  console.log(`⚠️  Found ${alerts.length} Low Stock Item Alerts:`);
  for (const a of alerts) {
    console.log(`  • [${a.severity.toUpperCase()}] SKU: ${a.sku} | Available: ${a.availableQuantity}/${a.threshold} | Reorder: +${a.recommendedReorderQty} units`);
  }
  console.log();
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/inventory demo     Run real-time stock urgency & multi-hub routing demo');
  console.log('  npx @boostengine/inventory alerts   Display low stock warnings & reorder recommendations');
  console.log('  npx @boostengine/inventory help     Show help information\n');
}
