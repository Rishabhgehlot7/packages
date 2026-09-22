// src/analytics-manager.ts
import { EventEmitter } from "events";
function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
var BoostAnalyticsManager = class extends EventEmitter {
  sessions = /* @__PURE__ */ new Map();
  sales = /* @__PURE__ */ new Map();
  // ── Event Tracking ────────────────────────────────────────────────────────
  trackEvent(name, sessionId, properties = {}, userId) {
    const event = { id: uuid(), name, sessionId, userId, properties, timestamp: /* @__PURE__ */ new Date() };
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = { sessionId, userId, events: [], startedAt: /* @__PURE__ */ new Date(), converted: false };
      this.sessions.set(sessionId, session);
    }
    session.events.push(event);
    this.emit("event:tracked", { name, sessionId });
    if (name === "purchase" || name === "checkout_completed") {
      session.converted = true;
      this.emit("funnel:converted", { sessionId, userId });
    }
    return event;
  }
  // ── Revenue Tracking ──────────────────────────────────────────────────────
  recordSale(params) {
    const sale = { ...params, timestamp: /* @__PURE__ */ new Date() };
    this.sales.set(params.orderId, sale);
    this.trackEvent("purchase", params.sessionId, { orderId: params.orderId, revenue: params.revenue }, params.userId);
    this.emit("sale:recorded", { orderId: params.orderId, revenue: params.revenue });
    this.emit("kpi:updated", { kpis: this.getKPIs() });
    return sale;
  }
  // ── Funnel Analysis ───────────────────────────────────────────────────────
  getFunnelStats() {
    const steps = ["product_view", "add_to_cart", "checkout_started", "checkout_completed"];
    const counts = {};
    for (const session of this.sessions.values()) {
      const sessionSteps = new Set(session.events.map((e) => e.name));
      for (const step of steps) {
        if (sessionSteps.has(step)) counts[step] = (counts[step] || 0) + 1;
      }
    }
    const stepData = steps.map((step, i) => {
      const count = counts[step] || 0;
      const prevCount = i === 0 ? count : counts[steps[i - 1]] || 1;
      const dropOff = i === 0 ? 0 : Math.round((1 - count / prevCount) * 100);
      return { step, count, dropOffRate: dropOff };
    });
    const views = counts["product_view"] || 1;
    const orders = counts["checkout_completed"] || 0;
    return { steps: stepData, overallConversionRate: Math.round(orders / views * 1e3) / 10 };
  }
  // ── KPIs ─────────────────────────────────────────────────────────────────
  getKPIs() {
    const allSales = Array.from(this.sales.values());
    const totalRevenue = allSales.reduce((s, r) => s + r.revenue, 0);
    const totalOrders = allSales.length;
    const totalSessions = this.sessions.size;
    const converted = Array.from(this.sessions.values()).filter((s) => s.converted).length;
    const productMap = /* @__PURE__ */ new Map();
    for (const sale of allSales) {
      for (const item of sale.items) {
        const existing = productMap.get(item.productId) ?? { productId: item.productId, productName: item.productName, totalRevenue: 0, unitsSold: 0 };
        existing.totalRevenue += item.price * item.quantity;
        existing.unitsSold += item.quantity;
        productMap.set(item.productId, existing);
      }
    }
    const totalProductViews = Array.from(this.sessions.values()).reduce((s, sess) => s + sess.events.filter((e) => e.name === "product_view").length, 0);
    const cartStarts = Array.from(this.sessions.values()).filter((s) => s.events.some((e) => e.name === "add_to_cart")).length;
    const cartAbandoned = cartStarts - converted;
    const cartAbandonmentRate = cartStarts > 0 ? Math.round(cartAbandoned / cartStarts * 100) : 0;
    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders * 100) / 100 : 0,
      conversionRate: totalSessions > 0 ? Math.round(converted / totalSessions * 1e3) / 10 : 0,
      revenuePerVisit: totalSessions > 0 ? Math.round(totalRevenue / totalSessions * 100) / 100 : 0,
      totalSessions,
      totalProductViews,
      cartAbandonmentRate,
      topProducts: Array.from(productMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10)
    };
  }
  // ── Queries ───────────────────────────────────────────────────────────────
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }
  getAllSales() {
    return Array.from(this.sales.values());
  }
  getTopProducts(n = 10) {
    return this.getKPIs().topProducts.slice(0, n);
  }
  // ── Sync ─────────────────────────────────────────────────────────────────
  sync(sessions, sales = []) {
    sessions.forEach((s) => this.sessions.set(s.sessionId, s));
    sales.forEach((s) => this.sales.set(s.orderId, s));
  }
  export() {
    return { sessions: Array.from(this.sessions.values()), sales: this.getAllSales() };
  }
};

