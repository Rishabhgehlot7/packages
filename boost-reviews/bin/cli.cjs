#!/usr/bin/env node

/**
 * @boostengine/reviews CLI Tool v1.1.0
 */

const args = process.argv.slice(2);
const command = args[0] || '--help';

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const item = argv[i];
    if (item.startsWith('--')) {
      const key = item.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

const flags = parseFlags(args.slice(1));

async function main() {
  console.log('\n⭐ @boostengine/reviews CLI v1.1.0\n');
  const { ReviewsEngine } = require('../dist/index.cjs');

  switch (command) {
    case 'demo': {
      const sampleReviews = [
        { id: '1', productId: 'p1', author: 'Rahul', rating: 5, body: 'Super fast shipping and great quality!', verifiedBuyer: true, createdAt: '2026-09-01' },
        { id: '2', productId: 'p1', author: 'Anjali', rating: 5, body: 'Fabric is so premium, fit is comfortable.', verifiedBuyer: true, createdAt: '2026-09-02' },
        { id: '3', productId: 'p1', author: 'Amit', rating: 4, body: 'Worth the price, nice color.', verifiedBuyer: true, createdAt: '2026-09-03' },
        { id: '4', productId: 'p1', author: 'Pooja', rating: 5, body: 'Best purchase ever, highly recommend!', verifiedBuyer: true, createdAt: '2026-09-04' },
      ];

      console.log('📊 Review Statistics:');
      const breakdown = ReviewsEngine.calculateBreakdown(sampleReviews);
      console.log(`  Average Rating: ⭐ ${breakdown.average} / 5.0`);
      console.log(`  Total Reviews: ${breakdown.totalCount}`);
      console.log(`  Recommendation Rate: ${breakdown.recommendationPercentage}%\n`);

      console.log('🤖 AI Sentiment Analysis:');
      const sentiment = ReviewsEngine.analyzeSentiment(sampleReviews);
      console.log(`  Satisfaction Score: ${sentiment.score} / 100`);
      console.log(`  Positive Feedback: ${sentiment.positivePercentage}%`);
      console.log(`  Consensus Highlights: ${sentiment.consensusHighlights.join(' | ')}`);
      console.log(`  AI Summary: "${sentiment.summary}"\n`);
      break;
    }

    case 'moderate': {
      const text = flags.text || args.slice(1).join(' ');
      if (!text) {
        console.error('❌ Error: Missing text. Usage: npx boost-reviews moderate --text "Superb quality!"');
        process.exit(1);
      }
      console.log(`🔍 Moderating text: "${text}"\n`);
      const result = ReviewsEngine.moderateReview(text);
      console.log('Result:', JSON.stringify(result, null, 2));
      break;
    }

    case 'jsonld': {
      const product = flags.product || 'Premium Sneaker';
      const rating = Number(flags.rating) || 4.8;
      const count = Number(flags.count) || 120;

      const mockData = Array.from({ length: 5 }, (_, i) => ({
        id: `r${i}`,
        productId: 'p1',
        author: `Buyer ${i + 1}`,
        rating: 5,
        body: 'Great product, matches description.',
        verifiedBuyer: true,
        createdAt: '2026-09-01',
      }));

      const jsonld = ReviewsEngine.generateFullJSONLD({
        product: {
          name: product,
          price: 1999,
          currency: 'INR',
        },
        reviews: mockData,
      });

      console.log('🌐 Google Search Schema.org JSON-LD:\n');
      console.log(JSON.stringify(jsonld, null, 2));
      console.log('\n💡 Paste this inside <script type="application/ld+json"> on your product page.\n');
      break;
    }

    case 'mock': {
      const count = Number(flags.count) || 5;
      console.log(`🎲 Generating ${count} realistic mock reviews:\n`);
      const authors = ['Aarav', 'Diya', 'Kabir', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Pooja'];
      const comments = [
        'Superb build quality, matches photo exactly.',
        'Extremely comfortable and delivered in 2 days.',
        'Good value for money, stitching is very neat.',
        'Fitting was perfect, fabric feels luxurious.',
      ];

      const generated = Array.from({ length: count }, (_, i) => ({
        id: `mock_${Date.now()}_${i}`,
        productId: 'PROD_MOCK_101',
        author: authors[i % authors.length],
        rating: (i % 5 === 0 ? 4 : 5),
        body: comments[i % comments.length],
        verifiedBuyer: true,
        helpfulVotes: Math.floor(Math.random() * 20),
        unhelpfulVotes: 0,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      }));

      console.log(JSON.stringify(generated, null, 2));
      break;
    }

    case '--help':
    default: {
      console.log('Available Commands:');
      console.log('  demo                                Run interactive ratings & AI sentiment demo');
      console.log('  moderate --text "<content>"         Audit text for abusive profanity and spam links');
      console.log('  jsonld   --product "<name>"         Generate Google Rich Snippets Schema.org JSON-LD');
      console.log('  mock     --count <number>           Generate mock reviews for UI/frontend dev');
      console.log('  --help                              Show this help menu\n');
      break;
    }
  }
}

main().catch((err) => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
