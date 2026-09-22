import { 
  Deal, 
  ClaimInfo, 
  TimeRemaining, 
  DealPriceCalculation, 
  CartItemForDeals, 
  CartDealEvaluationResult, 
  AppliedDealSummary, 
  DealClaimReservation,
  DealsManagerOptions,
  DealEventType,
  DealEventHandler
} from './types';

export class DealsEngine {
  /**
   * Calculate time remaining from the given endDate.
   */
  public static calculateTimeRemaining(endDate: string | Date): TimeRemaining {
    const total = Date.parse(endDate.toString()) - Date.parse(new Date().toString());
    
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, isExpired: false };
  }

  /**
   * Calculate claim percentage and sold out status.
   */
  public static calculateClaimInfo(claimedCount: number = 0, totalLimit?: number): ClaimInfo {
    if (!totalLimit || totalLimit <= 0) {
      return {
        claimedCount,
        percentageClaimed: 0,
        isSoldOut: false,
      };
    }

    const safeClaimed = Math.max(0, claimedCount);
    const percentage = Math.min(100, Math.round((safeClaimed / totalLimit) * 100));
    const remainingClaims = Math.max(0, totalLimit - safeClaimed);
    
    return {
      totalLimit,
      claimedCount: safeClaimed,
      percentageClaimed: percentage,
      isSoldOut: safeClaimed >= totalLimit,
      remainingClaims,
    };
  }

  /**
   * Compute final discounted price and savings for a single item.
   */
  public static computeDealPrice(originalPrice: number, deal: Deal): DealPriceCalculation {
    if (originalPrice <= 0) {
      return { originalPrice: 0, dealPrice: 0, savings: 0, discountPercentage: 0 };
    }

    let dealPrice = originalPrice;
    let savings = 0;
    let discountPercentage = 0;

    switch (deal.type) {
      case 'percentage':
      case 'flash_sale': {
        const pct = Math.min(100, Math.max(0, deal.discountValue));
        savings = (originalPrice * pct) / 100;
        dealPrice = Math.max(0, originalPrice - savings);
        discountPercentage = pct;
        break;
      }
      case 'fixed_discount': {
        savings = Math.min(originalPrice, Math.max(0, deal.discountValue));
        dealPrice = Math.max(0, originalPrice - savings);
        discountPercentage = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;
        break;
      }
      default:
        // Other types like BOGO/tiered evaluated at cart/quantity level
        break;
    }

    return {
      originalPrice: Number(originalPrice.toFixed(2)),
      dealPrice: Number(dealPrice.toFixed(2)),
      savings: Number(savings.toFixed(2)),
      discountPercentage,
    };
  }
}

/**
 * Universal Deal Manager for In-Memory / Hybrid Deal Orchestration.
 * Handles Flash Sales, BOGO, Tiered Volume Discounts, Cart Spend Rules,
 * Claim Reservations with TTL Lock, Bot Protection, Exclusivity,
 * Real-time Event Emitter, and Database Syncing.
 */
export class BoostDealsManager {
  private dealsMap: Map<string, Deal> = new Map();
  private reservationsMap: Map<string, DealClaimReservation> = new Map();
  private userClaimsMap: Map<string, number> = new Map(); // `${dealId}_${userId}` -> count
  private eventListeners: Map<DealEventType, Set<DealEventHandler>> = new Map();
  private defaultTTL: number;

  constructor(options: DealsManagerOptions = {}) {
    this.defaultTTL = options.ttlSeconds || 600; // 10 minutes default reservation hold
  }

  // --- Real-time Event Emitter ---

  public on(event: DealEventType, handler: DealEventHandler): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  public off(event: DealEventType, handler: DealEventHandler): void {
    const set = this.eventListeners.get(event);
    if (set) {
      set.delete(handler);
    }
  }

  private emit(event: DealEventType, payload: any): void {
    const set = this.eventListeners.get(event);
    if (set) {
      for (const handler of set) {
        try {
          handler(payload);
        } catch (e) {
          console.error(`[BoostDeals] Error in "${event}" event handler:`, e);
        }
      }
    }
  }

