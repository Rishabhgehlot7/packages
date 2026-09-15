// Cache reload trigger comment
import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { ICategory } from './Category';
import { ITag } from './Tag';

export interface IProductMedia {
  type: 'image' | 'video';
  url: string;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
}

export interface IVariant {
  name?: string;
  sku: string;
  options: { name: string; value: string }[];
  price: number;
  salePrice?: number;
  stock: number;
  weight?: number;
  dimensions?: IDimensions;
  images?: string[];
  categories?: (Types.ObjectId | ICategory | string)[];
  easyecomProductId?: string;
  easyecomSynced?: boolean;
}

export interface IFeatureBanner {
  image: string;
  displayOrder?: number;
}

export interface IUpsellItem {
  product: Types.ObjectId | IProduct | string;
  variantSku?: string;
  discountType?: 'percentage' | 'fixed_price';
  discountValue?: number;
}

export interface IProduct extends Document {
  _id: any;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  category: Types.ObjectId | ICategory;
  media: IProductMedia[];
  variants: IVariant[];
  dimensions?: IDimensions;
  weight?: number; // in a standard unit like kg
  isActive: boolean;
  isDeleted?: boolean;
  publishDate?: Date;
  averageRating: number;
  numReviews: number;
  highlights?: string[];
  tags?: Types.ObjectId[] | ITag[] | string[];
  showMeasurements?: boolean;
  measurementChart?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  warrantyYears?: number;
  ean?: string;
  returnMessage?: string;
  gstRate?: number;
  hsnCode?: string;
  upsellProducts?: (Types.ObjectId | IProduct | string)[];
  upsellItems?: IUpsellItem[];
  checkoutDealConfig?: Partial<IUpsellItem> | null;
  youtubeUrl?: string;
  featureBanners?: IFeatureBanner[];
  displayOrder: number;
  easyecomProductId?: string;
  easyecomSynced?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductMediaSchema: Schema = new Schema({
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  url: { type: String, required: true },
});

const DimensionsSchema: Schema = new Schema({
  length: { type: Number, required: true, min: 0 },
  width: { type: Number, required: true, min: 0 },
  height: { type: Number, required: true, min: 0 }
}, { _id: false });

const VariantSchema: Schema = new Schema({
  name: { type: String, trim: true },
  sku: { type: String, required: true, unique: true, sparse: true },
  options: [{
    name: { type: String, required: true }, // e.g., 'Color'
    value: { type: String, required: true } // e.g., 'Blue'
  }],
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  weight: { type: Number, min: 0 },
  dimensions: DimensionsSchema,
  images: { type: [String], default: [] },
  categories: { type: [{ type: Schema.Types.ObjectId, ref: 'Category' }], default: [] },
  easyecomProductId: { type: String, default: null },
  easyecomSynced: { type: Boolean, default: false },
}, { _id: false });

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true, trim: true },
  shortDescription: { type: String, trim: true, default: '' },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  media: [ProductMediaSchema],
  variants: [VariantSchema],
  dimensions: DimensionsSchema,
  weight: { type: Number, min: 0 }, // Assuming weight in kg
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false, index: true },
  publishDate: { type: Date },
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  highlights: { type: [String], default: [] },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  showMeasurements: { type: Boolean, default: false },
  measurementChart: { type: String, default: null },
  isBestSeller: { type: Boolean, default: false, index: true },
  isNewArrival: { type: Boolean, default: false, index: true },
  warrantyYears: { type: Number, default: 0, min: 0 },
  ean: { type: String, trim: true, default: '' },
  returnMessage: { type: String, trim: true, default: '' },
  gstRate: { type: Number, default: 18 },
  hsnCode: { type: String, trim: true, default: '' },
  upsellProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  upsellItems: [{
    _id: false,
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    variantSku: { type: String, trim: true, default: '' },
    discountType: { type: String, enum: ['percentage', 'fixed_price'], default: 'percentage' },
    discountValue: { type: Number, default: 0 },
  }],
  youtubeUrl: { type: String, trim: true, default: '' },
  featureBanners: [{
    image: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 }
  }],
  displayOrder: { type: Number, default: 0, index: true },
  easyecomProductId: { type: String, default: null },
  easyecomSynced: { type: Boolean, default: false },
}, { timestamps: true });

// Compound indexes for sub-millisecond shop & category querying
ProductSchema.index({ isActive: 1, isDeleted: 1, category: 1, displayOrder: 1 });
ProductSchema.index({ isActive: 1, isDeleted: 1, createdAt: -1 });

ProductSchema.pre('save', function (this: any, next: any) {
  if (this.isModified('salePrice') && this.salePrice && this.price) {
    if (this.salePrice > this.price) {
      return next ? next(new Error('Sale price must be less than or equal to the regular price.')) : undefined;
    }
  }
  if (this.variants && this.variants.length > 0) {
    for (const variant of this.variants) {
      if (variant.salePrice && variant.price && variant.salePrice > variant.price) {
        return next ? next(new Error(`Variant ${variant.sku || variant.name || ''} sale price must be less than or equal to its regular price.`)) : undefined;
      }
    }
  }
  if (typeof next === 'function') next();
});

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as any).Product;
}
export default models.Product || model<IProduct>('Product', ProductSchema);
