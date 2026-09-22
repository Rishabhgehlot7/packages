import { EventEmitter } from 'events';

type AnalyticsEventName = 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'checkout_started' | 'checkout_completed' | 'purchase' | 'search' | 'coupon_applied' | 'wishlist_added' | 'custom';
interface AnalyticsEvent {
    id: string;
    name: AnalyticsEventName | string;
    sessionId: string;
    userId?: string;
    properties: Record<string, unknown>;
    timestamp: Date;
}
interface SaleRecord {
    orderId: string;
    userId?: string;
    sessionId: string;
    revenue: number;
    items: SaleItem[];
    couponCode?: string;
    discountAmount?: number;
    timestamp: Date;
}
interface SaleItem {
    productId: string;
    productName: string;
    category?: string;
    quantity: number;
    price: number;
}
type FunnelStep = 'product_view' | 'add_to_cart' | 'checkout_started' | 'checkout_completed';
interface FunnelStats {
    steps: Array<{
        step: FunnelStep;
        count: number;
        dropOffRate: number;
    }>;
    overallConversionRate: number;
}
interface AnalyticsKPIs {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    revenuePerVisit: number;
    totalSessions: number;
    totalProductViews: number;
    cartAbandonmentRate: number;
    topProducts: ProductRevenue[];
}
interface ProductRevenue {
    productId: string;
    productName: string;
    totalRevenue: number;
    unitsSold: number;
}
interface AnalyticsSession {
    sessionId: string;
    userId?: string;
    events: AnalyticsEvent[];
    startedAt: Date;
    converted: boolean;
}
interface AnalyticsManagerEvents {
    'sale:recorded': {
        orderId: string;
        revenue: number;
    };
    'event:tracked': {
        name: string;
        sessionId: string;
    };
    'funnel:converted': {
        sessionId: string;
        userId?: string;
    };
    'kpi:updated': {
        kpis: AnalyticsKPIs;
    };
}

declare class BoostAnalyticsManager extends EventEmitter {
    private sessions;
    private sales;
    trackEvent(name: AnalyticsEventName | string, sessionId: string, properties?: Record<string, unknown>, userId?: string): AnalyticsEvent;
    recordSale(params: {
        orderId: string;
        sessionId: string;
        revenue: number;
        items: SaleItem[];
        userId?: string;
        couponCode?: string;
        discountAmount?: number;
    }): SaleRecord;
    getFunnelStats(): FunnelStats;
    getKPIs(): AnalyticsKPIs;
    getSession(sessionId: string): AnalyticsSession | undefined;
    getAllSales(): SaleRecord[];
    getTopProducts(n?: number): ProductRevenue[];
    sync(sessions: AnalyticsSession[], sales?: SaleRecord[]): void;
    export(): {
        sessions: AnalyticsSession[];
        sales: SaleRecord[];
    };
}

declare const analyticsAgentTools: ({
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            name: {
                type: string;
            };
            sessionId: {
                type: string;
            };
            properties: {
                type: string;
            };
            userId: {
                type: string;
            };
            orderId?: undefined;
            revenue?: undefined;
            items?: undefined;
            n?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            orderId: {
                type: string;
            };
            sessionId: {
                type: string;
            };
            revenue: {
                type: string;
            };
            items: {
                type: string;
            };
            userId: {
                type: string;
            };
            name?: undefined;
            properties?: undefined;
            n?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            name?: undefined;
            sessionId?: undefined;
            properties?: undefined;
            userId?: undefined;
            orderId?: undefined;
            revenue?: undefined;
            items?: undefined;
            n?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            n: {
                type: string;
            };
            name?: undefined;
            sessionId?: undefined;
            properties?: undefined;
            userId?: undefined;
            orderId?: undefined;
            revenue?: undefined;
            items?: undefined;
        };
        required?: undefined;
    };
})[];
type AnalyticsAgentToolName = typeof analyticsAgentTools[number]['name'];

