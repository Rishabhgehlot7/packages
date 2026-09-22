import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Deal, 
  TimeRemaining, 
  ClaimInfo, 
  CartItemForDeals, 
  CartDealEvaluationResult, 
  DealClaimReservation 
} from '../types';
import { BoostDealsManager, DealsEngine, deals as defaultDeals } from '../engine';

export interface DealsContextValue {
  manager: BoostDealsManager;
  activeDeals: Deal[];
  upcomingDeals: Deal[];
  refresh: () => void;
  syncDeals: <T = any>(records: T[], mapper?: (record: T) => Deal) => number;
}

const DealsContext = createContext<DealsContextValue | null>(null);

export interface DealsProviderProps {
  initialDeals?: Deal[];
  manager?: BoostDealsManager;
  children: any;
}

export const DealsProvider: React.FC<DealsProviderProps> = ({ 
  initialDeals, 
  manager: customManager, 
  children 
}) => {
  const manager = useMemo(() => customManager || defaultDeals, [customManager]);

  const [activeDeals, setActiveDeals] = useState<Deal[]>(() => {
    if (initialDeals && initialDeals.length > 0) {
      manager.registerDeals(initialDeals);
    }
    return manager.listActiveDeals();
  });

  const [upcomingDeals, setUpcomingDeals] = useState<Deal[]>(() => {
    return manager.listUpcomingDeals();
  });

  const refresh = useCallback(() => {
    setActiveDeals([...manager.listActiveDeals()]);
    setUpcomingDeals([...manager.listUpcomingDeals()]);
  }, [manager]);

  const syncDeals = useCallback(<T = any>(records: T[], mapper?: (record: T) => Deal) => {
    const count = manager.sync(records, mapper);
    refresh();
    return count;
  }, [manager, refresh]);

  // Reactive subscription to real-time manager events
  useEffect(() => {
    const unsubReserved = manager.on('claim:reserved', refresh);
    const unsubReleased = manager.on('claim:released', refresh);
    const unsubSoldOut = manager.on('deal:sold_out', refresh);
    const unsubReg = manager.on('deal:registered', refresh);

    // Periodic sweep for expired deals & reservations every 10 seconds
    const timer = setInterval(() => {
      refresh();
    }, 10000);

    return () => {
      unsubReserved();
      unsubReleased();
      unsubSoldOut();
      unsubReg();
      clearInterval(timer);
    };
  }, [manager, refresh]);

  const value: DealsContextValue = useMemo(() => ({
    manager,
    activeDeals,
    upcomingDeals,
    refresh,
    syncDeals
  }), [manager, activeDeals, upcomingDeals, refresh, syncDeals]);

  return React.createElement(DealsContext.Provider, { value }, children);
};

/**
 * Access deals state and manager methods anywhere in the React tree.
 */
export function useDeals(): DealsContextValue {
  const context = useContext(DealsContext) as DealsContextValue | null;
  if (!context) {
    // Graceful fallback to singleton manager
    return {
      manager: defaultDeals,
      activeDeals: defaultDeals.listActiveDeals(),
      upcomingDeals: defaultDeals.listUpcomingDeals(),
      refresh: () => {},
      syncDeals: (records, mapper) => defaultDeals.sync(records, mapper),
    };
  }
  return context;
}

/**
 * Live reactive countdown timer updating every 1000ms.
 */
export function useCountdownTimer(endDate: string | Date): TimeRemaining {
  const [remaining, setRemaining] = useState<TimeRemaining>(() => 
    DealsEngine.calculateTimeRemaining(endDate)
  );

  useEffect(() => {
    const update = () => {
      const current = DealsEngine.calculateTimeRemaining(endDate);
      setRemaining(current);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return remaining;
}

/**
 * Hook for a single lightning deal / flash sale.
 * Gives reactive claim state, timer, remaining claims, and reservation hold method.
 */
export function useLightningDeal(dealId: string) {
  const { manager, refresh } = useDeals();
  const deal = manager.getDeal(dealId);

  const [claimInfo, setClaimInfo] = useState<ClaimInfo>(() => 
    DealsEngine.calculateClaimInfo(deal?.claimedCount || 0, deal?.totalClaimLimit)
  );

  const countdown = useCountdownTimer(deal?.endDate || new Date());

  useEffect(() => {
    if (deal) {
      setClaimInfo(DealsEngine.calculateClaimInfo(deal.claimedCount || 0, deal.totalClaimLimit));
    }
  }, [deal?.claimedCount, deal?.totalClaimLimit]);

  const reserve = useCallback((userId: string, quantity: number = 1, ttlSeconds?: number): DealClaimReservation => {
    const reservation = manager.reserveClaim(dealId, userId, quantity, ttlSeconds);
    refresh();
    return reservation;
  }, [manager, dealId, refresh]);

  const release = useCallback((reservationId: string): boolean => {
    const released = manager.releaseClaim(reservationId);
    refresh();
    return released;
  }, [manager, refresh]);

  return {
    deal,
    claimInfo,
    countdown,
    reserve,
    release,
    isExpired: countdown.isExpired,
    isSoldOut: claimInfo.isSoldOut,
    remainingClaims: claimInfo.remainingClaims,
  };
}

/**
 * Hook to automatically evaluate deals (BOGO, tiered volume, cart promotions) on a shopping cart.
 */
export function useCartDeals(cartItems: CartItemForDeals[]): CartDealEvaluationResult {
  const { manager } = useDeals();

  const evaluation = useMemo(() => {
    return manager.evaluateCartDeals(cartItems);
  }, [manager, cartItems]);

  return evaluation;
}
