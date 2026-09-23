import {
  ReelItem,
  StoryItem,
  ReelAnalyticsEvent,
  TaggedProduct,
} from './types';

/**
 * Formats seconds into a human-readable mm:ss format.
 */
export function formatVideoTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates conversion & click-through rates from reel analytics events.
 */
export function calculateReelConversionRate(events: ReelAnalyticsEvent[]) {
  const views = events.filter((e) => e.eventType === 'reel_view').length || 1;
  const productClicks = events.filter((e) => e.eventType === 'product_tag_click').length;
  const cartAdds = events.filter((e) => e.eventType === 'product_add_to_cart').length;
  const buys = events.filter((e) => e.eventType === 'product_buy_now').length;

  const ctr = Math.round((productClicks / views) * 1000) / 10;
  const cartConversion = Math.round((cartAdds / views) * 1000) / 10;
  const buyConversion = Math.round((buys / views) * 1000) / 10;

  return {
    views,
    productClicks,
    cartAdds,
    buys,
    clickThroughRatePct: ctr,
    cartConversionRatePct: cartConversion,
    buyConversionRatePct: buyConversion,
  };
}

/**
 * Calculates engagement score for a reel to rank on top of feed.
 */
export function calculateReelEngagementScore(
  reel: ReelItem,
  events: ReelAnalyticsEvent[] = []
): number {
  const baseLikes = (reel.likesCount || 0) * 3;
  const baseViews = (reel.viewsCount || 0) * 0.1;

  const reelEvents = events.filter((e) => e.reelId === reel.id);
  const completedWatches = reelEvents.filter((e) => e.eventType === 'reel_watch_complete').length * 5;
  const productInteractions = reelEvents.filter(
    (e) => e.eventType === 'product_tag_click' || e.eventType === 'product_add_to_cart'
  ).length * 10;

  return Math.round(baseLikes + baseViews + completedWatches + productInteractions);
}

/**
 * Filters reels that tag a specific product (useful for PDP "As Seen In Videos" section).
 */
export function filterReelsByProduct(reels: ReelItem[], productId: string): ReelItem[] {
  return reels.filter((reel) =>
    reel.products.some((p) => p.productId === productId || p.id === productId)
  );
}

/**
 * Sorts reels by engagement & trending velocity.
 */
export function sortReelsByTrending(
  reels: ReelItem[],
  events: ReelAnalyticsEvent[] = []
): ReelItem[] {
  return [...reels].sort((a, b) => {
    const scoreA = calculateReelEngagementScore(a, events);
    const scoreB = calculateReelEngagementScore(b, events);
    return scoreB - scoreA;
  });
}
