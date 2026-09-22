import { P as ProductReview, R as RatingBreakdown, a as ReviewFilterOptions, b as ReviewSubmissionInput, c as ReviewSentimentSummary, d as ReviewModerationResult, e as ReviewIncentiveConfig, f as ReviewIncentiveReward, G as GoogleProductJSONLD } from './index-DRYjE3yL.js';
export { g as RatingBucket, h as ReviewMerchantReply, i as ReviewStatus, u as useProductReviews, j as useReviewBreakdown, k as useSubmitReview } from './index-DRYjE3yL.js';
export { AgentToolDeclaration, ReviewsAgentToolkit, agentToolkit } from './agent.js';

declare class ReviewsEngine {
    /**
     * Computes statistical star ratings, distribution, and recommendation percentage
     */
    static calculateBreakdown(reviews: ProductReview[]): RatingBreakdown;
    /**
     * Filters and sorts reviews with pinned reviews prioritized
     */
    static filterAndSort(reviews: ProductReview[], options?: ReviewFilterOptions): ProductReview[];
    /**
     * Helper to instantiate a valid sanitized ProductReview object
     */
    static createReview(params: ReviewSubmissionInput): ProductReview;
    /**
     * AI-Powered Sentiment Analysis & Highlights Consensus Engine
     */
    static analyzeSentiment(reviews: ProductReview[]): ReviewSentimentSummary;
    /**
     * Generates a crisp, high-converting 1-paragraph summary of reviews
     */
    static generateAISummary(reviews: ProductReview[]): string;
    /**
     * Automatic Profanity, Abusive Language & Spam Guard
     */
    static moderateReview(text: string, options?: {
        maxRepeatedChars?: number;
    }): ReviewModerationResult;
    /**
     * Calculates loyalty reward points for review submissions (Bridge for boost-loyalty)
     */
    static calculateRewards(review: ProductReview, config?: ReviewIncentiveConfig): ReviewIncentiveReward;
    /**
     * Formats reviews directly into Schema.org AggregateRating and Review snippets
     */
    static toSchemaOrg(reviews: ProductReview[]): {
        aggregateRating: {
            '@type': "AggregateRating";
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
        review: {
            '@type': "Review";
            reviewRating: {
                '@type': "Rating";
                ratingValue: number;
                bestRating: number;
                worstRating: number;
            };
            author: {
                '@type': "Person";
                name: string;
            };
            reviewBody: string;
            datePublished: string;
        }[];
    } | null;
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
    }): GoogleProductJSONLD | null;
    /**
     * Deduplicated Helpful / Unhelpful vote tracker
     */
    static voteHelpful(review: ProductReview, userIdentifier: string, isHelpful: boolean, historyMap: Map<string, 'helpful' | 'unhelpful'>): {
        review: ProductReview;
        changed: boolean;
    };
    /**
     * Developer-Friendly Quick Submit with automated moderation & sanitization
     */
    static quickSubmit(input: ReviewSubmissionInput, autoModerate?: boolean): {
        review: ProductReview;
        moderation: ReviewModerationResult;
    };
}

export { GoogleProductJSONLD, ProductReview, RatingBreakdown, ReviewFilterOptions, ReviewIncentiveConfig, ReviewIncentiveReward, ReviewModerationResult, ReviewSentimentSummary, ReviewSubmissionInput, ReviewsEngine };
