import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReviewDocument extends Document {
  productId: string;
  author: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedBuyer: boolean;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type IReview = IReviewDocument;

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    author: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: '' },
    comment: { type: String, required: true, trim: true },
    verifiedBuyer: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production' && mongoose.models.Review) {
  delete (mongoose.models as any).Review;
}

const Review: Model<IReviewDocument> =
  mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);

export default Review;
