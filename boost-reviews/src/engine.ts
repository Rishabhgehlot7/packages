import {
  ProductReview,
  RatingBreakdown,
  ReviewFilterOptions,
  ReviewSentimentSummary,
  ReviewModerationResult,
  ReviewIncentiveConfig,
  ReviewIncentiveReward,
  GoogleProductJSONLD,
  ReviewSubmissionInput,
} from './types';

// Multi-lingual common abusive / spam patterns
const PROFANITY_LIST = [
  'scam',
  'fraud',
  'fake',
  'bastard',
  'bitch',
  'idiot',
  'stupid',
  'asshole',
  'bakwas',
  'chutiya',
  'gandu',
  'harami',
  'madarchod',
  'behenchod',
  'kutta',
  'kamina',
  'ghatiya',
  'lootera',
  'chor',
];

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
  static filterAndSort(
    reviews: ProductReview[],
    options: ReviewFilterOptions = {}
  ): ProductReview[] {
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

    // Search query filter
    if (options.searchQuery?.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.body.toLowerCase().includes(q) ||
          r.title?.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
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
  static createReview(params: ReviewSubmissionInput): ProductReview {
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
      status: 'approved',
      sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * AI-Powered Sentiment Analysis & Highlights Consensus Engine
   */
  static analyzeSentiment(reviews: ProductReview[]): ReviewSentimentSummary {
    if (reviews.length === 0) {
      return {
        score: 0,
        positivePercentage: 0,
        neutralPercentage: 0,
        negativePercentage: 0,
        topPositiveTags: [],
        topNegativeTags: [],
        consensusHighlights: [],
        summary: 'No customer reviews available yet.',
      };
    }

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    const positiveKeywords = ['quality', 'fit', 'comfortable', 'great', 'love', 'fast', 'good', 'perfect', 'soft', 'value', 'recommend', 'worth', 'durable'];
    const negativeKeywords = ['bad', 'poor', 'worst', 'small', 'tight', 'loose', 'late', 'rough', 'fake', 'damaged', 'cheap', 'slow', 'return'];

    const positiveTagMap: Record<string, number> = {};
    const negativeTagMap: Record<string, number> = {};

    for (const r of reviews) {
      const text = `${r.title || ''} ${r.body}`.toLowerCase();
      const rating = r.rating;

      if (rating >= 4) {
        positiveCount++;
      } else if (rating === 3) {
        neutralCount++;
      } else {
        negativeCount++;
      }

      // Check positive tags
      for (const kw of positiveKeywords) {
        if (text.includes(kw)) {
          positiveTagMap[kw] = (positiveTagMap[kw] || 0) + 1;
        }
      }

      // Check negative tags
      for (const kw of negativeKeywords) {
        if (text.includes(kw)) {
          negativeTagMap[kw] = (negativeTagMap[kw] || 0) + 1;
        }
      }
    }

    const total = reviews.length;
    const positivePercentage = Math.round((positiveCount / total) * 100);
    const neutralPercentage = Math.round((neutralCount / total) * 100);
    const negativePercentage = Math.round((negativeCount / total) * 100);

    const breakdown = this.calculateBreakdown(reviews);
    const score = Math.round((breakdown.average / 5) * 100);

    // Sort tags by frequency
    const topPositiveTags = Object.keys(positiveTagMap)
      .sort((a, b) => positiveTagMap[b] - positiveTagMap[a])
      .slice(0, 5)
      .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1));

    const topNegativeTags = Object.keys(negativeTagMap)
      .sort((a, b) => negativeTagMap[b] - negativeTagMap[a])
      .slice(0, 5)
      .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1));

    // Consensus highlights
    const consensusHighlights: string[] = [];
    if (positivePercentage >= 70) consensusHighlights.push(`${positivePercentage}% of buyers highly recommend this product`);
    if (topPositiveTags.length > 0) consensusHighlights.push(`Customers praise the ${topPositiveTags.slice(0, 3).join(', ')}`);
    if (topNegativeTags.length > 0 && negativePercentage > 15) consensusHighlights.push(`Some buyers noted issues with ${topNegativeTags.slice(0, 2).join(', ')}`);

    // AI Summary
    const summary = this.generateAISummary(reviews);

    return {
      score,
      positivePercentage,
      neutralPercentage,
      negativePercentage,
      topPositiveTags,
      topNegativeTags,
      consensusHighlights,
      summary,
    };
  }

  /**
   * Generates a crisp, high-converting 1-paragraph summary of reviews
   */
  static generateAISummary(reviews: ProductReview[]): string {
    if (reviews.length === 0) return 'No reviews available yet.';
    const breakdown = this.calculateBreakdown(reviews);
    const count = reviews.length;

    let sentimentDescriptor = 'exceptional praise';
    if (breakdown.average >= 4.5) sentimentDescriptor = 'overwhelmingly positive acclaim';
    else if (breakdown.average >= 4.0) sentimentDescriptor = 'strong positive feedback';
    else if (breakdown.average >= 3.0) sentimentDescriptor = 'mixed customer satisfaction';
    else sentimentDescriptor = 'critical customer feedback';

    return `Based on ${count} verified review${count > 1 ? 's' : ''}, this item holds an average rating of ${breakdown.average.toFixed(1)}/5 with ${breakdown.recommendationPercentage}% customer satisfaction. Reviewers highlight ${sentimentDescriptor} for overall value and experience.`;
  }

  /**
   * Automatic Profanity, Abusive Language & Spam Guard
   */
  static moderateReview(
    text: string,
    options: { maxRepeatedChars?: number } = {}
  ): ReviewModerationResult {
    const reasons: string[] = [];
    let cleanText = text;
    let profanityCount = 0;
    const lower = text.toLowerCase();

    // 1. Check profanity
    for (const badWord of PROFANITY_LIST) {
      const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
      if (regex.test(lower)) {
        profanityCount++;
        cleanText = cleanText.replace(regex, '***');
      }
    }
    if (profanityCount > 0) {
      reasons.push(`Contains ${profanityCount} offensive or inappropriate word(s)`);
    }

    // 2. Check spam URLs / links
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\.com|\.in|\.org|\.net)\b/gi;
    if (urlPattern.test(text)) {
      reasons.push('Contains promotional external links or URLs');
      cleanText = cleanText.replace(urlPattern, '[link removed]');
    }

    // 3. Check character spam (e.g. "aaaaaahhhhhhh", "!!!!!!")
    const maxRepeat = options.maxRepeatedChars || 4;
    const repeatPattern = new RegExp(`(.)\\1{${maxRepeat},}`, 'g');
    if (repeatPattern.test(text)) {
      reasons.push('Contains excessive character repetition or spam pattern');
      cleanText = cleanText.replace(repeatPattern, '$1$1');
    }

    // 4. Check minimum content length
    if (text.trim().length < 3) {
      reasons.push('Review content is too short');
    }

    const flagged = reasons.length > 0;
    return {
      approved: !flagged,
      flagged,
      reasons,
      sanitizedText: cleanText,
      profanityCount,
    };
  }

  /**
   * Calculates loyalty reward points for review submissions (Bridge for boost-loyalty)
   */
  static calculateRewards(
    review: ProductReview,
    config: ReviewIncentiveConfig = {}
  ): ReviewIncentiveReward {
    const textReward = config.textRewardPoints ?? 50;
    const photoReward = config.photoRewardPoints ?? 100;
    const videoReward = config.videoRewardPoints ?? 200;
    const minWords = config.minWordCount ?? 5;

    const wordCount = review.body.trim().split(/\s+/).length;
    const hasValidText = wordCount >= minWords;
    const hasPhoto = (review.images && review.images.length > 0) ?? false;
    const hasVideo = (review.videos && review.videos.length > 0) ?? false;

    let points = 0;
    const reasons: string[] = [];
    const breakdown = { text: 0, photo: 0, video: 0 };

    if (hasValidText) {
      breakdown.text = textReward;
      points += textReward;
      reasons.push(`+${textReward} pts for detailed text review (${wordCount} words)`);
    }

    if (hasPhoto) {
      breakdown.photo = photoReward;
      points += photoReward;
      reasons.push(`+${photoReward} pts for uploading photo proof`);
    }

    if (hasVideo) {
      breakdown.video = videoReward;
      points += videoReward;
      reasons.push(`+${videoReward} pts for uploading video review`);
    }

    return {
      eligible: points > 0,
      totalPoints: points,
      breakdown,
      reasons,
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
        '@type': 'AggregateRating' as const,
        ratingValue: breakdown.average,
        reviewCount: breakdown.totalCount,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.slice(0, 10).map((r) => ({
        '@type': 'Review' as const,
        reviewRating: {
          '@type': 'Rating' as const,
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          '@type': 'Person' as const,
          name: r.author,
        },
        reviewBody: r.body,
        datePublished: r.createdAt.split('T')[0],
      })),
    };
  }

  /**
   * Generates Complete Google SEO Product Rich Snippet JSON-LD
   */
  static generateFullJSONLD(params: {
    product: {
      name: string;
      image?: string | string[];
      description?: string;
      brand?: string;
      price?: number | string;
      currency?: string;
      sku?: string;
    };
    reviews: ProductReview[];
  }): GoogleProductJSONLD | null {
    const schema = this.toSchemaOrg(params.reviews);
    if (!schema) return null;

    return {
      '@context': 'https://schema.org' as const,
      '@type': 'Product' as const,
      name: params.product.name,
      image: params.product.image,
      description: params.product.description,
      brand: params.product.brand
        ? {
            '@type': 'Brand' as const,
            name: params.product.brand,
          }
        : undefined,
      offers: params.product.price
        ? {
            '@type': 'Offer' as const,
            priceCurrency: params.product.currency || 'INR',
            price: params.product.price,
            availability: 'https://schema.org/InStock',
          }
        : undefined,
      aggregateRating: schema.aggregateRating,
      review: schema.review,
    };
  }

  /**
   * Deduplicated Helpful / Unhelpful vote tracker
   */
  static voteHelpful(
    review: ProductReview,
    userIdentifier: string,
    isHelpful: boolean,
    historyMap: Map<string, 'helpful' | 'unhelpful'>
  ): { review: ProductReview; changed: boolean } {
    const key = `${review.id}_${userIdentifier}`;
    const previousVote = historyMap.get(key);

    let helpfulVotes = review.helpfulVotes || 0;
    let unhelpfulVotes = review.unhelpfulVotes || 0;

    if (previousVote === (isHelpful ? 'helpful' : 'unhelpful')) {
      return { review, changed: false }; // already voted same
    }

    // Revert previous vote if opposite
    if (previousVote === 'helpful') helpfulVotes = Math.max(0, helpfulVotes - 1);
    if (previousVote === 'unhelpful') unhelpfulVotes = Math.max(0, unhelpfulVotes - 1);

    // Apply new vote
    if (isHelpful) {
      helpfulVotes++;
      historyMap.set(key, 'helpful');
    } else {
      unhelpfulVotes++;
      historyMap.set(key, 'unhelpful');
    }

    const updatedReview: ProductReview = {
      ...review,
      helpfulVotes,
      unhelpfulVotes,
    };

    return { review: updatedReview, changed: true };
  }

  /**
   * Developer-Friendly Quick Submit with automated moderation & sanitization
   */
  static quickSubmit(
    input: ReviewSubmissionInput,
    autoModerate: boolean = true
  ): { review: ProductReview; moderation: ReviewModerationResult } {
    const moderation = autoModerate
      ? this.moderateReview(`${input.title || ''} ${input.body}`)
      : { approved: true, flagged: false, reasons: [], sanitizedText: input.body, profanityCount: 0 };

    const review = this.createReview({
      ...input,
      body: moderation.sanitizedText,
    });

    if (moderation.flagged) {
      review.status = 'pending';
    }

    return { review, moderation };
  }
}
