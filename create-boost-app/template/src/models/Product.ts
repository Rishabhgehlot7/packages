import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface IProductReview {
  id: string;
  author: string;
  rating: number;
  body: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface IProductDocument extends Document {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number;
  brand: string;
  category: string;
  tags: string[];
  images: string[];
  inStock: boolean;
  hsnCode: string;
  taxRate: number;
  sku: string;
  rating: {
    value: number;
    count: number;
  };
  variants: IProductVariant[];
  reviews: IProductReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    attributes: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const ProductReviewSchema = new Schema<IProductReview>(
  {
    id: { type: String, required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, default: '' },
    verifiedBuyer: { type: Boolean, default: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    brand: { type: String, default: 'Boost' },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    hsnCode: { type: String, default: '6109' },
    taxRate: { type: Number, default: 18 },
    sku: { type: String, required: true, index: true },
    rating: {
      value: { type: Number, default: 4.8 },
      count: { type: Number, default: 1 },
    },
    variants: [ProductVariantSchema],
    reviews: [ProductReviewSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of existing model in Next.js HMR
const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;
