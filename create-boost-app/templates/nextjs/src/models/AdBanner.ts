import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdBannerDocument extends Document {
  text: string;
  backgroundColor: string;
  textColor: string;
  link: string;
  isActive: boolean;
  showCloseButton: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdBannerSchema: Schema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    backgroundColor: { type: String, default: '#4f46e5' },
    textColor: { type: String, default: '#ffffff' },
    link: { type: String, default: '/shop', trim: true },
    isActive: { type: Boolean, default: true, index: true },
    showCloseButton: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const AdBanner: Model<IAdBannerDocument> =
  mongoose.models.AdBanner || mongoose.model<IAdBannerDocument>('AdBanner', AdBannerSchema);

export default AdBanner;