  // --- Deal Registration & Management ---

  public registerDeal(deal: Deal): Deal {
    const normalized: Deal = {
      ...deal,
      claimedCount: deal.claimedCount || 0,
      stackable: deal.stackable !== undefined ? deal.stackable : true,
      exclusive: deal.exclusive || false,
      priority: deal.priority || 0,
    };
    this.dealsMap.set(deal.id, normalized);
    this.emit('deal:registered', normalized);
    return normalized;
  }

  public registerDeals(deals: Deal[]): Deal[] {
    return deals.map(d => this.registerDeal(d));
  }

  public getDeal(dealId: string): Deal | undefined {
    return this.dealsMap.get(dealId);
  }

  public removeDeal(dealId: string): boolean {
    return this.dealsMap.delete(dealId);
  }

  public clear(): void {
    this.dealsMap.clear();
    this.reservationsMap.clear();
    this.userClaimsMap.clear();
  }

  // --- TTL Sweeping & Claim Reservations ---

  public sweepExpiredReservations(): number {
    const now = new Date().getTime();
    let releasedCount = 0;

    for (const [id, res] of this.reservationsMap.entries()) {
      if (Date.parse(res.expiresAt) <= now) {
        const deal = this.dealsMap.get(res.dealId);
        if (deal && deal.claimedCount) {
          deal.claimedCount = Math.max(0, deal.claimedCount - res.quantity);
        }
        // Decrement user claim count
        const userKey = `${res.dealId}_${res.userId}`;
        const currentCount = this.userClaimsMap.get(userKey) || 0;
        const newCount = Math.max(0, currentCount - res.quantity);
        if (newCount === 0) {
          this.userClaimsMap.delete(userKey);
        } else {
          this.userClaimsMap.set(userKey, newCount);
        }

        this.reservationsMap.delete(id);
        releasedCount += res.quantity;

        this.emit('claim:released', {
          dealId: res.dealId,
          reservationId: id,
          userId: res.userId,
          quantity: res.quantity,
          reason: 'expired'
        });
      }
    }

    return releasedCount;
  }

  /**
   * Reserve a claim with TTL lock, bot protection (maxClaimsPerUser), and stock verification.
   */
  public reserveClaim(
    dealId: string, 
    userId: string, 
    quantity: number = 1, 
    ttlSeconds?: number
  ): DealClaimReservation {
    this.sweepExpiredReservations();

    const deal = this.dealsMap.get(dealId);
    if (!deal) {
      throw new Error(`Deal with ID "${dealId}" not found.`);
    }

    const now = new Date();
    const isStarted = Date.parse(deal.startDate) <= now.getTime();
    const isEnded = Date.parse(deal.endDate) <= now.getTime();

    if (!isStarted) {
      throw new Error(`Deal "${deal.title}" has not started yet.`);
    }
    if (isEnded) {
      this.emit('deal:expired', { dealId, title: deal.title });
      throw new Error(`Deal "${deal.title}" has already ended.`);
    }

    // Bot / Scalper Protection: Check max claims per user
    const userKey = `${dealId}_${userId}`;
    const userClaims = this.userClaimsMap.get(userKey) || 0;
    if (deal.maxClaimsPerUser && (userClaims + quantity) > deal.maxClaimsPerUser) {
      throw new Error(`Deal "${deal.title}" limit of ${deal.maxClaimsPerUser} claim(s) per customer reached.`);
    }

    const currentClaimed = deal.claimedCount || 0;
    if (deal.totalClaimLimit && (currentClaimed + quantity) > deal.totalClaimLimit) {
      this.emit('deal:sold_out', { dealId, title: deal.title, totalClaimLimit: deal.totalClaimLimit });
      throw new Error(`Deal "${deal.title}" claim limit reached. Sold out!`);
    }

    // Increment claims
    deal.claimedCount = currentClaimed + quantity;
    this.userClaimsMap.set(userKey, userClaims + quantity);

    const ttl = ttlSeconds || this.defaultTTL;
    const expiresAt = new Date(now.getTime() + ttl * 1000).toISOString();
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const reservation: DealClaimReservation = {
      reservationId,
      dealId,
      userId,
      quantity,
      reservedAt: now.toISOString(),
      expiresAt,
    };

    this.reservationsMap.set(reservationId, reservation);

    this.emit('claim:reserved', {
      dealId,
      userId,
      reservationId,
      quantity,
      remainingClaims: deal.totalClaimLimit ? Math.max(0, deal.totalClaimLimit - deal.claimedCount) : undefined
    });

    if (deal.totalClaimLimit && deal.claimedCount >= deal.totalClaimLimit) {
      this.emit('deal:sold_out', { dealId, title: deal.title, totalClaimLimit: deal.totalClaimLimit });
    }

    return reservation;
  }

