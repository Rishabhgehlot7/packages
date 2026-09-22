'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BoostReferralsManager } from '../referral-manager';
import { ReferralLink, ReferralConversion, ReferralStats, ReferralLeaderboardEntry, ReferralProgram } from '../referral-types';

const ReferralContext = createContext<{ manager: BoostReferralsManager } | null>(null);
function useCtx() { const c = useContext(ReferralContext); if (!c) throw new Error('Use inside <BoostReferralsProvider>'); return c; }

export function BoostReferralsProvider({ program, children }: { program?: Partial<ReferralProgram>; children: React.ReactNode }) {
  const [manager] = useState(() => new BoostReferralsManager(program));
  return <ReferralContext.Provider value={{ manager }}>{children}</ReferralContext.Provider>;
}

export function useReferrals() { return useCtx().manager; }

export function useReferralLink(referrerId: string) {
  const { manager } = useCtx();
  const [link, setLink] = useState<ReferralLink | undefined>(() => {
    const existing = Array.from((manager as any).links.values()).find((l: any) => l.referrerId === referrerId) as ReferralLink | undefined;
    return existing;
  });

  const createLink = useCallback(() => {
    const l = manager.createReferralLink(referrerId);
    setLink(l);
    return l;
  }, [manager, referrerId]);

  const shareLinks = link ? manager.getShareLinks(link.code) : null;
  return { link, createLink, shareLinks };
}

export function useReferralStats(referrerId: string) {
  const { manager } = useCtx();
  const [stats, setStats] = useState<ReferralStats>(() => manager.getReferralStats(referrerId));
  useEffect(() => {
    const refresh = ({ referrerId: rid }: { referrerId: string }) => {
      if (rid === referrerId) setStats(manager.getReferralStats(referrerId));
    };
    manager.on('referral:converted', refresh);
    manager.on('referral:rewarded', refresh);
    return () => { manager.off('referral:converted', refresh); manager.off('referral:rewarded', refresh); };
  }, [manager, referrerId]);
  return stats;
}

export function useReferralLeaderboard(topN = 10) {
  const { manager } = useCtx();
  const [leaderboard, setLeaderboard] = useState<ReferralLeaderboardEntry[]>(() => manager.getLeaderboard(topN));
  useEffect(() => {
    const refresh = () => setLeaderboard(manager.getLeaderboard(topN));
    manager.on('referral:converted', refresh);
    return () => { manager.off('referral:converted', refresh); };
  }, [manager, topN]);
  return leaderboard;
}
