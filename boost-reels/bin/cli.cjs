#!/usr/bin/env node

const { formatVideoTime, calculateReelConversionRate } = require('../dist/index.js');

console.log('\x1b[35m⚡ BoostEngine Reels & Stories CLI v1.1.0\x1b[0m\n');

const mockEvents = [
  { reelId: 'r1', eventType: 'reel_view', timestamp: Date.now() },
  { reelId: 'r1', eventType: 'reel_view', timestamp: Date.now() },
  { reelId: 'r1', eventType: 'reel_view', timestamp: Date.now() },
  { reelId: 'r1', eventType: 'product_tag_click', timestamp: Date.now() },
  { reelId: 'r1', eventType: 'product_add_to_cart', timestamp: Date.now() },
  { reelId: 'r1', eventType: 'product_buy_now', timestamp: Date.now() },
];

const stats = calculateReelConversionRate(mockEvents);

console.log('📊 Demo Video Reel Analytics:');
console.log(`  ⏱️ Formatted Length: ${formatVideoTime(84)} (84s)`);
console.log(`  👁️ Total Views: ${stats.views}`);
console.log(`  🏷️ Product Clicks: ${stats.productClicks} (${stats.clickThroughRatePct}% CTR)`);
console.log(`  🛒 Cart Adds: ${stats.cartAdds} (${stats.cartConversionRatePct}% Add-to-Cart)`);
console.log(`  💳 Orders: ${stats.buys} (\x1b[32m${stats.buyConversionRatePct}% Buy Conversion\x1b[0m)`);

console.log('\n\x1b[36m⚡ Visit https://boostengine-docs.netlify.app/ for full documentation.\x1b[0m\n');
