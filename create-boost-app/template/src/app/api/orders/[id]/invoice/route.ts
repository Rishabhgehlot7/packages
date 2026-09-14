import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { db } from '@/data/db';
import { InvoiceGenerator, InvoiceData } from '@boostengine/invoicing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let order: any = null;

    try {
      const conn = await dbConnect();
      if (conn && Order) {
        order = await Order.findOne({
          $or: [{ id }, { orderNumber: id }],
        }).lean();
      }
    } catch (e) {
      console.warn('DB error in invoice generation:', e);
    }

    if (!order) {
      order = db.getOrderById(id);
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const orderDateStr = new Date(order.createdAt || Date.now()).toISOString().split('T')[0];

    const invoicePayload: InvoiceData = {
      invoiceNumber: `INV-${order.orderNumber || order.id}`,
      invoiceDate: orderDateStr,
      orderId: order.orderNumber || order.id,
      orderDate: orderDateStr,
      paymentMethod: order.paymentMethod === 'cod' ? 'COD' : 'PREPAID',
      paymentTxnId: order.razorpayPaymentId || order.id,
      seller: {
        name: 'Boost Engine Enterprises India Pvt Ltd',
        tradeName: 'Boost Storefront D2C',
        gstin: '27AAAAA0000A1Z5',
        address: 'Tower B, Tech Park, Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051',
        phone: '+91 9876543210',
        email: 'billing@boostengine.dev',
      },
      buyer: {
        name: order.customer?.name || 'Valued Customer',
        address: order.customer?.address?.line1 || 'Main Street',
        city: order.customer?.address?.city || 'Mumbai',
        state: order.customer?.address?.state || 'Maharashtra',
        pincode: order.customer?.address?.pincode || '400050',
        phone: order.customer?.phone || '9876543210',
        email: order.customer?.email,
        gstin: order.gstDetails?.buyerGstin,
      },
      items: (order.items || []).map((item: any) => ({
        name: item.title,
        sku: item.sku || item.variantSku || 'BOOST-SKU',
        hsn: item.hsnCode || '6109',
        quantity: item.quantity || 1,
        unitPrice: item.price || 0,
        discount: 0,
        taxRate: item.gstRate || 18,
      })),
      shippingFee: order.shipping || 0,
      termsAndConditions: [
        'Goods once sold are covered under 7-day hassle-free replacement warranty.',
        'This is a computer-generated tax invoice and requires no physical signature.',
        'Subject to Mumbai jurisdiction only.',
      ],
    };

    const format = req.nextUrl.searchParams.get('format');
    if (format === 'html') {
      const html = InvoiceGenerator.generateTaxInvoiceHtml(invoicePayload);
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        invoiceNumber: invoicePayload.invoiceNumber,
        invoiceDate: invoicePayload.invoiceDate,
        orderId: invoicePayload.orderId,
        seller: invoicePayload.seller,
        buyer: invoicePayload.buyer,
        items: invoicePayload.items,
        total: order.total,
        downloadUrl: `/api/orders/${order.id || order.orderNumber}/invoice?format=html`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invoice generation error' },
      { status: 500 }
    );
  }
}
