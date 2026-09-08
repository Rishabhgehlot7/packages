#!/usr/bin/env node
console.log('\n📦 @boostengine/inventory - Real-Time Stock Urgency & Warehouse Allocation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'demo') {
  const { createBoostInventory } = require('../dist/index.cjs');

  const inv = createBoostInventory([
    { sku: 'HOODIE_L', productId: 'p1', quantity: 2, lowStockThreshold: 5 },
  ]);

  const urg = inv.getUrgency('HOODIE_L');
  console.log(`Badge Text: ${urg.badgeText}`);
  console.log(`Urgency Level: ${urg.urgencyLevel}`);
  console.log(`Available Quantity: ${urg.availableQuantity}\n`);
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/inventory demo   Run live stock urgency demo');
  console.log('  npx @boostengine/inventory help   Show help information\n');
}
