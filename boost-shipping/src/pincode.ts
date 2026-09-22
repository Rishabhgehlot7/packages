/**
 * Indian Pincode Intelligence & Offline Heuristics Engine
 * Provides sub-millisecond offline validation, city/state heuristics, and delivery tier resolution.
 */

export type DeliveryTier = 'METRO' | 'TIER_1' | 'TIER_2' | 'REMOTE';

export interface PincodeDetails {
  pincode: string;
  isValid: boolean;
  state?: string;
  majorHub?: string;
  tier: DeliveryTier;
  expectedStandardDays: number;
  isCodGenerallyAvailable: boolean;
}

// Prefix to region/state and tier mapping heuristic
interface PrefixMeta {
  prefix: string;
  state: string;
  majorHub: string;
  tier: DeliveryTier;
  standardDays: number;
}

const PINCODE_PREFIX_MAP: PrefixMeta[] = [
  // Delhi NCR
  { prefix: '11', state: 'Delhi', majorHub: 'New Delhi', tier: 'METRO', standardDays: 2 },
  { prefix: '12', state: 'Haryana', majorHub: 'Gurugram/Faridabad', tier: 'TIER_1', standardDays: 2 },
  { prefix: '20', state: 'Uttar Pradesh', majorHub: 'Noida/Ghaziabad', tier: 'TIER_1', standardDays: 2 },
  
  // Maharashtra & Goa
  { prefix: '40', state: 'Maharashtra', majorHub: 'Mumbai/Thane', tier: 'METRO', standardDays: 2 },
  { prefix: '41', state: 'Maharashtra', majorHub: 'Pune', tier: 'TIER_1', standardDays: 2 },
  { prefix: '42', state: 'Maharashtra', majorHub: 'Nashik', tier: 'TIER_2', standardDays: 3 },
  { prefix: '43', state: 'Maharashtra', majorHub: 'Aurangabad', tier: 'TIER_2', standardDays: 3 },
  { prefix: '44', state: 'Maharashtra', majorHub: 'Nagpur', tier: 'TIER_1', standardDays: 3 },
  { prefix: '403', state: 'Goa', majorHub: 'Panaji', tier: 'TIER_2', standardDays: 3 },

  // Karnataka
  { prefix: '56', state: 'Karnataka', majorHub: 'Bengaluru', tier: 'METRO', standardDays: 2 },
  { prefix: '57', state: 'Karnataka', majorHub: 'Mangaluru/Mysuru', tier: 'TIER_2', standardDays: 3 },
  { prefix: '58', state: 'Karnataka', majorHub: 'Hubballi/Belagavi', tier: 'TIER_2', standardDays: 3 },

  // Tamil Nadu & Pondicherry
  { prefix: '60', state: 'Tamil Nadu', majorHub: 'Chennai', tier: 'METRO', standardDays: 2 },
  { prefix: '64', state: 'Tamil Nadu', majorHub: 'Coimbatore', tier: 'TIER_1', standardDays: 2 },
  { prefix: '62', state: 'Tamil Nadu', majorHub: 'Madurai', tier: 'TIER_2', standardDays: 3 },

  // Telangana & Andhra Pradesh
  { prefix: '50', state: 'Telangana', majorHub: 'Hyderabad', tier: 'METRO', standardDays: 2 },
  { prefix: '51', state: 'Andhra Pradesh', majorHub: 'Tirupati', tier: 'TIER_2', standardDays: 3 },
  { prefix: '52', state: 'Andhra Pradesh', majorHub: 'Vijayawada', tier: 'TIER_1', standardDays: 2 },
  { prefix: '53', state: 'Andhra Pradesh', majorHub: 'Visakhapatnam', tier: 'TIER_1', standardDays: 2 },

  // West Bengal & North East
  { prefix: '70', state: 'West Bengal', majorHub: 'Kolkata', tier: 'METRO', standardDays: 2 },
  { prefix: '71', state: 'West Bengal', majorHub: 'Howrah', tier: 'TIER_1', standardDays: 2 },
  { prefix: '73', state: 'West Bengal', majorHub: 'Siliguri', tier: 'TIER_2', standardDays: 3 },
  { prefix: '78', state: 'Assam', majorHub: 'Guwahati', tier: 'TIER_2', standardDays: 4 },
  { prefix: '79', state: 'North East', majorHub: 'Shillong/Imphal/Aizawl', tier: 'REMOTE', standardDays: 5 },

  // Gujarat
  { prefix: '38', state: 'Gujarat', majorHub: 'Ahmedabad', tier: 'METRO', standardDays: 2 },
  { prefix: '39', state: 'Gujarat', majorHub: 'Surat/Vadodara', tier: 'TIER_1', standardDays: 2 },
  { prefix: '36', state: 'Gujarat', majorHub: 'Rajkot', tier: 'TIER_2', standardDays: 3 },

  // Rajasthan
  { prefix: '30', state: 'Rajasthan', majorHub: 'Jaipur', tier: 'TIER_1', standardDays: 2 },
  { prefix: '31', state: 'Rajasthan', majorHub: 'Udaipur', tier: 'TIER_2', standardDays: 3 },
  { prefix: '34', state: 'Rajasthan', majorHub: 'Jodhpur', tier: 'TIER_2', standardDays: 3 },

  // Punjab & Chandigarh
  { prefix: '14', state: 'Punjab', majorHub: 'Ludhiana/Amritsar', tier: 'TIER_1', standardDays: 3 },
  { prefix: '16', state: 'Chandigarh/Punjab', majorHub: 'Chandigarh', tier: 'TIER_1', standardDays: 2 },

  // Madhya Pradesh
  { prefix: '45', state: 'Madhya Pradesh', majorHub: 'Indore', tier: 'TIER_1', standardDays: 2 },
  { prefix: '46', state: 'Madhya Pradesh', majorHub: 'Bhopal', tier: 'TIER_1', standardDays: 3 },

  // Kerala
  { prefix: '68', state: 'Kerala', majorHub: 'Kochi/Ernakulam', tier: 'TIER_1', standardDays: 2 },
  { prefix: '69', state: 'Kerala', majorHub: 'Thiruvananthapuram', tier: 'TIER_1', standardDays: 3 },

  // Bihar & Jharkhand
  { prefix: '80', state: 'Bihar', majorHub: 'Patna', tier: 'TIER_1', standardDays: 3 },
  { prefix: '83', state: 'Jharkhand', majorHub: 'Ranchi/Jamshedpur', tier: 'TIER_2', standardDays: 3 },

  // Odisha
  { prefix: '75', state: 'Odisha', majorHub: 'Bhubaneswar/Cuttack', tier: 'TIER_1', standardDays: 3 },

  // Jammu & Kashmir / Ladakh / Himachal / Uttarakhand
  { prefix: '17', state: 'Himachal Pradesh', majorHub: 'Shimla', tier: 'REMOTE', standardDays: 4 },
  { prefix: '18', state: 'Jammu & Kashmir', majorHub: 'Jammu/Srinagar', tier: 'REMOTE', standardDays: 5 },
  { prefix: '19', state: 'Jammu & Kashmir/Ladakh', majorHub: 'Leh/Kargil', tier: 'REMOTE', standardDays: 6 },
  { prefix: '24', state: 'Uttarakhand', majorHub: 'Dehradun', tier: 'TIER_2', standardDays: 3 },
];

