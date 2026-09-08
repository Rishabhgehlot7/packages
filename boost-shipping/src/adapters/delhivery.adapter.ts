import { BaseShippingAdapter } from './base.adapter';
import {
  CarrierName,
  CreateShipmentOptions,
  CreateShipmentResult,
  DelhiveryConfig,
  NDRActionOptions,
  NDRActionResult,
  PickupScheduleOptions,
  PickupScheduleResult,
  PincodeCheckOptions,
  PincodeCheckResult,
  TrackingResult,
} from '../types';

export class DelhiveryAdapter extends BaseShippingAdapter {
  public readonly name: CarrierName = 'delhivery';
  private readonly baseUrl = 'https://track.delhivery.com';

  constructor(private readonly config: DelhiveryConfig) {
    super();
    if (!config.apiToken) {
      throw new Error('Delhivery apiToken is required.');
    }
  }

  private getAuthHeader(): Record<string, string> {
    return {
      Authorization: `Token ${this.config.apiToken}`,
    };
  }

  public async checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult> {
    const url = `${this.baseUrl}/c/api/pin-codes/json/?filter_codes=${options.deliveryPincode}`;
    const res = await this.fetchJson(url, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const deliveryCodes = res?.delivery_codes || [];
    const match = deliveryCodes.find((d: any) => d.postal_code?.pin === parseInt(options.deliveryPincode, 10));

    const isServiceable = Boolean(match);
    const isCodAvailable = match?.postal_code?.cod === 'Y';

    return {
      carrier: 'delhivery',
      pincode: options.deliveryPincode,
      isServiceable,
      isCodAvailable,
      estimatedDeliveryDays: 3,
      rawResponse: res,
    };
  }

  public async createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult> {
    const pickupLocation = options.pickupLocationName || this.config.defaultPickupLocation || 'Primary Warehouse';

    const shipmentData = {
      shipments: [
        {
          name: options.customerAddress.name,
          add: `${options.customerAddress.addressLine1} ${options.customerAddress.addressLine2 || ''}`.trim(),
          pin: options.customerAddress.pincode,
          city: options.customerAddress.city,
          state: options.customerAddress.state,
          country: options.customerAddress.country || 'India',
          phone: options.customerAddress.phone.replace(/[^0-9]/g, '').slice(-10),
          order: options.orderId,
          payment_mode: options.paymentMode === 'COD' ? 'COD' : 'Pre-paid',
          products_desc: options.items.map((i) => i.name).join(', '),
          cod_amount: options.paymentMode === 'COD' ? String(options.codAmount || options.totalAmount) : '0',
          order_date: options.orderDate || new Date().toISOString().slice(0, 19).replace('T', ' '),
          total_amount: String(options.totalAmount),
          quantity: String(options.items.reduce((acc, i) => acc + i.quantity, 0)),
          shipment_width: options.dimensions.breadthCm,
          shipment_height: options.dimensions.heightCm,
          weight: Math.round(options.dimensions.weightKg * 1000), // grams
        },
      ],
      pickup_location: {
        name: pickupLocation,
      },
    };

    const res = await this.fetchJson(`${this.baseUrl}/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        format: 'json',
        data: JSON.stringify(shipmentData),
      },
    });

    const packageDetail = res?.packages?.[0] || {};
    const awbNumber = packageDetail.waybill || '';

    return {
      carrier: 'delhivery',
      orderId: options.orderId,
      shipmentId: awbNumber || options.orderId,
      awbNumber,
      courierName: 'Delhivery Surface/Express',
      labelUrl: awbNumber ? `${this.baseUrl}/api/p/packing_slip?wbns=${awbNumber}&pdf=true` : undefined,
      status: awbNumber ? 'ASSIGNED' : 'PENDING',
      rawResponse: res,
    };
  }

  public async schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult> {
    const pickupLocation = options.pickupLocationName || this.config.defaultPickupLocation || 'Primary Warehouse';
    const payload = {
      pickup_date: options.pickupDate,
      pickup_time: options.pickupTimeSlot || '14:00:00',
      pickup_location: pickupLocation,
      expected_package_count: options.shipmentIds.length,
    };

    const res = await this.fetchJson(`${this.baseUrl}/fm/request/new/`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    return {
      carrier: 'delhivery',
      isScheduled: Boolean(res?.pickup_id || res?.success),
      pickupTokenNumber: String(res?.pickup_id || ''),
      expectedDate: options.pickupDate,
      rawResponse: res,
    };
  }

  public async track(awbNumber: string): Promise<TrackingResult> {
    const url = `${this.baseUrl}/api/v1/packages/json/?waybill=${awbNumber}`;
    const res = await this.fetchJson(url, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const pkg = res?.ShipmentData?.[0]?.Shipment || {};
    const rawStatus = pkg.Status?.Status || 'UNKNOWN';

    let currentStatus: TrackingResult['currentStatus'] = 'ORDER_PLACED';
    if (rawStatus.includes('In Transit') || rawStatus.includes('Dispatched')) currentStatus = 'IN_TRANSIT';
    else if (rawStatus.includes('Out for Delivery')) currentStatus = 'OUT_FOR_DELIVERY';
    else if (rawStatus.includes('Delivered')) currentStatus = 'DELIVERED';
    else if (rawStatus.includes('RTO')) currentStatus = 'RTO_INITIATED';

    const scans = pkg.Scans || [];
    const events = scans.map((s: any) => ({
      status: s.ScanDetail?.Scan || 'Checkpoint',
      description: s.ScanDetail?.Instructions || s.ScanDetail?.Scan,
      location: s.ScanDetail?.ScannedLocation,
      timestamp: s.ScanDetail?.ScanDateTime,
    }));

    return {
      carrier: 'delhivery',
      awbNumber,
      currentStatus,
      rawStatus,
      origin: pkg.Origin,
      destination: pkg.Destination,
      deliveredDate: pkg.Status?.StatusDateTime,
      events,
      rawResponse: res,
    };
  }

  public async actionNDR(options: NDRActionOptions): Promise<NDRActionResult> {
    const payload: any = {
      waybill: options.awbNumber,
      action: options.action === 'REATTEMPT' ? 're-attempt' : 'rto',
    };
    if (options.updatedAddress) {
      if (options.updatedAddress.phone) payload.phone = options.updatedAddress.phone;
      if (options.updatedAddress.addressLine1) payload.add = options.updatedAddress.addressLine1;
    }

    const res = await this.fetchJson(`${this.baseUrl}/api/p/edit`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    return {
      carrier: 'delhivery',
      awbNumber: options.awbNumber,
      isSuccess: res?.status === true || res?.success === true,
      actionTaken: options.action,
      rawResponse: res,
    };
  }
}
