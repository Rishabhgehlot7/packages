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
}
