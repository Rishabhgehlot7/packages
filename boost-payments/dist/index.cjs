'use strict';

var crypto = require('crypto');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var crypto__default = /*#__PURE__*/_interopDefault(crypto);

// src/adapters/base.adapter.ts
var BasePaymentAdapter = class {
  /**
   * Safe helper to extract single string header value from request headers.
   */
  getHeader(headers, name) {
    const direct = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
    if (Array.isArray(direct)) return direct[0];
    return direct;
  }
  /**
   * Helper to perform HTTP JSON requests with standard error extraction.
   */
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
      const errMsg = data?.message || data?.error?.description || data?.error?.message || data?.description || (typeof data === "string" ? data : `HTTP ${res.status} ${res.statusText}`);
      throw new Error(`[${this.name.toUpperCase()} API Error] ${errMsg}`);
    }
    return data;
  }
};
function hmacSha256(data, secret) {
  return crypto__default.default.createHmac("sha256", secret).update(data).digest("hex");
}
function sha256(data) {
  return crypto__default.default.createHash("sha256").update(data).digest("hex");
}
function base64Encode(data) {
  const str = typeof data === "string" ? data : JSON.stringify(data);
  return Buffer.from(str, "utf8").toString("base64");
}
function base64Decode(encoded) {
  return Buffer.from(encoded, "base64").toString("utf8");
}
function safeCompare(a, b) {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return crypto__default.default.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// src/utils/errors.ts
var PaymentError = class _PaymentError extends Error {
  constructor(message, options) {
    super(message);
    this.name = "PaymentError";
    this.gateway = options?.gateway;
    this.statusCode = options?.statusCode;
    this.rawError = options?.rawError;
    Object.setPrototypeOf(this, _PaymentError.prototype);
  }
};
var GatewayNotConfiguredError = class _GatewayNotConfiguredError extends PaymentError {
  constructor(gateway) {
    super(`Payment gateway '${gateway}' is not configured in PaymentManager.`, { gateway, statusCode: 400 });
    this.name = "GatewayNotConfiguredError";
    Object.setPrototypeOf(this, _GatewayNotConfiguredError.prototype);
  }
};
var SignatureVerificationError = class _SignatureVerificationError extends PaymentError {
  constructor(gateway, details) {
    super(`Invalid webhook/payment signature for gateway '${gateway}'. ${details || ""}`.trim(), {
      gateway,
      statusCode: 401
    });
    this.name = "SignatureVerificationError";
    Object.setPrototypeOf(this, _SignatureVerificationError.prototype);
  }
};

// src/adapters/razorpay.adapter.ts
var RazorpayAdapter = class extends BasePaymentAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "razorpay";
    this.baseUrl = "https://api.razorpay.com/v1";
    if (!config.keyId || !config.keySecret) {
      throw new PaymentError("Razorpay keyId and keySecret are required.", { gateway: "razorpay" });
    }
  }
  getAuthHeader() {
    const creds = `${this.config.keyId}:${this.config.keySecret}`;
    return `Basic ${Buffer.from(creds).toString("base64")}`;
  }
  async createOrder(options) {
    const amountInSubunits = Math.round(options.amount * 100);
    const payload = {
      amount: amountInSubunits,
      currency: options.currency.toUpperCase(),
      receipt: options.receipt,
      notes: {
        customer_name: options.customer.name,
        customer_email: options.customer.email,
        customer_phone: options.customer.phone,
        ...options.notes
      }
    };
    const res = await this.fetchJson(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader()
      },
      body: payload
    });
    return {
      gateway: "razorpay",
      orderId: options.receipt,
      gatewayOrderId: res.id,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: "CREATED",
      rawResponse: res
    };
  }
  async verifyPayment(options) {
    if (!options.paymentId) {
      throw new PaymentError("Razorpay payment verification requires paymentId.", { gateway: "razorpay" });
    }
    let isSignatureValid = false;
    if (options.signature) {
      const expectedSignature = hmacSha256(
        `${options.orderId}|${options.paymentId}`,
        this.config.keySecret
      );
      isSignatureValid = safeCompare(expectedSignature, options.signature);
    }
    const payment = await this.fetchJson(`${this.baseUrl}/payments/${options.paymentId}`, {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader()
      }
    });
    const isCaptured = payment.status === "captured" || payment.status === "authorized";
    return {
      gateway: "razorpay",
      isSuccessful: (options.signature ? isSignatureValid : true) && isCaptured,
      paymentId: payment.id,
      orderId: options.orderId,
      amount: payment.amount / 100,
      // Normalized back to standard currency units
      currency: payment.currency,
      paymentMethod: payment.method,
      rawResponse: payment
    };
  }
  async refund(options) {
    const payload = {
      notes: { reason: options.reason || "Merchant requested refund" }
    };
    if (options.amount) {
      payload.amount = Math.round(options.amount * 100);
    }
    const res = await this.fetchJson(`${this.baseUrl}/payments/${options.paymentId}/refund`, {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader()
      },
      body: payload
    });
    return {
      gateway: "razorpay",
      refundId: res.id,
      paymentId: options.paymentId,
      amount: res.amount / 100,
      // Normalized to standard currency units
      status: res.status === "processed" ? "SUCCESS" : "PENDING",
      rawResponse: res
    };
  }
  async verifyWebhook(options) {
    const secret = options.webhookSecret || this.config.webhookSecret;
    if (!secret) {
      return {
        isValid: false,
        normalizedEvent: "UNKNOWN",
        gateway: "razorpay",
        error: "Razorpay webhookSecret is not configured."
      };
    }
    const signature = this.getHeader(options.headers, "x-razorpay-signature");
    if (!signature) {
      return {
        isValid: false,
        normalizedEvent: "UNKNOWN",
        gateway: "razorpay",
        error: "Missing x-razorpay-signature header."
      };
    }
    const rawString = typeof options.rawBody === "string" ? options.rawBody : options.rawBody.toString("utf8");
    const expectedSignature = hmacSha256(rawString, secret);
    const isValid = safeCompare(expectedSignature, signature);
    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      parsed = null;
    }
    const rawEvent = parsed?.event || "";
    let normalizedEvent = "UNKNOWN";
    if (rawEvent === "order.paid" || rawEvent === "payment.captured" || rawEvent === "payment.authorized") {
      normalizedEvent = "PAYMENT_SUCCESS";
    } else if (rawEvent === "payment.failed") {
      normalizedEvent = "PAYMENT_FAILED";
    } else if (rawEvent === "refund.processed" || rawEvent === "refund.created") {
      normalizedEvent = "REFUND_PROCESSED";
    } else if (rawEvent === "refund.failed") {
      normalizedEvent = "REFUND_FAILED";
    } else if (rawEvent?.includes("dispute")) {
      normalizedEvent = "DISPUTE_CREATED";
    }
    const paymentEntity = parsed?.payload?.payment?.entity;
    const orderEntity = parsed?.payload?.order?.entity;
    const orderId = orderEntity?.receipt || paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;
    const amount = paymentEntity?.amount ? paymentEntity.amount / 100 : orderEntity?.amount ? orderEntity.amount / 100 : void 0;
    const currency = paymentEntity?.currency || orderEntity?.currency;
    return {
      isValid,
      normalizedEvent,
      rawEvent,
      gateway: "razorpay",
      orderId,
      paymentId,
      amount,
      currency,
      data: parsed?.payload
    };
  }
};

