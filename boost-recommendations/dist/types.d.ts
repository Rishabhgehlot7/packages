export interface ProductRecommendationItem {
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
export interface FrequentlyBoughtTogetherBundle {
    mainProduct: ProductRecommendationItem;
    bundleItems: ProductRecommendationItem[];
    allProducts: ProductRecommendationItem[];
    totalRegularPrice: number;
    bundleDiscountPercentage: number;
    bundlePrice: number;
    savingsAmount: number;
}
export interface RecommendationScore {
    item: ProductRecommendationItem;
    score: number;
    reason: 'bought_together' | 'similar_category' | 'price_range' | 'user_history' | 'trending';
}
//# sourceMappingURL=types.d.ts.map