export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  formatted: string; // e.g. "02h 45m 12s"
}

export interface DealClaimInfo {
  claimedCount: number;
  totalAvailable: number;
  percentageClaimed: number; // 0 to 100
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
  startsAt: string; // ISO string
  endsAt: string;   // ISO string
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
