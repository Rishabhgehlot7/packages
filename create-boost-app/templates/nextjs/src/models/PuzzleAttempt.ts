import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IPuzzleAttempt extends Document {
  phoneNumber: string;
  couponCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const PuzzleAttemptSchema: Schema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  couponCode: {
    type: String,
    required: true
  }
}, { timestamps: true });

PuzzleAttemptSchema.index({ phoneNumber: 1, createdAt: -1 });

export default models.PuzzleAttempt || model<IPuzzleAttempt>('PuzzleAttempt', PuzzleAttemptSchema);
