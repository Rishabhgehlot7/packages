import {
  AnalyticsConfig,
  TrackItem,
  TrackViewItemParams,
  TrackAddToCartParams,
  TrackRemoveFromCartParams,
  TrackBeginCheckoutParams,
  TrackPaymentInfoParams,
  TrackPurchaseParams,
  EventLog,
  AnalyticsDiagnosis,
} from './types';
import { isEventDuplicate } from './utils/dedupe';

// Global internal configuration
let globalConfig: AnalyticsConfig = {
  currency: 'INR',
  defaultBrand: 'Brand',
  debug: false,
  showDebugger: false,
};

// In-memory event stream for testing and debugging
const eventLogs: EventLog[] = [];
type EventListener = (log: EventLog, allLogs: EventLog[]) => void;
const listeners: Set<EventListener> = new Set();

export function onAnalyticsEvent(callback: EventListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function recordLog(
  eventName: string,
  channels: ('Meta Pixel' | 'Google Tag Manager' | 'Custom')[],
  payload: Record<string, any>
) {
  const log: EventLog = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString(),
    eventName,
    channels,
    payload,
  };

  eventLogs.unshift(log); // newest first
  if (eventLogs.length > 50) {
    eventLogs.pop(); // keep last 50
  }

  // Notify active debuggers
  listeners.forEach((fn) => {
    try {
      fn(log, eventLogs);
    } catch {
      // ignore listener errors
    }
  });

  // Pretty Console Output when in debug mode
  const isDebug =
    globalConfig.debug ||
    (typeof window !== 'undefined' &&
      (window.location.search.includes('boost_debug=1') ||
        window.location.search.includes('boost_debug=true')));

  if (isDebug && typeof console !== 'undefined') {
    const channelBadges = channels.join(' + ');
    console.groupCollapsed(
      `%c🎯 [BoostAnalytics] ${eventName} %c(${channelBadges})`,
      'background: #2563eb; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #64748b; font-size: 11px;'
    );
    console.log('Timestamp:', log.timestamp);
    console.log('Payload:', payload);
    console.log('Active Channels:', channels);
    console.groupEnd();
  }
}

/**
 * Configure global settings (currency, default brand, debug mode).
 */
export function initAnalytics(config: AnalyticsConfig): void {
  globalConfig = {
    ...globalConfig,
    ...config,
  };
}

/**
 * Get current active configuration.
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return globalConfig;
}

/**
 * Get all captured event logs.
 */
export function getEventLogs(): EventLog[] {
  return [...eventLogs];
}

/**
 * Clear captured event logs.
 */
export function clearEventLogs(): void {
  eventLogs.length = 0;
  listeners.forEach((fn) => fn({ id: '0', timestamp: '', eventName: 'cleared', channels: [], payload: {} }, []));
}

/**
 * Diagnose health of active tracking pixels and tags.
 */
export function diagnoseAnalytics(): AnalyticsDiagnosis {
  const metaPixelReady = typeof window !== 'undefined' && typeof window.fbq === 'function';
  const gtmReady = typeof window !== 'undefined' && Array.isArray(window.dataLayer);
  const clarityReady = typeof window !== 'undefined' && typeof window.clarity === 'function';

  return {
    metaPixelReady,
    gtmReady,
    clarityReady,
    totalEventsFired: eventLogs.length,
    lastEvent: eventLogs[0],
  };
}

/**
 * Safe push to Google Tag Manager / GA4 DataLayer.
 */
export function pushToDataLayer(data: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  if (data.ecommerce) {
    window.dataLayer.push({ ecommerce: null });
  }

  window.dataLayer.push(data);
}

/**
 * Safe call to Meta (Facebook) Pixel fbq().
 */
export function pushToFbPixel(action: string, eventName: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  if (params) {
    window.fbq(action, eventName, params);
  } else {
    window.fbq(action, eventName);
  }
}

/**
 * Helper to normalize item object for GTM/GA4.
 */
function normalizeGtmItem(item: any, currency: string) {
  if (!item) {
    return {
      item_id: 'item',
      item_name: 'Product',
      item_brand: globalConfig.defaultBrand || 'Brand',
      item_category: 'General',
      item_variant: '',
      price: 0,
      quantity: 1,
      currency,
    };
  }
  const itemId = item.id || item._id || item.product?._id || item.product?.id || item.productId || 'item';
  const itemName = item.name || item.title || item.product?.name || item.product?.title || 'Product';
  const itemBrand = item.brand || item.product?.brand || globalConfig.defaultBrand || 'Brand';
  const itemCategory = item.category || item.product?.category || 'General';
  const itemVariant = item.variant || item.product?.variant || '';
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
    currency,
  };
}

