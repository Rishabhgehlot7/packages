export type ReviewStatus = 'approved' | 'pending' | 'rejected' | 'pinned';

export interface ReviewMerchantReply {
  author: string;
  body: string;
  date: string; // ISO date
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1 to 5 integer
  title?: string;
  body: string;
  verifiedBuyer: boolean;
  images?: string[];
  videos?: string[];
  helpfulVotes?: number;
  unhelpfulVotes?: number;
  merchantReply?: ReviewMerchantReply;
  isPinned?: boolean;
  status?: ReviewStatus;
  sentiment?: 'positive' | 'neutral' | 'negative';
  createdAt: string; // ISO string
}

export interface RatingBucket {
  count: number;
  percentage: number;
}

export interface RatingBreakdown {
  average: number; // rounded to 1 decimal place (e.g. 4.8)
  totalCount: number;
  distribution: {
    5: RatingBucket;
    4: RatingBucket;
    3: RatingBucket;
    2: RatingBucket;
    1: RatingBucket;
  };
  recommendationPercentage: number; // percentage of 4 & 5 star reviews
}

export interface ReviewFilterOptions {
  rating?: number;
  verifiedOnly?: boolean;
  withMediaOnly?: boolean;
  sortBy?: 'recent' | 'highest' | 'lowest' | 'most_helpful';
  limit?: number;
  offset?: number;
  searchQuery?: string;
}

// ----------------- AI Sentiment & Highlights -----------------
export interface ReviewSentimentSummary {
  score: number; // 0 to 100
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  topPositiveTags: string[];
  topNegativeTags: string[];
  consensusHighlights: string[];
  summary: string; // 1-2 sentence AI summary
}

// ----------------- Moderation & Spam Guard -----------------
export interface ReviewModerationResult {
  approved: boolean;
  flagged: boolean;
  reasons: string[];
  sanitizedText: string;
  profanityCount: number;
}

// ----------------- Loyalty & Rewards Bridge -----------------
export interface ReviewIncentiveConfig {
  textRewardPoints?: number; // e.g. 50 pts
  photoRewardPoints?: number; // e.g. 100 pts
  videoRewardPoints?: number; // e.g. 200 pts
  minWordCount?: number; // default 5 words
}

export interface ReviewIncentiveReward {
  eligible: boolean;
  totalPoints: number;
  breakdown: {
    text: number;
    photo: number;
    video: number;
  };
  reasons: string[];
}

// ----------------- Schema.org Google Rich Snippet -----------------
export interface GoogleProductJSONLD {
  '@context': 'https://schema.org' | string;
  '@type': 'Product' | string;
  name: string;
  image?: string | string[];
  description?: string;
  brand?: {
    '@type': 'Brand' | string;
    name: string;
  };
  offers?: {
    '@type': 'Offer' | string;
    priceCurrency: string;
    price: number | string;
    availability?: string;
  };
  aggregateRating: {
    '@type': 'AggregateRating' | string;
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  review?: Array<{
    '@type': 'Review' | string;
    reviewRating: {
      '@type': 'Rating' | string;
      ratingValue: number;
      bestRating?: number;
      worstRating?: number;
    };
    author: {
      '@type': 'Person' | string;
      name: string;
    };
    reviewBody: string;
    datePublished: string;
  }>;
}

// ----------------- Review Submission Input -----------------
export interface ReviewSubmissionInput {
  productId: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  verifiedBuyer?: boolean;
  images?: string[];
  videos?: string[];
}
