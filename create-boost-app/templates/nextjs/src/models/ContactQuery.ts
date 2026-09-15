import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactQuery extends Document {
    _id: any;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'Pending' | 'Resolved';
    createdAt: Date;
    updatedAt: Date;
}

const ContactQuerySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: false },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Resolved'],
            default: 'Pending'
        },
    },
    { timestamps: true }
);

const ContactQuery: Model<IContactQuery> =
    mongoose.models.ContactQuery || mongoose.model<IContactQuery>('ContactQuery', ContactQuerySchema);

export default ContactQuery;
