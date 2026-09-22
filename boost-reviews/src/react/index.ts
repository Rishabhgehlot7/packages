import { useState, useMemo, useCallback } from 'react';
import { ReviewsEngine } from '../engine';
import {
  ProductReview,
  RatingBreakdown,
  ReviewFilterOptions,
  ReviewSentimentSummary,
  ReviewSubmissionInput,
  ReviewModerationResult,
} from '../types';

/**
 * Universal React & React Native Hook for Product Reviews Display & Filtering
 */
export function useProductReviews(initialReviews: ProductReview[] = []) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [filter, setFilterState] = useState<ReviewFilterOptions>({
    sortBy: 'recent',
  });
  const [votesHistory] = useState<Map<string, 'helpful' | 'unhelpful'>>(() => new Map());

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    return ReviewsEngine.filterAndSort(reviews, filter);
  }, [reviews, filter]);

  // Statistical Rating Breakdown
  const breakdown = useMemo(() => {
    return ReviewsEngine.calculateBreakdown(reviews);
  }, [reviews]);

  // AI Sentiment Summary & Highlights
  const sentiment = useMemo(() => {
    return ReviewsEngine.analyzeSentiment(reviews);
  }, [reviews]);

  const setFilter = useCallback((newFilter: Partial<ReviewFilterOptions>) => {
    setFilterState((prev: ReviewFilterOptions) => ({ ...prev, ...newFilter }));
  }, []);

  const addReview = useCallback((newReview: ProductReview) => {
    setReviews((prev: ProductReview[]) => [newReview, ...prev]);
  }, []);

  const voteHelpful = useCallback(
    (reviewId: string, userIdentifier: string, isHelpful: boolean) => {
      setReviews((prev: ProductReview[]) =>
        prev.map((r: ProductReview) => {
          if (r.id === reviewId) {
            return ReviewsEngine.voteHelpful(r, userIdentifier, isHelpful, votesHistory).review;
          }
          return r;
        })
      );
    },
    [votesHistory]
  );

  return {
    reviews,
    filteredReviews,
    breakdown,
    sentiment,
    filter,
    setFilter,
    addReview,
    voteHelpful,
    totalCount: reviews.length,
    filteredCount: filteredReviews.length,
  };
}

/**
 * Universal React & React Native Hook for Review Submission Forms
 */
export function useSubmitReview() {
  const [rating, setRating] = useState<number>(5);
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<ProductReview | null>(null);
  const [moderationResult, setModerationResult] = useState<ReviewModerationResult | null>(null);

  const addImage = useCallback((url: string) => {
    if (url.trim()) {
      setImages((prev: string[]) => [...prev, url.trim()]);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev: string[]) => prev.filter((_: string, i: number) => i !== index));
  }, []);

  const submitReview = useCallback(
    async (
      productId: string,
      verifiedBuyer: boolean = false
    ): Promise<{ review: ProductReview; moderation: ReviewModerationResult } | null> => {
      if (!author.trim()) {
        setError('Please provide your name');
        return null;
      }
      if (!body.trim()) {
        setError('Please write your review feedback');
        return null;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const input: ReviewSubmissionInput = {
          productId,
          author: author.trim(),
          rating,
          title: title.trim() || undefined,
          body: body.trim(),
          verifiedBuyer,
          images,
          videos,
        };

        const result = ReviewsEngine.quickSubmit(input, true);
        setLastSubmitted(result.review);
        setModerationResult(result.moderation);
        return result;
      } catch (err: any) {
        setError(err.message || 'Failed to submit review');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [author, rating, title, body, images, videos]
  );

  const reset = useCallback(() => {
    setRating(5);
    setAuthor('');
    setTitle('');
    setBody('');
    setImages([]);
    setVideos([]);
    setError(null);
    setLastSubmitted(null);
    setModerationResult(null);
  }, []);

  return {
    rating,
    setRating,
    author,
    setAuthor,
    title,
    setTitle,
    body,
    setBody,
    images,
    setImages,
    videos,
    setVideos,
    addImage,
    removeImage,
    isSubmitting,
    error,
    lastSubmitted,
    moderationResult,
    submitReview,
    reset,
  };
}

/**
 * Lightweight Hook for Memoized Rating Breakdown Calculation
 */
export function useReviewBreakdown(reviews: ProductReview[] = []): RatingBreakdown {
  return useMemo(() => {
    return ReviewsEngine.calculateBreakdown(reviews);
  }, [reviews]);
}
