export const analyticsAgentTools = [
  { name: 'track_analytics_event', description: 'Track a user event (page_view, add_to_cart, purchase, etc.) for a session.', parameters: { type: 'object', properties: { name: { type: 'string' }, sessionId: { type: 'string' }, properties: { type: 'object' }, userId: { type: 'string' } }, required: ['name', 'sessionId'] } },
  { name: 'record_sale', description: 'Record a completed sale with revenue and line items for KPI tracking.', parameters: { type: 'object', properties: { orderId: { type: 'string' }, sessionId: { type: 'string' }, revenue: { type: 'number' }, items: { type: 'array' }, userId: { type: 'string' } }, required: ['orderId', 'sessionId', 'revenue', 'items'] } },
  { name: 'get_kpis', description: 'Get current KPI dashboard: total revenue, AOV, CVR, RPV, cart abandonment rate, top products.', parameters: { type: 'object', properties: {} } },
  { name: 'get_funnel_stats', description: 'Get conversion funnel analysis from product_view → add_to_cart → checkout_started → checkout_completed.', parameters: { type: 'object', properties: {} } },
  { name: 'get_top_products', description: 'Get top N products ranked by revenue generated.', parameters: { type: 'object', properties: { n: { type: 'number' } } } },
];
export type AnalyticsAgentToolName = typeof analyticsAgentTools[number]['name'];
