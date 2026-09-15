import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ITag extends Document {
    _id: any;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const TagSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true });

export default models.Tag || model<ITag>('Tag', TagSchema);
