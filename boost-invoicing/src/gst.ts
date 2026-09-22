/**
 * Indian GST State Codes & Name Mapping
 */
export const GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
  '99': 'Centre Jurisdiction',
};

/**
 * Normalized reverse lookup: State name (lowercase trimmed) -> 2-digit GST state code
 */
const STATE_TO_CODE_MAP: Record<string, string> = {};
for (const [code, name] of Object.entries(GST_STATE_CODES)) {
  STATE_TO_CODE_MAP[name.toLowerCase().replace(/[^a-z0-9]/g, '')] = code;
}

// Common aliases for Indian states
STATE_TO_CODE_MAP['jk'] = '01';
STATE_TO_CODE_MAP['jammukashmir'] = '01';
STATE_TO_CODE_MAP['jammuandkashmir'] = '01';
STATE_TO_CODE_MAP['up'] = '09';
STATE_TO_CODE_MAP['uttarpradesh'] = '09';
STATE_TO_CODE_MAP['mp'] = '23';
STATE_TO_CODE_MAP['madhyapradesh'] = '23';
STATE_TO_CODE_MAP['mh'] = '27';
STATE_TO_CODE_MAP['maharashtra'] = '27';
STATE_TO_CODE_MAP['ka'] = '29';
STATE_TO_CODE_MAP['karnataka'] = '29';
STATE_TO_CODE_MAP['tn'] = '33';
STATE_TO_CODE_MAP['tamilnadu'] = '33';
STATE_TO_CODE_MAP['dl'] = '07';
STATE_TO_CODE_MAP['delhi'] = '07';
STATE_TO_CODE_MAP['ncr'] = '07';
STATE_TO_CODE_MAP['newdelhi'] = '07';
STATE_TO_CODE_MAP['wb'] = '19';
STATE_TO_CODE_MAP['westbengal'] = '19';
STATE_TO_CODE_MAP['ts'] = '36';
STATE_TO_CODE_MAP['telangana'] = '36';
STATE_TO_CODE_MAP['ap'] = '37';
STATE_TO_CODE_MAP['andhrapradesh'] = '37';
STATE_TO_CODE_MAP['gj'] = '24';
STATE_TO_CODE_MAP['gujarat'] = '24';
STATE_TO_CODE_MAP['kl'] = '32';
STATE_TO_CODE_MAP['kerala'] = '32';
STATE_TO_CODE_MAP['hr'] = '06';
STATE_TO_CODE_MAP['haryana'] = '06';
STATE_TO_CODE_MAP['rj'] = '08';
STATE_TO_CODE_MAP['rajasthan'] = '08';
STATE_TO_CODE_MAP['pb'] = '03';
STATE_TO_CODE_MAP['punjab'] = '03';

export interface GstinValidationResult {
  isValid: boolean;
  gstin?: string;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  entityType?: string; // Company, Individual, Firm, etc.
  error?: string;
}

const PAN_ENTITY_TYPES: Record<string, string> = {
  C: 'Company',
  P: 'Individual / Proprietorship',
  H: 'Hindu Undivided Family (HUF)',
  F: 'Partnership Firm / LLP',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government Entity',
};

/**
 * Validates a 15-digit Indian GSTIN number and parses state & entity information
 */
export function validateGSTIN(rawGstin: string): GstinValidationResult {
  if (!rawGstin || typeof rawGstin !== 'string') {
    return { isValid: false, error: 'GSTIN must be a non-empty string' };
  }

  const cleaned = rawGstin.trim().toUpperCase();

  // Standard GSTIN Regex: 2 digits + 5 letters + 4 digits + 1 letter + 1 char (1-9A-Z) + 'Z' + 1 checksum char
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Invalid GSTIN format. Must be 15 alphanumeric characters matching Indian GST standard.',
    };
  }

  const stateCode = cleaned.slice(0, 2);
  const stateName = GST_STATE_CODES[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      error: `Invalid GST state code "${stateCode}".`,
    };
  }

  const pan = cleaned.slice(2, 12);
  const entityChar = pan[3];
  const entityType = PAN_ENTITY_TYPES[entityChar] || 'Registered Entity';

  return {
    isValid: true,
    gstin: cleaned,
    stateCode,
    stateName,
    pan,
    entityType,
  };
}

/**
 * Resolves a 2-digit GST state code from a state name or existing state code
 */
export function resolveStateCode(stateNameOrCode: string): string | null {
  if (!stateNameOrCode) return null;
  const trimmed = stateNameOrCode.trim();

  // If already a 2-digit code
  if (/^\d{2}$/.test(trimmed) && GST_STATE_CODES[trimmed]) {
    return trimmed;
  }

  const normalized = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
  return STATE_TO_CODE_MAP[normalized] || null;
}

/**
 * Determines whether a transaction is Intra-State (CGST + SGST) or Inter-State (IGST)
 */
export function determineTaxType(
  sellerStateOrGstin: string,
  buyerStateOrGstin: string
): { isIntraState: boolean; sellerStateCode: string | null; buyerStateCode: string | null } {
  let sellerCode = /^[0-9]{2}[A-Z]/.test(sellerStateOrGstin.trim())
    ? sellerStateOrGstin.trim().slice(0, 2)
    : resolveStateCode(sellerStateOrGstin);

  let buyerCode = /^[0-9]{2}[A-Z]/.test(buyerStateOrGstin.trim())
    ? buyerStateOrGstin.trim().slice(0, 2)
    : resolveStateCode(buyerStateOrGstin);

  // If codes matched, or if strings match case-insensitively when codes can't be found
  const isIntraState =
    (Boolean(sellerCode && buyerCode) && sellerCode === buyerCode) ||
    sellerStateOrGstin.trim().toLowerCase() === buyerStateOrGstin.trim().toLowerCase();

  return {
    isIntraState,
    sellerStateCode: sellerCode,
    buyerStateCode: buyerCode,
  };
}
