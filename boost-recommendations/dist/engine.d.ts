import { ProductRecommendationItem, FrequentlyBoughtTogetherBundle } from './types';
export declare class RecommendationsEngine {
    /**
     * Generates an Amazon/Flipkart style "Frequently Bought Together" combo bundle
     * Combines the main product with 1 to 2 related/complementary products, applying a bundle discount.
     */
    static getFrequentlyBoughtTogether(mainProduct: ProductRecommendationItem, catalog: ProductRecommendationItem[], options?: {
        maxItems?: number;
        discountPercentage?: number;
    }): FrequentlyBoughtTogetherBundle;
    /**
     * Finds similar products (Customers who viewed this also viewed)
     */
    static getSimilarProducts(targetProduct: ProductRecommendationItem, catalog: ProductRecommendationItem[], limit?: number): ProductRecommendationItem[];
    /**
     * Generates personalized picks based on browsing history
     */
    static getPersonalizedPicks(viewHistoryIds: string[], catalog: ProductRecommendationItem[], limit?: number): ProductRecommendationItem[];
}
//# sourceMappingURL=engine.d.ts.map