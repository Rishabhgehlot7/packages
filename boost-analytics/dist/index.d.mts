import React from 'react';

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

interface BoostAnalyticsProps extends AnalyticsConfig {
    children?: React.ReactNode;
}
/**
 * Universal Analytics Component for Next.js and Vite.
 * Injects Meta Pixel, Google Tag Manager, Microsoft Clarity, In-App WebView Shields,
 * and live testing debugger widget.
 */
declare function BoostAnalytics({ fbPixelId, gtmId, clarityId, currency, defaultBrand, debug, enableInAppShield, showDebugger, children, }: BoostAnalyticsProps): React.ReactElement;

/**
 * Suppresses common non-fatal In-App WebView and Java bridge exceptions
 * from polluting analytics and crash reports (e.g. Clarity, Sentry).
 */
declare function InAppShield(): React.ReactElement | null;

/**
 * On-Screen Live Analytics Tester & Debugger Widget.
 * Shows real-time event stream, connection status with Meta Pixel & GTM,
 * and lets developers fire 1-click test events.
 */
declare function AnalyticsDebugger(): React.ReactElement | null;

export { type AnalyticsConfig, AnalyticsDebugger, type AnalyticsDiagnosis, BoostAnalytics, type BoostAnalyticsProps, type EventLog, InAppShield, type TrackAddToCartParams, type TrackBeginCheckoutParams, type TrackItem, type TrackPaymentInfoParams, type TrackPurchaseParams, type TrackRemoveFromCartParams, type TrackViewItemParams, clearEventLogs, diagnoseAnalytics, fireTestEvent, getAnalyticsConfig, getEventLogs, initAnalytics, onAnalyticsEvent, pushToDataLayer, pushToFbPixel, trackAddPaymentInfo, trackAddToCart, trackBeginCheckout, trackCustomEvent, trackPurchase, trackRemoveFromCart, trackViewItem };
