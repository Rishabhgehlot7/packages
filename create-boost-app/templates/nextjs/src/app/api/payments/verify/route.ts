import { NextResponse } from 'next/server';
import { RazorpayAdapter } from '@boostengine/payments';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { db } from '@/data/db';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, boostOrderId } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature parameters for payment verification.' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: 'RAZORPAY credentials are not configured.' },
        { status: 500 }
      );
    }

    // Direct cryptographic verification via @boostengine/payments
    const adapter = new RazorpayAdapter({ keyId, keySecret });
    const verification = await adapter.verifyPayment({
      gateway: 'razorpay',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!verification.isSuccessful) {
      console.error('❌ Razorpay signature mismatch via @boostengine/payments');
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // Update in MongoDB
    try {
      await dbConnect();
      if (Order) {
        await Order.findOneAndUpdate(
          { $or: [{ id: boostOrderId }, { orderNumber: boostOrderId }, { razorpayOrderId: razorpay_order_id }] },
          {
            paymentStatus: 'paid',
            orderStatus: 'processing',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          }
        );
      }
    } catch (dbErr) {
      console.warn('MongoDB order update warning:', dbErr);
    }

    // Update in in-memory fallback db
    if (boostOrderId) {
      const order = db.getOrderById(boostOrderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
        // Send email confirmation
        sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          customer: order.customer,
          items: order.items,
          total: order.total,
          paymentMethod: 'Razorpay',
          shippingAddress: order.customer.address,
        }).catch((err) => console.error('Email error:', err));
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      data: verification,
      message: 'Payment verified successfully via @boostengine/payments',
    });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
