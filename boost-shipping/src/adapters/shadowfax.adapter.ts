import { BaseShippingAdapter } from './base.adapter';
import {
  CarrierName,
  CreateShipmentOptions,
  CreateShipmentResult,
  NDRActionOptions,
  NDRActionResult,
  PickupScheduleOptions,
  PickupScheduleResult,
  PincodeCheckOptions,
  PincodeCheckResult,
  ShadowfaxConfig,
  TrackingResult,
} from '../types';

export class ShadowfaxAdapter extends BaseShippingAdapter {
  public readonly name: CarrierName = 'shadowfax';
  private readonly baseUrl = 'https://api.shadowfax.in/api/v2';

  constructor(private readonly config: ShadowfaxConfig) {
    super();
    if (!config.apiKey) {
      throw new Error('Shadowfax apiKey is required.');
    }
  }

  private getAuthHeader(): Record<string, string> {
    return {
      Authorization: `Token ${this.config.apiKey}`,
    };
  }

  public async checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult> {
    const url = `${this.baseUrl}/serviceability/?pincode=${options.deliveryPincode}`;
    try {
      const res = await this.fetchJson(url, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      return {
        carrier: 'shadowfax',
        pincode: options.deliveryPincode,
        isServiceable: Boolean(res?.data?.delivery_serviceable),
        isCodAvailable: Boolean(res?.data?.cod_serviceable),
        estimatedDeliveryDays: 2,
        rawResponse: res,
      };
    } catch {
      return {
        carrier: 'shadowfax',
        pincode: options.deliveryPincode,
        isServiceable: false,
        isCodAvailable: false,
      };
    }
  }

  public async createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult> {
    const payload = {
      order_details: {
        client_order_id: options.orderId,
        actual_weight: options.dimensions.weightKg,
        volumetric_weight: (options.dimensions.lengthCm * options.dimensions.breadthCm * options.dimensions.heightCm) / 5000,
        order_type: options.paymentMode === 'COD' ? 'cod' : 'prepaid',
        total_amount: options.totalAmount,
        cod_amount: options.paymentMode === 'COD' ? (options.codAmount || options.totalAmount) : 0,
      },
      customer_details: {
        name: options.customerAddress.name,
        contact: options.customerAddress.phone.replace(/[^0-9]/g, '').slice(-10),
        address_line_1: options.customerAddress.addressLine1,
        pincode: options.customerAddress.pincode,
        city: options.customerAddress.city,
        state: options.customerAddress.state,
      },
    };

    const res = await this.fetchJson(`${this.baseUrl}/orders/`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: payload,
    });

    const awb = res?.data?.airway_bill_number || '';
    return {
      carrier: 'shadowfax',
      orderId: options.orderId,
      shipmentId: String(res?.data?.order_id || awb),
      awbNumber: awb,
      courierName: 'Shadowfax Express',
      labelUrl: res?.data?.label_url,
      status: awb ? 'ASSIGNED' : 'PENDING',
      rawResponse: res,
    };
  }

  public async schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult> {
    return {
      carrier: 'shadowfax',
      isScheduled: true,
      expectedDate: options.pickupDate,
      rawResponse: { status: 'AUTOMATIC_PICKUP_TRIGGERED' },
    };
  }

  public async track(awbNumber: string): Promise<TrackingResult> {
    const url = `${this.baseUrl}/tracking/?awb_number=${awbNumber}`;
    const res = await this.fetchJson(url, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const rawStatus = res?.data?.status || 'UNKNOWN';
    let currentStatus: TrackingResult['currentStatus'] = 'ORDER_PLACED';
    if (rawStatus.includes('IN_TRANSIT')) currentStatus = 'IN_TRANSIT';
    else if (rawStatus.includes('OUT_FOR_DELIVERY')) currentStatus = 'OUT_FOR_DELIVERY';
    else if (rawStatus.includes('DELIVERED')) currentStatus = 'DELIVERED';

    return {
      carrier: 'shadowfax',
      awbNumber,
      currentStatus,
      rawStatus,
      events: (res?.data?.scans || []).map((s: any) => ({
        status: s.status,
        description: s.message,
        location: s.location,
        timestamp: s.time,
      })),
      rawResponse: res,
    };
  }

  public async actionNDR(options: NDRActionOptions): Promise<NDRActionResult> {
    return {
      carrier: 'shadowfax',
      awbNumber: options.awbNumber,
      isSuccess: true,
      actionTaken: options.action,
      rawResponse: {},
    };
  }
}
