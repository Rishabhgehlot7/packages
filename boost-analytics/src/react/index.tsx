'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BoostAnalyticsManager } from '../analytics-manager';
import { AnalyticsKPIs, ProductRevenue, FunnelStats, SaleItem } from '../analytics-types';

const AnalyticsContext = createContext<{ manager: BoostAnalyticsManager } | null>(null);
function useCtx() { const c = useContext(AnalyticsContext); if (!c) throw new Error('Use inside <BoostAnalyticsProvider>'); return c; }

export function BoostAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [manager] = useState(() => new BoostAnalyticsManager());
  return <AnalyticsContext.Provider value={{ manager }}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() { return useCtx().manager; }

export function useKPIs() {
  const { manager } = useCtx();
  const [kpis, setKpis] = useState<AnalyticsKPIs>(() => manager.getKPIs());
  useEffect(() => {
    const refresh = ({ kpis: k }: { kpis: AnalyticsKPIs }) => setKpis(k);
    manager.on('kpi:updated', refresh);
    return () => { manager.off('kpi:updated', refresh); };
  }, [manager]);
  return kpis;
}

export function useTopProducts(n = 10) {
  const { manager } = useCtx();
  const [products, setProducts] = useState<ProductRevenue[]>(() => manager.getTopProducts(n));
  useEffect(() => {
    const refresh = () => setProducts(manager.getTopProducts(n));
    manager.on('sale:recorded', refresh);
    return () => { manager.off('sale:recorded', refresh); };
  }, [manager, n]);
  return products;
}

export function useFunnelStats() {
  const { manager } = useCtx();
  const [funnel, setFunnel] = useState<FunnelStats>(() => manager.getFunnelStats());
  useEffect(() => {
    const refresh = () => setFunnel(manager.getFunnelStats());
    manager.on('event:tracked', refresh);
    return () => { manager.off('event:tracked', refresh); };
  }, [manager]);
  return funnel;
}

export function useTrackEvent(sessionId: string, userId?: string) {
  const { manager } = useCtx();
  return useCallback((name: string, properties?: Record<string, unknown>) =>
    manager.trackEvent(name, sessionId, properties ?? {}, userId), [manager, sessionId, userId]);
}
