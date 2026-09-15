import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { IUser } from './User';
import { IOrder } from './Order';
import { IProduct } from './Product';

export interface IWarrantyClaim extends Document {
  _id: any;
  user?: Types.ObjectId | IUser;
  order?: Types.ObjectId | IOrder;
  product?: Types.ObjectId | IProduct;
  variantSku?: string;
  issueType: 'Defective Product' | 'Damaged on Arrival' | 'Hardware Failure' | 'Other';
  description: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'Claim Submitted' | 'Under Review & Diagnosis' | 'Approved - Return Defective' | 'Defective - In Transit' | 'Defective - Received & Inspected' | 'Replacement Processing' | 'Replacement Shipped' | 'Claim Resolved' | 'Claim Rejected';
  adminNotes?: string;
  // Direct Claim Fields
  isDirectClaim?: boolean;
  fullName?: string;
  email?: string;
  phone?: string;
  manualOrderId?: string;
  platform?: string;
  manualProductName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WarrantyClaimSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: false },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
  variantSku: { type: String },
  issueType: {
    type: String,
    enum: ['Defective Product', 'Damaged on Arrival', 'Hardware Failure', 'Other'],
    required: true
  },
  description: { type: String, required: true, trim: true },
  images: [{ type: String }],
  status: {
    type: String,
    enum: [
      'Claim Submitted', 'Under Review & Diagnosis', 'Approved - Return Defective',
      'Defective - In Transit', 'Defective - Received & Inspected',
      'Replacement Processing', 'Replacement Shipped', 'Claim Resolved', 'Claim Rejected'
    ],
    default: 'Claim Submitted'
  },
  adminNotes: { type: String },
  isDirectClaim: { type: Boolean, default: false },
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  manualOrderId: { type: String },
  platform: { type: String },
  manualProductName: { type: String },
}, { timestamps: true });

export default models.WarrantyClaim || model<IWarrantyClaim>('WarrantyClaim', WarrantyClaimSchema);