// src/adapters/cashfree.adapter.ts
var CashfreeAdapter = class extends BasePaymentAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "cashfree";
    if (!config.appId || !config.secretKey) {
      throw new PaymentError("Cashfree appId and secretKey are required.", { gateway: "cashfree" });
    }
    this.baseUrl = config.env === "PRODUCTION" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    this.apiVersion = config.apiVersion || "2023-08-01";
  }
  getHeaders() {
    return {
      "x-client-id": this.config.appId,
      "x-client-secret": this.config.secretKey,
      "x-api-version": this.apiVersion,
      "Content-Type": "application/json"
    };
  }
  async createOrder(options) {
    const payload = {
      order_id: options.receipt,
      order_amount: options.amount,
      order_currency: options.currency.toUpperCase(),
      customer_details: {
        customer_id: options.customer.id || `cust_${Date.now()}`,
        customer_name: options.customer.name,
        customer_email: options.customer.email,
        customer_phone: options.customer.phone
      },
      order_meta: {
        return_url: options.redirectUrl,
        notify_url: options.callbackUrl
      },
      order_note: options.notes ? JSON.stringify(options.notes) : "Order via Boost Payments"
    };
    const res = await this.fetchJson(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: this.getHeaders(),
      body: payload
    });
    return {
      gateway: "cashfree",
      orderId: options.receipt,
      gatewayOrderId: res.order_id,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: res.order_status === "ACTIVE" ? "CREATED" : "PENDING",
      paymentSessionId: res.payment_session_id,
      rawResponse: res
    };
  }
  async verifyPayment(options) {
    const order = await this.fetchJson(`${this.baseUrl}/orders/${options.orderId}`, {
      method: "GET",
      headers: this.getHeaders()
    });
    const isSuccessful = order.order_status === "PAID";
    let paymentMethod = "unknown";
    let paymentId = options.paymentId || order.order_id;
    if (isSuccessful) {
      try {
        const payments = await this.fetchJson(`${this.baseUrl}/orders/${options.orderId}/payments`, {
          method: "GET",
          headers: this.getHeaders()
        });
        if (Array.isArray(payments) && payments.length > 0) {
          const latest = payments[0];
          paymentId = String(latest.cf_payment_id || paymentId);
          paymentMethod = latest.payment_group || (latest.payment_method ? Object.keys(latest.payment_method)[0] : "online");
        }
      } catch {
      }
    }
    return {
      gateway: "cashfree",
      isSuccessful,
      paymentId,
      orderId: order.order_id,
      amount: order.order_amount,
      currency: order.order_currency,
      paymentMethod,
      rawResponse: order
    };
  }
  async refund(options) {
    if (!options.orderId) {
      throw new PaymentError("Cashfree refund requires orderId.", { gateway: "cashfree" });
    }
    const payload = {
      refund_id: `rfnd_${Date.now()}`,
      refund_amount: options.amount,
      refund_note: options.reason || "Merchant initiated refund"
    };
    const res = await this.fetchJson(`${this.baseUrl}/orders/${options.orderId}/refunds`, {
      method: "POST",
      headers: this.getHeaders(),
      body: payload
    });
    return {
      gateway: "cashfree",
      refundId: res.refund_id,
      paymentId: options.paymentId,
      amount: res.refund_amount,
      status: res.refund_status === "SUCCESS" ? "SUCCESS" : "PENDING",
      rawResponse: res
    };
  }
  async verifyWebhook(options) {
    const signature = this.getHeader(options.headers, "x-webhook-signature");
    const timestamp = this.getHeader(options.headers, "x-webhook-timestamp");
    const rawString = typeof options.rawBody === "string" ? options.rawBody : options.rawBody.toString("utf8");
    let isValid = false;
    if (signature && timestamp) {
      const signedData = `${timestamp}${rawString}`;
      const expectedSignature = Buffer.from(
        hmacSha256(signedData, this.config.secretKey),
        "hex"
      ).toString("base64");
      isValid = safeCompare(expectedSignature, signature);
    } else if (signature) {
      const expectedSignature = Buffer.from(
        hmacSha256(rawString, this.config.secretKey),
        "hex"
      ).toString("base64");
      isValid = safeCompare(expectedSignature, signature);
    }
    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      parsed = null;
    }
    const rawEvent = parsed?.type || "";
    let normalizedEvent = "UNKNOWN";
    if (rawEvent === "PAYMENT_SUCCESS_WEBHOOK") {
      normalizedEvent = "PAYMENT_SUCCESS";
    } else if (rawEvent === "PAYMENT_FAILED_WEBHOOK" || rawEvent === "USER_DROPPED_WEBHOOK") {
      normalizedEvent = "PAYMENT_FAILED";
    } else if (rawEvent === "REFUND_STATUS_WEBHOOK") {
      const refundStatus = parsed?.data?.refund?.refund_status;
      normalizedEvent = refundStatus === "SUCCESS" ? "REFUND_PROCESSED" : "REFUND_FAILED";
    } else if (rawEvent?.includes("DISPUTE")) {
      normalizedEvent = "DISPUTE_CREATED";
    }
    const orderData = parsed?.data?.order;
    const paymentData = parsed?.data?.payment;
    const refundData = parsed?.data?.refund;
    const orderId = orderData?.order_id || refundData?.order_id;
    const paymentId = paymentData ? String(paymentData.cf_payment_id) : refundData ? String(refundData.cf_payment_id) : void 0;
    const amount = paymentData?.payment_amount ?? orderData?.order_amount ?? refundData?.refund_amount;
    const currency = paymentData?.payment_currency || orderData?.order_currency;
    return {
      isValid,
      normalizedEvent,
      rawEvent,
      gateway: "cashfree",
      orderId,
      paymentId,
      amount,
      currency,
      data: parsed?.data
    };
  }
};

