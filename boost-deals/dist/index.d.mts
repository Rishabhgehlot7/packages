interface TimeRemaining {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
    formatted: string;
}
interface DealClaimInfo {
    claimedCount: number;
    totalAvailable: number;
    percentageClaimed: number;
    isSoldOut: boolean;
    urgencyText: string;
}
interface LightningDeal {
    id: string;
    productId: string;
    title: string;
    dealPrice: number;
    originalPrice: number;
    discountPercentage: number;
    startsAt: string;
    endsAt: string;
    totalStockForDeal: number;
    claimedStock: number;
    isExclusivePrime?: boolean;
}
interface FlashSaleConfig {
    saleTitle: string;
    bannerSubtitle?: string;
    endsAt: string;
    deals: LightningDeal[];
}

declare class DealsEngine {
    /**
     * Calculates live remaining time until a deal ends
     */
    static calculateTimeRemaining(endsAt: string | Date): TimeRemaining;
    /**
     * Calculates percentage claimed and urgency label (Amazon Lightning Deals style)
     */
    static calculateClaimInfo(claimed: number, total: number): DealClaimInfo;
    /**
     * Applies deal pricing to a base price
     */
    static computeDealPrice(originalPrice: number, discountPercentage: number): {
        dealPrice: number;
        savings: number;
    };
}

export { type DealClaimInfo, DealsEngine, type FlashSaleConfig, type LightningDeal, type TimeRemaining };
