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
  boardId?: string; // Optional custom board/collection ID (default 'default')
  targetPrice?: number; // Price alert trigger threshold
  originalAddedPrice?: number; // Snapshot of price when added
  notifyOnPriceDrop?: boolean;
  notifyOnRestock?: boolean;
  metadata?: Record<string, any>;
}

export interface WishlistBoard {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  privacy: 'public' | 'private' | 'unlisted';
  shareToken?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PriceDropAlert {
  item: WishlistItem;
  originalPrice: number;
  currentPrice: number;
  savedAmount: number;
  discountPercentage: number;
}

export interface BackInStockAlert {
  item: WishlistItem;
  previousStock: boolean;
  currentStock: boolean;
  restockedAt: string;
}

export interface TargetPriceReachedAlert {
  item: WishlistItem;
  targetPrice: number;
  currentPrice: number;
  discountPercentage: number;
}

export interface WishlistSummary {
  items: WishlistItem[];
  totalCount: number;
  totalValue: number;
  boardCount?: number;
}

export interface WishlistMoveToCartResult {
  cartItem: {
    productId: string;
    variantId?: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
    metadata?: Record<string, any>;
  };
  remainingWishlistCount: number;
}

export interface WishlistOptions {
  autoRemoveOnMoveToCart?: boolean;
  storageKey?: string;
}

export type WishlistEventType = 
  | 'item:added' 
  | 'item:removed' 
  | 'item:moved_to_cart' 
  | 'price_drop' 
  | 'back_in_stock' 
  | 'board:created' 
  | 'board:deleted';

export type WishlistEventHandler = (payload: any) => void;