// src/adapters/phonepe.adapter.ts
var PhonePeAdapter = class extends BasePaymentAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "phonepe";
    if (!config.merchantId || !config.saltKey) {
      throw new PaymentError("PhonePe merchantId and saltKey are required.", { gateway: "phonepe" });
    }
    this.baseUrl = config.env === "PRODUCTION" ? "https://api.phonepe.com/apis/hermes" : "https://api-preprod.phonepe.com/apis/pg-sandbox";
    this.saltIndex = config.saltIndex || "1";
  }
  calculateXVerify(base64Payload, endpoint) {
    const stringToHash = `${base64Payload}${endpoint}${this.config.saltKey}`;
    const hash = sha256(stringToHash);
    return `${hash}###${this.saltIndex}`;
  }
  async createOrder(options) {
    const amountInPaise = Math.round(options.amount * 100);
    const payload = {
      merchantId: this.config.merchantId,
      merchantTransactionId: options.receipt,
      merchantUserId: options.customer.id || `MUID_${Date.now()}`,
      amount: amountInPaise,
      redirectUrl: options.redirectUrl || "https://yourstore.com/order-success",
      redirectMode: "POST",
      callbackUrl: options.callbackUrl || "https://api.yourstore.com/webhooks/phonepe",
      mobileNumber: options.customer.phone.replace(/[^0-9]/g, "").slice(-10),
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };
    const base64Payload = base64Encode(payload);
    const endpoint = "/pg/v1/pay";
    const xVerify = this.calculateXVerify(base64Payload, endpoint);
    const res = await this.fetchJson(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify
      },
      body: {
        request: base64Payload
      }
    });
    const redirectUrl = res?.data?.instrumentResponse?.redirectInfo?.url;
    return {
      gateway: "phonepe",
      orderId: options.receipt,
      gatewayOrderId: options.receipt,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: res.success ? "CREATED" : "FAILED",
      redirectUrl,
      rawResponse: res
    };
  }
  async verifyPayment(options) {
    const endpoint = `/pg/v1/status/${this.config.merchantId}/${options.orderId}`;
    const stringToHash = `${endpoint}${this.config.saltKey}`;
    const xVerify = `${sha256(stringToHash)}###${this.saltIndex}`;
    const res = await this.fetchJson(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        "X-MERCHANT-ID": this.config.merchantId
      }
    });
    const isSuccessful = res.code === "PAYMENT_SUCCESS";
    const amount = res.data?.amount ? res.data.amount / 100 : 0;
    const paymentId = res.data?.transactionId || options.orderId;
    return {
      gateway: "phonepe",
      isSuccessful,
      paymentId,
      orderId: options.orderId,
      amount,
      currency: "INR",
      paymentMethod: res.data?.paymentInstrument?.type || "UPI",
      rawResponse: res
    };
  }
  async refund(options) {
    const refundTxnId = `RF_${Date.now()}`;
    const amountInPaise = options.amount ? Math.round(options.amount * 100) : 0;
    const payload = {
      merchantId: this.config.merchantId,
      merchantTransactionId: refundTxnId,
      originalTransactionId: options.orderId || options.paymentId,
      amount: amountInPaise,
      callbackUrl: "https://api.yourstore.com/webhooks/phonepe"
    };
    const base64Payload = base64Encode(payload);
    const endpoint = "/pg/v1/refund";
    const xVerify = this.calculateXVerify(base64Payload, endpoint);
    const res = await this.fetchJson(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify
      },
      body: {
        request: base64Payload
      }
    });
    return {
      gateway: "phonepe",
      refundId: refundTxnId,
      paymentId: options.paymentId,
      amount: options.amount || 0,
      status: res.success ? "SUCCESS" : "FAILED",
      rawResponse: res
    };
  }
  async verifyWebhook(options) {
    const rawString = typeof options.rawBody === "string" ? options.rawBody : options.rawBody.toString("utf8");
    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      return { isValid: false, normalizedEvent: "UNKNOWN", gateway: "phonepe", error: "Invalid JSON payload" };
    }
    if (!parsed.response) {
      return { isValid: false, normalizedEvent: "UNKNOWN", gateway: "phonepe", error: "Missing response field in PhonePe callback" };
    }
    let decoded = {};
    try {
      decoded = JSON.parse(base64Decode(parsed.response));
    } catch {
      return { isValid: false, normalizedEvent: "UNKNOWN", gateway: "phonepe", error: "Failed to decode base64 PhonePe response" };
    }
    const rawEvent = decoded.code || "";
    let normalizedEvent = "UNKNOWN";
    if (rawEvent === "PAYMENT_SUCCESS") {
      normalizedEvent = "PAYMENT_SUCCESS";
    } else if (rawEvent === "PAYMENT_ERROR" || rawEvent === "PAYMENT_DECLINED") {
      normalizedEvent = "PAYMENT_FAILED";
    }
    const orderId = decoded.data?.merchantTransactionId;
    const paymentId = decoded.data?.transactionId;
    const amount = decoded.data?.amount ? decoded.data.amount / 100 : void 0;
    return {
      isValid: true,
      normalizedEvent,
      rawEvent,
      gateway: "phonepe",
      orderId,
      paymentId,
      amount,
      currency: "INR",
      data: decoded.data
    };
  }
};

