#!/usr/bin/env node

const path = require('path');

let DealsEngine, BoostDealsManager, deals;
try {
  const pkg = require('../dist/index.js');
  DealsEngine = pkg.DealsEngine;
  BoostDealsManager = pkg.BoostDealsManager;
  deals = pkg.deals;
} catch (e) {
  console.log('\x1b[33m%s\x1b[0m', 'Note: Running CLI in development mode (build dist first via npm run build)');
}

const args = process.argv.slice(2);
const command = args[0] || 'demo';

console.log('\x1b[36m%s\x1b[0m', '⚡ @boostengine/deals CLI (v1.1.0)');
console.log('\x1b[90m%s\x1b[0m', 'Enterprise Deals, Flash Sales & BOGO Engine\n');

if (command === 'help' || command === '--help' || command === '-h') {
  console.log('Usage: boost-deals <command>\n');
  console.log('Commands:');
  console.log('  demo       Run interactive simulation of Flash Sale, BOGO & Cart Deals');
  console.log('  evaluate   Evaluate a sample cart with volume discounts');
  console.log('  help       Show this help message\n');
  process.exit(0);
}

if (!deals) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Package dist not found. Please run "npm run build" first.');
  process.exit(1);
}

if (command === 'demo' || command === 'evaluate') {
  console.log('\x1b[32m%s\x1b[0m', '🚀 Initializing Demo Promotions & Flash Sales...\n');

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // 1. Flash Sale Deal
  deals.registerDeal({
    id: 'deal_flash_headphones',
    title: 'Midnight Flash Sale: Wireless ANC Headphones',
    type: 'flash_sale',
    discountValue: 40, // 40% OFF
    startDate: yesterday,
    endDate: tomorrow,
    applicableProductIds: ['prod_headphones'],
    totalClaimLimit: 100,
    claimedCount: 78
  });

  // 2. BOGO Deal
  deals.registerDeal({
    id: 'deal_bogo_tees',
    title: 'Buy 2 Get 1 FREE on Summer Tees',
    type: 'bogo',
    discountValue: 0,
    startDate: yesterday,
    endDate: tomorrow,
    applicableProductIds: ['prod_tshirt'],
    bogoRule: {
      buyQuantity: 2,
      getQuantity: 1,
      discountPercentage: 100
    }
  });

  // 3. Cart Spend Threshold Deal
  deals.registerDeal({
    id: 'deal_spend_100',
    title: 'Orders Over $150 get $25 OFF',
    type: 'spend_threshold',
    discountValue: 25,
    startDate: yesterday,
    endDate: tomorrow,
    spendThreshold: {
      minimumSpend: 150,
      discountAmount: 25
    }
  });

  console.log('\x1b[33m%s\x1b[0m', 'Active Deals Registered:');
  deals.listActiveDeals().forEach(d => {
    const claim = DealsEngine.calculateClaimInfo(d.claimedCount, d.totalClaimLimit);
    const time = DealsEngine.calculateTimeRemaining(d.endDate);
    console.log(`  • [${d.type.toUpperCase()}] ${d.title}`);
    console.log(`    Claimed: ${claim.claimedCount}/${claim.totalLimit} (${claim.percentageClaimed}%) | Time Left: ${time.hours}h ${time.minutes}m ${time.seconds}s`);
  });

  console.log('\n\x1b[33m%s\x1b[0m', 'Simulating Cart Evaluation:');
  const sampleCart = [
    { productId: 'prod_headphones', unitPrice: 150, quantity: 1, title: 'Wireless ANC Headphones' },
    { productId: 'prod_tshirt', unitPrice: 20, quantity: 3, title: 'Graphic Cotton T-Shirt' }
  ];

  console.log('Cart Items:');
  sampleCart.forEach(i => console.log(`  - ${i.title} x${i.quantity} @ $${i.unitPrice} = $${i.unitPrice * i.quantity}`));

  const result = deals.evaluateCartDeals(sampleCart);
  console.log('\n\x1b[32m%s\x1b[0m', 'Promotion Results:');
  console.log(`  Original Subtotal:   $${result.originalSubtotal.toFixed(2)}`);
  console.log(`  Total Savings:       -$${result.totalSavings.toFixed(2)}`);
  console.log(`  Final Pay Subtotal:  $${result.discountedSubtotal.toFixed(2)}`);
  console.log('\nApplied Deals:');
  result.appliedDeals.forEach(a => {
    console.log(`  ✓ ${a.dealTitle} -> Saved $${a.discountAmount.toFixed(2)} (${a.details})`);
  });

  console.log('\n\x1b[36m%s\x1b[0m', '✨ Demo complete! BoostDeals is ready for high-conversion commerce.');
} else {
  console.log(`Unknown command: ${command}. Type "boost-deals help" for options.`);
}
