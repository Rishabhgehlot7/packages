interface ProductRecommendationItem {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    imageUrl: string;
    category: string;
    rating?: number;
    reviewCount?: number;
    tags?: string[];
    stock?: number;
}
interface FrequentlyBoughtTogetherBundle {
    mainProduct: ProductRecommendationItem;
    bundleItems: ProductRecommendationItem[];
    allProducts: ProductRecommendationItem[];
    totalRegularPrice: number;
    bundleDiscountPercentage: number;
    bundlePrice: number;
    savingsAmount: number;
}
interface RecommendationScore {
    item: ProductRecommendationItem;
    score: number;
    reason: 'bought_together' | 'similar_category' | 'price_range' | 'user_history' | 'trending';
}

declare class RecommendationsEngine {
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

export { type FrequentlyBoughtTogetherBundle, type ProductRecommendationItem, type RecommendationScore, RecommendationsEngine };
