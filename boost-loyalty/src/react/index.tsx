'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { BoostLoyaltyManager } from '../engine';
import {
  LoyaltyProfile,
  LoyaltyReward,
  LoyaltyConfig,
  RedemptionQuote,
  LeaderboardEntry,
} from '../types';

// ─── Context ─────────────────────────────────────────────────────────────────

interface LoyaltyContextValue {
  manager: BoostLoyaltyManager;
}

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

function useLoyaltyContext(): LoyaltyContextValue {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error('useLoyalty* hooks must be used inside <BoostLoyaltyProvider>');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface BoostLoyaltyProviderProps {
  config?: Partial<LoyaltyConfig>;
  persistKey?: string;              // localStorage key for profile persistence
  children: React.ReactNode;
}

export function BoostLoyaltyProvider({ config, persistKey = 'boost_loyalty', children }: BoostLoyaltyProviderProps) {
  const [manager] = useState(() => {
    const mgr = new BoostLoyaltyManager(config);
    // Rehydrate from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(persistKey);
        if (saved) {
          const profiles: LoyaltyProfile[] = JSON.parse(saved).map((p: LoyaltyProfile) => ({
            ...p,
            lastActivityAt: new Date(p.lastActivityAt),
            createdAt:      new Date(p.createdAt),
            transactions:   p.transactions.map(t => ({ ...t, createdAt: new Date(t.createdAt) })),
          }));
          mgr.sync(profiles);
        }
      } catch { /* ignore */ }
    }
    return mgr;
  });

  // Persist on any event
  useEffect(() => {
    const persist = () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(persistKey, JSON.stringify(manager.export()));
      }
    };
    const events = ['coins:earned','coins:redeemed','coins:adjusted','coins:expired','tier:upgraded','challenge:completed'];
    events.forEach(e => manager.on(e, persist));
    return () => { events.forEach(e => manager.off(e, persist)); };
  }, [manager, persistKey]);

  return (
    <LoyaltyContext.Provider value={{ manager }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

// ─── Hook: useLoyalty (raw manager access) ────────────────────────────────────

export function useLoyalty() {
  return useLoyaltyContext().manager;
}

// ─── Hook: useLoyaltyProfile ─────────────────────────────────────────────────

export function useLoyaltyProfile(customerId: string) {
  const { manager } = useLoyaltyContext();
  const [profile, setProfile] = useState<LoyaltyProfile | undefined>(() => manager.getProfile(customerId));

  useEffect(() => {
    const refresh = ({ customerId: cid }: { customerId: string }) => {
      if (cid === customerId) setProfile(manager.getProfile(customerId));
    };
    const events = ['coins:earned','coins:redeemed','coins:adjusted','coins:expired','tier:upgraded','challenge:completed','profile:created'];
    events.forEach(e => manager.on(e, refresh));
    return () => { events.forEach(e => manager.off(e, refresh)); };
  }, [manager, customerId]);

  const earnCoins = useCallback((orderTotal: number, orderId?: string) =>
    manager.earnCoins(customerId, orderTotal, orderId), [manager, customerId]);

  const redeemCoins = useCallback((coins: number, orderId?: string) =>
    manager.redeemCoins(customerId, coins, orderId), [manager, customerId]);

  return { profile, earnCoins, redeemCoins };
}

// ─── Hook: useRedemptionQuote ─────────────────────────────────────────────────

export function useRedemptionQuote(customerId: string, orderTotal: number, requestedCoins?: number): RedemptionQuote | null {
  const { manager } = useLoyaltyContext();
  const [quote, setQuote] = useState<RedemptionQuote | null>(null);

  useEffect(() => {
    try {
      setQuote(manager.getRedemptionQuote(customerId, orderTotal, requestedCoins));
    } catch { setQuote(null); }
  }, [manager, customerId, orderTotal, requestedCoins]);

  return quote;
}

// ─── Hook: useLoyaltyLeaderboard ─────────────────────────────────────────────

export function useLoyaltyLeaderboard(topN: number = 10) {
  const { manager } = useLoyaltyContext();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => manager.getLeaderboard(topN));

  useEffect(() => {
    const refresh = () => setLeaderboard(manager.getLeaderboard(topN));
    const events  = ['coins:earned','coins:adjusted','tier:upgraded'];
    events.forEach(e => manager.on(e, refresh));
    return () => { events.forEach(e => manager.off(e, refresh)); };
  }, [manager, topN]);

  return leaderboard;
}

// ─── Hook: useLoyaltyChallenges ───────────────────────────────────────────────

export function useLoyaltyChallenges(customerId: string) {
  const { manager } = useLoyaltyContext();
  const [challenges, setChallenges] = useState(() => manager.getChallenges(customerId));

  useEffect(() => {
    const refresh = ({ customerId: cid }: { customerId: string }) => {
      if (cid === customerId) setChallenges(manager.getChallenges(customerId));
    };
    manager.on('challenge:completed', refresh);
    manager.on('coins:earned', refresh);
    return () => {
      manager.off('challenge:completed', refresh);
      manager.off('coins:earned', refresh);
    };
  }, [manager, customerId]);

  const joinChallenge = useCallback((challengeId: string) =>
    manager.joinChallenge(customerId, challengeId), [manager, customerId]);

  return { challenges, joinChallenge };
}

// ─── Hook: useLoyaltyRewards ──────────────────────────────────────────────────

export function useLoyaltyRewards(customerId: string) {
  const { manager } = useLoyaltyContext();
  const [rewards, setRewards] = useState<LoyaltyReward[]>(() => manager.getRewards());

  useEffect(() => {
    const refresh = () => setRewards(manager.getRewards());
    manager.on('reward:redeemed', refresh);
    return () => { manager.off('reward:redeemed', refresh); };
  }, [manager]);

  const redeemReward = useCallback((rewardId: string) =>
    manager.redeemReward(customerId, rewardId), [manager, customerId]);

  return { rewards, redeemReward };
}
