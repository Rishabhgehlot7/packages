// ─── Event Types ─────────────────────────────────────────────────────────────

export type AnalyticsEventName =
  | 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart'
  | 'checkout_started' | 'checkout_completed' | 'purchase'
  | 'search' | 'coupon_applied' | 'wishlist_added' | 'custom';

export interface AnalyticsEvent {
  id: string;
  name: AnalyticsEventName | string;
  sessionId: string;
  userId?: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

// ─── Sales & Revenue ──────────────────────────────────────────────────────────

export interface SaleRecord {
  orderId: string;
  userId?: string;
  sessionId: string;
  revenue: number;
  items: SaleItem[];
  couponCode?: string;
  discountAmount?: number;
  timestamp: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  category?: string;
  quantity: number;
  price: number;
}

// ─── Funnels ──────────────────────────────────────────────────────────────────

export type FunnelStep = 'product_view' | 'add_to_cart' | 'checkout_started' | 'checkout_completed';

export interface FunnelStats {
  steps: Array<{ step: FunnelStep; count: number; dropOffRate: number }>;
  overallConversionRate: number;
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export interface AnalyticsKPIs {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;           // AOV
  conversionRate: number;              // CVR = orders / sessions
  revenuePerVisit: number;             // RPV
  totalSessions: number;
  totalProductViews: number;
  cartAbandonmentRate: number;
  topProducts: ProductRevenue[];
}

export interface ProductRevenue {
  productId: string;
  productName: string;
  totalRevenue: number;
  unitsSold: number;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface AnalyticsSession {
  sessionId: string;
  userId?: string;
  events: AnalyticsEvent[];
  startedAt: Date;
  converted: boolean;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface AnalyticsManagerEvents {
  'sale:recorded':    { orderId: string; revenue: number };
  'event:tracked':    { name: string; sessionId: string };
  'funnel:converted': { sessionId: string; userId?: string };
  'kpi:updated':      { kpis: AnalyticsKPIs };
}
