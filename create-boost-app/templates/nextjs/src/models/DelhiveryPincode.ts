import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IDelhiveryPincode extends Document {
  pincode: string;
  state: string;
  city: string;
  days: number;
  createdAt: Date;
  updatedAt: Date;
}

const DelhiveryPincodeSchema: Schema = new Schema({
  pincode: { type: String, required: true, unique: true, index: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  days: { type: Number, required: true }
}, {
  timestamps: true
});

export default models.DelhiveryPincode || model<IDelhiveryPincode>('DelhiveryPincode', DelhiveryPincodeSchema);
