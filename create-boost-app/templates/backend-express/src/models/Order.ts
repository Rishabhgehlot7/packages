import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'cod_pending' | 'failed';
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        selectedSize: { type: String },
        selectedColor: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['online', 'cod'], default: 'online' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'cod_pending', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'], default: 'placed' },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>('Order', OrderSchema);
