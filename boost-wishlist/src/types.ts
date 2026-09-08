export interface WishlistItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  inStock?: boolean;
  addedAt: string; // ISO date
  metadata?: Record<string, any>;
}

export interface PriceDropAlert {
  item: WishlistItem;
  originalPrice: number;
  currentPrice: number;
  savedAmount: number;
  discountPercentage: number;
}

export interface WishlistSummary {
  items: WishlistItem[];
  totalCount: number;
  totalValue: number;
}
