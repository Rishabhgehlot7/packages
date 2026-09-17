import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChartIcon,
  BoxIcon,
  ShoppingBagIcon,
  TagIcon,
  PlusIcon,
  TrashIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  CloseIcon,
  SearchIcon,
  UsersIcon,
  SettingsIcon,
  TrendingUpIcon,
  FilterIcon,
  PrinterIcon,
  LockIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
} from './Icons';

// --- Types ---
export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice: number;
  stockQty: number;
  inStock: boolean;
  image: string;
  sizes: string[];
  colors: string[];
  hsn: string;
  gstRate: number;
  description: string;
}

export interface AdminOrder {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: string;
    image?: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  gst?: {
    taxType: string;
    cgst: number;
    sgst: number;
    igst: number;
    totalGst: number;
  };
  totalAmount: number;
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'cod_pending';
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'delivered';
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  tier: 'VIP Gold' | 'Silver' | 'New';
  lastOrderDate: string;
}

export interface AdminCoupon {
  code: string;
  discountPercent: number;
  minOrder: number;
  status: 'active' | 'inactive';
  usageCount: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  gstin: string;
  freeShippingThreshold: number;
  expressShippingFee: number;
  razorpayEnabled: boolean;
  codEnabled: boolean;
}

// --- Initial Mock Data ---
const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod_1',
    title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
    slug: 'cyberpunk-heavyweight-450-gsm-hoodie',
    category: 'Hoodies',
    price: 2499,
    compareAtPrice: 3999,
    stockQty: 48,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Onyx Black', 'Stone Grey'],
    hsn: '6109',
    gstRate: 18,
    description: 'Crafted with 450 GSM pure French Terry cotton, oversized streetwear silhouette.',
  },
  {
    id: 'prod_2',
    title: 'Acid Wash Vintage Boxy Tee',
    slug: 'acid-wash-vintage-boxy-tee',
    category: 'T-Shirts',
    price: 1199,
    compareAtPrice: 1799,
    stockQty: 74,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    sizes: ['M', 'L', 'XL'],
    colors: ['Washed Charcoal', 'Olive Green'],
    hsn: '6109',
    gstRate: 18,
    description: '240 GSM heavy combed single-jersey cotton with authentic vintage streetwear wash.',
  },
  {
    id: 'prod_3',
    title: 'Tactical Multi-Pocket Cargo Pants',
    slug: 'tactical-multi-pocket-cargo-pants',
    category: 'Bottoms',
    price: 2999,
    compareAtPrice: 4499,
    stockQty: 6,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    sizes: ['30', '32', '34', '36'],
    colors: ['Matte Black', 'Desert Tan'],
    hsn: '6203',
    gstRate: 18,
    description: 'Water-repellent ripstop fabric with 6 utility pockets and custom YKK hardware.',
  },
  {
    id: 'prod_4',
    title: 'Artisanal Matte Black Solid Fragrance (50ml)',
    slug: 'artisanal-matte-black-solid-fragrance-50ml',
    category: 'Fragrances',
    price: 1899,
    compareAtPrice: 2499,
    stockQty: 32,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    sizes: ['50ml'],
    colors: ['Matte Black'],
    hsn: '3303',
    gstRate: 18,
    description: 'Beeswax and jojoba base infused with smoked cedarwood, amber resin, and bergamot.',
  },
];