// src/adapters/paytm.adapter.ts
var PaytmAdapter = class extends BasePaymentAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "paytm";
    if (!config.mid || !config.merchantKey) {
      throw new PaymentError("Paytm mid and merchantKey are required.", { gateway: "paytm" });
    }
    this.baseUrl = config.env === "PRODUCTION" ? "https://securegw.paytm.in" : "https://securegw-stage.paytm.in";
  }
  async createOrder(options) {
    const payload = {
      body: {
        requestType: "Payment",
        mid: this.config.mid,
        websiteName: this.config.website || "DEFAULT",
        orderId: options.receipt,
        callbackUrl: options.callbackUrl || "https://api.yourstore.com/webhooks/paytm",
        txnAmount: {
          value: options.amount.toFixed(2),
          currency: "INR"
        },
        userInfo: {
          custId: options.customer.id || `CUST_${Date.now()}`,
          mobile: options.customer.phone.replace(/[^0-9]/g, "").slice(-10),
          email: options.customer.email
        }
      }
    };
    const url = `${this.baseUrl}/theia/api/v1/initiateTransaction?mid=${this.config.mid}&orderId=${options.receipt}`;
    const res = await this.fetchJson(url, {
      method: "POST",
      body: payload
    });
    const txnToken = res?.body?.txnToken;
    return {
      gateway: "paytm",
      orderId: options.receipt,
      gatewayOrderId: options.receipt,
      amount: options.amount,
      currency: "INR",
      status: txnToken ? "CREATED" : "FAILED",
      txnToken,
      rawResponse: res
    };
  }
  async verifyPayment(options) {
    const url = `${this.baseUrl}/v3/order/status`;
    const payload = {
      body: {
        mid: this.config.mid,
        orderId: options.orderId
      }
    };
    const res = await this.fetchJson(url, {
      method: "POST",
      body: payload
    });
    const body = res?.body || {};
    const isSuccessful = body.resultInfo?.resultStatus === "TXN_SUCCESS";
    return {
      gateway: "paytm",
      isSuccessful,
      paymentId: body.txnId || options.orderId,
      orderId: options.orderId,
      amount: parseFloat(body.txnAmount || "0"),
      currency: "INR",
      paymentMethod: body.paymentMode || "ONLINE",
      rawResponse: res
    };
  }
  async refund(options) {
    const refundRefId = `RF_${Date.now()}`;
    const url = `${this.baseUrl}/refund/apply`;
    const payload = {
      body: {
        mid: this.config.mid,
        txnType: "REFUND",
        orderId: options.orderId,
        txnId: options.paymentId,
        refId: refundRefId,
        refundAmount: (options.amount || 0).toFixed(2)
      }
    };
    const res = await this.fetchJson(url, {
      method: "POST",
      body: payload
    });
    const body = res?.body || {};
    const isSuccess = body.resultInfo?.resultStatus === "TXN_SUCCESS" || body.resultInfo?.resultStatus === "PENDING";
    return {
      gateway: "paytm",
      refundId: body.refundId || refundRefId,
      paymentId: options.paymentId,
      amount: options.amount || 0,
      status: isSuccess ? "SUCCESS" : "FAILED",
      rawResponse: res
    };
  }
  async verifyWebhook(options) {
    const rawString = typeof options.rawBody === "string" ? options.rawBody : options.rawBody.toString("utf8");
    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      const params = new URLSearchParams(rawString);
      parsed = Object.fromEntries(params.entries());
    }
    const rawStatus = parsed?.STATUS || parsed?.resultInfo?.resultStatus;
    const isSuccess = rawStatus === "TXN_SUCCESS";
    const normalizedEvent = isSuccess ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED";
    const orderId = parsed?.ORDERID || parsed?.orderId;
    const paymentId = parsed?.TXNID || parsed?.txnId;
    const amount = parsed?.TXNAMOUNT ? parseFloat(parsed.TXNAMOUNT) : void 0;
    return {
      isValid: true,
      normalizedEvent,
      rawEvent: rawStatus,
      gateway: "paytm",
      orderId,
      paymentId,
      amount,
      currency: "INR",
      data: parsed
    };
  }
};

