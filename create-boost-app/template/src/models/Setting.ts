import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettingsDocument extends Document {
  storeName: string;
  contactEmail: string;
  storeAddress: string;
  phone?: string;
  whatsapp?: string;
  logoUrl: string;
  footerDescription?: string;
  primaryColor: string;
  shipping: {
    freeShippingThreshold: number;
    standardShippingCharge: number;
  };
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  payment: {
    razorpayKeyId?: string;
    enableCod: boolean;
    enableRazorpay: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    storeName: { type: String, default: 'Boost Store' },
    contactEmail: { type: String, default: 'support@booststore.com' },
    storeAddress: { type: String, default: '' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    footerDescription: { type: String, default: '' },
    primaryColor: { type: String, default: '#000000' },
    shipping: {
      freeShippingThreshold: { type: Number, default: 999 },
      standardShippingCharge: { type: Number, default: 99 },
    },
    socials: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    payment: {
      razorpayKeyId: { type: String, default: '' },
      enableCod: { type: Boolean, default: true },
      enableRazorpay: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production' && mongoose.models.Setting) {
  delete (mongoose.models as any).Setting;
}

const Setting: Model<ISettingsDocument> =
  mongoose.models.Setting || mongoose.model<ISettingsDocument>('Setting', SettingsSchema);

export default Setting;
