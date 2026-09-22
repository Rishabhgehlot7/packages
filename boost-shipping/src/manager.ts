import {
  BoostCartLike,
  CarrierName,
  CarrierRoutingStrategy,
  CartShippingCalculationResult,
  CourierRateOption,
  CreateShipmentOptions,
  CreateShipmentResult,
  FreeShippingRule,
  NDRActionOptions,
  NDRActionResult,
  PickupScheduleOptions,
  PickupScheduleResult,
  PincodeCheckOptions,
  PincodeCheckResult,
  ShippingManagerOptions,
  TrackingResult,
} from './types';
import { BaseShippingAdapter } from './adapters/base.adapter';
import { ShiprocketAdapter } from './adapters/shiprocket.adapter';
import { DelhiveryAdapter } from './adapters/delhivery.adapter';
import { ShadowfaxAdapter } from './adapters/shadowfax.adapter';
import { BluedartAdapter } from './adapters/bluedart.adapter';
import { XpressbeesAdapter } from './adapters/xpressbees.adapter';
import { EcomExpressAdapter } from './adapters/ecomexpress.adapter';
import { PincodeDetails, PincodeIntelligence } from './pincode';
import { PackagingOptimizer, PackagingSuggestionResult } from './packaging';
import { RTOEvaluationInput, RTORiskAssessment, RTORiskEngine } from './rto';

export class ShippingManager {
  private readonly adapters: Map<CarrierName, BaseShippingAdapter> = new Map();
  private readonly defaultCarrier: CarrierName;
  private readonly freeShippingRule?: FreeShippingRule;

  constructor(private readonly options: ShippingManagerOptions) {
    this.defaultCarrier = options.defaultCarrier || 'shiprocket';
    this.freeShippingRule = options.freeShippingRule;

    const { carriers } = options;
    if (carriers.shiprocket) {
      this.adapters.set('shiprocket', new ShiprocketAdapter(carriers.shiprocket));
    }
    if (carriers.delhivery) {
      this.adapters.set('delhivery', new DelhiveryAdapter(carriers.delhivery));
    }
    if (carriers.shadowfax) {
      this.adapters.set('shadowfax', new ShadowfaxAdapter(carriers.shadowfax));
    }
    if (carriers.bluedart) {
      this.adapters.set('bluedart', new BluedartAdapter(carriers.bluedart));
    }
    if (carriers.xpressbees) {
      this.adapters.set('xpressbees', new XpressbeesAdapter(carriers.xpressbees));
    }
    if (carriers.ecomexpress) {
      this.adapters.set('ecomexpress', new EcomExpressAdapter(carriers.ecomexpress));
    }
  }

  public getAdapter(carrier: CarrierName): BaseShippingAdapter {
    const adapter = this.adapters.get(carrier);
    if (!adapter) {
      throw new Error(`Carrier '${carrier}' is not configured in ShippingManager.`);
    }
    return adapter;
  }

  public listConfiguredCarriers(): CarrierName[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Offline sub-millisecond Indian pincode resolution
   */
  public resolvePincodeOffline(pincode: string | number): PincodeDetails {
    return PincodeIntelligence.resolvePincode(pincode);
  }

  /**
   * Check delivery serviceability with Indian Pincode Intelligence.
   * Seamlessly merges carrier API data with offline state & delivery tier.
   */
  public async checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult> {
    const offline = PincodeIntelligence.resolvePincode(options.deliveryPincode);
    const carrier = options.carrier || this.defaultCarrier;

    try {
      const adapter = this.getAdapter(carrier);
      const res = await adapter.checkPincode(options);
      return {
        ...res,
        state: offline.state || res.state,
        city: offline.majorHub || res.city,
        tier: offline.tier,
      };
    } catch {
      // Graceful offline fallback if carrier API is unreachable or during client-side testing
      return {
        carrier,
        pincode: String(options.deliveryPincode),
        isServiceable: offline.isValid,
        isCodAvailable: offline.isCodGenerallyAvailable,
        estimatedDeliveryDays: offline.expectedStandardDays,
        state: offline.state,
        city: offline.majorHub,
        tier: offline.tier,
      };
    }
  }

  /**
   * Compare rates across all configured carriers with smart strategy sorting.
   */
  public async compareRates(
    options: PincodeCheckOptions,
    strategy: CarrierRoutingStrategy = 'CHEAPEST'
  ): Promise<CourierRateOption[]> {
    const allRates: CourierRateOption[] = [];

    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const res = await adapter.checkPincode(options);
        if (res.rates && res.rates.length > 0) {
          allRates.push(...res.rates);
        } else if (res.isServiceable) {
          allRates.push({
            carrier: name,
            courierName: `${name.toUpperCase()} Standard`,
            rate: 65, // Standard baseline rate estimate
            estimatedDeliveryDays: res.estimatedDeliveryDays || 3,
            codAvailable: res.isCodAvailable,
          });
        }
      } catch (err: any) {
        console.warn(`[ShippingManager RateCheck] Carrier '${name}' failed: ${err.message}`);
      }
    }

    if (strategy === 'CHEAPEST') {
      allRates.sort((a, b) => a.rate - b.rate);
    } else if (strategy === 'FASTEST') {
      allRates.sort((a, b) => a.estimatedDeliveryDays - b.estimatedDeliveryDays);
    }