export class PincodeIntelligence {
  private static readonly cache = new Map<string, PincodeDetails>();

  /**
   * Validate standard 6-digit Indian postal pincode format
   */
  public static isValidPincode(pincode: string | number): boolean {
    const clean = String(pincode).trim();
    return /^[1-9][0-9]{5}$/.test(clean);
  }

  /**
   * Resolve state, major hub, delivery tier and transit days offline
   */
  public static resolvePincode(pincode: string | number): PincodeDetails {
    const clean = String(pincode).trim();

    if (this.cache.has(clean)) {
      return this.cache.get(clean)!;
    }

    if (!this.isValidPincode(clean)) {
      const invalidResult: PincodeDetails = {
        pincode: clean,
        isValid: false,
        tier: 'REMOTE',
        expectedStandardDays: 7,
        isCodGenerallyAvailable: false,
      };
      return invalidResult;
    }

    // Try 3-digit prefix first for high specificity, then 2-digit
    const prefix3 = clean.substring(0, 3);
    const prefix2 = clean.substring(0, 2);

    const match =
      PINCODE_PREFIX_MAP.find((m) => m.prefix === prefix3) ||
      PINCODE_PREFIX_MAP.find((m) => m.prefix === prefix2);

    let result: PincodeDetails;

    if (match) {
      result = {
        pincode: clean,
        isValid: true,
        state: match.state,
        majorHub: match.majorHub,
        tier: match.tier,
        expectedStandardDays: match.standardDays,
        isCodGenerallyAvailable: match.tier !== 'REMOTE',
      };
    } else {
      // Safe fallback for unlisted 6-digit valid pincodes
      result = {
        pincode: clean,
        isValid: true,
        tier: 'TIER_2',
        expectedStandardDays: 4,
        isCodGenerallyAvailable: true,
      };
    }

    this.cache.set(clean, result);
    return result;
  }

  /**
   * Estimated delivery date calculator from pincode tier
   */
  public static estimateDeliveryDate(pincode: string | number, fromDate: Date = new Date()): Date {
    const details = this.resolvePincode(pincode);
    const daysToAdd = details.expectedStandardDays;
    
    const delivery = new Date(fromDate);
    let added = 0;
    while (added < daysToAdd) {
      delivery.setDate(delivery.getDate() + 1);
      // Skip Sundays for realistic delivery estimation
      if (delivery.getDay() !== 0) {
        added++;
      }
    }
    return delivery;
  }
}
