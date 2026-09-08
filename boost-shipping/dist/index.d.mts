type CarrierName = 'shiprocket' | 'delhivery' | 'shadowfax' | 'bluedart' | 'custom';
interface ShippingAddress {
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
interface PackageDimensions {
    weightKg: number;
    lengthCm: number;
    breadthCm: number;
    heightCm: number;
}
interface PincodeCheckOptions {
    carrier?: CarrierName;
    deliveryPincode: string;
    pickupPincode?: string;
    weightKg?: number;
    isCod?: boolean;
}
interface CourierRateOption {
    carrier: CarrierName;
    courierName: string;
    courierId?: string | number;
    rate: number;
    estimatedDeliveryDays: number;
    estimatedDeliveryDate?: string;
    codAvailable: boolean;
}
interface PincodeCheckResult {
    carrier: CarrierName;
    pincode: string;
    isServiceable: boolean;
    isCodAvailable: boolean;
    estimatedDeliveryDays?: number;
    estimatedDeliveryDate?: string;
    rates?: CourierRateOption[];
    rawResponse?: any;
}
interface ShipmentItem {
    name: string;
    sku: string;
    quantity: number;
    price: number;
}
interface CreateShipmentOptions {
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
interface CreateShipmentResult {
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
interface PickupScheduleOptions {
    carrier?: CarrierName;
    shipmentIds: string[];
    pickupDate: string;
    pickupTimeSlot?: string;
    pickupLocationName?: string;
}
interface PickupScheduleResult {
    carrier: CarrierName;
    isScheduled: boolean;
    pickupTokenNumber?: string;
    expectedDate: string;
    rawResponse: any;
}
interface TrackingEvent {
    status: string;
    description: string;
    location?: string;
    timestamp: string;
}
interface TrackingResult {
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
interface NDRActionOptions {
    carrier?: CarrierName;
    awbNumber: string;
    action: 'REATTEMPT' | 'RETURN_TO_ORIGIN';
    nextAttemptDate?: string;
    remarks?: string;
    updatedAddress?: Partial<ShippingAddress>;
}
interface NDRActionResult {
    carrier: CarrierName;
    awbNumber: string;
    isSuccess: boolean;
    actionTaken: string;
    rawResponse: any;
}
interface ShiprocketConfig {
    email?: string;
    password?: string;
    token?: string;
    defaultPickupPincode?: string;
    defaultPickupLocation?: string;
}
interface DelhiveryConfig {
    apiToken: string;
    defaultPickupPincode?: string;
    defaultPickupLocation?: string;
    mode?: 'S' | 'E';
}
interface ShadowfaxConfig {
    apiKey: string;
    defaultPickupPincode?: string;
}
interface BluedartConfig {
    loginId: string;
    licenceKey: string;
    customerCode: string;
}
interface ShippingManagerOptions {
    defaultCarrier?: CarrierName;
    carriers: {
        shiprocket?: ShiprocketConfig;
        delhivery?: DelhiveryConfig;
        shadowfax?: ShadowfaxConfig;
        bluedart?: BluedartConfig;
    };
    pickupAddress?: ShippingAddress;
}

declare abstract class BaseShippingAdapter {
    abstract readonly name: CarrierName;
    abstract checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    abstract createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    abstract schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    abstract track(awbNumber: string): Promise<TrackingResult>;
    abstract actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
    protected fetchJson<T = any>(url: string, options?: {
        method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
        headers?: Record<string, string>;
        body?: any;
    }): Promise<T>;
}

declare class ShippingManager {
    private readonly options;
    private readonly adapters;
    private readonly defaultCarrier;
    constructor(options: ShippingManagerOptions);
    getAdapter(carrier: CarrierName): BaseShippingAdapter;
    listConfiguredCarriers(): CarrierName[];
    /**
     * Check delivery serviceability and COD availability for a pincode.
     */
    checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    /**
     * Compare rates across all configured carriers and returns sorted by lowest price.
     */
    compareRates(options: PincodeCheckOptions): Promise<CourierRateOption[]>;
    /**
     * Book shipment and generate AWB.
     */
    createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    /**
     * Smart Cost-Optimizer: Compares rates and automatically books shipment with the cheapest courier!
     */
    createShipmentWithCheapestCourier(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    /**
     * Schedule courier pickup at warehouse.
     */
    schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    /**
     * Live parcel tracking across checkpoints.
     */
    track(awbNumber: string, carrier?: CarrierName): Promise<TrackingResult>;
    /**
     * Take action on Non-Delivery Reports (NDR) like re-attempt or RTO.
     */
    actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
}
declare function createShippingManager(options: ShippingManagerOptions): ShippingManager;

declare class ShiprocketAdapter extends BaseShippingAdapter {
    private readonly config;
    readonly name: CarrierName;
    private readonly baseUrl;
    private token;
    constructor(config: ShiprocketConfig);
    private getToken;
    checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    track(awbNumber: string): Promise<TrackingResult>;
    actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
}

declare class DelhiveryAdapter extends BaseShippingAdapter {
    private readonly config;
    readonly name: CarrierName;
    private readonly baseUrl;
    constructor(config: DelhiveryConfig);
    private getAuthHeader;
    checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    track(awbNumber: string): Promise<TrackingResult>;
    actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
}

declare class ShadowfaxAdapter extends BaseShippingAdapter {
    private readonly config;
    readonly name: CarrierName;
    private readonly baseUrl;
    constructor(config: ShadowfaxConfig);
    private getAuthHeader;
    checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    track(awbNumber: string): Promise<TrackingResult>;
    actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
}

export { BaseShippingAdapter, type BluedartConfig, type CarrierName, type CourierRateOption, type CreateShipmentOptions, type CreateShipmentResult, DelhiveryAdapter, type DelhiveryConfig, type NDRActionOptions, type NDRActionResult, type PackageDimensions, type PickupScheduleOptions, type PickupScheduleResult, type PincodeCheckOptions, type PincodeCheckResult, ShadowfaxAdapter, type ShadowfaxConfig, type ShipmentItem, type ShippingAddress, ShippingManager, type ShippingManagerOptions, ShiprocketAdapter, type ShiprocketConfig, type TrackingEvent, type TrackingResult, createShippingManager };
