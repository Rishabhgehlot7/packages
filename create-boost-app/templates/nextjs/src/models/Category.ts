import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: mongoose.Types.ObjectId | null;
  parents?: mongoose.Types.ObjectId[];
  ancestors?: Array<{ _id: mongoose.Types.ObjectId; name: string; slug: string }>;
  displayOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, index: true },
    image: { type: String, default: '' },
    description: { type: String, trim: true, default: '' },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
    parents: { type: [{ type: Schema.Types.ObjectId, ref: 'Category' }], default: [] },
    ancestors: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Category' },
        name: { type: String },
        slug: { type: String },
      },
    ],
    displayOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);

export default Category;
