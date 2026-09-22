import { EventEmitter } from 'events';
import {
  AnalyticsEvent, AnalyticsEventName, AnalyticsSession,
  SaleRecord, SaleItem, FunnelStats, FunnelStep,
  AnalyticsKPIs, ProductRevenue,
} from './analytics-types';

function uuid(): string { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// ─── BoostAnalyticsManager ────────────────────────────────────────────────────

export class BoostAnalyticsManager extends EventEmitter {
  private sessions = new Map<string, AnalyticsSession>();
  private sales    = new Map<string, SaleRecord>();

  // ── Event Tracking ────────────────────────────────────────────────────────

  trackEvent(name: AnalyticsEventName | string, sessionId: string, properties: Record<string, unknown> = {}, userId?: string): AnalyticsEvent {
    const event: AnalyticsEvent = { id: uuid(), name, sessionId, userId, properties, timestamp: new Date() };

    let session = this.sessions.get(sessionId);
    if (!session) {
      session = { sessionId, userId, events: [], startedAt: new Date(), converted: false };
      this.sessions.set(sessionId, session);
    }
    session.events.push(event);
    this.emit('event:tracked', { name, sessionId });

    // Auto-mark conversion on purchase
    if (name === 'purchase' || name === 'checkout_completed') {
      session.converted = true;
      this.emit('funnel:converted', { sessionId, userId });
    }
    return event;
  }

  // ── Revenue Tracking ──────────────────────────────────────────────────────

  recordSale(params: { orderId: string; sessionId: string; revenue: number; items: SaleItem[]; userId?: string; couponCode?: string; discountAmount?: number }): SaleRecord {
    const sale: SaleRecord = { ...params, timestamp: new Date() };
    this.sales.set(params.orderId, sale);
    this.trackEvent('purchase', params.sessionId, { orderId: params.orderId, revenue: params.revenue }, params.userId);
    this.emit('sale:recorded', { orderId: params.orderId, revenue: params.revenue });
    this.emit('kpi:updated', { kpis: this.getKPIs() });
    return sale;
  }

  // ── Funnel Analysis ───────────────────────────────────────────────────────

  getFunnelStats(): FunnelStats {
    const steps: FunnelStep[] = ['product_view', 'add_to_cart', 'checkout_started', 'checkout_completed'];
    const counts: Record<string, number> = {};

    for (const session of this.sessions.values()) {
      const sessionSteps = new Set(session.events.map(e => e.name));
      for (const step of steps) {
        if (sessionSteps.has(step)) counts[step] = (counts[step] || 0) + 1;
      }
    }

    const stepData = steps.map((step, i) => {
      const count    = counts[step] || 0;
      const prevCount= i === 0 ? count : (counts[steps[i - 1]] || 1);
      const dropOff  = i === 0 ? 0 : Math.round((1 - count / prevCount) * 100);
      return { step, count, dropOffRate: dropOff };
    });

    const views   = counts['product_view'] || 1;
    const orders  = counts['checkout_completed'] || 0;
    return { steps: stepData, overallConversionRate: Math.round((orders / views) * 1000) / 10 };
  }

  // ── KPIs ─────────────────────────────────────────────────────────────────

  getKPIs(): AnalyticsKPIs {
    const allSales      = Array.from(this.sales.values());
    const totalRevenue  = allSales.reduce((s, r) => s + r.revenue, 0);
    const totalOrders   = allSales.length;
    const totalSessions = this.sessions.size;
    const converted     = Array.from(this.sessions.values()).filter(s => s.converted).length;

    // Product stats
    const productMap = new Map<string, ProductRevenue>();
    for (const sale of allSales) {
      for (const item of sale.items) {
        const existing = productMap.get(item.productId) ?? { productId: item.productId, productName: item.productName, totalRevenue: 0, unitsSold: 0 };
        existing.totalRevenue += item.price * item.quantity;
        existing.unitsSold    += item.quantity;
        productMap.set(item.productId, existing);
      }
    }

    const totalProductViews  = Array.from(this.sessions.values()).reduce((s, sess) => s + sess.events.filter(e => e.name === 'product_view').length, 0);
    const cartStarts         = Array.from(this.sessions.values()).filter(s => s.events.some(e => e.name === 'add_to_cart')).length;
    const cartAbandoned      = cartStarts - converted;
    const cartAbandonmentRate= cartStarts > 0 ? Math.round((cartAbandoned / cartStarts) * 100) : 0;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
      conversionRate: totalSessions > 0 ? Math.round((converted / totalSessions) * 1000) / 10 : 0,
      revenuePerVisit: totalSessions > 0 ? Math.round((totalRevenue / totalSessions) * 100) / 100 : 0,
      totalSessions,
      totalProductViews,
      cartAbandonmentRate,
      topProducts: Array.from(productMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10),
    };
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  getSession(sessionId: string): AnalyticsSession | undefined { return this.sessions.get(sessionId); }
  getAllSales(): SaleRecord[] { return Array.from(this.sales.values()); }
  getTopProducts(n = 10): ProductRevenue[] { return this.getKPIs().topProducts.slice(0, n); }

  // ── Sync ─────────────────────────────────────────────────────────────────

  sync(sessions: AnalyticsSession[], sales: SaleRecord[] = []): void {
    sessions.forEach(s => this.sessions.set(s.sessionId, s));
    sales.forEach(s => this.sales.set(s.orderId, s));
  }

  export(): { sessions: AnalyticsSession[]; sales: SaleRecord[] } {
    return { sessions: Array.from(this.sessions.values()), sales: this.getAllSales() };
  }
}
