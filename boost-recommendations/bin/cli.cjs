#!/usr/bin/env node

console.log('\x1b[36m%s\x1b[0m', '🧠 @boostengine/recommendations CLI (v1.1.0)');
console.log('\x1b[90m%s\x1b[0m', 'Enterprise FBT Bundles, Collaborative Filtering & Upsells\n');

const args = process.argv.slice(2);
const command = args[0] || 'demo';

if (command === 'help' || command === '--help' || command === '-h') {
  console.log('Usage: boost-recommendations <command>\n');
  console.log('Commands:');
  console.log('  demo     Run interactive simulation of FBT Bundles, Cross-Sells & Collaborative Filtering');
  console.log('  help     Show this help message\n');
  process.exit(0);
}

let RecommendationsEngine, BoostRecommendationsManager, recommendations;
try {
  const pkg = require('../dist/index.js');
  RecommendationsEngine = pkg.RecommendationsEngine;
  BoostRecommendationsManager = pkg.BoostRecommendationsManager;
  recommendations = pkg.recommendations;
} catch (e) {
  console.log('\x1b[31m%s\x1b[0m', 'Error: dist not found. Please run "npm run build" first.');
  process.exit(1);
}

if (command === 'demo') {
  console.log('\x1b[32m%s\x1b[0m', '🚀 Initializing Recommendations Engine...\n');

  const sampleCatalog = [
    { id: 'phone', title: 'Flagship Smartphone Pro (128GB)', price: 69999, category: 'Electronics', tags: ['mobile', 'gadget'], rating: 4.8 },
    { id: 'phone_pro', title: 'Flagship Smartphone Pro Max (512GB)', price: 89999, category: 'Electronics', tags: ['mobile', 'gadget', 'premium'], rating: 4.9 },
    { id: 'case', title: 'Magnetic Shockproof Armor Case', price: 999, category: 'Electronics', tags: ['accessory', 'mobile', 'protection'], rating: 4.5 },
    { id: 'charger', title: '65W Fast GaN Wall Charger', price: 1499, category: 'Electronics', tags: ['accessory', 'charger', 'mobile'], rating: 4.7 },
    { id: 'buds', title: 'Wireless ANC Earbuds', price: 4999, category: 'Electronics', tags: ['audio', 'mobile', 'accessory'], rating: 4.6 },
  ];

  const mgr = new BoostRecommendationsManager();
  mgr.setCatalog(sampleCatalog);

  // Train transaction orders
  mgr.recordOrders([
    { productIds: ['phone', 'case', 'charger'] },
    { productIds: ['phone', 'case', 'buds'] },
    { productIds: ['phone', 'case'] },
  ]);

  // 1. Frequently Bought Together
  console.log('\x1b[33m%s\x1b[0m', '1. Frequently Bought Together (FBT) Bundle:');
  const bundle = mgr.getFrequentlyBoughtTogether(sampleCatalog[0], sampleCatalog, { maxItems: 2, discountPercentage: 10 });
  console.log(`  Main: ${bundle.mainProduct.title} (₹${bundle.mainProduct.price})`);
  bundle.bundleItems.forEach((b) => console.log(`  + Add-on: ${b.title} (₹${b.price})`));
  console.log(`  Total Regular: ₹${bundle.totalRegularPrice} -> Bundle Deal: ₹${bundle.bundlePrice} (Save ₹${bundle.savingsAmount} - ${bundle.bundleDiscountPercentage}% OFF!)\n`);

  // 2. Cart Cross-Sells
  console.log('\x1b[33m%s\x1b[0m', '2. Cart Cross-Sells (Impulse Add-ons):');
  const cartItems = [{ id: 'phone', category: 'Electronics', price: 69999 }];
  const crossSells = mgr.getCartCrossSells(cartItems, sampleCatalog, { limit: 2 });
  crossSells.forEach((c) => {
    console.log(`  ✨ ${c.item.title} @ ₹${c.item.price} (${c.reason})`);
  });

  // 3. Product Upgrades
  console.log('\x1b[33m%s\x1b[0m', '\n3. Smart Product Upgrade (Upsell):');
  const upgrades = mgr.getUpgrades(sampleCatalog[0], sampleCatalog, { limit: 1 });
  if (upgrades.length > 0) {
    const up = upgrades[0];
    console.log(`  ⭐ Upgrade to: ${up.upgradedProduct.title}`);
    console.log(`     Price Difference: +₹${up.priceDifference} (+${up.percentagePriceIncrease}%) | Rating: ${up.upgradedProduct.rating}★\n`);
  }

  console.log('\x1b[36m%s\x1b[0m', '✨ Demo complete! BoostRecommendations is ready for maximum average order value.');
}