interface AnalyticsConfig {
    /** Meta (Facebook) Pixel ID, e.g. "1234567890" */
    fbPixelId?: string;
    /** Google Tag Manager Container ID, e.g. "GTM-XXXXXX" */
    gtmId?: string;
    /** Microsoft Clarity Project ID, e.g. "ab12cd34ef" */
    clarityId?: string;
    /** Default currency code, defaults to "INR" */
    currency?: string;
    /** Default brand name used if not provided per item */
    defaultBrand?: string;
    /** Enable debug logging in browser console */
    debug?: boolean;
    /** Enable in-app browser WebView error protection (Instagram/Facebook/WhatsApp) */
    enableInAppShield?: boolean;
    /** Show on-screen interactive test badge & event inspector (or add ?boost_debug=1 in URL) */
    showDebugger?: boolean;
}
interface TrackItem {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    price?: number;
    quantity?: number;
    qty?: number;
    category?: string;
    brand?: string;
    variant?: string;
    product?: {
        _id?: string;
        id?: string;
        name?: string;
        title?: string;
        price?: number;
        category?: string;
        brand?: string;
        variant?: string;
        [key: string]: any;
    };
    [key: string]: any;
}
interface TrackViewItemParams {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    price?: number;
    category?: string;
    brand?: string;
    variant?: string;
    currency?: string;
    [key: string]: any;
}
interface TrackAddToCartParams {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    price?: number;
    quantity?: number;
    qty?: number;
    category?: string;
    brand?: string;
    variant?: string;
    currency?: string;
    [key: string]: any;
}
interface TrackRemoveFromCartParams {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    price?: number;
    quantity?: number;
    qty?: number;
    category?: string;
    brand?: string;
    variant?: string;
    currency?: string;
    [key: string]: any;
}
interface TrackBeginCheckoutParams {
    totalValue: number;
    items: (TrackItem | any)[];
    coupon?: string;
    currency?: string;
    [key: string]: any;
}
interface TrackPaymentInfoParams {
    totalValue: number;
    paymentMethod?: string;
    items: (TrackItem | any)[];
    currency?: string;
    [key: string]: any;
}
interface TrackPurchaseParams {
    transaction_id: string;
    value: number;
    tax?: number;
    shipping?: number;
    coupon?: string;
    items: (TrackItem | any)[];
    currency?: string;
    [key: string]: any;
}
interface EventLog {
    id: string;
    timestamp: string;
    eventName: string;
    channels: ('Meta Pixel' | 'Google Tag Manager' | 'Custom')[];
    payload: Record<string, any>;
}
interface AnalyticsDiagnosis {
    metaPixelReady: boolean;
    gtmReady: boolean;
    clarityReady: boolean;
    totalEventsFired: number;
    lastEvent?: EventLog;
}
declare global {
    interface Window {
        dataLayer?: Record<string, any>[];
        fbq?: ((...args: any[]) => void) & {
            callMethod?: (...args: any[]) => void;
            queue?: any[];
            push?: any;
            loaded?: boolean;
            version?: string;
        };
        _fbq?: any;
        clarity?: (...args: any[]) => void;
    }
}

type EventListener = (log: EventLog, allLogs: EventLog[]) => void;
declare function onAnalyticsEvent(callback: EventListener): () => void;
/**
 * Configure global settings (currency, default brand, debug mode).
 */
declare function initAnalytics(config: AnalyticsConfig): void;
/**
 * Get current active configuration.
 */
declare function getAnalyticsConfig(): AnalyticsConfig;
/**
 * Get all captured event logs.
 */
declare function getEventLogs(): EventLog[];
/**
 * Clear captured event logs.
 */
declare function clearEventLogs(): void;
/**
 * Diagnose health of active tracking pixels and tags.
 */
declare function diagnoseAnalytics(): AnalyticsDiagnosis;
/**
 * Safe push to Google Tag Manager / GA4 DataLayer.
 */
declare function pushToDataLayer(data: Record<string, any>): void;
/**
 * Safe call to Meta (Facebook) Pixel fbq().
 */
declare function pushToFbPixel(action: string, eventName: string, params?: Record<string, any>): void;
/**
 * 1. Track Product View (PDP)
 */
declare function trackViewItem(params: TrackViewItemParams): void;
/**
 * 2. Track Add To Cart
 */
declare function trackAddToCart(params: TrackAddToCartParams): void;
/**
 * 3. Track Remove From Cart
 */
declare function trackRemoveFromCart(params: TrackRemoveFromCartParams): void;
/**
 * 4. Track Begin Checkout
 */
declare function trackBeginCheckout(params: TrackBeginCheckoutParams): void;
/**
 * 5. Track Add Payment Info
 */
declare function trackAddPaymentInfo(params: TrackPaymentInfoParams): void;
/**
 * 6. Track Purchase / Order Placed
 */
declare function trackPurchase(params: TrackPurchaseParams): void;
/**
 * 7. Track Custom Event
 */
declare function trackCustomEvent(eventName: string, params?: Record<string, any>): void;
/**
 * Helper to trigger a live mock event to test Pixel & GTM connectivity.
 */
declare function fireTestEvent(type?: 'AddToCart' | 'Purchase'): void;

export { type AnalyticsAgentToolName, type AnalyticsEvent, type AnalyticsEventName, type AnalyticsKPIs, type AnalyticsManagerEvents, type AnalyticsSession, BoostAnalyticsManager, type FunnelStats, type FunnelStep, type ProductRevenue, type SaleItem, type SaleRecord, analyticsAgentTools, clearEventLogs, diagnoseAnalytics, fireTestEvent, getAnalyticsConfig, getEventLogs, initAnalytics, onAnalyticsEvent, pushToDataLayer, pushToFbPixel, trackAddPaymentInfo, trackAddToCart, trackBeginCheckout, trackCustomEvent, trackPurchase, trackRemoveFromCart, trackViewItem };
