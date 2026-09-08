#!/usr/bin/env node
console.log('\n⭐ @boostengine/reviews - High-Converting Review & Social Proof Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'demo') {
  const { ReviewsEngine } = require('../dist/index.cjs');

  const sampleReviews = [
    { id: '1', productId: 'p1', author: 'Rahul', rating: 5, body: 'Super fast shipping!', verifiedBuyer: true, createdAt: '2026-09-01' },
    { id: '2', productId: 'p1', author: 'Anjali', rating: 5, body: 'Fabric is so premium.', verifiedBuyer: true, createdAt: '2026-09-02' },
    { id: '3', productId: 'p1', author: 'Amit', rating: 4, body: 'Worth the price.', verifiedBuyer: true, createdAt: '2026-09-03' },
  ];

  console.log('📊 Review Statistics Breakdown:');
  const breakdown = ReviewsEngine.calculateBreakdown(sampleReviews);
  console.log(`  Average Rating: ⭐ ${breakdown.average} / 5.0`);
  console.log(`  Total Reviews: ${breakdown.totalCount}`);
  console.log(`  Recommendation Rate: ${breakdown.recommendationPercentage}% would recommend\n`);

  console.log('🌟 5-star distribution: ' + breakdown.distribution[5].percentage + '%');
  console.log('🌟 4-star distribution: ' + breakdown.distribution[4].percentage + '%\n');
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/reviews demo   Run interactive ratings breakdown demo');
  console.log('  npx @boostengine/reviews help   Show help information\n');
}
