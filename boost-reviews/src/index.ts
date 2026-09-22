export { ReviewsEngine } from './engine';
export { ReviewsAgentToolkit, agentToolkit } from './agent';

export type {
  ProductReview,
  ReviewMerchantReply,
  RatingBucket,
  RatingBreakdown,
  ReviewFilterOptions,
  ReviewStatus,
  ReviewSentimentSummary,
  ReviewModerationResult,
  ReviewIncentiveConfig,
  ReviewIncentiveReward,
  GoogleProductJSONLD,
  ReviewSubmissionInput,
} from './types';

export type { AgentToolDeclaration } from './agent';

// Export React Hook types for universal typings
export type {
  useProductReviews,
  useSubmitReview,
  useReviewBreakdown,
} from './react';
