import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductMedia {
  type: 'image' | 'video';
  url: string;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
}

export interface IProductVariant {
  id?: string;
  title?: string;
  name?: string;
  sku: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  stock: number;
  weight?: number;
  dimensions?: IDimensions;
  images?: string[];
  options?: { name: string; value: string }[];
  attributes?: Record<string, string>;
}

export interface IFeatureBanner {
  image: string;
  displayOrder?: number;
}

export interface IUpsellItem {
  product: string;
  variantSku?: string;
  discountType?: 'percentage' | 'fixed_price';
  discountValue?: number;
}

export interface IProductReview {
  id?: string;
  author: string;
  rating: number;
  body?: string;
  comment?: string;
  verifiedBuyer?: boolean;
  createdAt?: string;
}

export interface IProductDocument extends Document {
  id: string;
  slug?: string;
  title: string;
  name?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  brand: string;
  category: string;
  tags: string[];
  images: string[];
  media?: IProductMedia[];
  inStock: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  hsnCode: string;
  taxRate: number;
  gstRate?: number;
  sku: string;
  weight?: number;
  dimensions?: IDimensions;
  highlights?: string[];
  warrantyYears?: number;
  featureBanners?: IFeatureBanner[];
  upsellProducts?: string[];
  upsellItems?: IUpsellItem[];
  checkoutDealConfig?: Partial<IUpsellItem> | null;
  rating: {
    value: number;
    count: number;
  };
  variants: IProductVariant[];
  reviews: IProductReview[];
  createdAt: Date;
  updatedAt: Date;
}

const DimensionsSchema = new Schema<IDimensions>(
  {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductMediaSchema = new Schema<IProductMedia>(
  {
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    id: { type: String, default: '' },
    title: { type: String, default: '' },
    name: { type: String, default: '' },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    compareAtPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    weight: { type: Number },
    dimensions: DimensionsSchema,
    images: [{ type: String }],
    options: [
      {
        name: { type: String },
        value: { type: String },
        _id: false,
      },
    ],
    attributes: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const ProductReviewSchema = new Schema<IProductReview>(
  {
    id: { type: String, default: () => `rev_${Date.now()}` },
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, default: '' },
    comment: { type: String, default: '' },
    verifiedBuyer: { type: Boolean, default: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const FeatureBannerSchema = new Schema<IFeatureBanner>(
  {
    image: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const UpsellItemSchema = new Schema<IUpsellItem>(
  {
    product: { type: String, required: true },
    variantSku: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed_price'], default: 'percentage' },
    discountValue: { type: Number, default: 20 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, index: true },
    title: { type: String, required: true, index: true },
    name: { type: String, index: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    compareAtPrice: { type: Number, default: 0 },
    brand: { type: String, default: 'Boost' },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    images: [{ type: String }],
    media: [ProductMediaSchema],
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    hsnCode: { type: String, default: '6109' },
    taxRate: { type: Number, default: 18 },
    gstRate: { type: Number, default: 18 },
    sku: { type: String, required: true, index: true },
    weight: { type: Number },
    dimensions: DimensionsSchema,
    highlights: [{ type: String }],
    warrantyYears: { type: Number, default: 0 },
    featureBanners: [FeatureBannerSchema],
    upsellProducts: [{ type: String }],
    upsellItems: [UpsellItemSchema],
    checkoutDealConfig: {
      variantSku: { type: String },
      discountType: { type: String, enum: ['percentage', 'fixed_price'], default: 'percentage' },
      discountValue: { type: Number, default: 20 },
    },
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

ProductSchema.pre('save', function () {
  const doc = this as any;
  if (!doc.name && doc.title) {
    doc.name = doc.title;
  }
  if (!doc.title && doc.name) {
    doc.title = doc.name;
  }
  if ((!doc.images || doc.images.length === 0) && doc.media && doc.media.length > 0) {
    doc.images = doc.media.map((m: any) => m.url);
  }
  if ((!doc.media || doc.media.length === 0) && doc.images && doc.images.length > 0) {
    doc.media = doc.images.map((url: string) => ({ type: 'image', url }));
  }
});

if (process.env.NODE_ENV !== 'production' && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;
