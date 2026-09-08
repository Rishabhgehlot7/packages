import {
  CarrierName,
  CourierRateOption,
  CreateShipmentOptions,
  CreateShipmentResult,
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

export class ShippingManager {
  private readonly adapters: Map<CarrierName, BaseShippingAdapter> = new Map();
  private readonly defaultCarrier: CarrierName;

  constructor(private readonly options: ShippingManagerOptions) {
    this.defaultCarrier = options.defaultCarrier || 'shiprocket';

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
   * Check delivery serviceability and COD availability for a pincode.
   */
  public async checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult> {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.checkPincode(options);
  }

  /**
   * Compare rates across all configured carriers and returns sorted by lowest price.
   */
  public async compareRates(options: PincodeCheckOptions): Promise<CourierRateOption[]> {
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
            rate: 65, // Standard fallback estimate
            estimatedDeliveryDays: res.estimatedDeliveryDays || 3,
            codAvailable: res.isCodAvailable,
          });
        }
      } catch (err: any) {
        console.warn(`[ShippingManager RateCheck] Carrier '${name}' failed: ${err.message}`);
      }
    }

    allRates.sort((a, b) => a.rate - b.rate);
    return allRates;
  }

  /**
   * Book shipment and generate AWB.
   */
  public async createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult> {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.createShipment(options);
  }

  /**
   * Smart Cost-Optimizer: Compares rates and automatically books shipment with the cheapest courier!
   */
  public async createShipmentWithCheapestCourier(
    options: CreateShipmentOptions
  ): Promise<CreateShipmentResult> {
    try {
      const rates = await this.compareRates({
        deliveryPincode: options.customerAddress.pincode,
        pickupPincode: options.pickupAddress?.pincode,
        weightKg: options.dimensions.weightKg,
        isCod: options.paymentMode === 'COD',
      });

      if (rates.length > 0) {
        const cheapest = rates[0];
        console.log(`⚡ [ShippingManager Auto-Select] Selected cheapest courier: ${cheapest.courierName} (Rate: ₹${cheapest.rate})`);
        return this.createShipment({
          ...options,
          carrier: cheapest.carrier,
          courierId: cheapest.courierId,
        });
      }
    } catch {
      // Fall back to default
    }

    return this.createShipment(options);
  }

  /**
   * Schedule courier pickup at warehouse.
   */
  public async schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult> {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.schedulePickup(options);
  }

  /**
   * Live parcel tracking across checkpoints.
   */
  public async track(awbNumber: string, carrier?: CarrierName): Promise<TrackingResult> {
    const target = carrier || this.defaultCarrier;
    const adapter = this.getAdapter(target);
    return adapter.track(awbNumber);
  }

  /**
   * Take action on Non-Delivery Reports (NDR) like re-attempt or RTO.
   */
  public async actionNDR(options: NDRActionOptions): Promise<NDRActionResult> {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.actionNDR(options);
  }
}

export function createShippingManager(options: ShippingManagerOptions): ShippingManager {
  return new ShippingManager(options);
}
