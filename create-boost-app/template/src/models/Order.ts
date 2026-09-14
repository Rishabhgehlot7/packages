import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  variantId?: string;
  variantSku?: string;
  variantName?: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  gstRate?: number;
  hsnCode?: string;
}

export interface IOrderReturnDetails {
  reason: string;
  comments?: string;
  items: Array<{ productId: string; quantity: number; title: string; price: number }>;
  requestedAt: Date;
  refundMode: 'wallet' | 'original';
  refundAmount: number;
  pickupAwb?: string;
  status: 'requested' | 'approved' | 'rejected' | 'picked_up' | 'refunded';
}

export interface IOrderShippingDetails {
  awb: string;
  courierName: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  liveTimeline?: Array<{
    status: string;
    description: string;
    location: string;
    timestamp: Date;
    isCompleted: boolean;
  }>;
}

export interface IOrderDocument extends Document {
  id: string;
  orderId?: string;
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
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'razorpay' | 'phonepe' | 'cod' | 'upi';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  trackingNumber?: string;
  courier?: string;
  shippingDetails?: IOrderShippingDetails;
  returnStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'picked_up' | 'refunded';
  returnDetails?: IOrderReturnDetails;
  gstDetails?: {
    buyerGstin?: string;
    companyName?: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    variantId: { type: String, default: '' },
    variantSku: { type: String, default: '' },
    variantName: { type: String, default: '' },
    title: { type: String, required: true },
    sku: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String, default: '' },
    gstRate: { type: Number, default: 18 },
    hsnCode: { type: String, default: '6109' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: { type: String, required: true, index: true },
      address: {
        line1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
      },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'phonepe', 'cod', 'upi'],
      default: 'razorpay',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
      index: true,
    },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    trackingNumber: { type: String },
    courier: { type: String },
    shippingDetails: {
      awb: { type: String },
      courierName: { type: String },
      trackingUrl: { type: String },
      estimatedDelivery: { type: String },
      liveTimeline: [
        {
          status: String,
          description: String,
          location: String,
          timestamp: Date,
          isCompleted: Boolean,
        },
      ],
    },
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'picked_up', 'refunded'],
      default: 'none',
    },
    returnDetails: {
      reason: String,
      comments: String,
      items: [
        {
          productId: String,
          quantity: Number,
          title: String,
          price: Number,
        },
      ],
      requestedAt: Date,
      refundMode: { type: String, enum: ['wallet', 'original'], default: 'wallet' },
      refundAmount: Number,
      pickupAwb: String,
      status: {
        type: String,
        enum: ['requested', 'approved', 'rejected', 'picked_up', 'refunded'],
        default: 'requested',
      },
    },
    gstDetails: {
      buyerGstin: String,
      companyName: String,
    },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV !== 'production' && mongoose.models.Order) {
  delete (mongoose.models as any).Order;
}

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
