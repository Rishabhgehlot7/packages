import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IDiscountPopupConfig extends Document {
  isEnabled: boolean;
  couponCode: string;
  badgeText: string;
  headline: string;
  description: string;
  delaySeconds: number;
  showOnExitIntent: boolean;
  cooldownHours: number;
  updatedAt: Date;
  createdAt: Date;
}

const DiscountPopupConfigSchema: Schema = new Schema(
  {
    isEnabled: { type: Boolean, default: true },
    couponCode: { type: String, default: 'WELCOME10', uppercase: true, trim: true },
    badgeText: { type: String, default: 'Special Welcome Gift' },
    headline: { type: String, default: 'Get 10% OFF' },
    description: {
      type: String,
      default: 'Enjoy an exclusive discount on your order. Elevate your everyday travel with Club Hachi.',
    },
    delaySeconds: { type: Number, default: 4, min: 1, max: 60 },
    showOnExitIntent: { type: Boolean, default: true },
    cooldownHours: { type: Number, default: 24, min: 1, max: 720 },
  },
  { timestamps: true }
);

export default models.DiscountPopupConfig ||
  model<IDiscountPopupConfig>('DiscountPopupConfig', DiscountPopupConfigSchema);
