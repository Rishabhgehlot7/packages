import { TimeRemaining, DealClaimInfo } from './types';
export declare class DealsEngine {
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
//# sourceMappingURL=engine.d.ts.map