/**
 * @boostengine/reels - Core Types & Interfaces
 */

export interface TaggedProduct {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  url?: string;
  sku?: string;
  isFeatured?: boolean;
  options?: Record<string, string>;
  inStock?: boolean;
}

export interface CreatorProfile {
  name: string;
  handle?: string;
  avatar?: string;
  verified?: boolean;
}

export interface ReelItem {
  id: string;
  videoUrl: string;
  posterUrl?: string;
  title: string;
  description?: string;
  durationSeconds?: number;
  creator?: CreatorProfile;
  products: TaggedProduct[];
  likesCount?: number;
  viewsCount?: number;
  badge?: string;
  aspectRatio?: '9:16' | '1:1' | '16:9';
  isActive?: boolean;
  displayOrder?: number;
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  durationMs?: number; // Defaults to 5000ms for images
  title?: string;
  subtitle?: string;
  creator?: CreatorProfile;
  products?: TaggedProduct[];
  seen?: boolean;
}

export type ReelEventType =
  | 'reel_view'
  | 'reel_watch_25'
  | 'reel_watch_50'
  | 'reel_watch_75'
  | 'reel_watch_complete'
  | 'reel_like'
  | 'reel_share'
  | 'product_tag_click'
  | 'product_add_to_cart'
  | 'product_buy_now';

export interface ReelAnalyticsEvent {
  reelId: string;
  eventType: ReelEventType;
  productId?: string;
  timestamp: number;
  durationWatchedSeconds?: number;
  metadata?: Record<string, any>;
}
