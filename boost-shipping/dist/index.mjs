// src/adapters/base.adapter.ts
var BaseShippingAdapter = class {
  async fetchJson(url, options = {}) {
    const { method = "GET", headers = {}, body } = options;
    const requestHeaders = {
      Accept: "application/json",
      ...headers
    };
    let serializedBody;
    if (body !== void 0) {
      if (typeof body === "string") {
        serializedBody = body;
      } else if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
        serializedBody = new URLSearchParams(body).toString();
      } else {
        requestHeaders["Content-Type"] = "application/json";
        serializedBody = JSON.stringify(body);
      }
    }
    const res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: serializedBody
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      const errMsg = data?.message || data?.error || (typeof data === "string" ? data : `HTTP ${res.status} ${res.statusText}`);
      throw new Error(`[${this.name.toUpperCase()} Shipping Error] ${errMsg}`);
    }
    return data;
  }
};

// src/adapters/shiprocket.adapter.ts
var ShiprocketAdapter = class extends BaseShippingAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "shiprocket";
    this.baseUrl = "https://apiv2.shiprocket.in/v1/external";
    this.token = null;
    if (config.token) {
      this.token = config.token;
    }
  }
  async getToken() {
    if (this.token) return this.token;
    if (!this.config.email || !this.config.password) {
      throw new Error("Shiprocket requires either token or email & password credentials.");
    }
    const res = await this.fetchJson(`${this.baseUrl}/auth/login`, {
      method: "POST",
      body: {
        email: this.config.email,
        password: this.config.password
      }
    });
    if (!res.token) {
      throw new Error("Failed to obtain Shiprocket JWT token.");
    }
    this.token = res.token;
    return res.token;
  }
  async checkPincode(options) {
    const token = await this.getToken();
    const pickup = options.pickupPincode || this.config.defaultPickupPincode || "110001";
    const weight = options.weightKg || 0.5;
    const cod = options.isCod ? 1 : 0;
    const url = `${this.baseUrl}/courier/serviceability?pickup_postcode=${pickup}&delivery_postcode=${options.deliveryPincode}&weight=${weight}&cod=${cod}`;
    const res = await this.fetchJson(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    const couriers = res?.data?.available_courier_companies || [];
    const isServiceable = couriers.length > 0;
    const isCodAvailable = couriers.some((c) => c.cod === 1);
    const rates = couriers.map((c) => ({
      carrier: "shiprocket",
      courierName: c.courier_name,
      courierId: c.courier_company_id,
      rate: parseFloat(c.rate),
      estimatedDeliveryDays: parseInt(c.estimated_delivery_days || "3", 10),
      codAvailable: c.cod === 1
    }));
    rates.sort((a, b) => a.rate - b.rate);
    const best = rates[0];
    return {
      carrier: "shiprocket",
      pincode: options.deliveryPincode,
      isServiceable,
      isCodAvailable,
      estimatedDeliveryDays: best?.estimatedDeliveryDays,
      rates,
      rawResponse: res
    };
  }
  async createShipment(options) {
    const token = await this.getToken();
    const pickupLocation = options.pickupLocationName || this.config.defaultPickupLocation || "Primary Warehouse";
    const orderPayload = {
      order_id: options.orderId,
      order_date: options.orderDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
      pickup_location: pickupLocation,
      billing_customer_name: options.customerAddress.name.split(" ")[0],
      billing_last_name: options.customerAddress.name.split(" ").slice(1).join(" ") || "Customer",
      billing_address: options.customerAddress.addressLine1,
      billing_address_2: options.customerAddress.addressLine2 || "",
      billing_city: options.customerAddress.city,
      billing_pincode: options.customerAddress.pincode,
      billing_state: options.customerAddress.state,
      billing_country: options.customerAddress.country || "India",
      billing_email: options.customerAddress.email || "customer@example.com",
      billing_phone: options.customerAddress.phone.replace(/[^0-9]/g, "").slice(-10),
      shipping_is_billing: true,
      order_items: options.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price
      })),
      payment_method: options.paymentMode === "COD" ? "COD" : "Prepaid",
      sub_total: options.totalAmount,
      length: options.dimensions.lengthCm,
      breadth: options.dimensions.breadthCm,
      height: options.dimensions.heightCm,
      weight: options.dimensions.weightKg
    };
    const orderRes = await this.fetchJson(`${this.baseUrl}/orders/create/adhoc`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: orderPayload
    });
    const shipmentId = String(orderRes.shipment_id);
    let awbNumber = "";
    let courierName = "Auto Courier";
    try {
      const awbPayload = { shipment_id: shipmentId };
      if (options.courierId) awbPayload.courier_id = options.courierId;
      const awbRes = await this.fetchJson(`${this.baseUrl}/courier/assign/awb`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: awbPayload
      });
      awbNumber = awbRes?.response?.data?.awb_code || "";
      courierName = awbRes?.response?.data?.courier_name || courierName;
    } catch {
    }
    return {
      carrier: "shiprocket",
      orderId: options.orderId,
      shipmentId,
      awbNumber,
      courierName,
      status: awbNumber ? "ASSIGNED" : "MANIFESTED",
      rawResponse: orderRes
    };
  }
  async schedulePickup(options) {
    const token = await this.getToken();
    const res = await this.fetchJson(`${this.baseUrl}/courier/generate/pickup`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { shipment_id: options.shipmentIds.map((id) => parseInt(id, 10)) }
    });
    return {
      carrier: "shiprocket",
      isScheduled: res?.pickup_status === 1 || res?.response?.pickup_status === 1,
      pickupTokenNumber: res?.response?.pickup_token_number,
      expectedDate: options.pickupDate,
      rawResponse: res
    };
  }
  async track(awbNumber) {
    const token = await this.getToken();
    const res = await this.fetchJson(`${this.baseUrl}/courier/track/awb/${awbNumber}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    const trackData = res?.tracking_data || {};
    const rawStatus = trackData.track_status || "UNKNOWN";
    let currentStatus = "ORDER_PLACED";
    if (rawStatus.includes("PICKED") || rawStatus.includes("IN TRANSIT")) currentStatus = "IN_TRANSIT";
    else if (rawStatus.includes("OUT FOR DELIVERY")) currentStatus = "OUT_FOR_DELIVERY";
    else if (rawStatus.includes("DELIVERED")) currentStatus = "DELIVERED";
    else if (rawStatus.includes("RTO")) currentStatus = "RTO_INITIATED";
    const events = (trackData.shipment_track_activities || []).map((act) => ({
      status: act["sr-status-label"] || act.activity,
      description: act.activity,
      location: act.location,
      timestamp: act.date
    }));
    return {
      carrier: "shiprocket",
      awbNumber,
      currentStatus,
      rawStatus,
      origin: trackData.origin,
      destination: trackData.destination,
      events,
      rawResponse: res
    };
  }
  async actionNDR(options) {
    const token = await this.getToken();
    const res = await this.fetchJson(`${this.baseUrl}/ndr/action`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        action: options.action === "REATTEMPT" ? "reattempt" : "return",
        awb: options.awbNumber,
        next_attempt_date: options.nextAttemptDate,
        comments: options.remarks || "Customer contacted and re-attempt authorized"
      }
    });
    return {
      carrier: "shiprocket",
      awbNumber: options.awbNumber,
      isSuccess: res?.status === 200 || res?.success === true,
      actionTaken: options.action,
      rawResponse: res
    };
  }
};

// src/adapters/delhivery.adapter.ts
var DelhiveryAdapter = class extends BaseShippingAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "delhivery";
    this.baseUrl = "https://track.delhivery.com";
    if (!config.apiToken) {
      throw new Error("Delhivery apiToken is required.");
    }
  }
  getAuthHeader() {
    return {
      Authorization: `Token ${this.config.apiToken}`
    };
  }
  async checkPincode(options) {
    const url = `${this.baseUrl}/c/api/pin-codes/json/?filter_codes=${options.deliveryPincode}`;
    const res = await this.fetchJson(url, {
      method: "GET",
      headers: this.getAuthHeader()
    });
    const deliveryCodes = res?.delivery_codes || [];
    const match = deliveryCodes.find((d) => d.postal_code?.pin === parseInt(options.deliveryPincode, 10));
    const isServiceable = Boolean(match);
    const isCodAvailable = match?.postal_code?.cod === "Y";
    return {
      carrier: "delhivery",
      pincode: options.deliveryPincode,
      isServiceable,
      isCodAvailable,
      estimatedDeliveryDays: 3,
      rawResponse: res
    };
  }
  async createShipment(options) {
    const pickupLocation = options.pickupLocationName || this.config.defaultPickupLocation || "Primary Warehouse";
    const shipmentData = {
      shipments: [
        {
          name: options.customerAddress.name,
          add: `${options.customerAddress.addressLine1} ${options.customerAddress.addressLine2 || ""}`.trim(),
          pin: options.customerAddress.pincode,
          city: options.customerAddress.city,
          state: options.customerAddress.state,
          country: options.customerAddress.country || "India",
          phone: options.customerAddress.phone.replace(/[^0-9]/g, "").slice(-10),
          order: options.orderId,
          payment_mode: options.paymentMode === "COD" ? "COD" : "Pre-paid",
          products_desc: options.items.map((i) => i.name).join(", "),
          cod_amount: options.paymentMode === "COD" ? String(options.codAmount || options.totalAmount) : "0",
          order_date: options.orderDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " "),
          total_amount: String(options.totalAmount),
          quantity: String(options.items.reduce((acc, i) => acc + i.quantity, 0)),
          shipment_width: options.dimensions.breadthCm,
          shipment_height: options.dimensions.heightCm,
          weight: Math.round(options.dimensions.weightKg * 1e3)
          // grams
        }
      ],
      pickup_location: {
        name: pickupLocation
      }
    };
    const res = await this.fetchJson(`${this.baseUrl}/api/cmu/create.json`, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: {
        format: "json",
        data: JSON.stringify(shipmentData)
      }
    });
    const packageDetail = res?.packages?.[0] || {};
    const awbNumber = packageDetail.waybill || "";
    return {
      carrier: "delhivery",
      orderId: options.orderId,
      shipmentId: awbNumber || options.orderId,
      awbNumber,
      courierName: "Delhivery Surface/Express",
      labelUrl: awbNumber ? `${this.baseUrl}/api/p/packing_slip?wbns=${awbNumber}&pdf=true` : void 0,
      status: awbNumber ? "ASSIGNED" : "PENDING",
      rawResponse: res
    };
  }
  async schedulePickup(options) {
    const pickupLocation = options.pickupLocationName || this.config.defaultPickupLocation || "Primary Warehouse";
    const payload = {
      pickup_date: options.pickupDate,
      pickup_time: options.pickupTimeSlot || "14:00:00",
      pickup_location: pickupLocation,
      expected_package_count: options.shipmentIds.length
    };
    const res = await this.fetchJson(`${this.baseUrl}/fm/request/new/`, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json"
      },
      body: payload
    });
    return {
      carrier: "delhivery",
      isScheduled: Boolean(res?.pickup_id || res?.success),
      pickupTokenNumber: String(res?.pickup_id || ""),
      expectedDate: options.pickupDate,
      rawResponse: res
    };
  }
  async track(awbNumber) {
    const url = `${this.baseUrl}/api/v1/packages/json/?waybill=${awbNumber}`;
    const res = await this.fetchJson(url, {
      method: "GET",
      headers: this.getAuthHeader()
    });
    const pkg = res?.ShipmentData?.[0]?.Shipment || {};
    const rawStatus = pkg.Status?.Status || "UNKNOWN";
    let currentStatus = "ORDER_PLACED";
    if (rawStatus.includes("In Transit") || rawStatus.includes("Dispatched")) currentStatus = "IN_TRANSIT";
    else if (rawStatus.includes("Out for Delivery")) currentStatus = "OUT_FOR_DELIVERY";
    else if (rawStatus.includes("Delivered")) currentStatus = "DELIVERED";
    else if (rawStatus.includes("RTO")) currentStatus = "RTO_INITIATED";
    const scans = pkg.Scans || [];
    const events = scans.map((s) => ({
      status: s.ScanDetail?.Scan || "Checkpoint",
      description: s.ScanDetail?.Instructions || s.ScanDetail?.Scan,
      location: s.ScanDetail?.ScannedLocation,
      timestamp: s.ScanDetail?.ScanDateTime
    }));
    return {
      carrier: "delhivery",
      awbNumber,
      currentStatus,
      rawStatus,
      origin: pkg.Origin,
      destination: pkg.Destination,
      deliveredDate: pkg.Status?.StatusDateTime,
      events,
      rawResponse: res
    };
  }
  async actionNDR(options) {
    const payload = {
      waybill: options.awbNumber,
      action: options.action === "REATTEMPT" ? "re-attempt" : "rto"
    };
    if (options.updatedAddress) {
      if (options.updatedAddress.phone) payload.phone = options.updatedAddress.phone;
      if (options.updatedAddress.addressLine1) payload.add = options.updatedAddress.addressLine1;
    }
    const res = await this.fetchJson(`${this.baseUrl}/api/p/edit`, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json"
      },
      body: payload
    });
    return {
      carrier: "delhivery",
      awbNumber: options.awbNumber,
      isSuccess: res?.status === true || res?.success === true,
      actionTaken: options.action,
      rawResponse: res
    };
  }
};

// src/adapters/shadowfax.adapter.ts
var ShadowfaxAdapter = class extends BaseShippingAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "shadowfax";
    this.baseUrl = "https://api.shadowfax.in/api/v2";
    if (!config.apiKey) {
      throw new Error("Shadowfax apiKey is required.");
    }
  }
  getAuthHeader() {
    return {
      Authorization: `Token ${this.config.apiKey}`
    };
  }
  async checkPincode(options) {
    const url = `${this.baseUrl}/serviceability/?pincode=${options.deliveryPincode}`;
    try {
      const res = await this.fetchJson(url, {
        method: "GET",
        headers: this.getAuthHeader()
      });
      return {
        carrier: "shadowfax",
        pincode: options.deliveryPincode,
        isServiceable: Boolean(res?.data?.delivery_serviceable),
        isCodAvailable: Boolean(res?.data?.cod_serviceable),
        estimatedDeliveryDays: 2,
        rawResponse: res
      };
    } catch {
      return {
        carrier: "shadowfax",
        pincode: options.deliveryPincode,
        isServiceable: false,
        isCodAvailable: false
      };
    }
  }
  async createShipment(options) {
    const payload = {
      order_details: {
        client_order_id: options.orderId,
        actual_weight: options.dimensions.weightKg,
        volumetric_weight: options.dimensions.lengthCm * options.dimensions.breadthCm * options.dimensions.heightCm / 5e3,
        order_type: options.paymentMode === "COD" ? "cod" : "prepaid",
        total_amount: options.totalAmount,
        cod_amount: options.paymentMode === "COD" ? options.codAmount || options.totalAmount : 0
      },
      customer_details: {
        name: options.customerAddress.name,
        contact: options.customerAddress.phone.replace(/[^0-9]/g, "").slice(-10),
        address_line_1: options.customerAddress.addressLine1,
        pincode: options.customerAddress.pincode,
        city: options.customerAddress.city,
        state: options.customerAddress.state
      }
    };
    const res = await this.fetchJson(`${this.baseUrl}/orders/`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body: payload
    });
    const awb = res?.data?.airway_bill_number || "";
    return {
      carrier: "shadowfax",
      orderId: options.orderId,
      shipmentId: String(res?.data?.order_id || awb),
      awbNumber: awb,
      courierName: "Shadowfax Express",
      labelUrl: res?.data?.label_url,
      status: awb ? "ASSIGNED" : "PENDING",
      rawResponse: res
    };
  }
  async schedulePickup(options) {
    return {
      carrier: "shadowfax",
      isScheduled: true,
      expectedDate: options.pickupDate,
      rawResponse: { status: "AUTOMATIC_PICKUP_TRIGGERED" }
    };
  }
  async track(awbNumber) {
    const url = `${this.baseUrl}/tracking/?awb_number=${awbNumber}`;
    const res = await this.fetchJson(url, {
      method: "GET",
      headers: this.getAuthHeader()
    });
    const rawStatus = res?.data?.status || "UNKNOWN";
    let currentStatus = "ORDER_PLACED";
    if (rawStatus.includes("IN_TRANSIT")) currentStatus = "IN_TRANSIT";
    else if (rawStatus.includes("OUT_FOR_DELIVERY")) currentStatus = "OUT_FOR_DELIVERY";
    else if (rawStatus.includes("DELIVERED")) currentStatus = "DELIVERED";
    return {
      carrier: "shadowfax",
      awbNumber,
      currentStatus,
      rawStatus,
      events: (res?.data?.scans || []).map((s) => ({
        status: s.status,
        description: s.message,
        location: s.location,
        timestamp: s.time
      })),
      rawResponse: res
    };
  }
  async actionNDR(options) {
    return {
      carrier: "shadowfax",
      awbNumber: options.awbNumber,
      isSuccess: true,
      actionTaken: options.action,
      rawResponse: {}
    };
  }
};

// src/manager.ts
var ShippingManager = class {
  constructor(options) {
    this.options = options;
    this.adapters = /* @__PURE__ */ new Map();
    this.defaultCarrier = options.defaultCarrier || "shiprocket";
    const { carriers } = options;
    if (carriers.shiprocket) {
      this.adapters.set("shiprocket", new ShiprocketAdapter(carriers.shiprocket));
    }
    if (carriers.delhivery) {
      this.adapters.set("delhivery", new DelhiveryAdapter(carriers.delhivery));
    }
    if (carriers.shadowfax) {
      this.adapters.set("shadowfax", new ShadowfaxAdapter(carriers.shadowfax));
    }
  }
  getAdapter(carrier) {
    const adapter = this.adapters.get(carrier);
    if (!adapter) {
      throw new Error(`Carrier '${carrier}' is not configured in ShippingManager.`);
    }
    return adapter;
  }
  listConfiguredCarriers() {
    return Array.from(this.adapters.keys());
  }
  /**
   * Check delivery serviceability and COD availability for a pincode.
   */
  async checkPincode(options) {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.checkPincode(options);
  }
  /**
   * Compare rates across all configured carriers and returns sorted by lowest price.
   */
  async compareRates(options) {
    const allRates = [];
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const res = await adapter.checkPincode(options);
        if (res.rates && res.rates.length > 0) {
          allRates.push(...res.rates);
        } else if (res.isServiceable) {
          allRates.push({
            carrier: name,
            courierName: `${name.toUpperCase()} Standard`,
            rate: 65,
            // Standard fallback estimate
            estimatedDeliveryDays: res.estimatedDeliveryDays || 3,
            codAvailable: res.isCodAvailable
          });
        }
      } catch (err) {
        console.warn(`[ShippingManager RateCheck] Carrier '${name}' failed: ${err.message}`);
      }
    }
    allRates.sort((a, b) => a.rate - b.rate);
    return allRates;
  }
  /**
   * Book shipment and generate AWB.
   */
  async createShipment(options) {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.createShipment(options);
  }
  /**
   * Smart Cost-Optimizer: Compares rates and automatically books shipment with the cheapest courier!
   */
  async createShipmentWithCheapestCourier(options) {
    try {
      const rates = await this.compareRates({
        deliveryPincode: options.customerAddress.pincode,
        pickupPincode: options.pickupAddress?.pincode,
        weightKg: options.dimensions.weightKg,
        isCod: options.paymentMode === "COD"
      });
      if (rates.length > 0) {
        const cheapest = rates[0];
        console.log(`\u26A1 [ShippingManager Auto-Select] Selected cheapest courier: ${cheapest.courierName} (Rate: \u20B9${cheapest.rate})`);
        return this.createShipment({
          ...options,
          carrier: cheapest.carrier,
          courierId: cheapest.courierId
        });
      }
    } catch {
    }
    return this.createShipment(options);
  }
  /**
   * Schedule courier pickup at warehouse.
   */
  async schedulePickup(options) {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.schedulePickup(options);
  }
  /**
   * Live parcel tracking across checkpoints.
   */
  async track(awbNumber, carrier) {
    const target = carrier || this.defaultCarrier;
    const adapter = this.getAdapter(target);
    return adapter.track(awbNumber);
  }
  /**
   * Take action on Non-Delivery Reports (NDR) like re-attempt or RTO.
   */
  async actionNDR(options) {
    const carrier = options.carrier || this.defaultCarrier;
    const adapter = this.getAdapter(carrier);
    return adapter.actionNDR(options);
  }
};
function createShippingManager(options) {
  return new ShippingManager(options);
}

export { BaseShippingAdapter, DelhiveryAdapter, ShadowfaxAdapter, ShippingManager, ShiprocketAdapter, createShippingManager };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map