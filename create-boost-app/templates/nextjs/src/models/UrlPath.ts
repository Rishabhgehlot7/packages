import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUrlPath extends Document {
    url: string;
    type: 'product' | 'category' | 'page' | 'other';
    refId?: mongoose.Types.ObjectId;
    label: string;
}

const UrlPathSchema: Schema = new Schema({
    url: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['product', 'category', 'page', 'other'], required: true },
    refId: { type: Schema.Types.ObjectId, index: true },
    label: { type: String, required: true },
}, { timestamps: true });

export default models.UrlPath || model<IUrlPath>('UrlPath', UrlPathSchema);
