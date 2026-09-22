import { C as CarrierName, S as ShiprocketConfig, P as PincodeCheckOptions, a as PincodeCheckResult, b as CreateShipmentOptions, c as CreateShipmentResult, d as PickupScheduleOptions, e as PickupScheduleResult, T as TrackingResult, N as NDRActionOptions, f as NDRActionResult, D as DelhiveryConfig, g as ShadowfaxConfig, B as BluedartConfig, X as XpressbeesConfig, E as EcomExpressConfig } from './pincode-DwhdMRxq.mjs';
export { h as BoostCartLike, i as CarrierRoutingStrategy, j as CartShippingCalculationResult, k as CourierRateOption, l as DeliveryTier, F as FreeShippingRule, m as PackageDimensions, n as PincodeDetails, o as PincodeIntelligence, p as ShipmentItem, q as ShippingAddress, r as ShippingManagerOptions, s as TrackingEvent } from './pincode-DwhdMRxq.mjs';
import { B as BaseShippingAdapter } from './agent-aLmNaxYc.mjs';
export { A as AgentToolDefinition, P as PackagingContainer, a as PackagingOptimizer, b as PackagingSuggestionResult, R as RTOActionSuggestion, c as RTOEvaluationInput, d as RTORiskAssessment, e as RTORiskEngine, f as RTORiskLevel, S as STANDARD_PACKAGING_CATALOG, g as ShippingAgentToolkit, h as ShippingManager, i as createShippingManager } from './agent-aLmNaxYc.mjs';

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

declare class BluedartAdapter extends BaseShippingAdapter {
    private readonly config;
    readonly name: CarrierName;
    private readonly baseUrl;
    constructor(config: BluedartConfig);
    private getAuthHeader;
    checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    track(awbNumber: string): Promise<TrackingResult>;
    actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
}

declare class XpressbeesAdapter extends BaseShippingAdapter {
    private readonly config;
    readonly name: CarrierName;
    private readonly baseUrl;
    private token;
    constructor(config: XpressbeesConfig);
    private getToken;
    checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    track(awbNumber: string): Promise<TrackingResult>;
    actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
}

declare class EcomExpressAdapter extends BaseShippingAdapter {
    private readonly config;
    readonly name: CarrierName;
    private readonly baseUrl;
    constructor(config: EcomExpressConfig);
    checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
    createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
    schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
    track(awbNumber: string): Promise<TrackingResult>;
    actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;
}

export { BaseShippingAdapter, BluedartAdapter, BluedartConfig, CarrierName, CreateShipmentOptions, CreateShipmentResult, DelhiveryAdapter, DelhiveryConfig, EcomExpressAdapter, EcomExpressConfig, NDRActionOptions, NDRActionResult, PickupScheduleOptions, PickupScheduleResult, PincodeCheckOptions, PincodeCheckResult, ShadowfaxAdapter, ShadowfaxConfig, ShiprocketAdapter, ShiprocketConfig, TrackingResult, XpressbeesAdapter, XpressbeesConfig };
