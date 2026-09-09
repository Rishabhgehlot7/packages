export interface TimeRemaining {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
    formatted: string;
}
export interface DealClaimInfo {
    claimedCount: number;
    totalAvailable: number;
    percentageClaimed: number;
    isSoldOut: boolean;
    urgencyText: string;
}
export interface LightningDeal {
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
export interface FlashSaleConfig {
    saleTitle: string;
    bannerSubtitle?: string;
    endsAt: string;
    deals: LightningDeal[];
}
//# sourceMappingURL=types.d.ts.map