/**
 * 1. Track Product View (PDP)
 */
export function trackViewItem(params: TrackViewItemParams): void {
  if (typeof window === 'undefined') return;
  const currency = params.currency || globalConfig.currency || 'INR';
  const itemId = String(params.id || params._id || params.product?._id || params.product?.id || params.productId || 'product');
  const itemName = String(params.name || params.title || params.product?.name || params.product?.title || 'Product');
  const price = Number(params.price ?? params.product?.price ?? 0) || 0;
  const brand = params.brand || params.product?.brand || globalConfig.defaultBrand || 'Brand';
  const category = params.category || params.product?.category || 'General';
  const variant = params.variant || params.product?.variant || '';

  // 1. GTM / GA4
  pushToDataLayer({
    event: 'view_item',
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
            quantity: 1,
          },
          currency
        ),
      ],
    },
  });

  // 2. Meta Pixel
  pushToFbPixel('track', 'ViewContent', {
    content_name: itemName,
    content_ids: [itemId],
    content_type: 'product',
    value: price,
    currency,
  });

  recordLog('ViewContent (view_item)', ['Meta Pixel', 'Google Tag Manager'], {
    id: itemId,
    name: itemName,
    price,
    currency,
  });
}

/**
 * 2. Track Add To Cart
 */
export function trackAddToCart(params: TrackAddToCartParams): void {
  if (typeof window === 'undefined') return;
  const currency = params.currency || globalConfig.currency || 'INR';
  const itemId = String(params.id || params._id || params.product?._id || params.product?.id || params.productId || 'product');
  const itemName = String(params.name || params.title || params.product?.name || params.product?.title || 'Product');
  const price = Number(params.price ?? params.product?.price ?? 0) || 0;
  const quantity = Number(params.quantity ?? params.qty ?? 1) || 1;
  const brand = params.brand || params.product?.brand || globalConfig.defaultBrand || 'Brand';
  const category = params.category || params.product?.category || 'General';
  const variant = params.variant || params.product?.variant || '';

  // 1. GTM / GA4
  pushToDataLayer({
    event: 'add_to_cart',
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
            variant,
          },
          currency
        ),
      ],
    },
  });

  // 2. Meta Pixel
  pushToFbPixel('track', 'AddToCart', {
    content_name: itemName,
    content_ids: [itemId],
    content_type: 'product',
    value: price * quantity,
    currency,
  });

  recordLog('AddToCart (add_to_cart)', ['Meta Pixel', 'Google Tag Manager'], {
    id: itemId,
    name: itemName,
    price,
    quantity,
    value: price * quantity,
    currency,
  });
}

/**
 * 3. Track Remove From Cart
 */
export function trackRemoveFromCart(params: TrackRemoveFromCartParams): void {
  if (typeof window === 'undefined') return;
  const currency = params.currency || globalConfig.currency || 'INR';
  const itemId = String(params.id || params._id || params.product?._id || params.product?.id || params.productId || 'product');
  const itemName = String(params.name || params.title || params.product?.name || params.product?.title || 'Product');
  const price = Number(params.price ?? params.product?.price ?? 0) || 0;
  const quantity = Number(params.quantity ?? params.qty ?? 1) || 1;
  const brand = params.brand || params.product?.brand || globalConfig.defaultBrand || 'Brand';
  const category = params.category || params.product?.category || 'General';
  const variant = params.variant || params.product?.variant || '';

  pushToDataLayer({
    event: 'remove_from_cart',
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
            variant,
          },
          currency
        ),
      ],
    },
  });

  recordLog('RemoveFromCart (remove_from_cart)', ['Google Tag Manager'], {
    id: itemId,
    name: itemName,
    quantity,
    currency,
  });
}

/**
 * 4. Track Begin Checkout
 */
