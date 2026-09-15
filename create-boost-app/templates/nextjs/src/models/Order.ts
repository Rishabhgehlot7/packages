import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IOrderItem extends Document {
  product: Types.ObjectId | IProduct;
  quantity: number;
  price: number; // Price at the time of purchase
  variantSku?: string;
  gstRate: number;
  hsnCode: string;
  isPairDeal?: boolean;
  originalPrice?: number;
  discountPct?: number;
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  gstAmount?: number;
}

export interface IActionRequest {
  type: 'cancel' | 'refund' | 'return' | 'exchange';
  reason: string;
  comments?: string;
  status: 'pending' | 'approved' | 'rejected';
  images?: string[];
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: Types.ObjectId;
  adminComments?: string;
}

export interface IAuditLog {
  status: string;
  previousStatus?: string;
  changedBy?: string;
  changedById?: Types.ObjectId;
  notes?: string;
  timestamp: Date;
}

export interface IOrder extends Document {
  _changedBy?: string;
  _changedById?: Types.ObjectId;
  _notes?: string;
  auditLogs: IAuditLog[];
  _id: any;
  orderId: string; // User-friendly order ID
  user: Types.ObjectId | IUser;
  items: (Types.ObjectId | IOrderItem)[];
  originalAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  shippingAddress: {
    name: string;
    address: string;
    address2?: string;
    landmark?: string;
    city: string;
    state?: string;
    country?: string;
    zip: string;
    email: string;
    phone: string;
  };
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Failed' | 'Return Requested' | 'Returned' | 'Exchanged' | 'Refunded' | 'Return Approved (Pending Pickup)' | 'Return - In Transit' | 'Return - Received & Inspecting' | 'Refund Initiated' | 'Returned & Refunded' | 'Exchange Approved (Pending Pickup)' | 'Exchange - In Transit' | 'Exchange - Received & Inspecting' | 'Replacement Processing' | 'Replacement Shipped' | 'Exchange Completed' | 'Return/Exchange Rejected';
  actionRequests: IActionRequest[];
  refundStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  refundAmount?: number;
  returnReason?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  paymentMethod: 'Razorpay' | 'PhonePe' | 'Cashfree' | 'Paytm' | 'CCAvenue' | 'COD';
  easyecomSynced?: boolean;
  easyecomSyncError?: string | null;
  easyecomOrderId?: string;
  trackingNumber?: string;
  carrier?: string;
  manifestId?: string;
  shippingLabel?: string;
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  gstAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  variantSku: { type: String },
  gstRate: { type: Number, default: 18 },
  hsnCode: { type: String, default: '' },
  isPairDeal: { type: Boolean, default: false },
  originalPrice: { type: Number },
  discountPct: { type: Number },
  taxableAmount: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
});

const ShippingAddressSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  address2: { type: String, required: false },
  landmark: { type: String, required: false },
  city: { type: String, required: true },
  state: { type: String, required: false },
  country: { type: String, required: false, default: 'India' },
  zip: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
}, { _id: false });

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
  originalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  couponCode: { type: String },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  status: {
    type: String,
    enum: [
      'Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Failed', 
      'Return Requested', 'Returned', 'Exchanged', 'Refunded',
      'Return Approved (Pending Pickup)', 'Return - In Transit', 'Return - Received & Inspecting', 
      'Refund Initiated', 'Returned & Refunded', 
      'Exchange Approved (Pending Pickup)', 'Exchange - In Transit', 'Exchange - Received & Inspecting', 
      'Replacement Processing', 'Replacement Shipped', 'Exchange Completed', 
      'Return/Exchange Rejected'
    ],
    default: 'Pending'
  },
  actionRequests: [{
    type: {
      type: String,
      enum: ['cancel', 'refund', 'return', 'exchange'],
      required: true
    },
    reason: { type: String, required: true },
    comments: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    images: [{ type: String }],
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    adminComments: { type: String }
  }],
  refundStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed']
  },
  refundAmount: { type: Number },
  returnReason: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  gatewayOrderId: { type: String },
  gatewayPaymentId: { type: String },
  gatewaySignature: { type: String },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'PhonePe', 'Cashfree', 'Paytm', 'CCAvenue', 'COD'],
    default: 'Razorpay'
  },
  easyecomSynced: { type: Boolean, default: false },
  easyecomSyncError: { type: String, default: null },
  easyecomOrderId: { type: String, default: null },
  trackingNumber: { type: String, default: null },
  carrier: { type: String, default: null },
  manifestId: { type: String, default: null },
  shippingLabel: { type: String, default: null },
  taxableAmount: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  auditLogs: [{
    status: { type: String, required: true },
    previousStatus: { type: String },
    changedBy: { type: String },
    changedById: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

// High-performance compound indexes for Admin and Customer Order lookup
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ razorpayOrderId: 1 }, { sparse: true });
OrderSchema.index({ 'shippingAddress.phone': 1 });
OrderSchema.index({ 'shippingAddress.email': 1 });

OrderSchema.post('init', function (this: any) {
  this._originalStatus = this.status;
});

OrderSchema.pre('save', function (this: any, next: any) {
  if (this.isModified('status')) {
    const previousStatus = this._originalStatus;
    const currentStatus = this.status;

    if (!this.auditLogs) {
      this.auditLogs = [];
    }

    const changedBy = this._changedBy || 'System / Auto Integration';
    const changedById = this._changedById || undefined;
    const notes = this._notes || `Status changed from ${previousStatus || 'none'} to ${currentStatus}`;

    this.auditLogs.push({
      status: currentStatus,
      previousStatus: previousStatus || undefined,
      changedBy,
      changedById,
      notes,
      timestamp: new Date()
    });

    this._changedBy = undefined;
    this._changedById = undefined;
    this._notes = undefined;
    this._originalStatus = currentStatus;
  }
  if (typeof next === 'function') next();
});

export const OrderItem = models.OrderItem || model<IOrderItem>('OrderItem', OrderItemSchema);
export default models.Order || model<IOrder>('Order', OrderSchema);
