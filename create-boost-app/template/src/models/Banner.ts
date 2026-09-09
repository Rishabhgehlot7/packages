import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBannerDocument extends Document {
  title?: string;
  image?: string;
  desktopImage?: string;
  mobileImage?: string;
  desktopOrder: number;
  mobileOrder: number;
  link: string;
  buttonText?: string;
  isActive: boolean;
  isDeleted: boolean;
  orientation: 'landscape' | 'portrait';
  titleColor?: string;
  isHeroBanner?: boolean;
  isNewArrival?: boolean;
  videoUrl?: string;
  isVideoBanner?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    desktopImage: { type: String, default: '' },
    mobileImage: { type: String, default: '' },
    desktopOrder: { type: Number, default: 0, index: true },
    mobileOrder: { type: Number, default: 0, index: true },
    link: { type: String, default: '/shop', trim: true },
    buttonText: { type: String, default: 'Shop Now', trim: true },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    orientation: { type: String, enum: ['landscape', 'portrait'], default: 'landscape' },
    titleColor: { type: String, default: '#ffffff' },
    isHeroBanner: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false },
    videoUrl: { type: String, default: '' },
    isVideoBanner: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Banner: Model<IBannerDocument> =
  mongoose.models.Banner || mongoose.model<IBannerDocument>('Banner', BannerSchema);

export default Banner;