// src/adapters/stripe.adapter.ts
var StripeAdapter = class extends BasePaymentAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.name = "stripe";
    this.baseUrl = "https://api.stripe.com/v1";
    if (!config.secretKey) {
      throw new PaymentError("Stripe secretKey is required.", { gateway: "stripe" });
    }
  }
  getAuthHeader() {
    return {
      Authorization: `Bearer ${this.config.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    };
  }
  async createOrder(options) {
    const amountInCents = Math.round(options.amount * 100);
    const body = {
      "payment_method_types[0]": "card",
      mode: "payment",
      client_reference_id: options.receipt,
      customer_email: options.customer.email,
      "line_items[0][price_data][currency]": options.currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": String(amountInCents),
      "line_items[0][price_data][product_data][name]": `Order #${options.receipt}`,
      "line_items[0][quantity]": "1",
      success_url: options.redirectUrl || "https://yourstore.com/order-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://yourstore.com/cart"
    };
    const res = await this.fetchJson(`${this.baseUrl}/checkout/sessions`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body
    });
    return {
      gateway: "stripe",
      orderId: options.receipt,
      gatewayOrderId: res.id,
      amount: options.amount,
      currency: options.currency.toUpperCase(),
      status: "CREATED",
      redirectUrl: res.url,
      rawResponse: res
    };
  }
  async verifyPayment(options) {
    const session = await this.fetchJson(`${this.baseUrl}/checkout/sessions/${options.orderId}`, {
      method: "GET",
      headers: this.getAuthHeader()
    });
    const isSuccessful = session.payment_status === "paid";
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const paymentId = session.payment_intent || session.id;
    return {
      gateway: "stripe",
      isSuccessful,
      paymentId,
      orderId: session.client_reference_id || session.id,
      amount,
      currency: (session.currency || "USD").toUpperCase(),
      paymentMethod: "card",
      rawResponse: session
    };
  }
  async refund(options) {
    const body = {
      payment_intent: options.paymentId
    };
    if (options.amount) {
      body.amount = String(Math.round(options.amount * 100));
    }
    if (options.reason) {
      body.reason = "requested_by_customer";
    }
    const res = await this.fetchJson(`${this.baseUrl}/refunds`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body
    });
    return {
      gateway: "stripe",
      refundId: res.id,
      paymentId: options.paymentId,
      amount: res.amount / 100,
      // Normalized to standard currency units
      status: res.status === "succeeded" ? "SUCCESS" : "PENDING",
      rawResponse: res
    };
  }
  async verifyWebhook(options) {
    const secret = options.webhookSecret || this.config.webhookSecret;
    if (!secret) {
      return { isValid: false, normalizedEvent: "UNKNOWN", gateway: "stripe", error: "Stripe webhookSecret is not configured." };
    }
    const sigHeader = this.getHeader(options.headers, "stripe-signature");
    if (!sigHeader || typeof sigHeader !== "string") {
      return { isValid: false, normalizedEvent: "UNKNOWN", gateway: "stripe", error: "Missing stripe-signature header." };
    }
    const parts = sigHeader.split(",");
    let timestamp = "";
    const signatures = [];
    parts.forEach((part) => {
      const [key, val] = part.split("=");
      if (key === "t") timestamp = val;
      if (key === "v1") signatures.push(val);
    });
    const rawString = typeof options.rawBody === "string" ? options.rawBody : options.rawBody.toString("utf8");
    const signedPayload = `${timestamp}.${rawString}`;
    const expectedSignature = hmacSha256(signedPayload, secret);
    const isValid = signatures.some((sig) => safeCompare(expectedSignature, sig));
    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch {
      parsed = null;
    }
    const rawEvent = parsed?.type || "";
    let normalizedEvent = "UNKNOWN";
    if (rawEvent === "checkout.session.completed" || rawEvent === "payment_intent.succeeded") {
      normalizedEvent = "PAYMENT_SUCCESS";
    } else if (rawEvent === "payment_intent.payment_failed") {
      normalizedEvent = "PAYMENT_FAILED";
    } else if (rawEvent === "charge.refunded") {
      normalizedEvent = "REFUND_PROCESSED";
    } else if (rawEvent?.includes("dispute")) {
      normalizedEvent = "DISPUTE_CREATED";
    }
    const obj = parsed?.data?.object;
    const orderId = obj?.client_reference_id || obj?.metadata?.order_id || obj?.id;
    const paymentId = obj?.payment_intent || obj?.id;
    const amount = obj?.amount_total ? obj.amount_total / 100 : obj?.amount ? obj.amount / 100 : void 0;
    const currency = obj?.currency ? obj.currency.toUpperCase() : void 0;
    return {
      isValid,
      normalizedEvent,
      rawEvent,
      gateway: "stripe",
      orderId,
      paymentId,
      amount,
      currency,
      data: obj
    };
  }
};

