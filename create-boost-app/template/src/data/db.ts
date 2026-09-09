import { StoreProduct, PRODUCTS as INITIAL_PRODUCTS } from './products';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  items: Array<{
    productId: string;
    title: string;
    sku: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'razorpay' | 'phonepe' | 'cod' | 'upi';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoostPluginConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  category: 'marketing' | 'operations' | 'payments' | 'sales' | 'engagement';
  installed: boolean;
  enabled: boolean;
  settings: Record<string, any>;
}

export interface StoreSettings {
  storeName: string;
  storeUrl: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  currencySymbol: string;
  gstin: string;
  state: string;
  enableCod: boolean;
  freeShippingThreshold: number;
  defaultCourier: string;
  whatsappNotifications: boolean;
}

declare global {
  var __boostStoreDb: {
    products: StoreProduct[];
    orders: AdminOrder[];
    plugins: BoostPluginConfig[];
    settings: StoreSettings;
  } | undefined;
}

const INITIAL_PLUGINS: BoostPluginConfig[] = [
  {
    id: 'boost-coupons',
    name: 'Smart Coupons & Promotions',
    version: '1.0.0',
    description: 'Auto-apply cart discounts, percentage/flat promo codes, and countdown scarcity banners.',
    icon: '🎟️',
    category: 'marketing',
    installed: true,
    enabled: true,
    settings: {
      defaultCoupon: 'WELCOME10',
      allowStacking: false,
      autoApplyFirstOrder: true,
    },
  },
  {
    id: 'boost-shipping',
    name: 'Logistics & Pincode Serviceability',
    version: '1.0.0',
    description: 'Real-time Delhivery, Shiprocket, and Bluedart rate calculator and COD validator.',
    icon: '🚚',
    category: 'operations',
    installed: true,
    enabled: true,
    settings: {
      defaultPincode: '400001',
      freeShippingAbove: 999,
      standardShippingFee: 99,
      codAvailable: true,
    },
  },
  {
    id: 'boost-reviews',
    name: 'Customer Reviews & Social Proof',
    version: '1.0.0',
    description: 'Verified buyer stars, photo reviews, and rating breakdown bars on product pages.',
    icon: '⭐',
    category: 'engagement',
    installed: true,
    enabled: true,
    settings: {
      autoApproveVerified: true,
      requireRatingForComment: true,
      displayBadges: true,
    },
  },
  {
    id: 'boost-invoicing',
    name: 'GST Invoicing & Thermal Labels',
    version: '1.0.0',
    description: 'Instant compliant Indian Tax Invoice PDF generation and 4x6 courier shipping labels.',
    icon: '🧾',
    category: 'operations',
    installed: true,
    enabled: true,
    settings: {
      prefix: 'INV-2026-',
      showHsnBreakup: true,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
    },
  },
  {
    id: 'boost-notifications',
    name: 'WhatsApp & SMS Alerts',
    version: '1.0.0',
    description: 'Automated WhatsApp order confirmation, tracking updates, and abandoned cart nudges.',
    icon: '💬',
    category: 'sales',
    installed: true,
    enabled: true,
    settings: {
      enableWhatsapp: true,
      enableSms: false,
      sendShippingUpdate: true,
    },
  },
  {
    id: 'boost-payments',
    name: 'Universal Payment Gateway Hub',
    version: '1.0.0',
    description: 'Seamless checkout with Razorpay, PhonePe, Cashfree, UPI QR, and Cash on Delivery.',
    icon: '💳',
    category: 'payments',
    installed: true,
    enabled: true,
    settings: {
      primaryGateway: 'razorpay',
      enableCod: true,
      enableUpiInstant: true,
    },
  },
  {
    id: 'boost-analytics',
    name: 'D2C Conversion Analytics',
    version: '1.0.0',
    description: 'Tracks pageviews, cart abandonment, top selling variants, and Facebook/Google Pixels.',
    icon: '📊',
    category: 'marketing',
    installed: true,
    enabled: true,
    settings: {
      enablePixel: false,
      trackAddCart: true,
      anonymizeIp: true,
    },
  },
  {
    id: 'boost-seo',
    name: 'Smart SEO & Google Shopping Feeds',
    version: '1.0.0',
    description: 'Automated XML sitemaps, JSON-LD Schema markup, and Google Merchant Center RSS feed.',
    icon: '🔍',
    category: 'marketing',
    installed: true,
    enabled: true,
    settings: {
      autoGenerateSitemap: true,
      includeVariantsInFeed: true,
    },
  },
];

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord_1001',
    orderNumber: 'BOOST-1001',
    customer: {
      name: 'Aarav Mehta',
      email: 'aarav@example.com',
      phone: '+91 98765 43210',
      address: {
        line1: 'Flat 402, Sea Breeze Apts, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      },
    },
    items: [
      {
        productId: 'prod_cyberpunk_hoodie',
        title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
        sku: 'CP-HD-BLK-M',
        price: 2499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 2499,
    discount: 250,
    shipping: 0,
    tax: 342,
    total: 2249,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    courier: 'Delhivery Express',
    trackingNumber: 'DEL-99201948',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Boost D2C Store',
  storeUrl: 'https://boost-store.local',
  supportEmail: 'support@boostengine.dev',
  supportPhone: '+91 98765 00000',
  currency: 'INR',
  currencySymbol: '₹',
  gstin: '27AABCU9603R1ZM',
  state: 'Maharashtra',
  enableCod: true,
  freeShippingThreshold: 999,
  defaultCourier: 'Delhivery',
  whatsappNotifications: true,
};

if (!globalThis.__boostStoreDb) {
  globalThis.__boostStoreDb = {
    products: [...INITIAL_PRODUCTS],
    orders: [...INITIAL_ORDERS],
    plugins: [...INITIAL_PLUGINS],
    settings: { ...INITIAL_SETTINGS },
  };
}

export const db = {
  getProducts(): StoreProduct[] {
    return globalThis.__boostStoreDb!.products;
  },
  getProductById(id: string): StoreProduct | undefined {
    return globalThis.__boostStoreDb!.products.find((p) => p.id === id);
  },
  addProduct(product: StoreProduct): StoreProduct {
    globalThis.__boostStoreDb!.products.unshift(product);
    return product;
  },
  updateProduct(id: string, updates: Partial<StoreProduct>): StoreProduct | null {
    const idx = globalThis.__boostStoreDb!.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = { ...globalThis.__boostStoreDb!.products[idx], ...updates };
    globalThis.__boostStoreDb!.products[idx] = updated;
    return updated;
  },
  deleteProduct(id: string): boolean {
    const prevLen = globalThis.__boostStoreDb!.products.length;
    globalThis.__boostStoreDb!.products = globalThis.__boostStoreDb!.products.filter((p) => p.id !== id);
    return globalThis.__boostStoreDb!.products.length < prevLen;
  },
  getOrders(): AdminOrder[] {
    return globalThis.__boostStoreDb!.orders;
  },
  getOrderById(id: string): AdminOrder | undefined {
    return globalThis.__boostStoreDb!.orders.find((o) => o.id === id || o.orderNumber === id);
  },
  createOrder(orderData: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): AdminOrder {
    const count = globalThis.__boostStoreDb!.orders.length + 1001;
    const now = new Date().toISOString();
    const newOrder: AdminOrder = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `BOOST-${count}`,
      createdAt: now,
      updatedAt: now,
    };
    globalThis.__boostStoreDb!.orders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus(
    id: string,
    status: AdminOrder['orderStatus'],
    tracking?: { courier?: string; trackingNumber?: string }
  ): AdminOrder | null {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    if (tracking?.courier) order.courier = tracking.courier;
    if (tracking?.trackingNumber) order.trackingNumber = tracking.trackingNumber;
    return order;
  },
  getPlugins(): BoostPluginConfig[] {
    return globalThis.__boostStoreDb!.plugins;
  },
  togglePlugin(id: string, enabled: boolean): BoostPluginConfig | null {
    const plugin = globalThis.__boostStoreDb!.plugins.find((p) => p.id === id);
    if (!plugin) return null;
    plugin.enabled = enabled;
    return plugin;
  },
  updatePluginSettings(id: string, settings: Record<string, any>): BoostPluginConfig | null {
    const plugin = globalThis.__boostStoreDb!.plugins.find((p) => p.id === id);
    if (!plugin) return null;
    plugin.settings = { ...plugin.settings, ...settings };
    return plugin;
  },
  getSettings(): StoreSettings {
    return globalThis.__boostStoreDb!.settings;
  },
  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    globalThis.__boostStoreDb!.settings = {
      ...globalThis.__boostStoreDb!.settings,
      ...updates,
    };
    return globalThis.__boostStoreDb!.settings;
  },
  getStats() {
    const orders = globalThis.__boostStoreDb!.orders;
    const products = globalThis.__boostStoreDb!.products;
    const totalSales = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
    const lowStockProducts = products.filter((p) => {
      if (p.variants && p.variants.length > 0) {
        return p.variants.some((v) => v.stock <= 2);
      }
      return !p.inStock;
    }).length;

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      totalProducts: products.length,
      lowStockProducts,
      activePlugins: globalThis.__boostStoreDb!.plugins.filter((p) => p.enabled).length,
    };
  },
};