  /**
   * Explicitly release a reserved claim if customer leaves checkout.
   */
  public releaseClaim(reservationId: string): boolean {
    const res = this.reservationsMap.get(reservationId);
    if (!res) return false;

    const deal = this.dealsMap.get(res.dealId);
    if (deal && deal.claimedCount) {
      deal.claimedCount = Math.max(0, deal.claimedCount - res.quantity);
    }

    const userKey = `${res.dealId}_${res.userId}`;
    const userClaims = this.userClaimsMap.get(userKey) || 0;
    const newClaims = Math.max(0, userClaims - res.quantity);
    if (newClaims === 0) {
      this.userClaimsMap.delete(userKey);
    } else {
      this.userClaimsMap.set(userKey, newClaims);
    }

    this.reservationsMap.delete(reservationId);

    this.emit('claim:released', {
      dealId: res.dealId,
      reservationId,
      userId: res.userId,
      quantity: res.quantity,
      reason: 'manual_cancel'
    });

    return true;
  }

  /**
   * Commit reservation upon successful payment/checkout.
   */
  public commitClaim(reservationId: string): boolean {
    const res = this.reservationsMap.get(reservationId);
    if (!res) return false;

    this.reservationsMap.delete(reservationId);

    this.emit('claim:committed', {
      dealId: res.dealId,
      reservationId,
      userId: res.userId,
      quantity: res.quantity
    });

    return true;
  }

  // --- Queries ---

  public listActiveDeals(): Deal[] {
    this.sweepExpiredReservations();
    const now = new Date().getTime();

    return Array.from(this.dealsMap.values()).filter(deal => {
      const start = Date.parse(deal.startDate);
      const end = Date.parse(deal.endDate);
      const hasStock = !deal.totalClaimLimit || (deal.claimedCount || 0) < deal.totalClaimLimit;
      return now >= start && now <= end && hasStock;
    });
  }

  public listUpcomingDeals(): Deal[] {
    const now = new Date().getTime();
    return Array.from(this.dealsMap.values()).filter(deal => {
      return Date.parse(deal.startDate) > now;
    });
  }

  public computeProductDeal(productId: string, originalPrice: number, category?: string): {
    bestDeal?: Deal;
    calculation: DealPriceCalculation;
  } {
    const activeDeals = this.listActiveDeals();
    // Sort by priority descending
    activeDeals.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    let bestDeal: Deal | undefined;
    let maxSavings = 0;
    let bestCalculation: DealPriceCalculation = {
      originalPrice,
      dealPrice: originalPrice,
      savings: 0,
      discountPercentage: 0,
    };

    for (const deal of activeDeals) {
      const matchesProduct = !deal.applicableProductIds || deal.applicableProductIds.includes(productId);
      const matchesCategory = !deal.applicableCategories || (category && deal.applicableCategories.includes(category));

      if (matchesProduct && matchesCategory) {
        const calc = DealsEngine.computeDealPrice(originalPrice, deal);
        if (deal.exclusive) {
          // If exclusive, it immediately wins if it provides savings
          if (calc.savings > 0) {
            return { bestDeal: deal, calculation: calc };
          }
        }
        if (calc.savings > maxSavings) {
          maxSavings = calc.savings;
          bestDeal = deal;
          bestCalculation = calc;
        }
      }
    }

    return { bestDeal, calculation: bestCalculation };
  }

