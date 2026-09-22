/**
 * Packaging & Volumetric Weight Optimizer
 * Prevents dimensional weight courier penalties and suggests optimal packaging boxes & flyers.
 */

import { PackageDimensions } from './types';

export interface PackagingContainer {
  id: string;
  name: string;
  type: 'FLYER' | 'BOX';
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
  maxDeadWeightKg: number;
  volumetricWeightKg: number;
}

export const STANDARD_PACKAGING_CATALOG: PackagingContainer[] = [
  {
    id: 'flyer_xs',
    name: 'Tamper-Proof Flyer XS (Jewelry / Small Acc)',
    type: 'FLYER',
    lengthCm: 15,
    breadthCm: 10,
    heightCm: 2,
    maxDeadWeightKg: 0.25,
    volumetricWeightKg: (15 * 10 * 2) / 5000, // 0.06 kg
  },
  {
    id: 'flyer_s',
    name: 'Standard Poly Flyer S (T-Shirt / Mobile Cover)',
    type: 'FLYER',
    lengthCm: 25,
    breadthCm: 18,
    heightCm: 3,
    maxDeadWeightKg: 0.5,
    volumetricWeightKg: (25 * 18 * 3) / 5000, // 0.27 kg
  },
  {
    id: 'flyer_m',
    name: 'Standard Poly Flyer M (Jeans / Shoes in Pouch)',
    type: 'FLYER',
    lengthCm: 35,
    breadthCm: 25,
    heightCm: 5,
    maxDeadWeightKg: 1.2,
    volumetricWeightKg: (35 * 25 * 5) / 5000, // 0.875 kg
  },
  {
    id: 'box_s',
    name: 'Corrugated Box Small (Mugs / Cosmetics / Electronics)',
    type: 'BOX',
    lengthCm: 20,
    breadthCm: 15,
    heightCm: 12,
    maxDeadWeightKg: 2.0,
    volumetricWeightKg: (20 * 15 * 12) / 5000, // 0.72 kg
  },
  {
    id: 'box_m',
    name: 'Corrugated Box Medium (Shoe Box / Kitchenware)',
    type: 'BOX',
    lengthCm: 32,
    breadthCm: 22,
    heightCm: 14,
    maxDeadWeightKg: 4.0,
    volumetricWeightKg: (32 * 22 * 14) / 5000, // 1.97 kg
  },
  {
    id: 'box_l',
    name: 'Corrugated Box Large (Winter Jackets / Small Appliances)',
    type: 'BOX',
    lengthCm: 42,
    breadthCm: 30,
    heightCm: 20,
    maxDeadWeightKg: 7.5,
    volumetricWeightKg: (42 * 30 * 20) / 5000, // 5.04 kg
  },
  {
    id: 'box_xl',
    name: 'Corrugated Box XL (Bulky Goods / Multi-orders)',
    type: 'BOX',
    lengthCm: 55,
    breadthCm: 45,
    heightCm: 35,
    maxDeadWeightKg: 15.0,
    volumetricWeightKg: (55 * 45 * 35) / 5000, // 17.32 kg
  },
];

export interface PackagingSuggestionResult {
  suggestedContainer: PackagingContainer;
  deadWeightKg: number;
  volumetricWeightKg: number;
  billableWeightKg: number;
  isVolumetricPenaltyApplied: boolean;
  estimatedWeightPenaltyKg: number;
  recommendation: string;
}

export class PackagingOptimizer {
  private static readonly DEFAULT_DIVISOR = 5000;

  /**
   * Calculates volumetric weight in Kilograms based on dimensions in centimeters.
   * Standard Indian courier divisor = 5000 (Shiprocket, Delhivery, Shadowfax, Bluedart).
   */
  public static calculateVolumetricWeight(
    lengthCm: number,
    breadthCm: number,
    heightCm: number,
    divisor: number = this.DEFAULT_DIVISOR
  ): number {
    const vol = (lengthCm * breadthCm * heightCm) / divisor;
    return Math.round(vol * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculates billable weight (higher of dead weight and volumetric weight)
   */
  public static calculateBillableWeight(
    deadWeightKg: number,
    dimensions: Omit<PackageDimensions, 'weightKg'>,
    divisor: number = this.DEFAULT_DIVISOR
  ): {
    deadWeightKg: number;
    volumetricWeightKg: number;
    billableWeightKg: number;
    billedOn: 'DEAD_WEIGHT' | 'VOLUMETRIC_WEIGHT';
  } {
    const volWeight = this.calculateVolumetricWeight(
      dimensions.lengthCm,
      dimensions.breadthCm,
      dimensions.heightCm,
      divisor
    );

    const billable = Math.max(deadWeightKg, volWeight);
    return {
      deadWeightKg,
      volumetricWeightKg: volWeight,
      billableWeightKg: Math.round(billable * 100) / 100,
      billedOn: volWeight > deadWeightKg ? 'VOLUMETRIC_WEIGHT' : 'DEAD_WEIGHT',
    };
  }

  /**
   * Automatically suggests the best-fitting packaging box or flyer to minimize freight charges.
   */
  public static suggestContainer(
    deadWeightKg: number,
    approxItemVolumeCm3?: number,
    customCatalog: PackagingContainer[] = STANDARD_PACKAGING_CATALOG
  ): PackagingSuggestionResult {
    // Find all containers that can physically carry the dead weight
    const viable = customCatalog.filter((c) => c.maxDeadWeightKg >= deadWeightKg);

    let chosen: PackagingContainer;

    if (approxItemVolumeCm3) {
      // Find the smallest container whose volume accommodates the item volume (with 15% buffer)
      const bufferVolume = approxItemVolumeCm3 * 1.15;
      const fit = viable.find((c) => c.lengthCm * c.breadthCm * c.heightCm >= bufferVolume);
      chosen = fit || viable[viable.length - 1] || customCatalog[customCatalog.length - 1];
    } else {
      // Pick smallest container matching weight
      chosen = viable[0] || customCatalog[customCatalog.length - 1];
    }

    const volWeight = chosen.volumetricWeightKg;
    const billableWeight = Math.max(deadWeightKg, volWeight);
    const isPenalty = volWeight > deadWeightKg;
    const penaltyKg = isPenalty ? Math.round((volWeight - deadWeightKg) * 100) / 100 : 0;

    let recommendation = `Use ${chosen.name}. Billed on ${isPenalty ? 'volumetric' : 'dead'} weight (${billableWeight} kg).`;
    if (isPenalty) {
      recommendation += ` Tip: Reduce packing empty space to save ~₹${Math.round(penaltyKg * 40)} freight.`;
    }

    return {
      suggestedContainer: chosen,
      deadWeightKg,
      volumetricWeightKg: volWeight,
      billableWeightKg: billableWeight,
      isVolumetricPenaltyApplied: isPenalty,
      estimatedWeightPenaltyKg: penaltyKg,
      recommendation,
    };
  }
}