    return allRates;
  }

  /**
   * Calculate shipping for a @boostengine/cart instance with free shipping threshold progress
   */
  public async calculateCartShipping(
    cart: BoostCartLike,
    deliveryPincode: string,
    options: {
      isCod?: boolean;
      customFreeShippingRule?: FreeShippingRule;
      strategy?: CarrierRoutingStrategy;
    } = {}
  ): Promise<CartShippingCalculationResult> {
    const rule = options.customFreeShippingRule || this.freeShippingRule || {
      minOrderAmount: 999,
      defaultShippingFee: 60,
    };

    const cartTotal = cart.total ?? cart.subtotal ?? 0;
    const isFree = cartTotal >= rule.minOrderAmount;
    const amountNeeded = isFree ? 0 : Math.max(0, rule.minOrderAmount - cartTotal);
    const progressPercent = Math.min(100, Math.round((cartTotal / rule.minOrderAmount) * 100));

    // Calculate total billable weight from cart items
    let totalDeadWeightKg = 0;
    for (const item of cart.items) {
      const itemWeight = item.weightKg || 0.4;
      totalDeadWeightKg += itemWeight * item.quantity;
    }

    // Check rates across couriers
    const rates = await this.compareRates(
      {
        deliveryPincode,
        weightKg: totalDeadWeightKg,
        isCod: options.isCod,
      },
      options.strategy || 'CHEAPEST'
    );

    const cheapest = rates.length > 0 ? rates[0] : undefined;
    const fastest =
      rates.length > 0
        ? [...rates].sort((a, b) => a.estimatedDeliveryDays - b.estimatedDeliveryDays)[0]
        : undefined;

    const baseFee = isFree ? 0 : (cheapest?.rate ?? rule.defaultShippingFee);
    const estDays = cheapest?.estimatedDeliveryDays || 3;
    const estDeliveryDate = PincodeIntelligence.estimateDeliveryDate(deliveryPincode);

    return {
      isFreeShipping: isFree,
      shippingFee: baseFee,
      amountNeededForFreeShipping: amountNeeded,
      freeShippingProgressPercent: progressPercent,
      totalBillableWeightKg: Math.round(totalDeadWeightKg * 100) / 100,
      matchedCouriers: rates,
      cheapestCourier: cheapest,
      fastestCourier: fastest,
      estimatedDeliveryDays: estDays,
      deliveryDateFormatted: estDeliveryDate.toDateString(),
    };
  }

  /**
   * Evaluates COD Fraud & RTO Risk before creating shipment
   */
  public evaluateRTORisk(input: RTOEvaluationInput): RTORiskAssessment {
    return RTORiskEngine.evaluateOrder(input);
  }

  /**
   * Suggests best-fitting packaging box or poly-flyer
   */
  public suggestPackaging(
    deadWeightKg: number,
    approxVolumeCm3?: number
  ): PackagingSuggestionResult {
    return PackagingOptimizer.suggestContainer(deadWeightKg, approxVolumeCm3);
  }

  /**
   * Book shipment with automatic multi-carrier failover
   */
  public async createShipment(
    options: CreateShipmentOptions,
    enableFailover: boolean = true
  ): Promise<CreateShipmentResult> {
    const primaryCarrier = options.carrier || this.defaultCarrier;
    
    try {
      const adapter = this.getAdapter(primaryCarrier);
      return await adapter.createShipment(options);
    } catch (err: any) {
      if (!enableFailover) throw err;

      // Failover to next available carrier
      const fallbackCarriers = this.listConfiguredCarriers().filter((c) => c !== primaryCarrier);
      for (const fallback of fallbackCarriers) {
        try {
          console.warn(
            `[ShippingManager Failover] Carrier '${primaryCarrier}' failed. Retrying with '${fallback}'...`
          );
          const fallbackAdapter = this.getAdapter(fallback);
          return await fallbackAdapter.createShipment({ ...options, carrier: fallback });
        } catch {
          // continue to next fallback
        }
      }

      throw err;
    }
  }

  /**
   * Smart Router: Automatically routes and books shipment using selected strategy (CHEAPEST / FASTEST)
   */
  public async routeShipment(
    options: CreateShipmentOptions,
    strategy: CarrierRoutingStrategy = 'CHEAPEST'
  ): Promise<CreateShipmentResult> {
    try {
      const rates = await this.compareRates(
        {
          deliveryPincode: options.customerAddress.pincode,
          pickupPincode: options.pickupAddress?.pincode,
          weightKg: options.dimensions.weightKg,
          isCod: options.paymentMode === 'COD',
        },
        strategy
      );

      if (rates.length > 0) {
        const selected = rates[0];
        return this.createShipment({
          ...options,
          carrier: selected.carrier,
          courierId: selected.courierId,
        });
      }
    } catch {
      // Fall back to default
    }

    return this.createShipment(options);
  }

  public async schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult> {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.schedulePickup(options);
  }

  public async track(awbNumber: string, carrier?: CarrierName): Promise<TrackingResult> {
    const target = carrier || this.defaultCarrier;
    const adapter = this.getAdapter(target);
    return adapter.track(awbNumber);
  }

  public async actionNDR(options: NDRActionOptions): Promise<NDRActionResult> {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.actionNDR(options);
  }
}

export function createShippingManager(options: ShippingManagerOptions): ShippingManager {
  return new ShippingManager(options);
}
