import { Router, Request, Response } from 'express';

export const ordersRouter = Router();

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  gstRate?: number;
}

export interface OrderData {
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
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  gst: {
    taxType: 'INTRA_STATE' | 'INTER_STATE';
    cgst: number;
    sgst: number;
    igst: number;
    totalGst: number;
  };
  totalAmount: number;
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'cod_pending';
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'delivered';
  trackingNumber?: string;
  createdAt: string;
}

// In-memory store for instant mock mode with seed orders
const ORDERS_DB: Map<string, OrderData> = new Map([
  [
    'ORD-892104',
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
          price: 2499,
          quantity: 1,
          selectedSize: 'L',
          selectedColor: 'Onyx Black',
          gstRate: 18,
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
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    },
  ],
  [
    'ORD-714529',
    {
      orderId: 'ORD-714529',
      customer: {
        name: 'Aanya Sharma',
        phone: '+91 98112 34567',
        email: 'aanya.sharma@example.com',
        address: 'B-12, Green Park Main',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
      },
      items: [
        {
          productId: 'prod_2',
          title: 'Acid Wash Vintage Boxy Tee',
          price: 1199,
          quantity: 2,
          selectedSize: 'M',
          selectedColor: 'Washed Charcoal',
          gstRate: 18,
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
      trackingNumber: 'TRK-14529881',
      createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    },
  ],
]);

// Helper to compute GST based on destination state (assuming warehouse in MH / 27)
function computeIndianGst(taxableAmount: number, destState: string, defaultRate = 18) {
  const isIntraState = destState.toLowerCase().includes('maharashtra') || destState.toUpperCase() === 'MH';
  const taxMultiplier = defaultRate / (100 + defaultRate);
  const totalGst = Number((taxableAmount * taxMultiplier).toFixed(2));

  if (isIntraState) {
    const half = Number((totalGst / 2).toFixed(2));
    return {
      taxType: 'INTRA_STATE' as const,
      cgst: half,
      sgst: half,
      igst: 0,
      totalGst,
    };
  }

  return {
    taxType: 'INTER_STATE' as const,
    cgst: 0,
    sgst: 0,
    igst: totalGst,
    totalGst,
  };
}

// GET /api/orders - List all orders (Admin)
ordersRouter.get('/', (req: Request, res: Response) => {
  const { status, search } = req.query;
  let ordersList = Array.from(ORDERS_DB.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (status && status !== 'all') {
    ordersList = ordersList.filter((o) => o.orderStatus === status);
  }

  if (search) {
    const q = String(search).toLowerCase();
    ordersList = ordersList.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
    );
  }

  return res.json({
    success: true,
    count: ordersList.length,
    orders: ordersList,
  });
});

// POST /api/orders - Create New Order
ordersRouter.post('/', (req: Request, res: Response) => {
  const { customer, items, paymentMethod = 'online', couponCode } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address || !customer.pincode) {
    return res.status(400).json({ success: false, error: 'Customer name, phone, address, and pincode are required.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Order items cannot be empty.' });
  }

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const discount = couponCode === 'BOOST20' ? Math.round(subtotal * 0.2) : 0;
  const taxableAmount = subtotal - discount;
  const shippingFee = taxableAmount >= 999 ? 0 : 79;
  const gstBreakdown = computeIndianGst(taxableAmount, customer.state || 'DL');
  const totalAmount = taxableAmount + shippingFee;

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder: OrderData = {
    orderId,
    customer,
    items,
    subtotal,
    discount,
    shippingFee,
    gst: gstBreakdown,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
    orderStatus: 'placed',
    trackingNumber: 'TRK-' + Date.now().toString().slice(-8),
    createdAt: new Date().toISOString(),
  };

  ORDERS_DB.set(orderId, newOrder);

  return res.status(201).json({
    success: true,
    message: 'Order created successfully!',
    order: newOrder,
  });
});

// GET /api/orders/:orderId - Fetch Order
ordersRouter.get('/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = ORDERS_DB.get(orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  return res.json({ success: true, order });
});

// PATCH /api/orders/:orderId - Update order status (Admin)
ordersRouter.patch('/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = ORDERS_DB.get(orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  const { orderStatus, paymentStatus, trackingNumber } = req.body;
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  ORDERS_DB.set(orderId, order);

  return res.json({
    success: true,
    message: 'Order updated successfully',
    order,
  });
});