// src/adapters/cod.adapter.ts
var CODAdapter = class extends BasePaymentAdapter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.name = "cod";
  }
  async createOrder(options) {
    const min = this.config.minOrderValue ?? 0;
    const max = this.config.maxOrderValue ?? 1e4;
    if (options.amount < min) {
      throw new PaymentError(`Order amount ${options.amount} is below minimum COD threshold of ${min}`, {
        gateway: "cod",
        statusCode: 400
      });
    }
    if (options.amount > max) {
      throw new PaymentError(`Order amount ${options.amount} exceeds maximum COD limit of ${max}`, {
        gateway: "cod",
        statusCode: 400
      });
    }
    const codFee = this.config.extraFee || 0;
    const totalAmount = options.amount + codFee;
    return {
      gateway: "cod",
      orderId: options.receipt,
      gatewayOrderId: `COD_${options.receipt}`,
      amount: totalAmount,
      currency: options.currency.toUpperCase(),
      status: "CREATED",
      rawResponse: {
        paymentMode: "Cash On Delivery",
        baseAmount: options.amount,
        codFee,
        totalPayable: totalAmount
      }
    };
  }
  async verifyPayment(options) {
    return {
      gateway: "cod",
      isSuccessful: true,
      paymentId: `COD_COLLECTED_${options.orderId}`,
      orderId: options.orderId,
      amount: 0,
      currency: "INR",
      paymentMethod: "cash_on_delivery",
      rawResponse: { status: "COLLECTED" }
    };
  }
  async refund(options) {
    return {
      gateway: "cod",
      refundId: `COD_RF_${Date.now()}`,
      paymentId: options.paymentId,
      amount: options.amount || 0,
      status: "SUCCESS",
      rawResponse: { note: "Manual cash/store-credit refund for COD" }
    };
  }
  async verifyWebhook(_options) {
    return {
      isValid: true,
      normalizedEvent: "PAYMENT_SUCCESS",
      rawEvent: "COD_ORDER",
      gateway: "cod",
      data: {}
    };
  }
};

