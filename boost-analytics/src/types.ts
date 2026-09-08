export interface AnalyticsConfig {
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

export interface TrackItem {
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

export interface TrackViewItemParams {
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

export interface TrackAddToCartParams {
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

export interface TrackRemoveFromCartParams {
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

export interface TrackBeginCheckoutParams {
  totalValue: number;
  items: (TrackItem | any)[];
  coupon?: string;
  currency?: string;
  [key: string]: any;
}

export interface TrackPaymentInfoParams {
  totalValue: number;
  paymentMethod?: string;
  items: (TrackItem | any)[];
  currency?: string;
  [key: string]: any;
}

export interface TrackPurchaseParams {
  transaction_id: string;
  value: number;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: (TrackItem | any)[];
  currency?: string;
  [key: string]: any;
}

export interface EventLog {
  id: string;
  timestamp: string;
  eventName: string;
  channels: ('Meta Pixel' | 'Google Tag Manager' | 'Custom')[];
  payload: Record<string, any>;
}

export interface AnalyticsDiagnosis {
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
