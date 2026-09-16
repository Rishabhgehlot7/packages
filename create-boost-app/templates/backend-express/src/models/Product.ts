import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  hsn?: string;
  gstRate?: number;
  sizes: string[];
  colors: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, default: '' },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    hsn: { type: String, default: '6109' },
    gstRate: { type: Number, default: 18 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>('Product', ProductSchema);
