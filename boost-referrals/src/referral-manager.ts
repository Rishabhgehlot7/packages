import { EventEmitter } from 'events';
import {
  ReferralLink, ReferralConversion, ReferralProgram, ReferralReward,
  ReferralStats, ReferralLeaderboardEntry, ShareLinks,
  DEFAULT_REFERRAL_PROGRAM, ConversionStatus,
} from './referral-types';

function uuid(): string { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function shortCode(prefix: string, referrerId: string): string {
  return (prefix + referrerId.slice(-4) + Math.random().toString(36).slice(2, 5)).toUpperCase();
}

// ─── BoostReferralsManager ────────────────────────────────────────────────────

export class BoostReferralsManager extends EventEmitter {
  private links       = new Map<string, ReferralLink>();      // code → link
  private conversions = new Map<string, ReferralConversion>();
  private customerIPs = new Map<string, string>();            // customerId → IP (anti-fraud)
  readonly program    : ReferralProgram;

  constructor(program: Partial<ReferralProgram> = {}) {
    super();
    this.program = { ...DEFAULT_REFERRAL_PROGRAM, ...program };
  }

  // ── Create Referral Link ──────────────────────────────────────────────────

  createReferralLink(referrerId: string): ReferralLink {
    // Return existing active link if present
    const existing = Array.from(this.links.values()).find(l => l.referrerId === referrerId && l.status === 'active');
    if (existing) return existing;

    const code = shortCode(this.program.codePrefix ?? 'REF', referrerId);
    const link: ReferralLink = {
      id: uuid(), referrerId, code, clicks: 0, conversions: 0,
      totalRevenueGenerated: 0, status: 'active',
      createdAt: new Date(),
      expiresAt: this.program.expiryDays > 0
        ? new Date(Date.now() + this.program.expiryDays * 86400_000)
        : undefined,
    };
    this.links.set(code, link);
    this.emit('referral:created', { referrerId, code });
    return link;
  }

  // ── Track Click ───────────────────────────────────────────────────────────

  trackClick(code: string): boolean {
    const link = this.links.get(code);
    if (!link || link.status !== 'active') return false;
    link.clicks++;
    this.emit('referral:clicked', { code });
    return true;
  }

  // ── Record Conversion ─────────────────────────────────────────────────────

  recordConversion(params: {
    referralCode: string;
    newCustomerId: string;
    orderTotal: number;
    orderId?: string;
    customerIp?: string;
  }): ReferralConversion {
    const { referralCode, newCustomerId, orderTotal, orderId, customerIp } = params;
    const link = this.links.get(referralCode);
    if (!link) throw new Error(`Referral code ${referralCode} not found`);
    if (link.status !== 'active') throw new Error(`Referral code ${referralCode} is ${link.status}`);

    // ── Anti-Fraud ────────────────────────────────────────────────────────
    const fraudFlags: string[] = [];
    if (link.referrerId === newCustomerId) fraudFlags.push('self_referral');
    if (customerIp && this.customerIPs.get(link.referrerId) === customerIp) fraudFlags.push('same_ip');
    if (orderTotal < this.program.minOrderAmount) fraudFlags.push('below_min_order');
    if (link.conversions >= this.program.maxConversionsPerReferrer) fraudFlags.push('max_conversions_reached');

    if (fraudFlags.length > 0) {
      this.emit('fraud:detected', { code: referralCode, newCustomerId, flags: fraudFlags });
      // Still record but mark as pending for review
    }

    if (customerIp) this.customerIPs.set(newCustomerId, customerIp);

    const referrerReward: ReferralReward = {
      type: this.program.referrerRewardType,
      value: this.program.referrerRewardValue,
      issued: fraudFlags.length === 0,
    };
    const refereeReward: ReferralReward = {
      type: this.program.refereeRewardType,
      value: this.program.refereeRewardValue,
      couponCode: this.program.refereeRewardType === 'coupon' ? `WELCOME${Math.random().toString(36).slice(2,6).toUpperCase()}` : undefined,
      issued: fraudFlags.length === 0,
    };

    const conversion: ReferralConversion = {
      id: uuid(), referralCode, referrerId: link.referrerId, newCustomerId,
      orderId, orderTotal,
      status: fraudFlags.length > 0 ? 'pending' : 'rewarded',
      referrerReward, refereeReward, fraudFlags,
      createdAt: new Date(),
      confirmedAt: fraudFlags.length === 0 ? new Date() : undefined,
    };
    this.conversions.set(conversion.id, conversion);

    // Update link stats
    link.conversions++;
    link.totalRevenueGenerated += orderTotal;

    if (fraudFlags.length === 0) {
      this.emit('referral:converted', { referrerId: link.referrerId, newCustomerId, orderId });
      this.emit('referral:rewarded',  { referrerId: link.referrerId, reward: referrerReward });
    }

    return conversion;
  }

  // ── Share Links ───────────────────────────────────────────────────────────

  getShareLinks(code: string, baseUrl = 'https://yourstore.com'): ShareLinks {
    const url   = `${baseUrl}?ref=${code}`;
    const text  = encodeURIComponent(`Shop and save with my referral code ${code}! ${url}`);
    return {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter:  `https://twitter.com/intent/tweet?text=${text}`,
      copyLink: url,
    };
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  getReferralStats(referrerId: string): ReferralStats {
    const link = Array.from(this.links.values()).find(l => l.referrerId === referrerId);
    const myConversions = Array.from(this.conversions.values()).filter(c => c.referrerId === referrerId && c.status === 'rewarded');

    return {
      referrerId,
      totalClicks: link?.clicks ?? 0,
      totalConversions: link?.conversions ?? 0,
      totalRevenueGenerated: link?.totalRevenueGenerated ?? 0,
      totalRewardEarned: myConversions.reduce((s, c) => s + c.referrerReward.value, 0),
      conversionRate: link && link.clicks > 0 ? Math.round((link.conversions / link.clicks) * 100) : 0,
    };
  }

  getLeaderboard(topN = 10): ReferralLeaderboardEntry[] {
    return Array.from(this.links.values())
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, topN)
      .map((l, i) => ({ rank: i + 1, referrerId: l.referrerId, conversions: l.conversions, revenueGenerated: l.totalRevenueGenerated }));
  }

  getReferralLink(code: string): ReferralLink | undefined { return this.links.get(code); }
  getConversionsByReferrer(referrerId: string): ReferralConversion[] {
    return Array.from(this.conversions.values()).filter(c => c.referrerId === referrerId);
  }

  // ── Sync ─────────────────────────────────────────────────────────────────

  sync(links: ReferralLink[], conversions: ReferralConversion[] = []): void {
    links.forEach(l => this.links.set(l.code, l));
    conversions.forEach(c => this.conversions.set(c.id, c));
  }

  export(): { links: ReferralLink[]; conversions: ReferralConversion[] } {
    return { links: Array.from(this.links.values()), conversions: Array.from(this.conversions.values()) };
  }
}
