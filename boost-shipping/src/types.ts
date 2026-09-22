export type CarrierName =
  | 'shiprocket'
  | 'delhivery'
  | 'shadowfax'
  | 'bluedart'
  | 'xpressbees'
  | 'ecomexpress'
  | 'custom';

export type CarrierRoutingStrategy = 'CHEAPEST' | 'FASTEST' | 'BEST_RATED';

export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface PackageDimensions {
  weightKg: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
}

export interface PincodeCheckOptions {
  carrier?: CarrierName;
  deliveryPincode: string;
  pickupPincode?: string;
  weightKg?: number;
  isCod?: boolean;
}

export interface CourierRateOption {
  carrier: CarrierName;
  courierName: string;
  courierId?: string | number;
  rate: number;
  estimatedDeliveryDays: number;
  estimatedDeliveryDate?: string;
  codAvailable: boolean;
  rating?: number;
}

export interface PincodeCheckResult {
  carrier: CarrierName;
  pincode: string;
  isServiceable: boolean;
  isCodAvailable: boolean;
  estimatedDeliveryDays?: number;
  estimatedDeliveryDate?: string;
  state?: string;
  city?: string;
  tier?: 'METRO' | 'TIER_1' | 'TIER_2' | 'REMOTE';
  rates?: CourierRateOption[];
  rawResponse?: any;
}

export interface ShipmentItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  weightKg?: number;
}

export interface CreateShipmentOptions {
  carrier?: CarrierName;
  orderId: string;
  orderDate?: string;
  customerAddress: ShippingAddress;
  pickupAddress?: ShippingAddress;
  pickupLocationName?: string;
  items: ShipmentItem[];
  dimensions: PackageDimensions;
  paymentMode: 'Prepaid' | 'COD';
  totalAmount: number;
  codAmount?: number;
  courierId?: string | number;
  strategy?: CarrierRoutingStrategy;
}

export interface CreateShipmentResult {
  carrier: CarrierName;
  orderId: string;
  shipmentId: string;
  awbNumber: string;
  courierName: string;
  labelUrl?: string;
  manifestUrl?: string;
  status: 'MANIFESTED' | 'ASSIGNED' | 'PENDING';
  rawResponse: any;
}

export interface PickupScheduleOptions {
  carrier?: CarrierName;
  shipmentIds: string[];
  pickupDate: string;
  pickupTimeSlot?: string;
  pickupLocationName?: string;
}

export interface PickupScheduleResult {
  carrier: CarrierName;
  isScheduled: boolean;
  pickupTokenNumber?: string;
  expectedDate: string;
  rawResponse: any;
}

export interface TrackingEvent {
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface TrackingResult {
  carrier: CarrierName;
  awbNumber: string;
  currentStatus:
    | 'ORDER_PLACED'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'RTO_INITIATED'
    | 'RTO_DELIVERED'
    | 'FAILED';
  rawStatus: string;
  origin?: string;
  destination?: string;
  deliveredDate?: string;
  events: TrackingEvent[];
  rawResponse: any;
}

export interface NDRActionOptions {
  carrier?: CarrierName;
  awbNumber: string;
  action: 'REATTEMPT' | 'RETURN_TO_ORIGIN';
  nextAttemptDate?: string;
  remarks?: string;
  updatedAddress?: Partial<ShippingAddress>;
}

export interface NDRActionResult {
  carrier: CarrierName;
  awbNumber: string;
  isSuccess: boolean;
  actionTaken: string;
  rawResponse: any;
}

export interface FreeShippingRule {
  /** Minimum order amount to qualify for 100% free delivery (e.g. 999) */
  minOrderAmount: number;
  /** Flat shipping fee to charge if subtotal is below minOrderAmount (e.g. 60) */
  defaultShippingFee: number;
}

/**
 * Universal bridge interface compatible with @boostengine/cart
 */
export interface BoostCartLike {
  items: Array<{
    id?: string;
    productId?: string;
    name?: string;
    title?: string;
    price: number;
    quantity: number;
    sku?: string;
    weightKg?: number;
    dimensions?: { lengthCm?: number; breadthCm?: number; heightCm?: number };
  }>;
  total?: number;
  subtotal?: number;
}

export interface CartShippingCalculationResult {
  isFreeShipping: boolean;
  shippingFee: number;
  amountNeededForFreeShipping: number;
  freeShippingProgressPercent: number;
  totalBillableWeightKg: number;
  matchedCouriers: CourierRateOption[];
  cheapestCourier?: CourierRateOption;
  fastestCourier?: CourierRateOption;
  estimatedDeliveryDays?: number;
  deliveryDateFormatted?: string;
}

export interface ShiprocketConfig {
  email?: string;
  password?: string;
  token?: string;
  defaultPickupPincode?: string;
  defaultPickupLocation?: string;
}

export interface DelhiveryConfig {
  apiToken: string;
  defaultPickupPincode?: string;
  defaultPickupLocation?: string;
  mode?: 'S' | 'E'; // Surface or Express
}

export interface ShadowfaxConfig {
  apiKey: string;
  defaultPickupPincode?: string;
}

export interface BluedartConfig {
  loginId: string;
  licenceKey: string;
  customerCode: string;
  defaultPickupPincode?: string;
}

export interface XpressbeesConfig {
  email?: string;
  password?: string;
  key?: string;
  defaultPickupPincode?: string;
}

export interface EcomExpressConfig {
  username: string;
  password: string;
  defaultPickupPincode?: string;
}

export interface ShippingManagerOptions {
  defaultCarrier?: CarrierName;
  carriers: {
    shiprocket?: ShiprocketConfig;
    delhivery?: DelhiveryConfig;
    shadowfax?: ShadowfaxConfig;
    bluedart?: BluedartConfig;
    xpressbees?: XpressbeesConfig;
    ecomexpress?: EcomExpressConfig;
  };
  pickupAddress?: ShippingAddress;
  freeShippingRule?: FreeShippingRule;
}
