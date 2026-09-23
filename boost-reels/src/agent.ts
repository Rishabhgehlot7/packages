import { ReelItem, ReelAnalyticsEvent } from './types';
import {
  calculateReelEngagementScore,
  calculateReelConversionRate,
  sortReelsByTrending,
} from './engine';

/**
 * AI Agent Tool: Analyzes performance and conversion of video reels.
 */
export function analyzeReelPerformanceTool(params: {
  reel: ReelItem;
  events: ReelAnalyticsEvent[];
}) {
  const stats = calculateReelConversionRate(params.events);
  const score = calculateReelEngagementScore(params.reel, params.events);

  return {
    reelId: params.reel.id,
    title: params.reel.title,
    engagementScore: score,
    views: stats.views,
    productClicks: stats.productClicks,
    cartAdditions: stats.cartAdds,
    purchases: stats.buys,
    ctr: `${stats.clickThroughRatePct}%`,
    conversionRate: `${stats.buyConversionRatePct}%`,
    verdict: stats.buyConversionRatePct > 5 ? 'High Converting' : 'Needs Optimization',
  };
}

/**
 * AI Agent Tool: Recommends best reel order for homepage feed.
 */
export function optimizeReelsFeedTool(params: {
  reels: ReelItem[];
  events: ReelAnalyticsEvent[];
}) {
  const sorted = sortReelsByTrending(params.reels, params.events);
  return {
    recommendedOrder: sorted.map((r, idx) => ({
      position: idx + 1,
      id: r.id,
      title: r.title,
      score: calculateReelEngagementScore(r, params.events),
    })),
  };
}
