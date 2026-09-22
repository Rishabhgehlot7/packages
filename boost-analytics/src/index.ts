// @boostengine/analytics — Updated Entry Point
export { BoostAnalyticsManager } from './analytics-manager';
export type {
  AnalyticsEvent, AnalyticsEventName, AnalyticsSession,
  SaleRecord, SaleItem, FunnelStats, FunnelStep,
  AnalyticsKPIs, ProductRevenue, AnalyticsManagerEvents,
} from './analytics-types';
export { analyticsAgentTools } from './analytics-agent';
export type { AnalyticsAgentToolName } from './analytics-agent';
// Re-export existing tracker for backward compat
export * from './tracker';
