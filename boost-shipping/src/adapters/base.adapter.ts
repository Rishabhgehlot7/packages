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
  TrackingResult,
} from '../types';

export abstract class BaseShippingAdapter {
  public abstract readonly name: CarrierName;

  public abstract checkPincode(options: PincodeCheckOptions): Promise<PincodeCheckResult>;
  public abstract createShipment(options: CreateShipmentOptions): Promise<CreateShipmentResult>;
  public abstract schedulePickup(options: PickupScheduleOptions): Promise<PickupScheduleResult>;
  public abstract track(awbNumber: string): Promise<TrackingResult>;
  public abstract actionNDR(options: NDRActionOptions): Promise<NDRActionResult>;

  protected async fetchJson<T = any>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    let serializedBody: string | undefined;
    if (body !== undefined) {
      if (typeof body === 'string') {
        serializedBody = body;
      } else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        serializedBody = new URLSearchParams(body).toString();
      } else {
        requestHeaders['Content-Type'] = 'application/json';
        serializedBody = JSON.stringify(body);
      }
    }

    const res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: serializedBody,
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      const errMsg =
        data?.message ||
        data?.error ||
        (typeof data === 'string' ? data : `HTTP ${res.status} ${res.statusText}`);
      throw new Error(`[${this.name.toUpperCase()} Shipping Error] ${errMsg}`);
    }

    return data as T;
  }
}
