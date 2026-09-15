import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICounter extends Document {
  id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export default models.Counter || model<ICounter>('Counter', CounterSchema);
