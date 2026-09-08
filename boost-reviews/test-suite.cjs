const assert = require('assert');
const { ReviewsEngine } = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/reviews Test Suite...\n');

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

const mockReviews = [
  {
    id: 'r1',
    productId: 'p1',
    author: 'Aarav M.',
    rating: 5,
    body: 'Exceptional build quality and fast shipping!',
    verifiedBuyer: true,
    images: ['https://example.com/r1.jpg'],
    helpfulVotes: 12,
    unhelpfulVotes: 1,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'r2',
    productId: 'p1',
    author: 'Sneha P.',
    rating: 4,
    body: 'Good product, fitting is slightly snug.',
    verifiedBuyer: true,
    helpfulVotes: 5,
    unhelpfulVotes: 0,
    createdAt: '2026-09-02T12:00:00Z',
  },
  {
    id: 'r3',
    productId: 'p1',
    author: 'Rohan K.',
    rating: 5,
    body: 'Hands down the best purchase this year!',
    verifiedBuyer: false,
    isPinned: true, // Pinned!
    helpfulVotes: 30,
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'r4',
    productId: 'p1',
    author: 'Ananya D.',
    rating: 2,
    body: 'Did not match the color shown in photos.',
    verifiedBuyer: true,
    helpfulVotes: 2,
    unhelpfulVotes: 4,
    createdAt: '2026-09-03T14:00:00Z',
  },
];

// Test 1: Rating Breakdown & Average
test('Rating breakdown and statistical distribution', () => {
  const breakdown = ReviewsEngine.calculateBreakdown(mockReviews);

  // Sum = 5 + 4 + 5 + 2 = 16 / 4 = 4.0
  assert.strictEqual(breakdown.average, 4.0);
  assert.strictEqual(breakdown.totalCount, 4);
  assert.strictEqual(breakdown.distribution[5].count, 2);
  assert.strictEqual(breakdown.distribution[5].percentage, 50);
  assert.strictEqual(breakdown.distribution[4].count, 1);
  assert.strictEqual(breakdown.distribution[4].percentage, 25);
  assert.strictEqual(breakdown.distribution[2].count, 1);
  assert.strictEqual(breakdown.distribution[2].percentage, 25);
  // 3 out of 4 are >= 4 stars -> 75%
  assert.strictEqual(breakdown.recommendationPercentage, 75);
});

// Test 2: Pinned Review Priority & Sorting
test('Pinned review always appears first regardless of sort', () => {
  const sorted = ReviewsEngine.filterAndSort(mockReviews, { sortBy: 'recent' });
  assert.strictEqual(sorted[0].id, 'r3', 'Pinned review r3 should be index 0');
});

// Test 3: Verified Only Filter
test('Verified buyer only filtering', () => {
  const verified = ReviewsEngine.filterAndSort(mockReviews, { verifiedOnly: true });
  assert.strictEqual(verified.length, 3);
  assert.ok(verified.every(r => r.verifiedBuyer));
});

// Test 4: With Media Only Filter
test('Media only filtering', () => {
  const withMedia = ReviewsEngine.filterAndSort(mockReviews, { withMediaOnly: true });
  assert.strictEqual(withMedia.length, 1);
  assert.strictEqual(withMedia[0].id, 'r1');
});

// Test 5: Review Creation Helper
test('Review creation and validation', () => {
  const newRev = ReviewsEngine.createReview({
    productId: 'p10',
    author: 'Kunal G.',
    rating: 6, // Should clamp to 5
    body: 'Great!',
    verifiedBuyer: true,
  });

  assert.strictEqual(newRev.rating, 5);
  assert.strictEqual(newRev.author, 'Kunal G.');
  assert.ok(newRev.id.startsWith('rev_'));
  assert.strictEqual(newRev.helpfulVotes, 0);
});

// Test 6: Schema.org Output
test('Schema.org aggregateRating payload generation', () => {
  const schema = ReviewsEngine.toSchemaOrg(mockReviews);
  assert.ok(schema);
  assert.strictEqual(schema.aggregateRating['@type'], 'AggregateRating');
  assert.strictEqual(schema.aggregateRating.ratingValue, 4.0);
  assert.strictEqual(schema.aggregateRating.reviewCount, 4);
});

console.log(`\n🎉 All ${passed} tests in @boostengine/reviews passed successfully!\n`);
