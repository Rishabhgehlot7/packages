const assert = require('assert');
const {
  formatVideoTime,
  calculateReelEngagementScore,
  calculateReelConversionRate,
  filterReelsByProduct,
  sortReelsByTrending,
  analyzeReelPerformanceTool,
  optimizeReelsFeedTool,
} = require('./dist/index.js');

console.log('🧪 Running @boostengine/reels complete test suite...\n');

try {
  // ── Test 1: Time Formatting ───────────────────────────────────────────────
  console.log('🔹 1. Testing Video Time Formatter...');
  assert.strictEqual(formatVideoTime(0), '00:00');
  assert.strictEqual(formatVideoTime(45), '00:45');
  assert.strictEqual(formatVideoTime(65), '01:05');
  assert.strictEqual(formatVideoTime(360), '06:00');
  console.log('✅ Video time formatting passed!');

  // ── Test 2: Conversion & Click-through Calculations ───────────────────────
  console.log('🔹 2. Testing Conversion & CTR Calculations...');
  const events = [
    { reelId: 'r1', eventType: 'reel_view', timestamp: 1 },
    { reelId: 'r1', eventType: 'reel_view', timestamp: 2 },
    { reelId: 'r1', eventType: 'reel_view', timestamp: 3 },
    { reelId: 'r1', eventType: 'reel_view', timestamp: 4 },
    { reelId: 'r1', eventType: 'product_tag_click', timestamp: 5 },
    { reelId: 'r1', eventType: 'product_add_to_cart', timestamp: 6 },
    { reelId: 'r1', eventType: 'product_buy_now', timestamp: 7 },
  ];

  const conv = calculateReelConversionRate(events);
  assert.strictEqual(conv.views, 4);
  assert.strictEqual(conv.productClicks, 1);
  assert.strictEqual(conv.cartAdds, 1);
  assert.strictEqual(conv.buys, 1);
  assert.strictEqual(conv.clickThroughRatePct, 25); // 1/4 = 25%
  assert.strictEqual(conv.buyConversionRatePct, 25);
  console.log('✅ Conversion & CTR analytics passed!');

  // ── Test 3: Product Tag Filtering for PDP ─────────────────────────────────
  console.log('🔹 3. Testing Product Tag Filtering for PDP...');
  const reels = [
    {
      id: 'r1',
      videoUrl: 'https://video1.mp4',
      title: 'Styling Streetwear',
      likesCount: 150,
      viewsCount: 2000,
      products: [{ id: 'p1', productId: 'p1', title: 'Tee', price: 999 }],
    },
    {
      id: 'r2',
      videoUrl: 'https://video2.mp4',
      title: 'Sneaker Review',
      likesCount: 500,
      viewsCount: 10000,
      products: [{ id: 'p2', productId: 'p2', title: 'Sneakers', price: 4999 }],
    },
  ];

  const filteredP1 = filterReelsByProduct(reels, 'p1');
  assert.strictEqual(filteredP1.length, 1);
  assert.strictEqual(filteredP1[0].id, 'r1');

  const filteredP2 = filterReelsByProduct(reels, 'p2');
  assert.strictEqual(filteredP2.length, 1);
  assert.strictEqual(filteredP2[0].id, 'r2');
  console.log('✅ Product Tag filtering passed!');

  // ── Test 4: Engagement Scoring & Trending Sort ────────────────────────────
  console.log('🔹 4. Testing Engagement Scoring & Trending Sort...');
  const sorted = sortReelsByTrending(reels, events);
  assert.strictEqual(sorted[0].id, 'r2'); // r2 has 500 likes & 10000 views
  console.log('✅ Engagement scoring and trending sorting passed!');

  // ── Test 5: AI Agent Tools ────────────────────────────────────────────────
  console.log('🔹 5. Testing AI Agent Reel Optimization Tools...');
  const agentPerf = analyzeReelPerformanceTool({ reel: reels[0], events });
  assert.strictEqual(agentPerf.reelId, 'r1');
  assert.strictEqual(agentPerf.verdict, 'High Converting');

  const agentFeed = optimizeReelsFeedTool({ reels, events });
  assert.strictEqual(agentFeed.recommendedOrder.length, 2);
  assert.strictEqual(agentFeed.recommendedOrder[0].id, 'r2');
  console.log('✅ AI Agent Tools passed!');

  console.log('\n🎉 ALL 5 TEST STAGES FOR @boostengine/reels PASSED (100% SUCCESS)!');
} catch (err) {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
}
