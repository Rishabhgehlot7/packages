import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IAbandonedCheckoutItem {
  productId: Types.ObjectId | IProduct | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantSku?: string;
  variantName?: string;
  isPairDeal?: boolean;
  discountPct?: number;
  originalPrice?: number;
  slug?: string;
}

export interface IAbandonedCheckout extends Document {
  _id: any;
  checkoutId: string; // e.g. CHK-1724...
  recoveryToken: string; // unique token for 1-click cart recovery link
  user?: Types.ObjectId | IUser;
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    address2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  items: IAbandonedCheckoutItem[];
  totalAmount: number;
  originalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod?: string;
  status: 'abandoned' | 'recovered' | 'completed';
  recoveryEmailSent: boolean;
  recoveryEmailSentAt?: Date;
  recoveryWhatsappSent: boolean;
  recoveryWhatsappSentAt?: Date;
  lastStep: 'contact_entered' | 'payment_attempted' | 'payment_failed';
  associatedOrderId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AbandonedCheckoutItemSchema = new Schema({
  productId: { type: Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  variantSku: { type: String },
  variantName: { type: String },
  isPairDeal: { type: Boolean, default: false },
  discountPct: { type: Number },
  originalPrice: { type: Number },
  slug: { type: String },
}, { _id: false });

const AbandonedCheckoutSchema = new Schema<IAbandonedCheckout>({
  checkoutId: { type: String, required: true, unique: true, index: true },
  recoveryToken: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  customerInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    address2: { type: String, default: '' },
    landmark: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    zip: { type: String, default: '' },
  },
  items: [AbandonedCheckoutItemSchema],
  totalAmount: { type: Number, default: 0 },
  originalAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String },
  paymentMethod: { type: String },
  status: {
    type: String,
    enum: ['abandoned', 'recovered', 'completed'],
    default: 'abandoned',
    index: true,
  },
  recoveryEmailSent: { type: Boolean, default: false },
  recoveryEmailSentAt: { type: Date },
  recoveryWhatsappSent: { type: Boolean, default: false },
  recoveryWhatsappSentAt: { type: Date },
  lastStep: {
    type: String,
    enum: ['contact_entered', 'payment_attempted', 'payment_failed'],
    default: 'contact_entered',
  },
  associatedOrderId: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
}, {
  timestamps: true,
});

// Indexes for fast lookup
AbandonedCheckoutSchema.index({ 'customerInfo.email': 1 });
AbandonedCheckoutSchema.index({ 'customerInfo.phone': 1 });
AbandonedCheckoutSchema.index({ createdAt: -1 });

export default models.AbandonedCheckout || model<IAbandonedCheckout>('AbandonedCheckout', AbandonedCheckoutSchema);
