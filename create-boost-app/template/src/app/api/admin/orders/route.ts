import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { db } from '@/data/db';
import { sendOrderConfirmationEmail } from '@/lib/mail';
import { sendOrderSMS } from '@/lib/sms';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    // Try MongoDB
    try {
      const conn = await dbConnect();
      if (conn && Order) {
        const filter: Record<string, any> = {};
        if (status && status !== 'all') {
          filter.orderStatus = status;
        }
        if (paymentStatus && paymentStatus !== 'all') {
          filter.paymentStatus = paymentStatus;
        }
        const mongoOrders = await Order.find(filter).sort({ createdAt: -1 }).lean();
        if (mongoOrders && mongoOrders.length > 0) {
          return NextResponse.json({
            success: true,
            source: 'mongodb',
            count: mongoOrders.length,
            data: mongoOrders,
          });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB orders bypass, using in-memory store:', dbErr);
    }

    let orders = db.getOrders();

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.orderStatus === status);
    }
    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus === paymentStatus);
    }

    return NextResponse.json({
      success: true,
      source: 'in-memory',
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer information and items are required.' },
        { status: 400 }
      );
    }

    // Always create in in-memory store for instant sync
    const order = db.createOrder(body, body.id, body.orderNumber);

    // Save to MongoDB if available
    try {
      const conn = await dbConnect();
      if (conn && Order) {
        await Order.create({
          id: order.id,
          orderId: order.id,
          orderNumber: order.orderNumber,
          customer: order.customer,
          items: order.items,
          subtotal: order.subtotal,
          discount: order.discount,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          razorpayOrderId: body.razorpayOrderId,
          metadata: body.metadata || {},
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        });
        console.log(`✅ Order ${order.orderNumber} successfully saved to MongoDB`);
      }
    } catch (dbErr: any) {
      console.warn('Could not save order to MongoDB:', dbErr.message);
    }

    // Send order confirmation email asynchronously
    if (order.customer.email) {
      sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.customer.address,
      }).catch((err) => console.error('Order email failure:', err));
    }

    // Send SMS alert asynchronously
    if (order.customer.phone) {
      sendOrderSMS(
        order.customer.phone,
        `Boost Store: Your order #${order.orderNumber} for Rs.${order.total} has been placed successfully! Tracking link will be shared shortly.`
      ).catch((err) => console.error('Order SMS failure:', err));
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
