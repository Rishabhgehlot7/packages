import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { IUser } from './User';

export interface IWarrantyRegistration extends Document {
  _id: any;
  user?: Types.ObjectId | IUser;
  fullName: string;
  email: string;
  phone: string;
  productName: string;
  ean?: string;
  purchaseDate: Date;
  purchaseLocation: string;
  proofOfPurchase?: string; // Image URL of invoice/receipt
  status: 'pending' | 'verified' | 'rejected' | 'Pending Verification' | 'Under Review' | 'Action Required (More Info)' | 'Verified & Active' | 'Registration Rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WarrantyRegistrationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  productName: { type: String, required: true, trim: true },
  ean: { type: String, trim: true },
  purchaseDate: { type: Date, required: true },
  purchaseLocation: { type: String, required: true, trim: true },
  proofOfPurchase: { type: String, trim: true },
  status: {
    type: String,
    enum: [
      'Pending Verification', 'Under Review', 'Action Required (More Info)', 
      'Verified & Active', 'Registration Rejected'
    ],
    default: 'Pending Verification'
  },
  adminNotes: { type: String, trim: true },
}, { timestamps: true });

export default models.WarrantyRegistration || model<IWarrantyRegistration>('WarrantyRegistration', WarrantyRegistrationSchema);
