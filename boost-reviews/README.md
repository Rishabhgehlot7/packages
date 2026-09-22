# @boostengine/reviews 🌟

[![npm version](https://img.shields.io/npm/v/@boostengine/reviews.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/reviews)
[![license](https://img.shields.io/npm/l/@boostengine/reviews.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Social Proof](https://img.shields.io/badge/Social%20Proof-Verified%20Buyer%20Badges-amber.svg?style=flat-square)](https://github.com/boostengine/boostengine)
[![Frameworks](https://img.shields.io/badge/Frameworks-Next.js%20%7C%20React%20%7C%20React%20Native%20%7C%20Vite%20%7C%20Node-8a2be2.svg?style=flat-square)](https://nodejs.org/)
[![AI Ready](https://img.shields.io/badge/AI%20Agent-OpenAI%20%7C%20Claude%20%7C%20Gemini%20%7C%20Vercel%20AI-orange.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Industry-King Social Proof, UGC Media & AI-Powered Product Review Engine for Modern eCommerce.**  
> Computes **weighted star rating aggregates**, **1-to-5 star distribution bars**, **verified buyer badges**, **AI sentiment analysis & consensus tags**, **automated profanity & spam moderation**, **Google Search Schema.org JSON-LD**, **loyalty reward points calculation**, **AI Agent Toolkits**, and **Universal React & React Native hooks**.

---

## 📸 Visual Social Proof Preview

```text
  Customer Reviews & Ratings (142 Reviews)
  ─────────────────────────────────────────────────────────────
  Average Rating: 4.8 / 5 ⭐⭐⭐⭐⭐  (89% would recommend)
  
  5 Star  [========================================= ] 85% (121)
  4 Star  [=====                                     ] 10%  (14)
  3 Star  [=                                         ]  3%   (4)
  2 Star  [                                          ]  1%   (2)
  1 Star  [                                          ]  1%   (1)
  ─────────────────────────────────────────────────────────────
  🤖 AI Highlights: "True to size" • "Premium fabric" • "Fast shipping"
  
  ⭐⭐⭐⭐⭐ 5.0 | Reviewed by Rahul M. [✓ Verified Buyer]
  "Best heavyweight oversized tee I've bought! Quality is 10/10."
  📸 Attached Photos: [Image 1] [Image 2]
  👍 Helpful (28)  •  Report
```

---

## 🌟 Key Superpowers

- **⭐ Star Breakdown & Math**: Calculates precise average ratings (e.g. 4.8 / 5.0) and percentage distribution across 1 to 5 star buckets.
- **🤖 AI Sentiment Analysis**: Automatically detects positive %, neutral %, negative %, extract consensus tags ("True to size", "Quality fabric"), and generates a 1-paragraph summary for product hero sections.
- **🛡️ Profanity & Spam Guard**: Censorship for offensive words and suppression of external promotional links or character spam.
- **🌐 Google Search Rich Snippets (SEO)**: Generates Schema.org `Product` & `AggregateRating` JSON-LD so star ratings appear directly in Google search results.
- **🎁 Loyalty Rewards Bridge**: Automatically calculates loyalty points/cashback incentives for detailed reviews, photo uploads, and video uploads.
- **👍 Deduplicated Helpful Voting**: Manages helpful vs unhelpful votes with user session deduplication.
- **🤖 AI Agent Toolkit**: Turnkey tools for OpenAI, Anthropic Claude, Google Gemini, and Vercel AI SDK.
- **📱 Universal React & React Native Hooks**: `useProductReviews()`, `useSubmitReview()`, and `useReviewBreakdown()`.

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

## ⚡ Quickstart Guide

```typescript
import { ReviewsEngine, type ProductReview } from '@boostengine/reviews';

const sampleReviews: ProductReview[] = [
  {
    id: 'rev_1',
    productId: 'sneaker_01',
    author: 'Aarav M.',
    rating: 5,
    title: 'Outstanding quality!',
    body: 'The build quality is exceptional and shipping was within 2 days.',
    verifiedBuyer: true,
    images: ['https://example.com/shoes.jpg'],
    helpfulVotes: 14,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rev_2',
    productId: 'sneaker_01',
    author: 'Sneha P.',
    rating: 4,
    title: 'Great fit',
    body: 'Loved the packaging. Fitting is slightly snug but comfortable.',
    verifiedBuyer: true,
    helpfulVotes: 6,
    createdAt: new Date().toISOString(),
  },
];

// 1. Calculate Ratings Breakdown
const breakdown = ReviewsEngine.calculateBreakdown(sampleReviews);
console.log(breakdown.average); // 4.5
console.log(breakdown.recommendationPercentage); // 100%

// 2. AI Sentiment & Highlights
const sentiment = ReviewsEngine.analyzeSentiment(sampleReviews);
console.log(sentiment.score); // 90
console.log(sentiment.consensusHighlights); // ['100% of buyers recommend this product', ...]
console.log(sentiment.summary); // 'Based on 2 verified reviews...'

// 3. Moderate Incoming Customer Review
const moderation = ReviewsEngine.moderateReview('This sneaker is amazing! Check out https://spam.com');
console.log(moderation.flagged); // true (blocked link)
console.log(moderation.sanitizedText); // 'This sneaker is amazing! Check out [link removed]'

// 4. Calculate Loyalty Reward Points
const reward = ReviewsEngine.calculateRewards(sampleReviews[0], {
  textRewardPoints: 50,
  photoRewardPoints: 100,
});
console.log(reward.totalPoints); // 150 points (50 text + 100 photo)
```

---

## 🌐 Google Search SEO Rich Snippet (JSON-LD)

Generate standard Schema.org JSON-LD to display gold stars and rating counts in Google Search results:

```typescript
import { ReviewsEngine } from '@boostengine/reviews';

const jsonld = ReviewsEngine.generateFullJSONLD({
  product: {
    name: 'Air Max Sneakers',
    price: 4999,
    currency: 'INR',
    brand: 'Nike',
    image: 'https://store.in/sneaker.jpg',
  },
  reviews: sampleReviews,
});
```

In Next.js App Router (`app/products/[id]/page.tsx`):
```tsx
export default function ProductPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      {/* Product Page UI */}
    </>
  );
}
```

---

## 🤖 AI Agent Toolkit (`@boostengine/reviews/agent`)

Ready-to-use function calling schemas for **OpenAI Assistants**, **Anthropic Claude**, **Google Gemini**, and **Vercel AI SDK**:

```typescript
import { ReviewsAgentToolkit } from '@boostengine/reviews/agent';

const toolkit = new ReviewsAgentToolkit();

// 1. OpenAI Function Calling Format
const openAITools = toolkit.getOpenAITools();

// 2. Anthropic Claude Tools Format
const claudeTools = toolkit.getAnthropicTools();

// 3. Google Gemini Function Declarations Format
const geminiTools = toolkit.getGeminiTools();

// 4. Vercel AI SDK Tools Format
const vercelTools = toolkit.getVercelAITools();

// 5. Execute Autonomous Agent Tool
const result = await toolkit.execute('analyze_product_reviews', {
  reviews: sampleReviews,
});
```

### Supported AI Agent Tools
- `analyze_product_reviews` — Statistical breakdown, sentiment score, and top consensus tags.
- `submit_customer_review` — Submit verified customer review with media and star rating.
- `moderate_review` — Scan review text for profanity, character spam, or malicious links.
- `generate_merchant_reply` — Generate a polite, empathetic merchant reply to customer reviews.
- `generate_rich_snippets` — Generate Google SEO Schema.org JSON-LD for rich star ratings.

---

## 📱 Universal React & React Native Hooks (`@boostengine/reviews/react`)

Works in **Next.js (Client Components)**, **Vite**, **React SPA**, and **React Native / Expo**:

### 1. `useProductReviews()` Hook

```tsx
import React from 'react';
import { useProductReviews } from '@boostengine/reviews/react';

export function ProductReviewsSection({ initialReviews }) {
  const {
    filteredReviews,
    breakdown,
    sentiment,
    setFilter,
    voteHelpful,
  } = useProductReviews(initialReviews);

  return (
    <div className="space-y-6">
      {/* Average Rating & AI Highlights */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-2xl font-bold">⭐ {breakdown.average} / 5.0</h3>
        <p className="text-sm text-gray-600">{breakdown.recommendationPercentage}% of buyers recommend this product</p>
        <p className="mt-2 text-sm italic text-blue-700 font-medium">"{sentiment.summary}"</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setFilter({ rating: 5 })}>5 Stars Only</button>
        <button onClick={() => setFilter({ withMediaOnly: true })}>With Photos</button>
        <button onClick={() => setFilter({ verifiedOnly: true })}>Verified Buyers</button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="border p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="font-semibold">{rev.author}</span>
              <span>⭐ {rev.rating}</span>
            </div>
            {rev.verifiedBuyer && <span className="text-xs text-green-600">✓ Verified Buyer</span>}
            <p className="mt-2">{rev.body}</p>
            <button
              onClick={() => voteHelpful(rev.id, 'current_user', true)}
              className="text-xs text-gray-500 mt-2"
            >
              👍 Helpful ({rev.helpfulVotes || 0})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. `useSubmitReview()` Hook

```tsx
import React from 'react';
import { useSubmitReview } from '@boostengine/reviews/react';

export function WriteReviewForm({ productId }) {
  const {
    rating, setRating,
    author, setAuthor,
    title, setTitle,
    body, setBody,
    isSubmitting,
    error,
    submitReview,
  } = useSubmitReview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitReview(productId, true);
    if (result) alert('Review submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your Name" />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
      </select>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review Headline" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience..." />
      <button type="submit" disabled={isSubmitting}>Submit Review</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

---

## 💻 Interactive Developer CLI (`boost-reviews`)

```bash
# Run interactive breakdown & AI sentiment demo
npx boost-reviews demo

# Audit text for abusive profanity and promotional spam
npx boost-reviews moderate --text "Superb quality and fast delivery!"

# Generate Google Rich Snippet JSON-LD
npx boost-reviews jsonld --product "Sneakers" --rating 4.8

# Generate realistic mock reviews for frontend testing
npx boost-reviews mock --count 5
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
