export type CarrierName = 'shiprocket' | 'delhivery' | 'shadowfax' | 'bluedart' | 'custom';

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
}

export interface PincodeCheckResult {
  carrier: CarrierName;
  pincode: string;
  isServiceable: boolean;
  isCodAvailable: boolean;
  estimatedDeliveryDays?: number;
  estimatedDeliveryDate?: string;
  rates?: CourierRateOption[];
  rawResponse?: any;
}

export interface ShipmentItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
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
  currentStatus: 'ORDER_PLACED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RTO_INITIATED' | 'RTO_DELIVERED' | 'FAILED';
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
}

export interface ShippingManagerOptions {
  defaultCarrier?: CarrierName;
  carriers: {
    shiprocket?: ShiprocketConfig;
    delhivery?: DelhiveryConfig;
    shadowfax?: ShadowfaxConfig;
    bluedart?: BluedartConfig;
  };
  pickupAddress?: ShippingAddress;
}
