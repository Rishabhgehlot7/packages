#!/usr/bin/env node
console.log('\n🔍 @boostengine/search - Typo-Tolerant Product Search & Filter Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'demo') {
  const { BoostSearchEngine } = require('../dist/index.cjs');

  const products = [
    { id: '1', title: 'Cyberpunk Heavyweight Hoodie', brand: 'Boost', price: 2499, inStock: true },
    { id: '2', title: 'Japanese Streetwear Graphic Tee', brand: 'Boost', price: 799, inStock: true },
    { id: '3', title: 'Vintage Leather Bomber Jacket', brand: 'Retro', price: 4999, inStock: false },
  ];

  console.log('Typo search for "hoddie":');
  const res = BoostSearchEngine.search(products, { query: 'hoddie' });
  console.log(`Found ${res.total} result(s): ${res.products.map(p => p.title).join(', ')}`);
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/search demo   Run live typo-tolerant search demo');
  console.log('  npx @boostengine/search help   Show help information\n');
}