// src/analytics-agent.ts
var analyticsAgentTools = [
  { name: "track_analytics_event", description: "Track a user event (page_view, add_to_cart, purchase, etc.) for a session.", parameters: { type: "object", properties: { name: { type: "string" }, sessionId: { type: "string" }, properties: { type: "object" }, userId: { type: "string" } }, required: ["name", "sessionId"] } },
  { name: "record_sale", description: "Record a completed sale with revenue and line items for KPI tracking.", parameters: { type: "object", properties: { orderId: { type: "string" }, sessionId: { type: "string" }, revenue: { type: "number" }, items: { type: "array" }, userId: { type: "string" } }, required: ["orderId", "sessionId", "revenue", "items"] } },
  { name: "get_kpis", description: "Get current KPI dashboard: total revenue, AOV, CVR, RPV, cart abandonment rate, top products.", parameters: { type: "object", properties: {} } },
  { name: "get_funnel_stats", description: "Get conversion funnel analysis from product_view \u2192 add_to_cart \u2192 checkout_started \u2192 checkout_completed.", parameters: { type: "object", properties: {} } },
  { name: "get_top_products", description: "Get top N products ranked by revenue generated.", parameters: { type: "object", properties: { n: { type: "number" } } } }
];

// src/utils/dedupe.ts
function isEventDuplicate(key) {
  if (typeof window === "undefined") return true;
  try {
    const storageKey = `boost_event_${key}`;
    if (sessionStorage.getItem(storageKey)) {
      return true;
    }
    sessionStorage.setItem(storageKey, "true");
    return false;
  } catch {
    return false;
  }
}

