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
  ShiprocketConfig,
  TrackingResult,
} from '../types';

export class ShiprocketAdapter extends BaseShippingAdapter {
  public readonly name: CarrierName = 'shiprocket';
  private readonly baseUrl = 'https://apiv2.shiprocket.in/v1/external';
  private token: string | null = null;

  constructor(private readonly config: ShiprocketConfig) {
    super();
    if (config.token) {
      this.token = config.token;
    }
  }

  private async getToken(): Promise<string> {
    if (this.token) return this.token;
    if (!this.config.email || !this.config.password) {
      throw new Error('Shiprocket requires either token or email & password credentials.');
    }

    const res = await this.fetchJson(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      body: {
        email: this.config.email,
        password: this.config.password,
      },
    });

    if (!res.token) {
      throw new Error('Failed to obtain Shiprocket JWT token.');
    }

    this.token = res.token;
    return res.token;
  }

  public async checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult> {
    const token = await this.getToken();
    const pickup = options.pickupPincode || this.config.defaultPickupPincode || '110001';
    const weight = options.weightKg || 0.5;
    const cod = options.isCod ? 1 : 0;

    const url = `${this.baseUrl}/courier/serviceability?pickup_postcode=${pickup}&delivery_postcode=${options.deliveryPincode}&weight=${weight}&cod=${cod}`;
    const res = await this.fetchJson(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const couriers = res?.data?.available_courier_companies || [];
    const isServiceable = couriers.length > 0;
    const isCodAvailable = couriers.some((c: any) => c.cod === 1);

    const rates = couriers.map((c: any) => ({
      carrier: 'shiprocket' as CarrierName,
      courierName: c.courier_name,
      courierId: c.courier_company_id,
      rate: parseFloat(c.rate),
      estimatedDeliveryDays: parseInt(c.estimated_delivery_days || '3', 10),
      codAvailable: c.cod === 1,
    }));

    // Sort by cheapest rate
    rates.sort((a: any, b: any) => a.rate - b.rate);

    const best = rates[0];
    return {
      carrier: 'shiprocket',
      pincode: options.deliveryPincode,
      isServiceable,
      isCodAvailable,
      estimatedDeliveryDays: best?.estimatedDeliveryDays,
      rates,
      rawResponse: res,
    };
  }

  public async createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult> {
    const token = await this.getToken();
    const pickupLocation = options.pickupLocationName || this.config.defaultPickupLocation || 'Primary Warehouse';

    const orderPayload = {
      order_id: options.orderId,
      order_date: options.orderDate || new Date().toISOString().slice(0, 19).replace('T', ' '),
      pickup_location: pickupLocation,
      billing_customer_name: options.customerAddress.name.split(' ')[0],
      billing_last_name: options.customerAddress.name.split(' ').slice(1).join(' ') || 'Customer',
      billing_address: options.customerAddress.addressLine1,
      billing_address_2: options.customerAddress.addressLine2 || '',
      billing_city: options.customerAddress.city,
      billing_pincode: options.customerAddress.pincode,
      billing_state: options.customerAddress.state,
      billing_country: options.customerAddress.country || 'India',
      billing_email: options.customerAddress.email || 'customer@example.com',
      billing_phone: options.customerAddress.phone.replace(/[^0-9]/g, '').slice(-10),
      shipping_is_billing: true,
      order_items: options.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: options.paymentMode === 'COD' ? 'COD' : 'Prepaid',
      sub_total: options.totalAmount,
      length: options.dimensions.lengthCm,
      breadth: options.dimensions.breadthCm,
      height: options.dimensions.heightCm,
      weight: options.dimensions.weightKg,
    };

    // 1. Create order
    const orderRes = await this.fetchJson(`${this.baseUrl}/orders/create/adhoc`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: orderPayload,
    });

    const shipmentId = String(orderRes.shipment_id);

    // 2. Generate AWB
    let awbNumber = '';
    let courierName = 'Auto Courier';
    try {
      const awbPayload: any = { shipment_id: shipmentId };
      if (options.courierId) awbPayload.courier_id = options.courierId;

      const awbRes = await this.fetchJson(`${this.baseUrl}/courier/assign/awb`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: awbPayload,
      });

      awbNumber = awbRes?.response?.data?.awb_code || '';
      courierName = awbRes?.response?.data?.courier_name || courierName;
    } catch {
      // Order created, AWB can be assigned manually
    }

    return {
      carrier: 'shiprocket',
      orderId: options.orderId,
      shipmentId,
      awbNumber,
      courierName,
      status: awbNumber ? 'ASSIGNED' : 'MANIFESTED',
      rawResponse: orderRes,
    };
  }

  public async schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult> {
    const token = await this.getToken();
    const res = await this.fetchJson(`${this.baseUrl}/courier/generate/pickup`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { shipment_id: options.shipmentIds.map((id) => parseInt(id, 10)) },
    });

    return {
      carrier: 'shiprocket',
      isScheduled: res?.pickup_status === 1 || res?.response?.pickup_status === 1,
      pickupTokenNumber: res?.response?.pickup_token_number,
      expectedDate: options.pickupDate,
      rawResponse: res,
    };
  }

  public async track(awbNumber: string): Promise<TrackingResult> {
    const token = await this.getToken();
    const res = await this.fetchJson(`${this.baseUrl}/courier/track/awb/${awbNumber}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const trackData = res?.tracking_data || {};
    const rawStatus = trackData.track_status || 'UNKNOWN';

    let currentStatus: TrackingResult['currentStatus'] = 'ORDER_PLACED';
    if (rawStatus.includes('PICKED') || rawStatus.includes('IN TRANSIT')) currentStatus = 'IN_TRANSIT';
    else if (rawStatus.includes('OUT FOR DELIVERY')) currentStatus = 'OUT_FOR_DELIVERY';
    else if (rawStatus.includes('DELIVERED')) currentStatus = 'DELIVERED';
    else if (rawStatus.includes('RTO')) currentStatus = 'RTO_INITIATED';

    const events = (trackData.shipment_track_activities || []).map((act: any) => ({
      status: act['sr-status-label'] || act.activity,
      description: act.activity,
      location: act.location,
      timestamp: act.date,
    }));

    return {
      carrier: 'shiprocket',
      awbNumber,
      currentStatus,
      rawStatus,
      origin: trackData.origin,
      destination: trackData.destination,
      events,
      rawResponse: res,
    };
  }

  public async actionNDR(options: NDRActionOptions): Promise<NDRActionResult> {
    const token = await this.getToken();
    const res = await this.fetchJson(`${this.baseUrl}/ndr/action`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        action: options.action === 'REATTEMPT' ? 'reattempt' : 'return',
        awb: options.awbNumber,
        next_attempt_date: options.nextAttemptDate,
        comments: options.remarks || 'Customer contacted and re-attempt authorized',
      },
    });

    return {
      carrier: 'shiprocket',
      awbNumber: options.awbNumber,
      isSuccess: res?.status === 200 || res?.success === true,
      actionTaken: options.action,
      rawResponse: res,
    };
  }
}
