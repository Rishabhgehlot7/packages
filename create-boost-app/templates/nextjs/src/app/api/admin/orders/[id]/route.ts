import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { db } from '@/data/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check MongoDB first
    try {
      const conn = await dbConnect();
      if (conn && Order) {
        const mongoOrder = await Order.findOne({
          $or: [{ id }, { orderNumber: id }],
        }).lean();
        if (mongoOrder) {
          return NextResponse.json({ success: true, source: 'mongodb', data: mongoOrder });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB single order fetch error:', dbErr);
    }

    // In-memory fallback
    const order = db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'in-memory', data: order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, courier, trackingNumber } = body;

    // Update in MongoDB
    try {
      const conn = await dbConnect();
      if (conn && Order) {
        await Order.findOneAndUpdate(
          { $or: [{ id }, { orderNumber: id }] },
          {
            ...(status && { orderStatus: status }),
            ...(courier && { courier }),
            ...(trackingNumber && { trackingNumber }),
          }
        );
      }
    } catch (dbErr) {
      console.warn('MongoDB order status update error:', dbErr);
    }

    const updated = db.updateOrderStatus(id, status, { courier, trackingNumber });
    return NextResponse.json({
      success: true,
      data: updated || { id, orderStatus: status, courier, trackingNumber },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating order' },
      { status: 500 }
    );
  }
}