  /**
   * Evaluate deals across an entire shopping cart with Priority, Exclusivity, and Stacking rules.
   */
  public evaluateCartDeals(cartItems: CartItemForDeals[]): CartDealEvaluationResult {
    const activeDeals = this.listActiveDeals();
    // Sort by priority descending
    activeDeals.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const appliedDeals: AppliedDealSummary[] = [];
    const itemPriceOverrides: Record<string, number> = {};
    const itemAppliedDeals: Map<string, Deal[]> = new Map(); // productId -> deals applied

    let originalSubtotal = 0;
    let totalSavings = 0;

    for (const item of cartItems) {
      originalSubtotal += item.unitPrice * item.quantity;
      itemPriceOverrides[item.productId] = item.unitPrice;
      itemAppliedDeals.set(item.productId, []);
    }

    // Check if any active deal is globally exclusive across cart
    const globalExclusiveDeal = activeDeals.find(d => d.exclusive && d.type === 'spend_threshold');
    if (globalExclusiveDeal && globalExclusiveDeal.spendThreshold && originalSubtotal >= globalExclusiveDeal.spendThreshold.minimumSpend) {
      const discount = globalExclusiveDeal.spendThreshold.discountAmount;
      return {
        originalSubtotal: Number(originalSubtotal.toFixed(2)),
        discountedSubtotal: Number((originalSubtotal - discount).toFixed(2)),
        totalSavings: Number(discount.toFixed(2)),
        appliedDeals: [{
          dealId: globalExclusiveDeal.id,
          dealTitle: globalExclusiveDeal.title,
          dealType: globalExclusiveDeal.type,
          discountAmount: discount,
          affectedProductIds: cartItems.map(i => i.productId),
          details: `Exclusive Promotion: Saved $${discount.toFixed(2)}`,
          exclusive: true
        }],
        itemPriceOverrides
      };
    }

    // Evaluate item-level deals
    for (const item of cartItems) {
      let itemDiscount = 0;

      for (const deal of activeDeals) {
        const matchesProduct = !deal.applicableProductIds || deal.applicableProductIds.includes(item.productId);
        const matchesCategory = !deal.applicableCategories || (item.category && deal.applicableCategories.includes(item.category));

        if (!matchesProduct || !matchesCategory) continue;

        // Check stacking rule
        const alreadyApplied = itemAppliedDeals.get(item.productId) || [];
        const hasUnstackable = alreadyApplied.some(d => d.stackable === false);
        if (hasUnstackable || (alreadyApplied.length > 0 && deal.stackable === false)) {
          // Cannot stack with other deals on this item
          continue;
        }

        // A. BOGO Evaluation
        if (deal.type === 'bogo' && deal.bogoRule) {
          const rule = deal.bogoRule;
          const bundleSize = rule.buyQuantity + rule.getQuantity;
          const completeBundles = Math.floor(item.quantity / bundleSize);

          if (completeBundles > 0) {
            const freeUnits = completeBundles * rule.getQuantity;
            const savingsForDeal = freeUnits * item.unitPrice * (rule.discountPercentage / 100);
            
            itemDiscount += savingsForDeal;
            alreadyApplied.push(deal);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(savingsForDeal.toFixed(2)),
              affectedProductIds: [item.productId],
              details: `BOGO: Buy ${rule.buyQuantity}, get ${rule.getQuantity} at ${rule.discountPercentage}% off`,
              exclusive: deal.exclusive
            });

            if (deal.exclusive) break; // Exclusive deal stops further rules on this item
          }
        }

        // B. Tiered Volume Discount
        else if (deal.type === 'tiered_volume' && deal.tiers && deal.tiers.length > 0) {
          const sortedTiers = [...deal.tiers].sort((a, b) => b.minQuantity - a.minQuantity);
          const matchedTier = sortedTiers.find(t => item.quantity >= t.minQuantity);

          if (matchedTier) {
            const savingsForDeal = (item.unitPrice * item.quantity * matchedTier.discountPercentage) / 100;
            itemDiscount += savingsForDeal;
            alreadyApplied.push(deal);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(savingsForDeal.toFixed(2)),
              affectedProductIds: [item.productId],
              details: `Volume Discount: ${matchedTier.discountPercentage}% off for buying ${item.quantity}+ units`,
              exclusive: deal.exclusive
            });

            if (deal.exclusive) break;
          }
        }

        // C. Standard Percentage / Flash Sale / Fixed Discount
        else if (['percentage', 'flash_sale', 'fixed_discount'].includes(deal.type)) {
          const singleCalc = DealsEngine.computeDealPrice(item.unitPrice, deal);
          const totalDealSavings = singleCalc.savings * item.quantity;

          if (totalDealSavings > 0) {
            itemDiscount += totalDealSavings;
            alreadyApplied.push(deal);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(totalDealSavings.toFixed(2)),
              affectedProductIds: [item.productId],
              details: `${deal.title}: Saved $${singleCalc.savings.toFixed(2)} per unit`,
              exclusive: deal.exclusive
            });

            if (deal.exclusive) break;
          }
        }
      }

      if (itemDiscount > 0) {
        totalSavings += itemDiscount;
        const newTotal = (item.unitPrice * item.quantity) - itemDiscount;
        itemPriceOverrides[item.productId] = Number((newTotal / item.quantity).toFixed(2));
      }
    }

    // Evaluate Cart Spend Threshold Deals
    let currentSubtotal = originalSubtotal - totalSavings;
    for (const deal of activeDeals) {
      if (deal.type === 'spend_threshold' && deal.spendThreshold) {
        const threshold = deal.spendThreshold;
        if (currentSubtotal >= threshold.minimumSpend) {
          let cartDiscount = threshold.discountAmount;
          if (threshold.discountPercentage) {
            cartDiscount = (currentSubtotal * threshold.discountPercentage) / 100;
          }

          if (cartDiscount > 0) {
            totalSavings += cartDiscount;
            currentSubtotal = Math.max(0, currentSubtotal - cartDiscount);
            appliedDeals.push({
              dealId: deal.id,
              dealTitle: deal.title,
              dealType: deal.type,
              discountAmount: Number(cartDiscount.toFixed(2)),
              affectedProductIds: cartItems.map(i => i.productId),
              details: `Cart Promotion: Saved $${cartDiscount.toFixed(2)} on orders over $${threshold.minimumSpend}`,
              exclusive: deal.exclusive
            });

            if (deal.exclusive) break;
          }
        }
      }
    }

    const discountedSubtotal = Math.max(0, originalSubtotal - totalSavings);

    return {
      originalSubtotal: Number(originalSubtotal.toFixed(2)),
      discountedSubtotal: Number(discountedSubtotal.toFixed(2)),
      totalSavings: Number(totalSavings.toFixed(2)),
      appliedDeals,
      itemPriceOverrides
    };
  }

  // --- Universal Database Sync ---

  public sync<T = any>(records: T[], mapper?: (record: T) => Deal): number {
    if (!Array.isArray(records)) {
      throw new Error('sync requires an array of records.');
    }

    let synced = 0;
    for (const rec of records) {
      try {
        const deal: Deal = mapper ? mapper(rec) : (rec as unknown as Deal);
        if (deal && deal.id && deal.title && deal.type) {
          this.registerDeal(deal);
          synced++;
        }
      } catch (e) {
        // Skip malformed records
      }
    }
    return synced;
  }
}

export const deals = new BoostDealsManager();
