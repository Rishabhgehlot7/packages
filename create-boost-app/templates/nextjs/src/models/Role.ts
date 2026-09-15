import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IRole extends Document {
  _id: any;
  name: string;
  description: string;
  permissions: string[];
  isDeleted: boolean;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  permissions: [{ type: String, required: true }],
  isDeleted: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export default models.Role || model<IRole>('Role', RoleSchema);
