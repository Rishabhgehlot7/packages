interface ReviewMerchantReply {
    author: string;
    body: string;
    date: string;
}
interface ProductReview {
    id: string;
    productId: string;
    author: string;
    rating: number;
    title?: string;
    body: string;
    verifiedBuyer: boolean;
    images?: string[];
    videos?: string[];
    helpfulVotes?: number;
    unhelpfulVotes?: number;
    merchantReply?: ReviewMerchantReply;
    isPinned?: boolean;
    createdAt: string;
}
interface RatingBucket {
    count: number;
    percentage: number;
}
interface RatingBreakdown {
    average: number;
    totalCount: number;
    distribution: {
        5: RatingBucket;
        4: RatingBucket;
        3: RatingBucket;
        2: RatingBucket;
        1: RatingBucket;
    };
    recommendationPercentage: number;
}
interface ReviewFilterOptions {
    rating?: number;
    verifiedOnly?: boolean;
    withMediaOnly?: boolean;
    sortBy?: 'recent' | 'highest' | 'lowest' | 'most_helpful';
    limit?: number;
    offset?: number;
}

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
    static createReview(params: {
        productId: string;
        author: string;
        rating: number;
        title?: string;
        body: string;
        verifiedBuyer?: boolean;
        images?: string[];
        videos?: string[];
    }): ProductReview;
    /**
     * Formats reviews directly into Schema.org AggregateRating and Review snippets
     */
    static toSchemaOrg(reviews: ProductReview[]): {
        aggregateRating: {
            '@type': string;
            ratingValue: number;
            reviewCount: number;
            bestRating: number;
            worstRating: number;
        };
        review: {
            '@type': string;
            reviewRating: {
                '@type': string;
                ratingValue: number;
                bestRating: number;
                worstRating: number;
            };
            author: {
                '@type': string;
                name: string;
            };
            reviewBody: string;
            datePublished: string;
        }[];
    } | null;
}

export { type ProductReview, type RatingBreakdown, type RatingBucket, type ReviewFilterOptions, type ReviewMerchantReply, ReviewsEngine };
