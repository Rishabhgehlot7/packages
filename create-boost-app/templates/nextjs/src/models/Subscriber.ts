import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISubscriber extends Document {
    email: string;
    isSubscribed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriberSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    isSubscribed: { type: Boolean, default: true },
}, { timestamps: true });

export default models.Subscriber || model<ISubscriber>('Subscriber', SubscriberSchema);
