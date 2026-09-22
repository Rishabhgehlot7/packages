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
  metadata?: Record<string, any>;
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
  reason: 'bought_together' | 'similar_category' | 'price_range' | 'user_history' | 'trending' | 'co_occurrence';
}

export interface CartCrossSellRecommendation {
  item: ProductRecommendationItem;
  targetCartItemId: string;
  reason: string;
  priorityScore: number;
}

export interface ProductUpgradeRecommendation {
  originalProduct: ProductRecommendationItem;
  upgradedProduct: ProductRecommendationItem;
  priceDifference: number;
  percentagePriceIncrease: number;
  ratingIncrease?: number;
}

export interface OrderTransaction {
  orderId?: string;
  productIds: string[];
  timestamp?: string;
}

export interface CoOccurrenceRule {
  productId: string;
  pairedProductId: string;
  frequency: number;
  confidenceScore: number;
}

export interface RecommendationsManagerOptions {
  defaultBundleDiscount?: number;
  maxBundleSize?: number;
  minCoOccurrenceThreshold?: number;
}
