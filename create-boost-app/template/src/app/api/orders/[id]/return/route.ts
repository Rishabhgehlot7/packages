import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { db } from '@/data/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reason, comments, items, refundMode = 'wallet' } = body;

    if (!reason || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Return reason and at least one item must be selected' },
        { status: 400 }
      );
    }

    let order: any = null;

    try {
      const conn = await dbConnect();
      if (conn && Order) {
        order = await Order.findOne({
          $or: [{ id }, { orderNumber: id }],
        });
      }
    } catch (e) {
      console.warn('DB error in return lookup:', e);
    }

    if (!order) {
      order = db.getOrderById(id);
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Calculate refund amount
    const returnItemsTotal = items.reduce((sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1), 0);
    // If refundMode is 'wallet', add 5% store bonus incentive!
    const finalRefundAmount = refundMode === 'wallet' ? Math.round(returnItemsTotal * 1.05) : returnItemsTotal;
    const pickupAwb = `REV-DEL${Date.now().toString().slice(-6)}`;

    const returnData = {
      reason,
      comments: comments || '',
      items,
      requestedAt: new Date(),
      refundMode,
      refundAmount: finalRefundAmount,
      pickupAwb,
      status: 'approved', // Auto-approved for world-class frictionless UX
    };

    // Update in MongoDB
    try {
      const conn = await dbConnect();
      if (conn && Order) {
        await Order.findOneAndUpdate(
          { $or: [{ id }, { orderNumber: id }] },
          {
            returnStatus: 'approved',
            returnDetails: returnData,
          },
          { new: true }
        );
      }
    } catch (e) {
      console.warn('DB error in updating return:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Return request approved successfully! Reverse pickup scheduled.',
      data: {
        orderId: order.orderNumber || order.id,
        returnDetails: returnData,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Return processing error' },
      { status: 500 }
    );
  }
}