export function trackBeginCheckout(params: TrackBeginCheckoutParams): void {
  if (typeof window === 'undefined') return;
  const currency = params.currency || globalConfig.currency || 'INR';
  const itemsList = Array.isArray(params.items) ? params.items : [];
  const contentIds = itemsList
    .map((item: any) => item.id || item._id || item.product?._id || item.product?.id || item.productId)
    .filter(Boolean)
    .map(String);
  const numItems = itemsList.reduce(
    (sum: number, item: any) => sum + (Number(item.quantity ?? item.qty ?? 1) || 1),
    0
  );

  // 1. GTM / GA4
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency,
      value: params.totalValue,
      coupon: params.coupon || '',
      items: itemsList.map((item) => normalizeGtmItem(item, currency)),
    },
  });

  // 2. Meta Pixel
  pushToFbPixel('track', 'InitiateCheckout', {
    content_ids: contentIds,
    num_items: numItems,
    value: params.totalValue,
    currency,
  });

  recordLog('InitiateCheckout (begin_checkout)', ['Meta Pixel', 'Google Tag Manager'], {
    totalValue: params.totalValue,
    itemCount: itemsList.length,
    currency,
  });
}

/**
 * 5. Track Add Payment Info
 */
export function trackAddPaymentInfo(params: TrackPaymentInfoParams): void {
  if (typeof window === 'undefined') return;
  const currency = params.currency || globalConfig.currency || 'INR';
  const itemsList = Array.isArray(params.items) ? params.items : [];

  // 1. GTM / GA4
  pushToDataLayer({
    event: 'add_payment_info',
    ecommerce: {
      currency,
      value: params.totalValue,
      payment_type: params.paymentMethod || 'Online',
      items: itemsList.map((item) => normalizeGtmItem(item, currency)),
    },
  });

  // 2. Meta Pixel
  pushToFbPixel('track', 'AddPaymentInfo', {
    value: params.totalValue,
    currency,
  });

  recordLog('AddPaymentInfo (add_payment_info)', ['Meta Pixel', 'Google Tag Manager'], {
    totalValue: params.totalValue,
    paymentMethod: params.paymentMethod || 'Online',
    currency,
  });
}

/**
 * 6. Track Purchase / Order Placed
 */
export function trackPurchase(params: TrackPurchaseParams): void {
  if (typeof window === 'undefined') return;

  if (isEventDuplicate(`purchase_${params.transaction_id}`)) {
    return;
  }

  const currency = params.currency || globalConfig.currency || 'INR';
  const itemsList = Array.isArray(params.items) ? params.items : [];
  const contentIds = itemsList
    .map((item: any) => item.id || item._id || item.product?._id || item.product?.id || item.productId)
    .filter(Boolean)
    .map(String);

  const contents = itemsList.map((item: any) => {
    const id = item.id || item._id || item.product?._id || item.product?.id || item.productId || 'item';
    const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
    const price = Number(item.price ?? item.product?.price ?? 0) || 0;
    return {
      id: String(id),
      quantity,
      item_price: price,
    };
  });

  // 1. GTM / GA4
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: params.transaction_id,
      value: params.value,
      tax: params.tax || 0,
      shipping: params.shipping || 0,
      coupon: params.coupon || '',
      currency,
      items: itemsList.map((item) => normalizeGtmItem(item, currency)),
    },
  });

  // 2. Meta Pixel
  pushToFbPixel('track', 'Purchase', {
    content_type: 'product',
    content_ids: contentIds,
    contents,
    value: params.value,
    currency,
  });

  recordLog('Purchase (purchase)', ['Meta Pixel', 'Google Tag Manager'], {
    transaction_id: params.transaction_id,
    value: params.value,
    currency,
    items: itemsList.length,
  });
}

/**
 * 7. Track Custom Event
 */
export function trackCustomEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  pushToDataLayer({
    event: eventName,
    ...params,
  });
  pushToFbPixel('trackCustom', eventName, params);
  recordLog(eventName, ['Custom', 'Meta Pixel', 'Google Tag Manager'], params || {});
}

/**
 * Helper to trigger a live mock event to test Pixel & GTM connectivity.
 */
export function fireTestEvent(type: 'AddToCart' | 'Purchase' = 'AddToCart'): void {
  if (type === 'AddToCart') {
    trackAddToCart({
      id: 'TEST-SKU-999',
      name: 'Boost Engine Test T-Shirt',
      price: 499,
      quantity: 1,
      category: 'Test Category',
      brand: globalConfig.defaultBrand || 'Test Brand',
    });
  } else {
    trackPurchase({
      transaction_id: `TEST_ORD_${Date.now().toString().slice(-6)}`,
      value: 999,
      currency: globalConfig.currency || 'INR',
      items: [
        {
          id: 'TEST-SKU-999',
          name: 'Boost Engine Test T-Shirt',
          price: 999,
          quantity: 1,
          category: 'Test Category',
          brand: globalConfig.defaultBrand || 'Test Brand',
        },
      ],
    });
  }
}