// src/manager.ts
var PaymentManager = class {
  constructor(options) {
    this.adapters = /* @__PURE__ */ new Map();
    this.defaultGateway = options.defaultGateway;
    this.smartRouting = options.smartRouting;
    const { gateways } = options;
    if (gateways.razorpay) {
      this.adapters.set("razorpay", new RazorpayAdapter(gateways.razorpay));
    }
    if (gateways.cashfree) {
      this.adapters.set("cashfree", new CashfreeAdapter(gateways.cashfree));
    }
    if (gateways.phonepe) {
      this.adapters.set("phonepe", new PhonePeAdapter(gateways.phonepe));
    }
    if (gateways.paytm) {
      this.adapters.set("paytm", new PaytmAdapter(gateways.paytm));
    }
    if (gateways.stripe) {
      this.adapters.set("stripe", new StripeAdapter(gateways.stripe));
    }
    if (gateways.cod) {
      this.adapters.set("cod", new CODAdapter(gateways.cod));
    }
    if (this.adapters.size === 0) {
      console.warn("\u26A0\uFE0F [PaymentManager] No payment gateways were configured in PaymentManager.");
    }
  }
  /**
   * Returns an active adapter instance by gateway name.
   */
  getAdapter(gateway) {
    const adapter = this.adapters.get(gateway);
    if (!adapter) {
      throw new GatewayNotConfiguredError(gateway);
    }
    return adapter;
  }
  /**
   * Lists all currently registered gateway names.
   */
  listConfiguredGateways() {
    return Array.from(this.adapters.keys());
  }
  /**
   * Resolves the optimal gateway based on currency rules, explicit override, or default.
   */
  resolveGateway(options) {
    if (options.gateway) {
      return options.gateway;
    }
    if (options.currency && this.smartRouting?.currencyMap) {
      const mapped = this.smartRouting.currencyMap[options.currency.toUpperCase()];
      if (mapped && this.adapters.has(mapped)) {
        return mapped;
      }
    }
    if (this.defaultGateway && this.adapters.has(this.defaultGateway)) {
      return this.defaultGateway;
    }
    const firstAvailable = this.adapters.keys().next().value;
    if (firstAvailable) {
      return firstAvailable;
    }
    throw new PaymentError("No payment gateways configured to process order.");
  }
  /**
   * Create an order using the chosen or automatically resolved gateway.
   */
  async createOrder(options) {
    const targetGateway = this.resolveGateway({
      gateway: options.gateway,
      currency: options.currency
    });
    const adapter = this.getAdapter(targetGateway);
    return adapter.createOrder(options);
  }
  /**
   * Smart Fallback: Attempts creation on primary gateway. If it throws an error or fails,
   * it automatically routes through fallback gateways in sequence!
   */
  async createOrderWithFallback(options) {
    const chain = options.fallbackChain || this.smartRouting?.fallbackChain || this.listConfiguredGateways();
    if (chain.length === 0) {
      throw new PaymentError("Fallback chain is empty. Configure at least one gateway.");
    }
    let lastError;
    for (const gw of chain) {
      if (!this.adapters.has(gw)) continue;
      try {
        const adapter = this.getAdapter(gw);
        const result = await adapter.createOrder({ ...options, gateway: gw });
        return result;
      } catch (err) {
        lastError = err;
        console.warn(`[PaymentManager Fallback] Gateway '${gw}' failed (${err.message}). Trying next gateway in chain...`);
      }
    }
    throw new PaymentError(
      `All gateways in fallback chain [${chain.join(", ")}] failed. Last error: ${lastError?.message || "Unknown"}`,
      { rawError: lastError }
    );
  }
  /**
   * Verifies payment completion signature or status query.
   */
  async verifyPayment(options) {
    const adapter = this.getAdapter(options.gateway);
    return adapter.verifyPayment(options);
  }
  /**
   * Initiates a customer refund.
   */
  async refund(options) {
    const adapter = this.getAdapter(options.gateway);
    return adapter.refund(options);
  }
  /**
   * Verifies incoming webhook authenticity and decodes payload.
   */
  async verifyWebhook(options) {
    const adapter = this.getAdapter(options.gateway);
    return adapter.verifyWebhook(options);
  }
  /**
   * Ready-made Next.js 13/14/15 App Router Route Handler Webhook Authenticator.
   * Directly consumes the standard web Request object with raw stream body handling:
   *
   * ```typescript
   * export async function POST(req: Request) {
   *   const result = await payments.verifyNextJsWebhook(req, { gateway: 'razorpay' });
   *   if (!result.isValid) return new Response('Invalid Signature', { status: 400 });
   *   console.log('Event:', result.normalizedEvent, result.orderId);
   *   return new Response('OK');
   * }
   * ```
   */
  async verifyNextJsWebhook(request, options) {
    try {
      let rawBody = "";
      if (typeof request.text === "function") {
        rawBody = await request.text();
      } else if (typeof request.body === "string") {
        rawBody = request.body;
      } else if (Buffer.isBuffer(request.body)) {
        rawBody = request.body.toString("utf8");
      }
      const headers = {};
      if (request.headers) {
        if (typeof request.headers.forEach === "function") {
          request.headers.forEach((val, key) => {
            headers[key.toLowerCase()] = val;
          });
        } else if (typeof request.headers.entries === "function") {
          for (const [key, val] of request.headers.entries()) {
            headers[key.toLowerCase()] = val;
          }
        } else if (typeof request.headers === "object") {
          Object.entries(request.headers).forEach(([k, v]) => {
            headers[k.toLowerCase()] = Array.isArray(v) ? v[0] : v;
          });
        }
      }
      return this.verifyWebhook({
        gateway: options.gateway,
        rawBody,
        headers,
        webhookSecret: options.webhookSecret
      });
    } catch (err) {
      return {
        isValid: false,
        normalizedEvent: "UNKNOWN",
        gateway: options.gateway,
        error: `Failed to process Next.js webhook: ${err.message}`
      };
    }
  }
};
function createPaymentManager(options) {
  return new PaymentManager(options);
}

exports.BasePaymentAdapter = BasePaymentAdapter;
exports.CODAdapter = CODAdapter;
exports.CashfreeAdapter = CashfreeAdapter;
exports.GatewayNotConfiguredError = GatewayNotConfiguredError;
exports.PaymentError = PaymentError;
exports.PaymentManager = PaymentManager;
exports.PaytmAdapter = PaytmAdapter;
exports.PhonePeAdapter = PhonePeAdapter;
exports.RazorpayAdapter = RazorpayAdapter;
exports.SignatureVerificationError = SignatureVerificationError;
exports.StripeAdapter = StripeAdapter;
exports.base64Decode = base64Decode;
exports.base64Encode = base64Encode;
exports.createPaymentManager = createPaymentManager;
exports.hmacSha256 = hmacSha256;
exports.safeCompare = safeCompare;
exports.sha256 = sha256;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map