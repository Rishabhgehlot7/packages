#!/usr/bin/env node
console.log('\n💖 @boostengine/wishlist - Save-for-Later & Price-Drop Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'demo') {
  const { createBoostWishlist } = require('../dist/index.cjs');

  const wl = createBoostWishlist();
  wl.addItem({ productId: 'p1', title: 'Cyberpunk Jacket', price: 3999 });

  console.log('Saved items: ' + wl.getItems().length);
  const alerts = wl.checkPriceDrops([{ id: 'p1', price: 2999 }]);
  console.log(`Detected ${alerts.length} price drop! Saved: ₹${alerts[0].savedAmount} (${alerts[0].discountPercentage}% OFF)`);
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/wishlist demo   Run live wishlist & price drop demo');
  console.log('  npx @boostengine/wishlist help   Show help information\n');
}
