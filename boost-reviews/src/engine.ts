import {
  ProductReview,
  RatingBreakdown,
  ReviewFilterOptions,
} from './types';

export class ReviewsEngine {
  /**
   * Computes statistical star ratings, distribution, and recommendation percentage
   */
  static calculateBreakdown(reviews: ProductReview[]): RatingBreakdown {
    const totalCount = reviews.length;

    if (totalCount === 0) {
      return {
        average: 0,
        totalCount: 0,
        distribution: {
          5: { count: 0, percentage: 0 },
          4: { count: 0, percentage: 0 },
          3: { count: 0, percentage: 0 },
          2: { count: 0, percentage: 0 },
          1: { count: 0, percentage: 0 },
        },
        recommendationPercentage: 0,
      };
    }

    const counts: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    let recommendedCount = 0;

    for (const r of reviews) {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rating]++;
      sum += rating;
      if (rating >= 4) {
        recommendedCount++;
      }
    }

    const average = Math.round((sum / totalCount) * 10) / 10;
    const recommendationPercentage = Math.round((recommendedCount / totalCount) * 100);

    return {
      average,
      totalCount,
      distribution: {
        5: { count: counts[5], percentage: Math.round((counts[5] / totalCount) * 100) },
        4: { count: counts[4], percentage: Math.round((counts[4] / totalCount) * 100) },
        3: { count: counts[3], percentage: Math.round((counts[3] / totalCount) * 100) },
        2: { count: counts[2], percentage: Math.round((counts[2] / totalCount) * 100) },
        1: { count: counts[1], percentage: Math.round((counts[1] / totalCount) * 100) },
      },
      recommendationPercentage,
    };
  }

  /**
   * Filters and sorts reviews with pinned reviews prioritized
   */
  static filterAndSort(reviews: ProductReview[], options: ReviewFilterOptions = {}): ProductReview[] {
    let filtered = [...reviews];

    // Filter by rating
    if (options.rating !== undefined) {
      filtered = filtered.filter((r) => Math.round(r.rating) === options.rating);
    }

    // Filter verified buyers only
    if (options.verifiedOnly) {
      filtered = filtered.filter((r) => r.verifiedBuyer);
    }

    // Filter with media only
    if (options.withMediaOnly) {
      filtered = filtered.filter(
        (r) => (r.images && r.images.length > 0) || (r.videos && r.videos.length > 0)
      );
    }

    // Sort reviews
    const sortBy = options.sortBy || 'recent';
    filtered.sort((a, b) => {
      // Pinned reviews always appear first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'most_helpful') {
        const netA = (a.helpfulVotes || 0) - (a.unhelpfulVotes || 0);
        const netB = (b.helpfulVotes || 0) - (b.unhelpfulVotes || 0);
        return netB - netA;
      }
      // 'recent' default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const offset = options.offset || 0;
    const limit = options.limit || filtered.length;
    return filtered.slice(offset, offset + limit);
  }

  /**
   * Helper to instantiate a valid sanitized ProductReview object
   */
  static createReview(params: {
    productId: string;
    author: string;
    rating: number;
    title?: string;
    body: string;
    verifiedBuyer?: boolean;
    images?: string[];
    videos?: string[];
  }): ProductReview {
    const rating = Math.min(5, Math.max(1, Math.round(params.rating)));
    if (!params.author.trim()) throw new Error('Author name is required');
    if (!params.body.trim()) throw new Error('Review content is required');

    return {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      productId: params.productId,
      author: params.author.trim(),
      rating,
      title: params.title?.trim(),
      body: params.body.trim(),
      verifiedBuyer: Boolean(params.verifiedBuyer),
      images: params.images || [],
      videos: params.videos || [],
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Formats reviews directly into Schema.org AggregateRating and Review snippets
   */
  static toSchemaOrg(reviews: ProductReview[]) {
    const breakdown = this.calculateBreakdown(reviews);
    if (breakdown.totalCount === 0) return null;

    return {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: breakdown.average,
        reviewCount: breakdown.totalCount,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.slice(0, 10).map((r) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          '@type': 'Person',
          name: r.author,
        },
        reviewBody: r.body,
        datePublished: r.createdAt.split('T')[0],
      })),
    };
  }
}
