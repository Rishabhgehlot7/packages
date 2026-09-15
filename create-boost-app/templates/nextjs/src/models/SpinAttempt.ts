import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISpinAttempt extends Document {
  phoneNumber: string;
  prize: string;
  couponCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpinAttemptSchema: Schema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  prize: {
    type: String,
    required: true
  },
  couponCode: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create compound index for querying phoneNumber within a timeframe easily
SpinAttemptSchema.index({ phoneNumber: 1, createdAt: -1 });

export default models.SpinAttempt || model<ISpinAttempt>('SpinAttempt', SpinAttemptSchema);
