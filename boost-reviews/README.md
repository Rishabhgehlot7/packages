# @boostengine/reviews 🌟

[![npm version](https://img.shields.io/npm/v/@boostengine/reviews.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/reviews)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/reviews.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/reviews)
[![license](https://img.shields.io/npm/l/@boostengine/reviews.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Social Proof](https://img.shields.io/badge/Social%20Proof-Verified%20Buyer%20Badges-amber.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **High-converting customer review and social proof engine for eCommerce. Computes star rating aggregates, 5-to-1 star distribution bars, verified buyer badges, helpful upvotes, and customer photo attachments.**

Zero external dependencies. Works on Node.js, Next.js, and client-side React.

---

## 📸 Visual Ratings & Review Breakdown Preview

```text
  Customer Reviews & Ratings (142 Reviews)
  ─────────────────────────────────────────────────────────────
  Average Rating: 4.8 / 5 ⭐⭐⭐⭐⭐
  
  5 Star  [========================================= ] 85% (121)
  4 Star  [=====                                     ] 10%  (14)
  3 Star  [=                                         ]  3%   (4)
  2 Star  [                                          ]  1%   (2)
  1 Star  [                                          ]  1%   (1)
  ─────────────────────────────────────────────────────────────
  
  ⭐⭐⭐⭐⭐ 5.0 | Reviewed by Rahul M. [✓ Verified Buyer]
  "Best heavyweight oversized tee I've bought! Quality is 10/10."
  📸 Attached Photos: [Image 1] [Image 2]
  👍 Helpful (28)  •  Report
```

---

## 🌟 Key Highlights

- **⭐ Star Aggregates & Math**: Accurately computes weighted averages (e.g. 4.8 / 5.0) and rounded percentage distribution for 1-5 star bars.
- **🛡️ Verified Buyer Verification**: Ensures authenticity badges (`[✓ Verified Buyer]`) are only awarded to real completed orders.
- **👍 Helpful Upvotes & Sorting**: Sort reviews by `highest_rated`, `most_recent`, or `most_helpful`.
- **📸 User Generated Content (UGC)**: First-class support for customer photo reviews.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/reviews

# pnpm
pnpm add @boostengine/reviews

# yarn
yarn add @boostengine/reviews
```

---

## 🚀 Quickstart Guide

```typescript
import { ReviewEngine, type ProductReview } from '@boostengine/reviews';

const reviews: ProductReview[] = [
  {
    id: 'rev_01',
    productId: 'tee_black',
    userId: 'usr_1',
    userName: 'Rahul M.',
    rating: 5,
    title: 'Outstanding quality!',
    comment: 'The cotton is dense and the fit is genuinely oversized.',
    isVerifiedBuyer: true,
    helpfulVotes: 14,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rev_02',
    productId: 'tee_black',
    userId: 'usr_2',
    userName: 'Sneha P.',
    rating: 4,
    title: 'Great fit, fast delivery',
    comment: 'Loved the packaging. Delivered in 2 days.',
    isVerifiedBuyer: true,
    helpfulVotes: 6,
    createdAt: new Date().toISOString(),
  },
];

// 1. Calculate Ratings Summary
const summary = ReviewEngine.calculateSummary(reviews);

console.log(summary.averageRating); // 4.5
console.log(summary.totalReviews);  // 2
console.log(summary.distribution);
/*
{
  5: { count: 1, percentage: 50 },
  4: { count: 1, percentage: 50 },
  3: { count: 0, percentage: 0 },
  2: { count: 0, percentage: 0 },
  1: { count: 0, percentage: 0 }
}
*/

// 2. Sort Reviews
const sorted = ReviewEngine.sort(reviews, 'most_helpful');
console.log(sorted[0].userName); // "Rahul M." (14 helpful votes)
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
