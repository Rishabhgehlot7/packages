#!/usr/bin/env node

const { calculateBundlePrice, calculateVolumeTierPrice } = require('../dist/index.js');

console.log('\x1b[35m⚡ BoostEngine Bundles CLI v1.1.0\x1b[0m\n');

const demoBundle = {
  id: 'demo-fbt-1',
  title: 'Urban Streetwear 3-Piece Kit',
  type: 'frequently_bought_together',
  discountType: 'percentage',
  discountValue: 20,
  items: [
    { id: '1', productId: 'p1', title: 'Oversized Cotton Tee', price: 999, isRequired: true },
    { id: '2', productId: 'p2', title: 'Cargo Joggers', price: 1999, isDefaultSelected: true },
    { id: '3', productId: 'p3', title: 'Embroidered Cap', price: 499, isDefaultSelected: true },
  ],
};

const result = calculateBundlePrice(demoBundle);

console.log(`📦 Bundle: \x1b[1m${result.bundleTitle}\x1b[0m`);
console.log(`💵 Original Price: ₹${result.originalTotal}`);
console.log(`🎉 Deal Price: \x1b[32m₹${result.discountedTotal}\x1b[0m`);
console.log(`💰 You Save: \x1b[33m₹${result.savingsAmount} (${result.savingsPercentage}% OFF)\x1b[0m\n`);

console.log('Included Items:');
result.items.forEach((item) => {
  console.log(`  ✔ ${item.title} — ₹${item.finalPrice} (was ₹${item.price})`);
});

console.log('\n\x1b[36m⚡ Visit https://boostengine-docs.netlify.app/ for full documentation.\x1b[0m\n');