// src/tracker.ts
var globalConfig = {
  currency: "INR",
  defaultBrand: "Brand",
  debug: false,
  showDebugger: false
};
var eventLogs = [];
var listeners = /* @__PURE__ */ new Set();
function onAnalyticsEvent(callback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
function recordLog(eventName, channels, payload) {
  const log = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
    eventName,
    channels,
    payload
  };
  eventLogs.unshift(log);
  if (eventLogs.length > 50) {
    eventLogs.pop();
  }
  listeners.forEach((fn) => {
    try {
      fn(log, eventLogs);
    } catch {
    }
  });
  const isDebug = globalConfig.debug || typeof window !== "undefined" && (window.location.search.includes("boost_debug=1") || window.location.search.includes("boost_debug=true"));
  if (isDebug && typeof console !== "undefined") {
    const channelBadges = channels.join(" + ");
    console.groupCollapsed(
      `%c\u{1F3AF} [BoostAnalytics] ${eventName} %c(${channelBadges})`,
      "background: #2563eb; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
      "color: #64748b; font-size: 11px;"
    );
    console.log("Timestamp:", log.timestamp);
    console.log("Payload:", payload);
    console.log("Active Channels:", channels);
    console.groupEnd();
  }
}
function initAnalytics(config) {
  globalConfig = {
    ...globalConfig,
    ...config
  };
}
function getAnalyticsConfig() {
  return globalConfig;
}
function getEventLogs() {
  return [...eventLogs];
}
function clearEventLogs() {
  eventLogs.length = 0;
  listeners.forEach((fn) => fn({ id: "0", timestamp: "", eventName: "cleared", channels: [], payload: {} }, []));
}
function diagnoseAnalytics() {
  const metaPixelReady = typeof window !== "undefined" && typeof window.fbq === "function";
  const gtmReady = typeof window !== "undefined" && Array.isArray(window.dataLayer);
  const clarityReady = typeof window !== "undefined" && typeof window.clarity === "function";
  return {
    metaPixelReady,
    gtmReady,
    clarityReady,
    totalEventsFired: eventLogs.length,
    lastEvent: eventLogs[0]
  };
}
function pushToDataLayer(data) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (data.ecommerce) {
    window.dataLayer.push({ ecommerce: null });
  }
  window.dataLayer.push(data);
}
function pushToFbPixel(action, eventName, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) {
    window.fbq(action, eventName, params);
  } else {
    window.fbq(action, eventName);
  }
}
function normalizeGtmItem(item, currency) {
  if (!item) {
    return {
      item_id: "item",
      item_name: "Product",
      item_brand: globalConfig.defaultBrand || "Brand",
      item_category: "General",
      item_variant: "",
      price: 0,
      quantity: 1,
      currency
    };
  }
  const itemId = item.id || item._id || item.product?._id || item.product?.id || item.productId || "item";
  const itemName = item.name || item.title || item.product?.name || item.product?.title || "Product";
  const itemBrand = item.brand || item.product?.brand || globalConfig.defaultBrand || "Brand";
  const itemCategory = item.category || item.product?.category || "General";
  const itemVariant = item.variant || item.product?.variant || "";
  const price = Number(item.price ?? item.product?.price ?? 0) || 0;
  const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
  return {
    item_id: String(itemId),
    item_name: String(itemName),
    item_brand: String(itemBrand),
    item_category: String(itemCategory),
    item_variant: String(itemVariant),
    price,
    quantity,
    currency
  };
}
function trackViewItem(params) {
  if (typeof window === "undefined") return;
  const currency = params.currency || globalConfig.currency || "INR";
  const itemId = String(params.id || params._id || params.product?._id || params.product?.id || params.productId || "product");
  const itemName = String(params.name || params.title || params.product?.name || params.product?.title || "Product");
  const price = Number(params.price ?? params.product?.price ?? 0) || 0;
  const brand = params.brand || params.product?.brand || globalConfig.defaultBrand || "Brand";
  const category = params.category || params.product?.category || "General";
  const variant = params.variant || params.product?.variant || "";
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency,
      value: price,
      items: [
        normalizeGtmItem(
          {
            id: itemId,
            name: itemName,
            price,
            brand,
            category,
            variant,
            quantity: 1
          },
          currency
        )
      ]
    }
  });
  pushToFbPixel("track", "ViewContent", {
    content_name: itemName,
    content_ids: [itemId],
    content_type: "product",
    value: price,
    currency
  });
  recordLog("ViewContent (view_item)", ["Meta Pixel", "Google Tag Manager"], {
    id: itemId,
    name: itemName,
    price,
    currency
  });
}
function trackAddToCart(params) {
  if (typeof window === "undefined") return;
  const currency = params.currency || globalConfig.currency || "INR";
  const itemId = String(params.id || params._id || params.product?._id || params.product?.id || params.productId || "product");
  const itemName = String(params.name || params.title || params.product?.name || params.product?.title || "Product");
  const price = Number(params.price ?? params.product?.price ?? 0) || 0;
  const quantity = Number(params.quantity ?? params.qty ?? 1) || 1;
  const brand = params.brand || params.product?.brand || globalConfig.defaultBrand || "Brand";
  const category = params.category || params.product?.category || "General";
  const variant = params.variant || params.product?.variant || "";
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency,
      value: price * quantity,
      items: [
        normalizeGtmItem(
          {
            id: itemId,
            name: itemName,
            price,
            quantity,
            brand,
            category,
            variant
          },
          currency
        )
      ]
    }
  });
  pushToFbPixel("track", "AddToCart", {
    content_name: itemName,
    content_ids: [itemId],
    content_type: "product",
    value: price * quantity,
    currency
  });
  recordLog("AddToCart (add_to_cart)", ["Meta Pixel", "Google Tag Manager"], {
    id: itemId,
    name: itemName,
    price,
    quantity,
    value: price * quantity,
    currency
  });
}
function trackRemoveFromCart(params) {
  if (typeof window === "undefined") return;
  const currency = params.currency || globalConfig.currency || "INR";
  const itemId = String(params.id || params._id || params.product?._id || params.product?.id || params.productId || "product");
  const itemName = String(params.name || params.title || params.product?.name || params.product?.title || "Product");
  const price = Number(params.price ?? params.product?.price ?? 0) || 0;
  const quantity = Number(params.quantity ?? params.qty ?? 1) || 1;
  const brand = params.brand || params.product?.brand || globalConfig.defaultBrand || "Brand";
  const category = params.category || params.product?.category || "General";
  const variant = params.variant || params.product?.variant || "";
  pushToDataLayer({
    event: "remove_from_cart",
    ecommerce: {
      currency,
      value: price * quantity,
      items: [
        normalizeGtmItem(
          {
            id: itemId,
            name: itemName,
            price,
            quantity,
            brand,
            category,
            variant
          },
          currency
        )
      ]
    }
  });
  recordLog("RemoveFromCart (remove_from_cart)", ["Google Tag Manager"], {
    id: itemId,
    name: itemName,
    quantity,
    currency
  });
}
function trackBeginCheckout(params) {
  if (typeof window === "undefined") return;
  const currency = params.currency || globalConfig.currency || "INR";
  const itemsList = Array.isArray(params.items) ? params.items : [];
  const contentIds = itemsList.map((item) => item.id || item._id || item.product?._id || item.product?.id || item.productId).filter(Boolean).map(String);
  const numItems = itemsList.reduce(
    (sum, item) => sum + (Number(item.quantity ?? item.qty ?? 1) || 1),
    0
  );
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency,
      value: params.totalValue,
      coupon: params.coupon || "",
      items: itemsList.map((item) => normalizeGtmItem(item, currency))
    }
  });
  pushToFbPixel("track", "InitiateCheckout", {
    content_ids: contentIds,
    num_items: numItems,
    value: params.totalValue,
    currency
  });
  recordLog("InitiateCheckout (begin_checkout)", ["Meta Pixel", "Google Tag Manager"], {
    totalValue: params.totalValue,
    itemCount: itemsList.length,
    currency
  });
}
function trackAddPaymentInfo(params) {
  if (typeof window === "undefined") return;
  const currency = params.currency || globalConfig.currency || "INR";
  const itemsList = Array.isArray(params.items) ? params.items : [];
  pushToDataLayer({
    event: "add_payment_info",
    ecommerce: {
      currency,
      value: params.totalValue,
      payment_type: params.paymentMethod || "Online",
      items: itemsList.map((item) => normalizeGtmItem(item, currency))
    }
  });
  pushToFbPixel("track", "AddPaymentInfo", {
    value: params.totalValue,
    currency
  });
  recordLog("AddPaymentInfo (add_payment_info)", ["Meta Pixel", "Google Tag Manager"], {
    totalValue: params.totalValue,
    paymentMethod: params.paymentMethod || "Online",
    currency
  });
}
function trackPurchase(params) {
  if (typeof window === "undefined") return;
  if (isEventDuplicate(`purchase_${params.transaction_id}`)) {
    return;
  }
  const currency = params.currency || globalConfig.currency || "INR";
  const itemsList = Array.isArray(params.items) ? params.items : [];
  const contentIds = itemsList.map((item) => item.id || item._id || item.product?._id || item.product?.id || item.productId).filter(Boolean).map(String);
  const contents = itemsList.map((item) => {
    const id = item.id || item._id || item.product?._id || item.product?.id || item.productId || "item";
    const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
    const price = Number(item.price ?? item.product?.price ?? 0) || 0;
    return {
      id: String(id),
      quantity,
      item_price: price
    };
  });
  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: params.transaction_id,
      value: params.value,
      tax: params.tax || 0,
      shipping: params.shipping || 0,
      coupon: params.coupon || "",
      currency,
      items: itemsList.map((item) => normalizeGtmItem(item, currency))
    }
  });
  pushToFbPixel("track", "Purchase", {
    content_type: "product",
    content_ids: contentIds,
    contents,
    value: params.value,
    currency
  });
  recordLog("Purchase (purchase)", ["Meta Pixel", "Google Tag Manager"], {
    transaction_id: params.transaction_id,
    value: params.value,
    currency,
    items: itemsList.length
  });
}
function trackCustomEvent(eventName, params) {
  if (typeof window === "undefined") return;
  pushToDataLayer({
    event: eventName,
    ...params
  });
  pushToFbPixel("trackCustom", eventName, params);
  recordLog(eventName, ["Custom", "Meta Pixel", "Google Tag Manager"], params || {});
}
function fireTestEvent(type = "AddToCart") {
  if (type === "AddToCart") {
    trackAddToCart({
      id: "TEST-SKU-999",
      name: "Boost Engine Test T-Shirt",
      price: 499,
      quantity: 1,
      category: "Test Category",
      brand: globalConfig.defaultBrand || "Test Brand"
    });
  } else {
    trackPurchase({
      transaction_id: `TEST_ORD_${Date.now().toString().slice(-6)}`,
      value: 999,
      currency: globalConfig.currency || "INR",
      items: [
        {
          id: "TEST-SKU-999",
          name: "Boost Engine Test T-Shirt",
          price: 999,
          quantity: 1,
          category: "Test Category",
          brand: globalConfig.defaultBrand || "Test Brand"
        }
      ]
    });
  }
}
export {
  BoostAnalyticsManager,
  analyticsAgentTools,
  clearEventLogs,
  diagnoseAnalytics,
  fireTestEvent,
  getAnalyticsConfig,
  getEventLogs,
  initAnalytics,
  onAnalyticsEvent,
  pushToDataLayer,
  pushToFbPixel,
  trackAddPaymentInfo,
  trackAddToCart,
  trackBeginCheckout,
  trackCustomEvent,
  trackPurchase,
  trackRemoveFromCart,
  trackViewItem
};
