import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  ArrowRightIcon,
} from './Icons';

interface OrderTrackingData {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    title: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
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
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'delivered';
  trackingNumber?: string;
  createdAt: string;
}

const DEMO_ORDER_SEED: OrderTrackingData = {
  orderId: 'ORD-892104',
  customer: {
    name: 'Kabir Verma',
    phone: '+91 98765 43210',
    email: 'kabir.v@example.com',
    address: 'Flat 402, Signature Towers, 100 Feet Rd',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  },
  items: [
    {
      title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
      price: 2499,
      quantity: 1,
      selectedSize: 'L',
      selectedColor: 'Onyx Black',
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
  trackingNumber: 'TRK-98234112',
  createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
};

export default function OrderTrackingPage() {
  const { orderId: paramOrderId } = useParams<{ orderId?: string }>();
  const [searchInput, setSearchInput] = useState<string>(paramOrderId || 'ORD-892104');
  const [order, setOrder] = useState<OrderTrackingData | null>(DEMO_ORDER_SEED);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          return;
        }
      }
      // If mock search matches seed
      if (id.trim().toUpperCase() === DEMO_ORDER_SEED.orderId) {
        setOrder(DEMO_ORDER_SEED);
        return;
      }
      setErrorMessage(`Order "${id}" not found. Try searching with "ORD-892104".`);
      setOrder(null);
    } catch {
      // Fallback
      if (id.trim().toUpperCase() === DEMO_ORDER_SEED.orderId) {
        setOrder(DEMO_ORDER_SEED);
      } else {
        setErrorMessage('Unable to connect to order service. Check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderId) {
      setSearchInput(paramOrderId);
      fetchOrder(paramOrderId);
    }
  }, [paramOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  // Status mapping
  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Verified & Payment Confirmed' },
    { key: 'confirmed', label: 'QC & Packed', desc: 'Packed at Hub Warehouse' },
    { key: 'dispatched', label: 'Shipped', desc: 'In Transit with Express Courier' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over to customer' },
  ];

  const getStepStatus = (stepKey: string) => {
    if (!order) return 'upcoming';
    const orderHierarchy = ['placed', 'confirmed', 'dispatched', 'delivered'];
    const currentIndex = orderHierarchy.indexOf(order.orderStatus);
    const stepIndex = orderHierarchy.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <span style={{ fontWeight: '800', letterSpacing: '-0.5px', fontSize: '18px' }}>BOOST ENGINE</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Store
          </Link>
          <Link to="/wishlist" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Wishlist
          </Link>
          <Link to="/admin" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Admin
          </Link>
          <Link
            to="/cart"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}
          >
            <ShoppingBagIcon size={16} />
            Bag
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Search Order Bar */}
        <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0' }}>Track Your Consignment</h1>
          <p style={{ margin: '0 0 20px 0', color: '#a1a1aa', fontSize: '14px' }}>Enter your Order ID or Courier Tracking Number to view real-time transit status.</p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="e.g. ORD-892104"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }}
              />
              <div style={{ position: 'absolute', left: '14px', top: '14px', color: '#71717a' }}>
                <SearchIcon size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#e11d48', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          {errorMessage && (
            <div style={{ marginTop: '14px', color: '#f87171', fontSize: '13px' }}>
              ⚠️ {errorMessage}
            </div>
          )}
        </div>

        {/* Order Details & Stepper */}
        {order && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Order Meta */}
            <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #27272a', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Order Tracking</div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 0 0' }}>{order.orderId}</h2>
                  <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Waybill / Courier AWB</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8' }}>{order.trackingNumber || 'Processing AWB'}</div>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginTop: '2px' }}>Shiprocket / Delhivery Air</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', position: 'relative' }}>
                {steps.map((step, idx) => {
                  const status = getStepStatus(step.key);
                  return (
                    <div key={step.key} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: status === 'completed' ? '#10b981' : status === 'active' ? '#e11d48' : '#27272a',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 10px auto',
                          fontWeight: '700',
                          fontSize: '14px',
                        }}
                      >
                        {status === 'completed' ? <CheckCircleIcon size={20} /> : idx + 1}
                      </div>
                      <div style={{ fontWeight: status === 'active' ? '700' : '600', fontSize: '14px', color: status === 'upcoming' ? '#71717a' : '#fff' }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px', lineHeight: '1.3' }}>
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items & Invoice Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
              {/* Ordered Items */}
              <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 0' }}>Ordered Garments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #27272a' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                          Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Delivery Address</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#d4d4d8' }}>
                    <strong>{order.customer.name}</strong><br />
                    {order.customer.address}<br />
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}<br />
                    Phone: {order.customer.phone}
                  </div>
                </div>
              </div>

              {/* Price & GST Summary */}
              <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 0' }}>Tax Invoice Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                    <span>Bag Total</span>
                    <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {order.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                      <span>Coupon Savings</span>
                      <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                    <span>Express Shipping</span>
                    <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                  </div>

                  {order.gst && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', fontSize: '12px' }}>
                      <span>GST 18% ({order.gst.taxType === 'INTRA_STATE' ? 'CGST+SGST' : 'IGST'})</span>
                      <span>Included (₹{order.gst.totalGst})</span>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid #27272a', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '18px', color: '#fff' }}>
                    <span>Total Paid</span>
                    <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ marginTop: '12px', backgroundColor: '#27272a', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#a1a1aa' }}>
                    Payment Mode: <strong style={{ color: '#fff', textTransform: 'uppercase' }}>{order.paymentMethod}</strong> • Status:{' '}
                    <span style={{ color: '#10b981', fontWeight: '700' }}>{order.paymentStatus.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
