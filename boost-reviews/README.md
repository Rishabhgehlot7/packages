# @boostengine/reviews ⭐

> **High-Converting Social Proof & Product Review Engine with Star Aggregates, Verified Buyer Badges, Helpful Upvoting, Sentiment & Media Support.**

Zero external dependencies, built for maximum SEO trust and eCommerce conversion optimization.

---

## 🌟 Key Features

- **⭐ Rating Statistics & Distribution**: Calculates rounded average rating (e.g. 4.8 / 5.0), 1-to-5 star percentage breakdown, and customer recommendation rate.
- **🛡️ Verified Buyer Verification**: Distinct badge attribution for verified purchasers.
- **📌 Merchant Controls**: Pin exceptional customer reviews to the top and attach official store responses.
- **🖼️ Photo & Video UGC**: Filter reviews containing images or unboxing videos.
- **👍 Helpful Upvoting**: Community-driven review voting system.
- **🔍 Schema.org Integration**: 1-click export to Google Rich Snippet `AggregateRating` and `Review` markup.

---

## 📦 Installation

```bash
npm install @boostengine/reviews
```

---

## 🚀 Quickstart

```typescript
import { ReviewsEngine, ProductReview } from '@boostengine/reviews';

const reviews: ProductReview[] = [
  {
    id: 'rev_1',
    productId: 'prod_tee',
    author: 'Aarav M.',
    rating: 5,
    body: 'Exceptional build quality and super fast shipping!',
    verifiedBuyer: true,
    helpfulVotes: 15,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'rev_2',
    productId: 'prod_tee',
    author: 'Neha S.',
    rating: 4,
    body: 'Great fit and fabric.',
    verifiedBuyer: true,
    helpfulVotes: 4,
    createdAt: '2026-09-02T10:00:00Z',
  }
];

// 1. Calculate statistical breakdown
const stats = ReviewsEngine.calculateBreakdown(reviews);

console.log(stats.average); // 4.5
console.log(stats.totalCount); // 2
console.log(stats.recommendationPercentage); // 100%
console.log(stats.distribution[5].percentage); // 50%

// 2. Filter & Sort reviews (e.g. verified only, sorted by most helpful)
const displayList = ReviewsEngine.filterAndSort(reviews, {
  verifiedOnly: true,
  sortBy: 'most_helpful',
  limit: 10,
});

// 3. Export to Schema.org JSON-LD for SEO
const jsonLd = ReviewsEngine.toSchemaOrg(reviews);
```

---

## 🛠️ CLI Utilities

```bash
# Run interactive ratings breakdown demo
npx @boostengine/reviews demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