const INITIAL_ORDERS: AdminOrder[] = [
  {
    orderId: 'ORD-892104',
    customer: {
      name: 'Kabir Verma',
      phone: '+91 98765 43210',
      email: 'kabir.v@example.com',
      address: 'Flat 402, Signature Towers, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    items: [
      {
        productId: 'prod_1',
        title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
        quantity: 1,
        price: 2499,
        selectedSize: 'L',
        selectedColor: 'Onyx Black',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 2499,
    discount: 499,
    shippingFee: 0,
    gst: {
      taxType: 'INTER_STATE',
      cgst: 0,
      sgst: 0,
      igst: 305.08,
      totalGst: 305.08,
    },
    totalAmount: 2000,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderStatus: 'dispatched',
    courierName: 'Delhivery Air Express',
    trackingNumber: 'TRK-98234112',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    orderId: 'ORD-714529',
    customer: {
      name: 'Aanya Sharma',
      phone: '+91 98112 34567',
      email: 'aanya.s@example.com',
      address: 'B-12, Green Park Main',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
    },
    items: [
      {
        productId: 'prod_2',
        title: 'Acid Wash Vintage Boxy Tee',
        quantity: 2,
        price: 1199,
        selectedSize: 'M',
        selectedColor: 'Washed Charcoal',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 2398,
    discount: 0,
    shippingFee: 0,
    gst: {
      taxType: 'INTER_STATE',
      cgst: 0,
      sgst: 0,
      igst: 365.8,
      totalGst: 365.8,
    },
    totalAmount: 2398,
    paymentMethod: 'cod',
    paymentStatus: 'cod_pending',
    orderStatus: 'placed',
    courierName: 'BlueDart Surface',
    trackingNumber: 'TRK-71452988',
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    orderId: 'ORD-602931',
    customer: {
      name: 'Rohan Mehra',
      phone: '+91 97654 11223',
      email: 'rohan.m@example.com',
      address: '14, Bandra West, Near Hill Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    items: [
      {
        productId: 'prod_3',
        title: 'Tactical Multi-Pocket Cargo Pants',
        quantity: 1,
        price: 2999,
        selectedSize: '32',
        selectedColor: 'Matte Black',
        image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      },
      {
        productId: 'prod_4',
        title: 'Artisanal Matte Black Solid Fragrance (50ml)',
        quantity: 1,
        price: 1899,
        selectedSize: '50ml',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 4898,
    discount: 500,
    shippingFee: 0,
    gst: {
      taxType: 'INTRA_STATE',
      cgst: 335.44,
      sgst: 335.44,
      igst: 0,
      totalGst: 670.88,
    },
    totalAmount: 4398,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    courierName: 'Shiprocket Pro',
    trackingNumber: 'TRK-60293101',
    createdAt: new Date(Date.now() - 3600 * 1000 * 120).toISOString(),
  },
];

const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'cust_1',
    name: 'Kabir Verma',
    email: 'kabir.v@example.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    state: 'Karnataka',
    totalOrders: 3,
    totalSpent: 8497,
    tier: 'VIP Gold',
    lastOrderDate: '15 Sept 2026',
  },
  {
    id: 'cust_2',
    name: 'Aanya Sharma',
    email: 'aanya.s@example.com',
    phone: '+91 98112 34567',
    city: 'New Delhi',
    state: 'Delhi',
    totalOrders: 1,
    totalSpent: 2398,
    tier: 'New',
    lastOrderDate: '16 Sept 2026',
  },
  {
    id: 'cust_3',
    name: 'Rohan Mehra',
    email: 'rohan.m@example.com',
    phone: '+91 97654 11223',
    city: 'Mumbai',
    state: 'Maharashtra',
    totalOrders: 2,
    totalSpent: 6297,
    tier: 'VIP Gold',
    lastOrderDate: '12 Sept 2026',
  },
  {
    id: 'cust_4',
    name: 'Devika Singhania',
    email: 'devika.s@example.com',
    phone: '+91 99887 66554',
    city: 'Pune',
    state: 'Maharashtra',
    totalOrders: 1,
    totalSpent: 1899,
    tier: 'Silver',
    lastOrderDate: '08 Sept 2026',
  },
];

const INITIAL_COUPONS: AdminCoupon[] = [
  { code: 'BOOST20', discountPercent: 20, minOrder: 999, status: 'active', usageCount: 64 },
  { code: 'WELCOME50', discountPercent: 50, minOrder: 1999, status: 'active', usageCount: 38 },
  { code: 'FREESHIP', discountPercent: 10, minOrder: 499, status: 'active', usageCount: 112 },
  { code: 'STREET15', discountPercent: 15, minOrder: 1499, status: 'inactive', usageCount: 19 },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'BOOST ENGINE STREETWEAR',
  tagline: 'High-Performance Streetwear & Luxury Heavyweight Essentials',
  supportPhone: '+91 98765 00000',
  supportEmail: 'support@boostengine.in',
  gstin: '27AAACB2234M1Z5',
  freeShippingThreshold: 999,
  expressShippingFee: 79,
  razorpayEnabled: true,
  codEnabled: true,
};

// --- Weekly Sales Trend Mock ---
const WEEKLY_TREND = [
  { day: 'Mon', revenue: 18400, orders: 8 },
  { day: 'Tue', revenue: 22100, orders: 11 },
  { day: 'Wed', revenue: 16800, orders: 7 },
  { day: 'Thu', revenue: 25400, orders: 13 },
  { day: 'Fri', revenue: 29200, orders: 15 },
  { day: 'Sat', revenue: 34800, orders: 18 },
  { day: 'Sun', revenue: 28200, orders: 12 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings'>('overview');
  const [products, setProducts] = useState<AdminProduct[]>(() => {
    const saved = localStorage.getItem('boost_admin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    const saved = localStorage.getItem('boost_admin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [customers] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(() => {
    const saved = localStorage.getItem('boost_admin_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('boost_admin_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search and Filter states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Hoodies',
    price: '',
    compareAtPrice: '',
    stockQty: '50',
    image: '',
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
  });

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '20', minOrder: '999' });

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('boost_admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('boost_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('boost_admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('boost_admin_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync with Express backend
  const refreshFromBackend = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const pData = await prodRes.json();
        if (pData.products && pData.products.length > 0) {
          // Merge with stockQty if missing
          const normalized = pData.products.map((p: any) => ({
            ...p,
            stockQty: p.stockQty !== undefined ? p.stockQty : 50,
          }));
          setProducts(normalized);
        }
      }

      const ordRes = await fetch('/api/orders');
      if (ordRes.ok) {
        const oData = await ordRes.json();
        if (oData.orders && oData.orders.length > 0) {
          setOrders(oData.orders);
        }
      }
      showToast('Dashboard metrics synchronized with live backend!');
    } catch {
      showToast('Working in offline/mock cache mode (server unreachable)');
    } finally {
      setLoading(false);
    }
  };

  // Product actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    if (editingProductId) {
      // Update
      const updated = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            title: productForm.title,
            category: productForm.category,
            price: Number(productForm.price),
            compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : Math.round(Number(productForm.price) * 1.3),
            stockQty: Number(productForm.stockQty),
            inStock: Number(productForm.stockQty) > 0,
            image: productForm.image || p.image,
            description: productForm.description || p.description,
            sizes: productForm.sizes,
          };
        }
        return p;
      });
      setProducts(updated);
      showToast(`Product "${productForm.title}" updated successfully!`);
    } else {
      // Create new
      const newProd: AdminProduct = {
        id: 'prod_' + (products.length + 1) + '_' + Date.now().toString().slice(-4),
        title: productForm.title,
        slug: productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: productForm.category,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : Math.round(Number(productForm.price) * 1.3),
        stockQty: Number(productForm.stockQty),
        inStock: Number(productForm.stockQty) > 0,
        image: productForm.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        sizes: productForm.sizes,
        colors: ['Onyx Black'],
        hsn: '6109',
        gstRate: 18,
        description: productForm.description || 'Premium heavyweight garment tailored for high-performance streetwear.',
      };
      setProducts([newProd, ...products]);

      // Fire to backend
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProd),
        });
      } catch {}

      showToast(`Product "${newProd.title}" added to live catalog!`);
    }

    setShowAddProductModal(false);
    setEditingProductId(null);
    setProductForm({
      title: '',
      category: 'Hoodies',
      price: '',
      compareAtPrice: '',
      stockQty: '50',
      image: '',
      description: '',
      sizes: ['S', 'M', 'L', 'XL'],
    });
  };

  const handleEditProduct = (p: AdminProduct) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title,
      category: p.category,
      price: String(p.price),
      compareAtPrice: String(p.compareAtPrice),
      stockQty: String(p.stockQty),
      image: p.image,
      description: p.description,
      sizes: p.sizes,
    });
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {}
    showToast(`Product "${title}" removed from catalog.`);
  };

  // Order status transition
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: AdminOrder['orderStatus']) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, orderStatus: nextStatus } : o));
    setOrders(updated);
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: nextStatus });
    }

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: nextStatus }),
      });
    } catch {}

    showToast(`Order #${orderId} moved to ${nextStatus.toUpperCase()}!`);
  };

  // Coupon action
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountPercent) return;
    const newC: AdminCoupon = {
      code: couponForm.code.trim().toUpperCase(),
      discountPercent: Number(couponForm.discountPercent),
      minOrder: Number(couponForm.minOrder),
      status: 'active',
      usageCount: 0,
    };
    setCoupons([newC, ...coupons]);
    setShowCouponModal(false);
    setCouponForm({ code: '', discountPercent: '20', minOrder: '999' });
    showToast(`Promo Code ${newC.code} activated successfully!`);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c))
    );
    showToast(`Coupon status toggled for ${code}`);
  };

  // Settings action
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Store & GST settings saved to production configuration!');
  };

  // Metrics
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalGMV / totalOrdersCount) : 0;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stockQty, 0);
  const lowStockCount = products.filter((p) => p.stockQty < 10).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !productSearch ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    const matchStock =
      productStockFilter === 'All'
        ? true
        : productStockFilter === 'In Stock'
        ? p.stockQty >= 10
        : productStockFilter === 'Low Stock'
        ? p.stockQty > 0 && p.stockQty < 10
        : p.stockQty === 0;

    return matchSearch && matchCategory && matchStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !orderSearch ||
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#09090b', color: '#f4f4f5', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* --- TOAST POPUP --- */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: '600',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <span style={{ color: '#10b981' }}>⚡</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', padding: 0 }}>
            <CloseIcon size={16} />
          </button>
        </div>
      )}

      {/* --- PERSISTENT ENTERPRISE SIDEBAR --- */}
      <aside
        style={{
          width: '260px',
          borderRight: '1px solid #27272a',
          backgroundColor: '#121215',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
        }}
      >
        <div>
          {/* Brand Header */}
          <div style={{ padding: '20px 20px 16px 20px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '900',
                fontSize: '18px',
                boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)',
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', letterSpacing: '-0.3px', color: '#fff' }}>BOOST ENGINE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '600' }}>Store Live v1.2</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#71717a', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Operations
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'overview' ? '#27272a' : 'transparent',
                color: activeTab === 'overview' ? '#fff' : '#a1a1aa',
                fontWeight: activeTab === 'overview' ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <BarChartIcon size={18} />
              <span>Overview & Insights</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'products' ? '#27272a' : 'transparent',
                color: activeTab === 'products' ? '#fff' : '#a1a1aa',
                fontWeight: activeTab === 'products' ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BoxIcon size={18} />
                <span>Products Catalog</span>
              </div>
              <span style={{ backgroundColor: '#18181b', padding: '2px 7px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: '#d4d4d8' }}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'orders' ? '#27272a' : 'transparent',
                color: activeTab === 'orders' ? '#fff' : '#a1a1aa',
                fontWeight: activeTab === 'orders' ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingBagIcon size={18} />
                <span>Orders & Fulfillment</span>
              </div>
              <span style={{ backgroundColor: '#e11d48', padding: '2px 7px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: '#fff' }}>
                {orders.length}
              </span>
            </button>

            <div style={{ fontSize: '11px', fontWeight: '700', color: '#71717a', padding: '16px 12px 6px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Growth & CRM
            </div>

            <button
              onClick={() => setActiveTab('customers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'customers' ? '#27272a' : 'transparent',
                color: activeTab === 'customers' ? '#fff' : '#a1a1aa',
                fontWeight: activeTab === 'customers' ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <UsersIcon size={18} />
              <span>Customers Database</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'coupons' ? '#27272a' : 'transparent',
                color: activeTab === 'coupons' ? '#fff' : '#a1a1aa',
                fontWeight: activeTab === 'coupons' ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <TagIcon size={18} />
              <span>Coupons & Promos</span>
            </button>

            <div style={{ fontSize: '11px', fontWeight: '700', color: '#71717a', padding: '16px 12px 6px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Settings
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'settings' ? '#27272a' : 'transparent',
                color: activeTab === 'settings' ? '#fff' : '#a1a1aa',
                fontWeight: activeTab === 'settings' ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <SettingsIcon size={18} />
              <span>Store Configuration</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#27272a',
              border: '1px solid #3f3f46',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <ExternalLinkIcon size={14} />
            <span>Open Storefront</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
              HA
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Harsh (Admin)</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>superadmin@boost.in</div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD VIEWPORT --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            borderBottom: '1px solid #27272a',
            backgroundColor: '#18181b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, textTransform: 'capitalize' }}>
              {activeTab === 'overview'
                ? 'Executive Analytics & KPI Dashboard'
                : activeTab === 'products'
                ? 'Streetwear Inventory & Product Catalog'
                : activeTab === 'orders'
                ? 'Order Fulfillment & Logistics Dispatch'
                : activeTab === 'customers'
                ? 'Customer Lifetime Value & CRM'
                : activeTab === 'coupons'
                ? 'Promotional Engine & Discount Rules'
                : 'Store Identity & GST Configuration'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={refreshFromBackend}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#27272a',
                border: '1px solid #3f3f46',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              <RefreshCwIcon size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Syncing...' : 'Sync Backend'}
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setShowAddProductModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#e11d48',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
              }}
            >
              <PlusIcon size={15} />
              New Product
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main style={{ padding: '32px', flex: 1, maxWidth: '1440px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
          {/* ======================================================== */}
          {/* 1. OVERVIEW / ANALYTICS TAB */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div>
              {/* 4 Big KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '600' }}>Gross Merchandise Value (GMV)</span>
                    <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                      +18.4%
                    </span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
                    ₹{totalGMV.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#71717a', marginTop: '6px' }}>Across verified online & COD orders</div>
                </div>

                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '600' }}>Total Orders Processed</span>
                    <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                      +12.1%
                    </span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
                    {totalOrdersCount}
                  </div>
                  <div style={{ fontSize: '12px', color: '#71717a', marginTop: '6px' }}>100% fulfillment dispatch rate</div>
                </div>

                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '600' }}>Average Order Value (AOV)</span>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                      +6.2%
                    </span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
                    ₹{avgOrderValue.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#71717a', marginTop: '6px' }}>Target streetwear benchmark: ₹1,800+</div>
                </div>

                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#a1a1aa', fontWeight: '600' }}>Live Inventory Depth</span>
                    <span style={{ backgroundColor: lowStockCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: lowStockCount > 0 ? '#ef4444' : '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                      {lowStockCount > 0 ? `${lowStockCount} Low Stock` : 'Healthy'}
                    </span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
                    {totalInventoryUnits} <span style={{ fontSize: '16px', color: '#a1a1aa', fontWeight: '500' }}>units</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#71717a', marginTop: '6px' }}>Across {products.length} live product SKUs</div>
                </div>
              </div>

              {/* Middle Section: Weekly Sales Trend Chart & Order Distribution */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
                {/* 7-Day Revenue Trend Chart */}
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>7-Day Revenue & Demand Velocity</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#a1a1aa' }}>Daily gross revenue from e-commerce checkouts</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                        <TrendingUpIcon size={14} /> +22.4% this week
                      </span>
                    </div>
                  </div>

                  {/* SVG Bar Chart */}
                  <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '14px', paddingTop: '10px' }}>
                    {WEEKLY_TREND.map((item, idx) => {
                      const maxRev = 35000;
                      const heightPercent = Math.round((item.revenue / maxRev) * 100);
                      const isPeak = item.day === 'Sat';

                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: isPeak ? '#e11d48' : '#a1a1aa', marginBottom: '6px' }}>
                            ₹{(item.revenue / 1000).toFixed(1)}k
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: `${heightPercent}%`,
                              backgroundColor: isPeak ? '#e11d48' : '#27272a',
                              borderRadius: '6px 6px 2px 2px',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              position: 'relative',
                            }}
                            title={`${item.day}: ₹${item.revenue.toLocaleString('en-IN')} (${item.orders} orders)`}
                          ></div>
                          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '8px', fontWeight: '600' }}>{item.day}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fulfillment Status Breakdown */}
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>Fulfillment Pipeline</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: 'Delivered', count: orders.filter((o) => o.orderStatus === 'delivered').length, color: '#10b981' },
                      { label: 'In Transit / Dispatched', count: orders.filter((o) => o.orderStatus === 'dispatched').length, color: '#3b82f6' },
                      { label: 'Confirmed / Packing', count: orders.filter((o) => o.orderStatus === 'confirmed').length, color: '#8b5cf6' },
                      { label: 'New / Placed', count: orders.filter((o) => o.orderStatus === 'placed').length, color: '#f59e0b' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span style={{ color: '#d4d4d8', fontWeight: '500' }}>{item.label}</span>
                          <span style={{ fontWeight: '700', color: item.color }}>{item.count} orders</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(10, (item.count / orders.length) * 100)}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px', padding: '12px', borderRadius: '8px', backgroundColor: '#27272a', fontSize: '12px', color: '#a1a1aa' }}>
                    💡 <strong>Pro Tip:</strong> 67% of orders are paid via Online UPI, ensuring zero RTO risk.
                  </div>
                </div>
              </div>

              {/* Bottom Section: Recent Orders Table & Top Streetwear Items */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
                {/* Recent Orders */}
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Recent Consignments</h3>
                    <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#e11d48', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {orders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.orderId}
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveTab('orders');
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 14px',
                          backgroundColor: '#27272a',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: '1px solid transparent',
                          transition: 'border 0.2s',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>{ord.orderId} • {ord.customer.name}</div>
                          <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '2px' }}>
                            {ord.items.length} item(s) • {ord.customer.city}, {ord.customer.state}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '800', fontSize: '15px' }}>₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              fontWeight: '800',
                              marginTop: '2px',
                              backgroundColor: ord.orderStatus === 'delivered' ? '#065f46' : ord.orderStatus === 'dispatched' ? '#1e3a8a' : '#78350f',
                              color: '#fff',
                            }}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Selling Products Leaderboard */}
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>Top Performing SKUs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {products.slice(0, 4).map((p, idx) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: idx === 0 ? '#e11d48' : '#71717a', width: '18px' }}>
                          #{idx + 1}
                        </div>
                        <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                            ₹{p.price.toLocaleString('en-IN')} • {p.stockQty} in stock
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. PRODUCTS TAB */}
          {/* ======================================================== */}
          {activeTab === 'products' && (
            <div>
              {/* Product Controls Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: '320px', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Search by title, SKU ID, or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '8px',
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      color: '#fff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ position: 'absolute', left: '14px', top: '13px', color: '#71717a' }}>
                    <SearchIcon size={18} />
                  </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    style={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      color: '#fff',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Fragrances">Fragrances</option>
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                    style={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      color: '#fff',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    <option value="All">All Stock Status</option>
                    <option value="In Stock">In Stock (&gt;10)</option>
                    <option value="Low Stock">Low Stock (&lt;10)</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>

                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({
                        title: '',
                        category: 'Hoodies',
                        price: '',
                        compareAtPrice: '',
                        stockQty: '50',
                        image: '',
                        description: '',
                        sizes: ['S', 'M', 'L', 'XL'],
                      });
                      setShowAddProductModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#e11d48',
                      color: '#fff',
                      padding: '11px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    <PlusIcon size={16} /> Add Product
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #27272a', backgroundColor: '#27272a', color: '#a1a1aa' }}>
                      <th style={{ padding: '14px 18px' }}>Garment / Product</th>
                      <th style={{ padding: '14px 18px' }}>Category</th>
                      <th style={{ padding: '14px 18px' }}>Pricing & Margins</th>
                      <th style={{ padding: '14px 18px' }}>Inventory Depth</th>
                      <th style={{ padding: '14px 18px' }}>Available Sizes</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => {
                      const discountPct = Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100);
                      const isLowStock = prod.stockQty > 0 && prod.stockQty < 10;
                      const isOutOfStock = prod.stockQty === 0;

                      return (
                        <tr key={prod.id} style={{ borderBottom: '1px solid #27272a' }}>
                          <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img src={prod.image} alt={prod.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div>
                              <div style={{ fontWeight: '700', color: '#fff' }}>{prod.title}</div>
                              <div style={{ fontSize: '11px', color: '#71717a' }}>SKU: {prod.id} • HSN: {prod.hsn}</div>
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ backgroundColor: '#27272a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                              {prod.category}
                            </span>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: '800', fontSize: '15px' }}>₹{prod.price.toLocaleString('en-IN')}</div>
                            {prod.compareAtPrice > prod.price && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#71717a' }}>
                                <span style={{ textDecoration: 'line-through' }}>₹{prod.compareAtPrice}</span>
                                <span style={{ color: '#10b981', fontWeight: '700' }}>-{discountPct}%</span>
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                backgroundColor: isOutOfStock ? 'rgba(239, 68, 68, 0.15)' : isLowStock ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#10b981',
                              }}
                            >
                              ● {isOutOfStock ? 'Out of Stock' : `${prod.stockQty} Units`}
                            </span>
                          </td>

                          <td style={{ padding: '14px 18px', color: '#a1a1aa', fontSize: '12px' }}>
                            {prod.sizes ? prod.sizes.join(', ') : 'Free Size'}
                          </td>

                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleEditProduct(prod)}
                                style={{
                                  backgroundColor: '#27272a',
                                  border: '1px solid #3f3f46',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  color: '#f87171',
                                  padding: '6px',
                                  cursor: 'pointer',
                                }}
                                title="Delete Product"
                              >
                                <TrashIcon size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. ORDERS TAB */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div>
              {/* Order Tabs Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'all', label: `All (${orders.length})` },
                    { id: 'placed', label: 'Placed' },
                    { id: 'confirmed', label: 'Confirmed' },
                    { id: 'dispatched', label: 'Dispatched' },
                    { id: 'delivered', label: 'Delivered' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusFilter(tab.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: orderStatusFilter === tab.id ? '#e11d48' : '#18181b',
                        color: '#fff',
                        fontWeight: orderStatusFilter === tab.id ? '700' : '500',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', width: '280px' }}>
                  <input
                    type="text"
                    placeholder="Search Order ID or Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '8px',
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ position: 'absolute', left: '12px', top: '11px', color: '#71717a' }}>
                    <SearchIcon size={16} />
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #27272a', backgroundColor: '#27272a', color: '#a1a1aa' }}>
                      <th style={{ padding: '14px 18px' }}>Order ID & Date</th>
                      <th style={{ padding: '14px 18px' }}>Customer Info</th>
                      <th style={{ padding: '14px 18px' }}>Items Summary</th>
                      <th style={{ padding: '14px 18px' }}>Total Amount</th>
                      <th style={{ padding: '14px 18px' }}>Payment Mode</th>
                      <th style={{ padding: '14px 18px' }}>Fulfillment Status</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Workflow Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.orderId} style={{ borderBottom: '1px solid #27272a' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            style={{ background: 'none', border: 'none', padding: 0, fontWeight: '800', color: '#38bdf8', cursor: 'pointer', fontSize: '14px' }}
                          >
                            {ord.orderId}
                          </button>
                          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: '600' }}>{ord.customer.name}</div>
                          <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{ord.customer.phone}</div>
                          <div style={{ fontSize: '11px', color: '#71717a' }}>{ord.customer.city}, {ord.customer.state}</div>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          {ord.items.map((it, idx) => (
                            <div key={idx} style={{ fontSize: '13px', color: '#d4d4d8' }}>
                              {it.quantity}x {it.title} {it.selectedSize ? `(${it.selectedSize})` : ''}
                            </div>
                          ))}
                        </td>

                        <td style={{ padding: '14px 18px', fontWeight: '800', fontSize: '15px' }}>
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              backgroundColor: ord.paymentMethod === 'online' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: ord.paymentMethod === 'online' ? '#10b981' : '#f59e0b',
                            }}
                          >
                            {ord.paymentMethod === 'online' ? '● Online Paid' : '● COD Pending'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              backgroundColor:
                                ord.orderStatus === 'delivered'
                                  ? '#065f46'
                                  : ord.orderStatus === 'dispatched'
                                  ? '#1e3a8a'
                                  : ord.orderStatus === 'confirmed'
                                  ? '#4c1d95'
                                  : '#78350f',
                              color: '#fff',
                            }}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {ord.orderStatus === 'placed' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.orderId, 'confirmed')}
                                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                              >
                                QC & Confirm
                              </button>
                            )}
                            {ord.orderStatus === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.orderId, 'dispatched')}
                                style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                              >
                                Dispatch AWB
                              </button>
                            )}
                            {ord.orderStatus === 'dispatched' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.orderId, 'delivered')}
                                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                              >
                                Mark Delivered
                              </button>
                            )}
                            {ord.orderStatus === 'delivered' && (
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                style={{ backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#d4d4d8', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                View Receipt
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. CUSTOMERS TAB (CRM) */}
          {/* ======================================================== */}
          {activeTab === 'customers' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0' }}>Customer Lifetime Value (LTV) Directory</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Segment high-value streetwear VIPs and view complete purchasing histories.</p>
              </div>

              <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #27272a', backgroundColor: '#27272a', color: '#a1a1aa' }}>
                      <th style={{ padding: '14px 18px' }}>Customer Profile</th>
                      <th style={{ padding: '14px 18px' }}>Contact Phone & Email</th>
                      <th style={{ padding: '14px 18px' }}>Location</th>
                      <th style={{ padding: '14px 18px' }}>Total Orders</th>
                      <th style={{ padding: '14px 18px' }}>Lifetime Value (LTV)</th>
                      <th style={{ padding: '14px 18px' }}>Customer Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust) => (
                      <tr key={cust.id} style={{ borderBottom: '1px solid #27272a' }}>
                        <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff' }}>
                            {cust.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#fff' }}>{cust.name}</div>
                            <div style={{ fontSize: '11px', color: '#71717a' }}>Last active: {cust.lastOrderDate}</div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <div>{cust.phone}</div>
                          <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{cust.email}</div>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          {cust.city}, {cust.state}
                        </td>

                        <td style={{ padding: '14px 18px', fontWeight: '700' }}>
                          {cust.totalOrders} order(s)
                        </td>

                        <td style={{ padding: '14px 18px', fontWeight: '900', color: '#10b981', fontSize: '15px' }}>
                          ₹{cust.totalSpent.toLocaleString('en-IN')}
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '800',
                              backgroundColor: cust.tier === 'VIP Gold' ? '#f59e0b' : cust.tier === 'Silver' ? '#71717a' : '#27272a',
                              color: cust.tier === 'VIP Gold' ? '#000' : '#fff',
                            }}
                          >
                            {cust.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. COUPONS TAB */}
          {/* ======================================================== */}
          {activeTab === 'coupons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0' }}>Promotion & Discount Rules Engine</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Powered by @boostengine/coupons with instant checkout cart validation.</p>
                </div>

                <button
                  onClick={() => setShowCouponModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#e11d48',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <PlusIcon size={16} /> New Promo Code
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {coupons.map((c) => (
                  <div key={c.code} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ backgroundColor: '#27272a', border: '1px dashed #e11d48', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontWeight: '900', letterSpacing: '1px', fontSize: '16px' }}>
                        {c.code}
                      </span>
                      <button
                        onClick={() => toggleCouponStatus(c.code)}
                        style={{
                          backgroundColor: c.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: c.status === 'active' ? '#10b981' : '#ef4444',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                        }}
                      >
                        ● {c.status}
                      </button>
                    </div>

                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>
                      {c.discountPercent}% OFF
                    </div>
                    <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '16px' }}>
                      Valid on orders above ₹{c.minOrder.toLocaleString('en-IN')}
                    </div>

                    <div style={{ borderTop: '1px solid #27272a', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#71717a' }}>
                      <span>Redeemed {c.usageCount} times</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(c.code);
                          showToast(`Code "${c.code}" copied to clipboard!`);
                        }}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. SETTINGS TAB */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0' }}>Store Identity & Indian Tax Compliance</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>Configure merchant GST details, payment gateways, and logistics rules.</p>
              </div>

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Store Info */}
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700' }}>Store Profile</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Store Name</label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Support Email</label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                {/* GST Tax Compliance */}
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700' }}>GSTIN & Invoicing</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Registered GSTIN Number</label>
                      <input
                        type="text"
                        value={settings.gstin}
                        onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Free Shipping Threshold (₹)</label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Toggles */}
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700' }}>Payment Gateways Active</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>Razorpay Online UPI / Netbanking / Cards</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Instant payment verification with automated webhooks</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.razorpayEnabled}
                        onChange={(e) => setSettings({ ...settings, razorpayEnabled: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#e11d48' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>Cash On Delivery (COD)</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Allow doorstep payment on order delivery</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.codEnabled}
                        onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#e11d48' }}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#e11d48',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Save Configuration
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ======================================================== */}
      {showAddProductModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                {editingProductId ? 'Edit Streetwear Product' : 'Add New Streetwear SKU'}
              </h3>
              <button onClick={() => setShowAddProductModal(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                <CloseIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavyweight 450 GSM Oversized Hoodie"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Compare Price (₹)</label>
                  <input
                    type="number"
                    placeholder="3999"
                    value={productForm.compareAtPrice}
                    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="Hoodies">Hoodies</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Fragrances">Fragrances</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={productForm.stockQty}
                    onChange={(e) => setProductForm({ ...productForm, stockQty: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Image URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Garment Description</label>
                <textarea
                  rows={3}
                  placeholder="450 GSM pure cotton, enzyme washed streetwear finish..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#27272a', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '8px', backgroundColor: '#e11d48', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                >
                  {editingProductId ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ORDER DETAILS MODAL / DRAWER */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #27272a', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Order Specification</div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800' }}>{selectedOrder.orderId}</h3>
                <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Stepper Status Controls */}
            <div style={{ marginBottom: '20px', backgroundColor: '#27272a', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '8px', fontWeight: '600' }}>Update Fulfillment State</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(['placed', 'confirmed', 'dispatched', 'delivered'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, st)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: selectedOrder.orderStatus === st ? '#e11d48' : '#18181b',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#27272a', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Customer Contact</div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{selectedOrder.customer.name}</div>
                <div style={{ fontSize: '13px', color: '#d4d4d8' }}>{selectedOrder.customer.phone}</div>
                <div style={{ fontSize: '12px', color: '#71717a' }}>{selectedOrder.customer.email}</div>
              </div>

              <div style={{ backgroundColor: '#27272a', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Delivery Destination</div>
                <div style={{ fontSize: '13px', color: '#d4d4d8', lineHeight: '1.4' }}>
                  {selectedOrder.customer.address}<br />
                  {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                </div>
              </div>
            </div>

            {/* Line items */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>Items ({selectedOrder.items.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#27272a', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#a1a1aa' }}>
                        Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '14px' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Tax Invoice breakdown */}
            <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Coupon Savings</span>
                  <span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {selectedOrder.gst && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', fontSize: '12px' }}>
                  <span>GST 18% ({selectedOrder.gst.taxType === 'INTRA_STATE' ? 'CGST+SGST' : 'IGST'})</span>
                  <span>Included (₹{selectedOrder.gst.totalGst})</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #27272a', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '18px', color: '#fff' }}>
                <span>Total Amount</span>
                <span>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => showToast(`GST Invoice exported for ${selectedOrder.orderId}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                <PrinterIcon size={16} /> Export Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD COUPON MODAL */}
      {/* ======================================================== */}
      {showCouponModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Launch Promotional Rule</h3>
              <button onClick={() => setShowCouponModal(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                <CloseIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', textTransform: 'uppercase', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    placeholder="25"
                    value={couponForm.discountPercent}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPercent: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '600' }}>Min Cart (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="999"
                    value={couponForm.minOrder}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#27272a', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '8px', backgroundColor: '#e11d48', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
