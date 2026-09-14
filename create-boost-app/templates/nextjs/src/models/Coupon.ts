import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICouponDocument extends Document {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: Date;
  minSpend?: number;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  restrictions?: {
    firstPurchaseOnly?: boolean;
    oneTimePerUser?: boolean;
  };
  usedBy?: {
    userId: string;
    orderId: string;
    usedAt: Date;
  }[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true, default: 'percentage' },
    value: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    minSpend: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    usageLimit: { type: Number, min: 1 },
    usageCount: { type: Number, default: 0 },
    restrictions: {
      firstPurchaseOnly: { type: Boolean, default: false },
      oneTimePerUser: { type: Boolean, default: false },
    },
    usedBy: [
      {
        userId: { type: String },
        orderId: { type: String },
        usedAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production' && mongoose.models.Coupon) {
  delete (mongoose.models as any).Coupon;
}

const Coupon: Model<ICouponDocument> =
  mongoose.models.Coupon || mongoose.model<ICouponDocument>('Coupon', CouponSchema);

export default Coupon;
